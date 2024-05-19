import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/histogram/Histogram.svelte';

it('canvas wrapper exists', () => {
	const { getByTestId } = render(sut);
	const canvas = getByTestId('canvas-element');
	expect(canvas).to.exist;
});
