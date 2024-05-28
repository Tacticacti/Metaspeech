import { writable } from 'svelte/store';

export type BinDictionary = Record<string, number>;
export const ABSOLUTE_FREQUENCY: string = 'Absolute Frequency';
export const RELATIVE_FREQUENCY: string = 'Relative Frequency';

export const selectedColumns = writable<string[]>([]);
export const selectedValues = writable<string[]>([]);
export const binSizes = writable<BinDictionary>();
export const checkedMean = writable<boolean>(false);
//export const numericColumns = writable<[string, number][]>([]);
