import { writable } from 'svelte/store';
import { DataFrame } from 'dataframe-js';

// Name for the application and other shared metadata
export const APP_NAME = 'GraphGadget';
export const COPYRIGHT_YEAR = 2024;

/**
 * The data store for the application.
 */
export const data = writable<DataFrame>(new DataFrame([], []));

/**
 * The bin dictionary type. The key is the column name and the value is the bin size for that column
 */
export type BinDictionary = Record<string, number>;

/**
 * The map dictionary type. The key is a column name and the value is a map that takes a label as key,
 * and has values with sum and frequency
 */
export type MapDictionary = Record<string, Map<string, [number, number]>>;

/**
 * The table info type is an array of column names and a 2d string array with the cells
 * Used for gridjs
 */
export type TableInfo = [string[], string[][]];

/**
 * The absolute frequency string.
 */
export const ABSOLUTE_FREQUENCY: string = 'Absolute Frequency';
/**
 * The relative frequency string.
 */
export const RELATIVE_FREQUENCY: string = 'Relative Frequency';

/**
 * groupBy selected columns
 */
export const selectedColumns = writable<string[]>([]);
/**
 * select values/columns
 */
export const selectedValues = writable<string[]>([]);
/**
 * bin size for each of the columns
 */
export const binSizes = writable<BinDictionary>();

/**
 * Whether to use mean or not
 */
export const checkedMean = writable<boolean>(false);
