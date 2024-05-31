import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/table/Table.svelte';
import { type RenderResult } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

describe('download', () => {
	let page: RenderResult;
	window.URL.createObjectURL = jest.fn();

	beforeEach(async () => {
		page = render(sut);
	});
	it('tsv button for downloading exists', () => {
		const button = page.getByText('TSV');
		expect(button).to.exist;
	});

	it('tsv button gets clicked', async () => {
		const user = userEvent.setup();
		const button = page.getByText('TSV');

		await user.click(button);

		const expectedDiv = page.getByTestId('download-function-called');
		expect(expectedDiv).to.exist;
	});

	it('if no button is not clicked download is not called', () => {
		const expectedDiv = page.queryAllByTestId('download-function-called');
		expect(expectedDiv).toHaveLength(0);
	});
});
