import sut from './+page.svelte';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { fireEvent, render, type RenderResult } from '@testing-library/svelte';
import { goto } from '$app/navigation';
import userEvent from '@testing-library/user-event';
import { fromText } from '$lib/dataframe/DataFrame';

vi.mock('$app/navigation');
vi.mock('$lib/components/importer/Importer.svelte');

let page: RenderResult<sut>;
beforeEach(() => {
	page = render(sut);
});

afterEach(() => {
	localStorage.clear();
	sessionStorage.clear();
});

function getStoreDataCheckbox(): HTMLInputElement {
	return page.getByTestId('store-data-cb') as HTMLInputElement;
}

function getPreviousPageButton(): HTMLButtonElement {
	return page.getByTestId('previous-btn') as HTMLButtonElement;
}

/**
 * Gets the mock import button, when clicked it will fire the input event with:
 * { data: fromText('a,b,c\n4,5,6\n7,8,9'), name: 'test.csv' }
 * @returns the import button
 */
function getImport(): HTMLButtonElement {
	return page.getByTestId('import') as HTMLButtonElement;
}

describe('navigation', () => {
	it('navigates to previous page', async () => {
		const user = userEvent.setup();
		const previousPageButton = getPreviousPageButton();
		await user.click(previousPageButton);

		expect(goto).toHaveBeenCalledWith('/previous');
	});

	it('moves to modify page when data is selected', async () => {
		await fireEvent.input(getImport());

		expect(goto).toHaveBeenCalledWith('/modify');
		expect(sessionStorage.getItem('current-df')).toEqual(
			JSON.stringify(fromText('a,b,c\n1,2,3\n2,3,4'))
		);
	});
});

describe('store data', () => {
	it('stores data when checkbox is checked', async () => {
		const user = userEvent.setup();
		const storeDataCheckbox = getStoreDataCheckbox();

		if (!storeDataCheckbox.checked) {
			await user.click(storeDataCheckbox);
		}

		await fireEvent.input(getImport());

		expect(localStorage.getItem('datasets')).toEqual(JSON.stringify(['test.csv']));
		expect(localStorage.getItem('test.csv')).toEqual(
			JSON.stringify(fromText('a,b,c\n1,2,3\n2,3,4'))
		);
	});
	it('does not store data when checkbox is not checked', async () => {
		const user = userEvent.setup();
		const storeDataCheckbox = getStoreDataCheckbox();

		if (storeDataCheckbox.checked) {
			await user.click(storeDataCheckbox);
		}

		await fireEvent.input(getImport());

		expect(localStorage.getItem('test.csv')).toBeFalsy();
	});
});
