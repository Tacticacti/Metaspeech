import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['./test-setup.ts'],
		globals: true,
		environment: 'jsdom',
		coverage: {
			provider: 'istanbul',
			include: ['src/**'],
			reporter: ['cobertura', 'text-summary', 'text'],
			skipFull: true
		}
	}
});
