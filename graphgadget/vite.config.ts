import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		coverage: {
			provider: 'istanbul',
			include: ['src/**'],
			reporter: ['cobertura', 'text-summary', 'text'],
			skipFull: true
		}
	}
});
