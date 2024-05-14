import { writable } from 'svelte/store';
import { DataFrame } from 'dataframe-js';

/**
 * The data store for the application.
 */
export const data = writable<DataFrame>(new DataFrame([], []));