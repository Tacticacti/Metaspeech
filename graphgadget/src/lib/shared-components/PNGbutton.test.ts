import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/histogram/Histogram.svelte';
import { type RenderResult } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

describe('download', () => {
	let page: RenderResult;
	beforeEach(async () => {
		page = render(sut);
	});
	it('png button for downloading exists', () => {
		const button = page.getByText('PNG');
		expect(button).to.exist;
	});

	it('png button gets clicked', async () => {
		const user = userEvent.setup();
		const button = page.getByText('PNG');

		await user.click(button);

		const expectedDiv = page.getByTestId('download-function-called');
		expect(expectedDiv).to.exist;
	});

	it('if no button is not clicked download is not called', () => {
		const expectedDiv = page.queryAllByTestId('download-function-called');
		expect(expectedDiv).toHaveLength(0);
	});
});
