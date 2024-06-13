import { type ComponentType, SvelteComponent } from 'svelte';

// #region Errors

/**
 * Error class for when a file is not supported by the application.
 */
export class UnsupportedFileError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UnsupportedFileError';
	}
}

// #endregion

/**
 * A bundle is a DataFrame with a filename.
 */
export type DataFile = {
	/**
	 * The DataFrame contained in the file.
	 */
	data: DataFrameLike;
	/**
	 * The filename of the file.
	 */
	name: string;
};

export type GraphMeta = {
	title: string;
	description: string;
	img: string;
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

// Scatter plot types

/**
 * A type that has the style of a dataset in a scatter plot, e.g. red circles
 */
export type ScatterStyle = {
	backgroundColor: string;
	borderColor: string;
	pointStyle: string;
};

/**
 * A type that represents a dataset for a scatter plot
 */
export type ScatterDataset = {
	data: [number, number][];
	label: string;
	style: ScatterStyle;
};
