import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import sut from './+page.svelte'; // Update the import path to your Svelte file

describe('Page', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
});