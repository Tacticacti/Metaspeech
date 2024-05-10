import { render } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import sut from './+page.svelte'; // Update the import path to your Svelte file

vi.mock('$lib/pages/Start.svelte');

describe('Page', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	it('should contain Start', async () => {
		const { getByTestId } = render(sut);
		const start = getByTestId('start');
		expect(start).to.exist;
	});
});
