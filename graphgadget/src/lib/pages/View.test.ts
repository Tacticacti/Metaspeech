import { render } from '@testing-library/svelte';
import sut from '$lib/pages/View.svelte';
import { vi, describe, it, expect } from 'vitest';
//import { GraphMetas } from '$lib/graphs/Graphs';
//import Histogram from '$lib/graphs/histogram/Histogram.svelte';

vi.mock('$lib/graphs/histogram/Histogram.svelte');

describe('View', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	it('should contain Histogram', async () => {
		const { getByTestId } = render(sut);
		const histogram = getByTestId('histogram');
		expect(histogram).to.exist;
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
});
