import { StateEnum, state, data } from '$lib/Store';
import { get } from 'svelte/store';
import { it, expect } from 'vitest';

it('should have a state', () => {
	expect(state).toBeDefined();
});

it('should have data', () => {
	expect(data).toBeDefined();
});

it('should have a StateEnum', () => {
	expect(StateEnum).toBeDefined();
});

it('should have a start state', () => {
	expect(StateEnum.start).toBeDefined();
});

it('should have a modify state', () => {
	expect(StateEnum.modify).toBeDefined();
});

it('should have a view state', () => {
	expect(StateEnum.view).toBeDefined();
});

it('should have state default to start', () => {
	expect(get(state)).toEqual(StateEnum.start);
});
