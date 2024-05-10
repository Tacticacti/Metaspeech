import { writable } from 'svelte/store';
import Start from './pages/Start.svelte';
import Modify from './pages/Modify.svelte';
import View from './pages/View.svelte';
import { DataFrame } from 'dataframe-js';

export const StateEnum = {
	start: Start,
	modify: Modify,
	view: View
} as const;

// Create a type that only accepts the values of StateEnum
type PageState = (typeof StateEnum)[keyof typeof StateEnum];

export const state = writable<PageState>(StateEnum.start);
export const data = writable<DataFrame>(new DataFrame([], []));
