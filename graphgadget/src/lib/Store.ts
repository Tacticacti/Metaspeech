import { writable } from 'svelte/store';
import { DataFrame } from 'dataframe-js';

export const data = writable<DataFrame>(new DataFrame([], []));
