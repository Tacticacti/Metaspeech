import { render, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { data, state, StateEnum } from '$lib/Store';
import DataFrame from 'dataframe-js';
import sut from '$lib/pages/Start.svelte';
import { vi, describe, it, expect } from 'vitest';

vi.mock('$lib/importer/Importer.svelte');

describe('Start component', () => {
	it('handles input event correctly', async () => {
		const { getByTestId } = render(sut);
		const input = getByTestId('file-input');
		await fireEvent.input(input);

		// Check that the data store is updated correctly
		expect(get(state)).toEqual(StateEnum.modify);
		expect(get(data)).toEqual(new DataFrame([{ a: '1', b: '2', c: '3' }]));
	});
});
