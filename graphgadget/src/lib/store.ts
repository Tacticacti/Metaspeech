import { writable } from 'svelte/store';

export enum StateEnum {
	input,
	modify,
	graph
}

export const state = writable(StateEnum.input);
export const data = writable<string[][]>([]);
