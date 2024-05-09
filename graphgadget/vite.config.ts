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
		poolOptions: {
			threads: {
			  singleThread: true,
			},
		},
		coverage: {
			provider: 'istanbul',
			include: ['src/**'],
			exclude: ['src/**/__mocks__/**/*'],
			reporter: ['cobertura', 'text-summary', 'text'],
			skipFull: true
		},
		mockReset: true
	}
});
