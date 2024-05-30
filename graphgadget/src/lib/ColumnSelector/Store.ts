import { writable } from 'svelte/store';

/**
 * Store for the selected columns.
 */
export const selectedColumns = writable<string[]>([]);
