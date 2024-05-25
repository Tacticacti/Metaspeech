import { writable } from 'svelte/store';

export const selectedColumns = writable<string[]>([]);
