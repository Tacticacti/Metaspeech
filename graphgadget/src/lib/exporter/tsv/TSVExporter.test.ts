import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/table/Table.svelte';
import userEvent from '@testing-library/user-event';

describe('download tsv', () => {
	window.URL.createObjectURL = jest.fn();

	it('tsv button for downloading exists', () => {
		const { getByTestId } = render(sut);

		const button = getByTestId('btn-download-tsv');
		expect(button).to.exist;
		expect(button).to.toBeInstanceOf(HTMLButtonElement);
	});

	it('tsv button gets clicked', async () => {
		const { getByTestId } = render(sut);

		const button = getByTestId('btn-download-tsv');
		expect(button).to.exist;
		expect(button).to.toBeInstanceOf(HTMLButtonElement);

		const user = userEvent.setup();

		await user.click(button);

		const expectedDiv = getByTestId('tsv-download-function-called');
		expect(expectedDiv).to.exist;
	});

	it('if no button is not clicked download is not called', () => {
		const { queryAllByTestId } = render(sut);

		const expectedDiv = queryAllByTestId('tsv-download-function-called');
		expect(expectedDiv).toHaveLength(0);
	});
});
