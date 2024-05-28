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
	it('should contain histogram', async () => {
		const { getByTestId } = render(sut);
        const nextLink = getByTestId('next-link');
		
        expect(nextLink).toBeDefined();
	    expect(nextLink).toHaveAttribute('href', '/view');
	});
});
