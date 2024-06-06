import { render, waitFor } from '@testing-library/svelte';
import sut from './+page.svelte';
import { describe, it, expect } from 'vitest';
import Histogram from '$lib/graphs/histogram/Histogram.svelte';



describe('View', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});

	it('should render the selected graph component', async () => {
		selected_graph.set(Histogram);
		const { container } = render(sut);
		await waitFor(() => {
			const histogramComponent = container.querySelector('div.mt-5.w-full.flex.justify-center');
			expect(histogramComponent).to.exist;
		});
	});

	it('session storage cleared should still render', () => {
		sessionStorage.clear();
		const { container } = render(sut);
		expect(container).to.exist;
	});
});
