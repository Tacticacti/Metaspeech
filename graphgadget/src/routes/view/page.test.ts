import { render } from '@testing-library/svelte';
import sut from './+page.svelte';
import { vi, describe, it, expect } from 'vitest';
import Stem from '$lib/graphs/Stem/Stem.svelte';
import { selected_graph } from '$lib/graphs/Store';
import { get } from 'svelte/store';
import userEvent from '@testing-library/user-event';

vi.mock('$lib/graphs/histogram/Histogram.svelte');

describe('View', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	it('should contain Stem', async () => {
		render(sut);
		expect(get(selected_graph)).toBeNull();
	});
	it('click stem', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut);
		const stem = getByTestId('Stem');

		await user.click(stem);
		expect(get(selected_graph)).toBe(Stem);
	});
	// it('should have a select component', async () => {
	// 	const { getByRole } = render(sut);
	// 	const select = getByRole('combobox');
	// 	expect(select).to.exist;
	// });
	// it('should display all graphs', async () => {
	// 	GraphMetas.push({
	// 		title: 'Test',
	// 		description: 'Test',
	// 		component: Histogram
	// 	});
	// 	const { getAllByRole } = render(sut);

	// 	const options = getAllByRole('option') as HTMLOptionElement[];
	// 	expect(options.length).to.equal(GraphMetas.length);
	// 	expect(options.map((o) => o.textContent)).toEqual(GraphMetas.map((g) => g.title));
	// });
	// it('should be able to render no graphs', async () => {
	// 	GraphMetas.length = 0;
	// 	const { queryAllByRole } = render(sut);
	// 	const options = queryAllByRole('option') as HTMLOptionElement[];
	// 	expect(options.length).to.equal(0);
	// });
});
