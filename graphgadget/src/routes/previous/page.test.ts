import { it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import sut from './+page.svelte';
import helperSut from '../+page.svelte';
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { data } from '$lib/Store';
import DataFrame from 'dataframe-js';

describe('No mocking has zero files saved', () => {
	it('Expect no data heading to be available', () => {
		const { getByText } = render(sut);
		const heading = getByText('Previous Data');
		expect(heading).to.exist;
	});

	it('Expect clear cache button to be available', () => {
		const { getByText } = render(sut);
		const button = getByText('Clear Cache');
		expect(button).to.exist;
	});
});

describe('Mocking a saved file', () => {
	vi.mock('$lib/importer/Importer.svelte');
	vi.mock('$app/navigation');

	beforeEach(async () => {
		const { getByTestId, getByLabelText } = render(helperSut);
		const checkbox = getByLabelText('Store data in client side?');
		await fireEvent.click(checkbox);
		const input = getByTestId('file-input');
		await fireEvent.input(input);
	});

	it('List entries should exist from mock', async () => {
		const { getByText } = render(sut);
		const firstFile = getByText('pretestfile');
		const secondFile = getByText('testfile');

		expect(firstFile).to.exist;
		expect(secondFile).to.exist;
	});

	it('List entry delete buttons should exist from mock', async () => {
		const { getAllByText } = render(sut);
		const button = getAllByText('X');
		expect(button.length).toEqual(2);
	});

	it('Goto is called when clicking on dataset', async () => {
		const { getByText } = render(sut);
		const button = getByText('pretestfile');
		await fireEvent.click(button);

		expect(get(data).toText()).toEqual(new DataFrame([{ a: '5', b: '10', c: '15' }]).toText());
		expect(goto).toHaveBeenCalledWith('/modify');
	});
});

describe('Deleting datasets', () => {
	vi.mock('$lib/importer/Importer.svelte');
	vi.mock('$app/navigation');

	beforeEach(async () => {
		const { getByTestId, getByLabelText } = render(helperSut);
		const checkbox = getByLabelText('Store data in client side?');
		await fireEvent.click(checkbox);
		const input = getByTestId('file-input');
		await fireEvent.input(input);
	});

	it('Deleting a file should delete its entry', async () => {
		const { getAllByText } = render(sut);
		const deleteFirst = getAllByText('X')[0];

		await fireEvent.click(deleteFirst);

		const firstFile = screen.queryByText('pretestfile');

		expect(firstFile).toBeNull();
	});

	it('Clearing cache should delete all entries', async () => {
		const { getByText } = render(sut);
		const clearCache = getByText('Clear Cache');

		await fireEvent.click(clearCache);

		const firstFile = screen.queryByText('pretestfile');
		expect(firstFile).toBeNull();

		const secondFile = screen.queryByText('testfile');
		expect(secondFile).toBeNull();
	});

	it('If client deletes file from storage and click it, load nothing', async () => {
		const { getByText } = render(sut);
		localStorage.removeItem('pretestfile');

		const firstFile = getByText('pretestfile');
		await fireEvent.click(firstFile);

		const firstFileNowRemoved = screen.queryByText('pretestfile');
		expect(firstFileNowRemoved).toBeNull();
	});

	it('If client deletes file from storage and click it and also deletes it from list of stored, load nothing', async () => {
		const { getByText } = render(sut);
		localStorage.removeItem('pretestfile');
		localStorage.removeItem('datasets');

		const firstFile = getByText('pretestfile');
		await fireEvent.click(firstFile);

		const firstFileNowRemoved = screen.queryByText('pretestfile');
		expect(firstFileNowRemoved).toBeNull();
	});
});
