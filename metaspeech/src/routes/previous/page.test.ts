import { it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import sut from './+page.svelte';
import { goto } from '$app/navigation';
import { df } from '$lib/Store';
import userEvent from '@testing-library/user-event';

vi.mock('$app/navigation');

beforeEach(async () => {
	localStorage.setItem('datasets', JSON.stringify(['pretestfile', 'testfile']));
	localStorage.setItem('pretestfile', JSON.stringify({ columns: [], rows: [] }));
	localStorage.setItem('testfile', JSON.stringify({ columns: [], rows: [] }));
});

describe('No mocking has zero files saved', () => {
	it('Expect no data heading to be available', () => {
		const { getByText } = render(sut);
		const heading = getByText('Previous Data');
		expect(heading).to.exist;
	});

	it('Expect clear data button to be available', () => {
		const { getByText } = render(sut);
		const button = getByText('Clear Data');
		expect(button).to.exist;
	});

	it('If there is nothing in local storage, nothing is shown', () => {
		localStorage.clear();
		sessionStorage.clear();

		render(sut);

		const file = screen.queryByText('X');
		expect(file).toBeNull();

		const list = screen.queryByRole('list');
		expect(list).toBeNull();
	});
});

describe('Mocking a saved file', () => {
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

		const data = df.get();
		expect(data.columns).toBeDefined();
		expect(data.rows).toBeDefined();
		expect(goto).toHaveBeenCalledWith('/modify');
	});
});

describe('Deleting datasets', () => {
	it('Deleting a file should delete its entry', async () => {
		const { getAllByText } = render(sut);
		const deleteFirst = getAllByText('X')[0];

		await fireEvent.click(deleteFirst);

		const firstFile = screen.queryByText('pretestfile');

		expect(firstFile).toBeNull();
	});

	it('Clearing data should delete all entries', async () => {
		// This makes sure that confirm is clicked when deleting files prompt appears
		global.confirm = vi.fn(() => true);

		const { getByText } = render(sut);
		const clearCache = getByText('Clear Data');

		await fireEvent.click(clearCache);

		const firstFile = screen.queryByText('pretestfile');
		expect(firstFile).toBeNull();

		const secondFile = screen.queryByText('testfile');
		expect(secondFile).toBeNull();
	});
});

describe('info icon hover', () => {
	it('Bubble appears when hovering over info icon', async () => {
		const { getByTestId } = render(sut);
		const user = userEvent.setup();
		const icon = getByTestId('info-icon');
		await user.hover(icon);

		const bubble = getByTestId('info-bubble');
		expect(bubble).to.exist;
	});
});
