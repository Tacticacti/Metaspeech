import sut from './+page.svelte';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, type RenderResult } from '@testing-library/svelte';

vi.mock('$app/navigation');
vi.mock('$lib/components/importer/Importer.svelte');

let page: RenderResult<sut>;
beforeEach(() => {
	page = render(sut);
});

function getStoreDataCheckbox(): HTMLInputElement {
	return page.getByTestId('store-data') as HTMLInputElement;
}

function getPreviousPageButton(): HTMLButtonElement {
	return page.getByTestId('previous-btn') as HTMLButtonElement;
}




describe('Start component', () => {
	it('handles input event correctly', async () => {
		//do stuff
	});
});
