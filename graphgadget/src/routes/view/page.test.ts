import { render } from '@testing-library/svelte';
import sut from './+page.svelte';
import { describe, it, expect } from 'vitest';
import { selected_graph } from '$lib/graphs/Store';
import { get } from 'svelte/store';
import Histogram from '$lib/graphs/histogram/Histogram.svelte';

describe('View', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	// it('should contain histogram', async () => {
	// 	render(sut);
	// 	expect(get(selected_graph)).toBe(Histogram);
	// });
	// it('session storage cleared should still render', () => {
	// 	sessionStorage.clear();
	// 	const { container } = render(sut);
	// 	expect(container).to.exist;
	// });
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
