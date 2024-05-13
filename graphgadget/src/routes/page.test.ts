import { render, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { data } from '$lib/Store';
import DataFrame from 'dataframe-js';
import sut from './+page.svelte';
import { vi, describe, it, expect } from 'vitest';
import { goto } from '$app/navigation';

vi.mock('$lib/importer/Importer.svelte');
vi.mock('$app/navigation');

describe('Start component', () => {
	it('handles input event correctly', async () => {
		const { getByTestId } = render(sut);
		const input = getByTestId('file-input');
		await fireEvent.input(input);

		// Check that the data store is updated correctly
		expect(get(data)).toEqual(new DataFrame([{ a: '1', b: '2', c: '3' }]));
		expect(goto).toHaveBeenCalledWith('/modify');
	});
});
