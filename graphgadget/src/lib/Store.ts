import { writable } from 'svelte/store';
import { DataFrame } from 'dataframe-js';

/**
 * The data store for the application.
 */
export const data = writable<DataFrame>(new DataFrame([], []));

export type BinDictionary = Record<string, number>;
export const ABSOLUTE_FREQUENCY: string = 'Absolute Frequency';
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
export const checkedMean = writable<boolean>(false);
//export const numericColumns = writable<[string, number][]>([]);
