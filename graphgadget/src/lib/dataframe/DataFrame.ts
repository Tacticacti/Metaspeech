import { type Readable, get, type Writable, writable } from 'svelte/store';
import type { Grouper, Aggregator } from '$lib/dataframe/Grouping';

export class DataFrame {
	/**
	 * The names and types of the columns in the DataFrame.
	 */
	columns: Readable<Column[]>;
	private _columnMetas: Writable<Column[]>;

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
		this.columns = this._columnMetas = writable<Column[]>([]);
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
	deleteColumn(index: number) {
		const columnMetas = get(this.columns);
		const rows = get(this.rows);

		if (index === -1) return;

		columnMetas.splice(index, 1);
		rows.forEach((row) => row.splice(index, 1));

		this.forceStoreUpdate();
	}

	/**
	 * Group rows and aggregate values to make a new DataFrame.
	 * @param groupBy A list of functions that take a row and return a string key.
	 * @param select A list of functions that take a bucket of rows and return the aggregated value.
	 * @param includeGroupColumn Whether to include the 'groups' column in the new DataFrame, consisting of an array of the generated keys by the groupers (json).
	 */
	groupBy(groupBy: Grouper[], select: Aggregator[], includeGroupColumn: boolean = false) {
		const rows = get(this.rows);

		if (includeGroupColumn) select.unshift(GroupKey(groupBy));

		// make buckets for each group
		const map = new Map<string, DataType[][]>();
		for (const row of rows) {
			const key = JSON.stringify(groupBy.map((fn) => fn(row)));
			map.has(key) ? map.get(key)!.push(row) : map.set(key, [row]);
		}

		// aggregate each bucket to make new rows
		const newRows = Array.from(map.values(), (bucket) => select.map(({ fn }) => fn(bucket)));
		const newColumnMetas = getColumnMetas(
			select.map(({ name }) => name),
			newRows
		);

		// set new rows and columnMetas
		this._rows.set(newRows);
		this._columnMetas.set(newColumnMetas);
	}

	/**
	 * Left join two DataFrames on a column.
	 * @param df The DataFrame to join with.
	 * @param col1 The index of the column to join on in the first DataFrame.
	 * @param col2 The index of the column to join on in the second DataFrame.
	 */
	keyedJoin(df: DataFrameLike, col1: number, col2: number) {
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
		this.set({ columns: [...columns1, ...columns2], rows: rows1 });
	}

	join(df: DataFrameLike) {
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
	forceStoreUpdate() {
		this._columnMetas.set(get(this.columns));
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
	set(df: DataFrameLike) {
		const cols = df.columns ?? [];
		const rows = df.rows ?? [];

		this._columnMetas.set(cols);
		this._rows.set(rows);
	}
}

// #region df types

/**
 * A type that represents a data type that can be stored in a DataFrame.
 */
export type DataType = string | number | undefined;
type DataTypeString = 'string' | 'number';

/**
 * A type that represents a column in a DataFrame.
 */
export type Column = {
	name: string;
	type: DataTypeString;
	hasMissing: boolean;
};

/**
 * A type that represents a barebones DataFrame.
 */
export type DataFrameLike = {
	columns: Column[];
	rows: DataType[][];
};

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

// #region Grouping & Aggregating

/**
 * A type that represents a function that takes a bucket of rows and returns the key associated with the group.
 * @param groupers A list of functions that take a row and return a string key.
 * @returns The key associated with the group.
 */
function GroupKey(groupers: Grouper[]): Aggregator {
	return {
		name: 'groups',
		fn: (bucket) => JSON.stringify(groupers.map((fn) => fn(bucket[0])))
	};
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
	df.rows = cast2DArray(df.columns.map((c) => c.type), rows);

	return df;
}

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
	return arr.map((row) => row.map((cell, i) => castCell(types[i], cell)));
}

/**
 * Cast a cell to a specific type.
 * @param type The type to cast to.
 * @param cell The cell to cast.
 * @returns The casted cell.
 */
function castCell(type: DataTypeString, cell: unknown): DataType {
	if(isUndefinedLike(cell)) return undefined;

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
	const rows = text.split(rowDelimiter).map((row) => row.split(columnDelimiter));
	const columns = rows.shift()!.map(c => c?.toString() ?? '');

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
	const rows = collection.map((row) => columns.map(c => row[c]));

	return toDataFrameLike(columns, rows);
}

// #endregion
