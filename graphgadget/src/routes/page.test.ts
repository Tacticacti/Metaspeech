import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import sut from './+page.svelte'; // Update the import path to your Svelte file

describe('YourComponent', () => {
	it('renders the correct title and link', () => {
		const { getByText, getByRole } = render(sut);

		// Check for the h1 title
		expect(getByText('Welcome to SvelteKit')).toBeTruthy();

		// Check for the link and its href attribute
		const link = getByRole('link');
		expect(link.getAttribute('href')).toBe('https://kit.svelte.dev');
		expect(link.textContent).toBe('kit.svelte.dev');
	});
});
