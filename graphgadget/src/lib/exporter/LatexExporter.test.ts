import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/table/Table.svelte';
import userEvent from '@testing-library/user-event';

describe('copy to clipboard', () => {
	it('latex button for downloading exists', () => {
		const { getByTestId } = render(sut);

		const button = getByTestId('btn-copy-latex');
		expect(button).to.exist;
		expect(button).to.toBeInstanceOf(HTMLButtonElement);
	});

	it('latex button gets clicked', async () => {
		const { getByTestId } = render(sut);

		const button = getByTestId('btn-copy-latex');
		expect(button).to.exist;
		expect(button).to.toBeInstanceOf(HTMLButtonElement);

		const user = userEvent.setup();

		await user.click(button);

		const expectedDiv = getByTestId('latex-copy-function-called');
		expect(expectedDiv).to.exist;
	});

	it('if no button is not clicked download is not called', () => {
		const { queryAllByTestId } = render(sut);

		const expectedDiv = queryAllByTestId('latex-copy-function-called');
		expect(expectedDiv).toHaveLength(0);
	});
});
