import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/histogram/Histogram.svelte';
import { describe, it, expect } from 'vitest';

describe('When user views', () => {
	it('should render', () => {
		const { container, getByTestId } = render(sut);
		expect(container).to.exist;
		expect(getByTestId('canvas-element')).to.exist;
	});
});
