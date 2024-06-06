import { type ComponentType, SvelteComponent } from 'svelte';

/**
 * A bundle is a DataFrame with a filename.
 */
export type Bundle = {
	data: DataFrameLike;
	filename: string;
};

/**
 * Error class for when a file is not supported by the application.
 */
export class UnsupportedFileError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UnsupportedFileError';
	}
}

export type GraphMeta = {
	title: string;
	description: string;
	img_src: string;
	canRender: (data: GroupedDataFrame) => boolean;
	graph: ComponentType<Graph>;
};

export class Graph extends SvelteComponent<{ data: GroupedDataFrame }> {}

// #region Grouping

export type GroupedDataFrame = {
	groups: Group[];
	groupedColumns: Column[];
	aggregateColumn?: Column;
};

export type Group = {
	values: DataType[];
	keys: DataType[];
};

export type GroupBy = Specific | Binned;

export type Grouper = (row: DataType[]) => DataType;

type Specific = {
	type: 'specific';
};

type Binned = {
	type: 'binned';
	size: number;
};

// #endregion

/**
 * A type that represents a data type that can be stored in a DataFrame.
 */
export type DataType = string | number | undefined;
export type DataTypeString = 'string' | 'number';

/**
 * A type that represents a column in a DataFrame.
 */
export type Column = {
	name: string;
	type: DataTypeString;
	hasMissing: boolean;
	groupBy?: GroupBy;
	aggregate?: boolean;
};

/**
 * A type that represents a barebones DataFrame.
 */
export type DataFrameLike = {
	columns: Column[];
	rows: DataType[][];
};
