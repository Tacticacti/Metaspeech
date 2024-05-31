import { type Readable, get, type Writable, writable } from 'svelte/store';

export class DataFrame {
	/**
	 * The names and types of the columns in the DataFrame.
	 */
	columnMetas: Readable<ColumnMeta[]>;
	private _columnMetas: Writable<ColumnMeta[]>;

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
	constructor(columns: string[], rows: DataType[][]) {
		this.columnMetas = this._columnMetas = writable<ColumnMeta[]>(getColumnMetas(columns, rows));
		this.rows = this._rows = writable<DataType[][]>(rows);
	}

	/**
	 * Get the shape of the DataFrame.
	 * @returns The shape of the DataFrame. [rows, columns]
	 */
	shape(): [number, number] {
		return [get(this.rows).length, get(this.columnMetas).length];
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
	 * @param column The name of the column.
	 * @returns An array of values from the column.
	 */
	getColumnValues(column: string): DataType[] {
		const columnIndex = get(this.columnMetas).findIndex((c) => c.name === column);
		return selectIndex(get(this.rows), columnIndex);
	}

	/**
	 * Delete a column from the DataFrame.
	 * @param index The index of the column to delete.
	 */
	deleteColumn(index: number) {
		const columnMetas = get(this.columnMetas);
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
	 * @param includeGroupColumn Whether to include the 'group' column in the new DataFrame, consisting of an array of the generated keys by the groupers (json).
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
	 * Join two DataFrames on a column.
	 * @param df The DataFrame to join with.
	 * @param col1 The index of the column to join on in the first DataFrame.
	 * @param col2 The index of the column to join on in the second DataFrame.
	 */
	join(df: DataFrameLike, col1: number, col2: number) {
		// get cols and rows
		const columns1 = get(this.columnMetas).map((c) => c.name);
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
			columns: [...columns1, ...columns2],
			rows: rows1
		});
	}

	/**
	 * Sometimes the stores don't update when the data changes. This function forces the stores to update.
	 */
	forceStoreUpdate() {
		this._columnMetas.set(get(this.columnMetas));
		this._rows.set(get(this.rows));
	}

	/**
	 * Set the columns and rows of the DataFrame.
	 * @param df The DataFrame to set.
	 */
	set(df: DataFrameLike) {
		this._columnMetas.set(getColumnMetas(df.columns, df.rows));
		this._rows.set(df.rows);
	}
}

// #region df types

/**
 * A type that represents a data type that can be stored in a DataFrame.
 */
export type DataType = string | number | undefined;

/**
 * A type that represents a column in a DataFrame.
 */
export type ColumnMeta = {
	name: string;
	type: string;
};

/**
 * A type that represents a barebones DataFrame.
 */
export type DataFrameLike = {
	columns: string[];
	rows: DataType[][];
};

// #endregion

// #region Grouping & Aggregating

/**
 * A type that represents a function that takes a row and returns a string key.
 */
export type Grouper = (row: DataType[]) => string;

/**
 * A type that represents a function that takes a bucket of rows and returns the aggregated value.
 */
export type Aggregator = {
	name: string;
	fn: (bucket: DataType[][]) => DataType;
};

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
 * Check if a value is numeric.
 * @param value The value to check.
 * @returns Whether the value is numeric.
 */
function isNumeric(value: unknown): boolean {
	return !isNaN(Number(value));
}

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

/**
 * Get the type of a column in a 2D array.
 * @param rows The 2D array.
 * @param columnIndex The index of the column.
 * @returns The type of the column.
 */
function getColumnType(rows: unknown[][], columnIndex: number): string {
	let type = 'string';
	const columnValues = selectIndex(rows, columnIndex);

	type = columnValues.every((v) => isNumeric(v) || !v) ? 'number' : type;

	return type;
}

/**
 * Get the column metas from a 2D array.
 * @param columnNames The names of the columns.
 * @param rows The 2D array.
 * @returns The column metas.
 */
function getColumnMetas(columnNames: string[], rows: unknown[][]): ColumnMeta[] {
	return columnNames.map((name, i) => {
		return {
			name,
			type: getColumnType(rows, i)
		};
	});
}

// #region df importing

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
	const columns = rows.shift()!;

	return {
		columns: columns,
		rows
	};
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
	const rows = collection.map((row) => columns.map((c) => toDataType(row[c])));

	return {
		columns,
		rows
	};
}

/**
 * Parses a value into a DataType. It follows the following rules:
 * numeric -> converted to a number.
 * whitespace string -> undefined.
 * string -> trimed string.
 * else -> undefined.
 * @param df The DataFrameLike to create the DataFrame from.
 * @returns A DataFrame.
 */
function toDataType(value: unknown): DataType {
	if (isNumeric(value)) return Number(value);
	if (typeof value === 'string') {
		value = value.trim();
		return value === '' ? undefined : (value as string);
	}
	return undefined;
}

// #endregion
