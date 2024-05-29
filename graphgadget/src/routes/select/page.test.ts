import { render } from '@testing-library/svelte';
import sut from './+page.svelte';
import { describe, it, expect } from 'vitest';

describe('View', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	it('should contain link to next page', async () => {
		const { getByTestId } = render(sut);
		const nextLink = getByTestId('next-link');

		expect(nextLink).toBeDefined();
		expect(nextLink).toHaveAttribute('href', '/view');
	});
});
