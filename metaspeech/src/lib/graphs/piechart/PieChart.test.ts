import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/piechart/PieChart.svelte';
import { describe, it, expect } from 'vitest';

describe('When user views', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
});
