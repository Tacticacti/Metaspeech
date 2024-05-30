import { render, waitFor } from '@testing-library/svelte';
import sut from './+page.svelte';
import { describe, it, expect } from 'vitest';
import { selected_graph } from '$lib/graphs/Store';
import Histogram from '$lib/graphs/histogram/Histogram.svelte';

describe('View', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});

	it('should contain placeholder text when no graph is selected', () => {
		render(sut);
		const placeholderText = document.querySelector('p.text-lg.text-gray-600');
		expect(placeholderText).to.exist;
		expect(placeholderText.textContent).toBe('Please select a graph to display.');
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
