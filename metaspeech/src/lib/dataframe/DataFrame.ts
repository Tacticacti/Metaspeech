import { type Readable, get, type Writable, writable } from 'svelte/store';
import type {
	GroupBy,
	DataType,
	Column,
	DataFrameLike,
	DataTypeString,
	Grouper,
	GroupedDataFrame,
	Group
} from '$lib/Types';

export class DataFrame {
	/**
	 * The names and types of the columns in the DataFrame.
	 */
	columns: Readable<Column[]>;
	private _columns: Writable<Column[]>;

	/**
	 * The rows in the DataFrame.
	 */
	rows: Readable<DataType[][]>;
	private _rows: Writable<DataType[][]>;

	/**
	 * Create a new DataFrame.
	 * @param columns The names of the columns.
	 * @param rows The rows of the DataFrame.
	 */
	constructor() {
		this.columns = this._columns = writable<Column[]>([]);
		this.rows = this._rows = writable<DataType[][]>([]);
	}

	/**
	 * Get the shape of the DataFrame.
	 * @returns The shape of the DataFrame. [rows, columns]
	 */
	shape(): [number, number] {
		return [get(this.rows).length, get(this.columns).length];
	}

	/**
	 * Filter rows based on a function.
	 * @param fn A function that takes a row and returns whether it should be kept.
	 */
	filter(fn: (row: DataType[]) => boolean) {
		let rows = get(this.rows);
		rows = rows.filter(fn);
		this._rows.set(rows);
		this._columns.set(
			getColumnMetas(
				get(this.columns).map((c) => c.name),
				rows
			)
		);
	}

	/**
	 * Get an array of values from a column.
	 * @param column The index of the column.
	 * @returns An array of values from the column.
	 */
	selectColumn(column: number): DataType[] {
		return selectIndex(get(this.rows), column);
	}

	/**
	 * Delete a column from the DataFrame.
	 * @param index The index of the column to delete.
	 */
	deleteColumn(index: number): void {
		const columnMetas = get(this.columns);
		const rows = get(this.rows);

		if (index === -1) return;

		columnMetas.splice(index, 1);
		rows.forEach((row) => row.splice(index, 1));

		this.forceStoreUpdate();
	}

	/**
	 * Group rows and aggregate values to make a new DataFrame. It checks the current columns to see
	 * which ones to group by and which ones to aggregate
	 * @returns the grouped data frame after grouping.
	 */
	groupBy(): GroupedDataFrame {
		const rows = get(this.rows);
		const columns = get(this.columns);

		columns.forEach((c) => {
			if (c.groupBy?.type === 'binned' && (c.groupBy?.size <= 1 || c.groupBy?.size === null)) {
				c.groupBy = {
					type: 'specific'
				};
			}
		});

		const groupers = columns
			.map((c, i) => (c.groupBy ? toGrouper(c.groupBy, i) : undefined))
			.filter((g) => g !== undefined) as Grouper[];
		const select = columns.findIndex((c) => c.aggregate);

		// make buckets for each group
		const map = new Map<string, DataType[]>();
		for (const row of rows) {
			const key = JSON.stringify(groupers.map((fn) => fn(row)));
			if (map.has(key)) {
				const arr = map.get(key) as DataType[];
				arr.push(row[select]);
			} else {
				map.set(key, [row[select]]);
			}
		}

		const groups = Array.from(map.entries()).map(([key, arr]) => {
			// JSON turns undefined into null, so we need to turn it back into undefined
			const parsed = JSON.parse(key) as (DataType | null)[];
			const keys = parsed.map((k) => k ?? undefined) as DataType[];
			return { keys, values: arr };
		}) as Group[];

		return {
			groups,
			groupedColumns: columns.filter((c) => c.groupBy !== undefined),
			aggregateColumn: columns[select]
		};
	}

	/**
	 * Left join two DataFrames on a column.
	 * @param df The DataFrame to join with.
	 * @param col1 The index of the column to join on in the first DataFrame.
	 * @param col2 The index of the column to join on in the second DataFrame.
	 */
	keyedJoin(df: DataFrameLike, col1: number, col2: number): void {
		// get cols and rows
		const columns1 = get(this.columns);
		const rows1 = get(this.rows);
		const columns2 = df.columns;
		const rows2 = df.rows;

		// create a map of keys from the second dataframe
		const map = new Map<DataType, DataType[]>();
		for (const row2 of rows2) {
			const key = row2.splice(col2, 1)[0];
			map.set(key, row2);
		}

		// join the rows
		for (const row1 of rows1) {
			const key = row1[col1];
			if (map.has(key)) {
				const row2 = map.get(key)!;
				row1.splice(columns1.length, 0, ...row2);
			}
		}

		// remove the joined column from the second dataframe
		columns2.splice(col2, 1);

		// set the new columns and rows
		this.set({
			columns: getColumnMetas(
				[...columns1, ...columns2].map((c) => c.name),
				rows1
			),
			rows: rows1
		});
	}

	/**
	 * Join two DataFrames. The columns of the second DataFrame are appended to the first DataFrame.
	 * @param df The DataFrame to join with.
	 */
	join(df: DataFrameLike): void {
		const columns1 = get(this.columns);
		const rows1 = get(this.rows);
		const columns2 = df.columns;
		const rows2 = df.rows;

		const newColumns = [...columns1, ...columns2];
		const newRows = rows1.map((row1, i) => [...row1, ...rows2[i]]);

		this.set({ columns: newColumns, rows: newRows });
	}

	/**
	 * Sometimes the stores don't update when the data changes. This function forces the stores to update.
	 */
	forceStoreUpdate(): void {
		this._columns.set(get(this.columns));
		this._rows.set(get(this.rows));
	}

	/**
	 * Get the DataFrame as a DataFrameLike.
	 * @returns The DataFrame as a DataFrameLike.
	 */
	get(): DataFrameLike {
		return {
			columns: get(this.columns),
			rows: get(this.rows)
		};
	}

	/**
	 * Set the columns and rows of the DataFrame.
	 * @param df The DataFrame to set.
	 */
	set(df: DataFrameLike): void {
		const cols = df.columns ?? [];
		let rows = df.rows ?? [];

		rows = cast2DArray(
			cols.map((c) => c.type),
			rows
		);

		this._columns.set(cols);
		this._rows.set(rows);
	}

	/**
	 * Check if the DataFrame is empty.
	 * @returns Whether the DataFrame is empty.
	 */
	isEmpty(): boolean {
		return get(this.rows).length === 0;
	}
}
/**
 * sorts groups. Used in histogram to order so it is more intuitive. checks each element. Goes from 0 to nth index.
 * If nth element in a and b are numbers then func puts key with smallest number first, if these numbers are equal func moves to the next element.
 * if nth element in and b are string then func uses built in string comparator to decide which comes first, if strings are equal func moves to the next element.
 * if there are no more elements for one of the keys, then this key comes first in sorting.
 * if both keys are same length and func went through all elements that means these keys are equal.
 * @param a first DataType
 * @param b second DataType
 * @returns either 0, 1, -1 depending on a, b
 */
export function sortGroups(groups: Group[]): Group[] {
	return groups.sort((a, b) => compareDataTypeArray(a.keys, b.keys));
}
/**
 * helper function to compare 2 DataType arrays. Usually used for sorting
 * @param a first DataType
 * @param b second DataType
 * @returns either 0, 1, -1 depending on a, b
 */
export function compareDataTypeArray(a: DataType[], b: DataType[]): number {
	const limit = Math.min(a.length, b.length);
	for (let i = 0; i < limit; i++) {
		const aElement = a[i];
		const bElement = b[i];
		const compareScore = compareDataType(aElement, bElement);
		if (compareScore !== 0) {
			return compareScore;
		}
	}
	if (a.length === b.length) {
		return 0;
	} else if (a.length > b.length) {
		return 1;
	}
	return -1;
}
/**
 * helper function to compare 2 DataTypes. Usually used for sorting
 * @param a first DataType
 * @param b second DataType
 * @returns either 0, 1, -1 depending on a, b
 */
export function compareDataType(a: DataType, b: DataType): number {
	if (a === b) return 0;
	if (a === undefined) return -1;
	if (b === undefined) return 1;

	if (typeof a === 'number' && typeof b === 'number') {
		return a - b;
	}

	if (typeof a === 'string' && typeof b === 'string') {
		return a.localeCompare(b);
	}

	if (typeof a === 'number') return -1;
	if (typeof b === 'number') return 1;

	return 0; // This case is redundant but added for completeness
}
// #region df types

/**
 * Check if a value is numeric.
 * @param value The value to check.
 * @returns Whether the value is numeric.
 */
function isNumeric(value: unknown): boolean {
	return !isNaN(Number(value));
}

/**
 * Check if a value is undefined, null, or an empty string.
 * @param value The value to check.
 * @returns Whether the value is undefined-like.
 */
function isUndefinedLike(value: unknown): boolean {
	if (value === undefined) return true;
	if (value === null) return true;
	if (typeof value === 'string' && value.trim() === '') return true;
	return false;
}

// #endregion

/**
 * Select an index from a 2D array.
 * index 1 would get [2, 3, 4] from:
 * [[1, 2, 3],
 * [2, 3, 4],
 * [3, 4, 5]]
 * @param array The 2D array.
 * @param index The index to select.
 * @returns The selected array.
 */
function selectIndex<T>(array: T[][], index: number): T[] {
	return array.map((a) => a[index]);
}

// #region df importing

/**
 * Get the column metadata for a DataFrame.
 * @param cols The names of the columns.
 * @param rows The rows of the DataFrame.
 * @returns The df.
 */
function toDataFrameLike(cols: string[], rows: unknown[][]): DataFrameLike {
	const df: DataFrameLike = { columns: [], rows: [] };

	df.columns = getColumnMetas(cols, rows);
	df.rows = cast2DArray(
		df.columns.map((c) => c.type),
		rows
	);

	return df;
}

/**
 * Get the column metadata for a DataFrame.
 * @param cols The names of the columns.
 * @param rows The rows of the DataFrame.
 * @returns The column metadata's.
 */
function getColumnMetas(cols: string[], rows: unknown[][]): Column[] {
	const columnMetas: Column[] = [];

	for (let i = 0; i < cols.length; i++) {
		const col = selectIndex(rows, i);

		const meta: Column = {
			name: cols[i],
			type: getArraySubType(col),
			hasMissing: hasMissingValues(col, rows.length)
		};

		columnMetas.push(meta);
	}

	return columnMetas;
}

/**
 * Get the type of a column in a 2D array.
 * @param col The 2D array.
 * @param columnIndex The index of the column.
 * @returns The type of the column.
 */
function getArraySubType(arr: unknown[]): DataTypeString {
	let type: DataTypeString = 'string';

	type = arr.every((v) => isNumeric(v) || isUndefinedLike(v)) ? 'number' : type;

	return type;
}

/**
 * Check if an array has missing values. Missing values are undefined, null, or whitespace strings.
 * @param arr The array to check.
 * @param length The length the array should have.
 * @returns Whether the array has missing values.
 */
function hasMissingValues(arr: unknown[], length: number): boolean {
	return arr.length < length || arr.some(isUndefinedLike);
}

/**
 * Get the column metadata for a DataFrame.
 * @param cols The names of the columns.
 * @param rows The rows of the DataFrame.
 * @returns The column metadata.
 */
function cast2DArray(types: DataTypeString[], arr: unknown[][]): DataType[][] {
	const result = [];

	for (const row of arr) {
		const newRow = [];
		for (let i = 0; i < types.length; i++) {
			newRow.push(castCell(types[i], row[i]));
		}
		result.push(newRow);
	}

	return result;
}

/**
 * Cast a cell to a specific type.
 * @param type The type to cast to.
 * @param cell The cell to cast.
 * @returns The casted cell.
 */
function castCell(type: DataTypeString, cell: unknown): DataType {
	if (isUndefinedLike(cell)) return undefined;

	if (type === 'number') {
		return Number(cell);
	}

	return cell!.toString();
}

/**
 * Create a DataFrame from a file.
 * @param file The file to create the DataFrame from.
 * @param columnDelimiter The delimiter between columns.
 * @param rowDelimiter The delimiter between rows.
 * @returns A Promise that resolves to a DataFrame.
 */
export function fromFile(
	file: File,
	columnDelimiter: string = ',',
	rowDelimiter: string = '\n'
): Promise<DataFrameLike> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const text = reader.result as string;
			resolve(fromText(text, columnDelimiter, rowDelimiter));
		};
		reader.onerror = reject;
		reader.readAsText(file);
	});
}

/**
 * Create a DataFrame from a string.
 * @param text The string to create the DataFrame from.
 * @param columnDelimiter The delimiter between columns.
 * @param rowDelimiter The delimiter between rows.
 * @returns A DataFrame.
 */
export function fromText(
	text: string,
	columnDelimiter: string = ',',
	rowDelimiter: string = '\n'
): DataFrameLike {
	let rows = text.split(rowDelimiter).map((row) => row.split(columnDelimiter));
	if (rowDelimiter === '\n') {
		rows = rows.map((row) => row.map((cell) => cell.replaceAll('\r', '').trim()));
	}

	const columns = rows.shift()!.map((c) => c ?? '');

	if (rows.length === 0 || columns.length === 0) {
		return toDataFrameLike([], []);
	}

	const lastRow = rows[rows.length - 1];
	if (lastRow.length === 1 && lastRow[0] === '') {
		rows.pop();
	}

	return toDataFrameLike(columns, rows);
}

/**
 * Create a DataFrame from an array of objects.
 * @param collection The array of objects to create the DataFrame from.
 * @returns A DataFrame.
 */
export function fromObjects(collection: { [i: string]: unknown }[]): DataFrameLike {
	if (collection.length === 0) {
		return { columns: [], rows: [] };
	}

	const columns = Object.keys(collection[0]);
	const rows = collection.map((row) => columns.map((c) => row[c]));

	return toDataFrameLike(columns, rows);
}

/**
 * Create a DataFrame from an array of arrays.
 * The first array should be the column names.
 * @param array The array of arrays to create the DataFrame from.
 * @returns A DataFrame.
 */
export function fromArrays(array: unknown[][]): DataFrameLike {
	const cols = array.splice(0, 1)[0] as string[];
	return toDataFrameLike(cols, array);
}
// #endregion

/**
 * Create a Grouper function from a GroupBy object.
 * @param value The GroupBy object.
 * @param index The index of the column to group by.
 * @returns The Grouper function.
 */
function toGrouper(value: GroupBy, index: number): Grouper {
	switch (value.type) {
		case 'specific':
			return (row) => row[index];
		case 'binned':
			return (row) => {
				const number = row[index] as number;
				const binIndex = Math.floor(number / value.size);
				return binIndex;
			};
	}
}
