import { vi, it, expect, describe } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import sut from '$lib/components/Toast.svelte';

vi.useFakeTimers();

describe('Rendering toast', () => {
	it('props shows up in toast', () => {
		const r = render(sut, { message: 'Hello', color: 'green', duration: 100 });
		expect(r.getByText('Hello')).to.exist;
	});
	it('default shows up correctly', () => {
		const r = render(sut);
		expect(r.getByText('Default message')).to.exist;
	});
	it('dispatches close event after duration', async () => {
		const { component } = render(sut, {
			props: {
				message: 'Test message',
				color: 'green',
				duration: 3000
			}
		});

		const closeHandler = vi.fn();
		component.$on('close', closeHandler);

		vi.advanceTimersByTime(3000); // Fast-forward time by 3 seconds

		await waitFor(() => {
			expect(closeHandler).toHaveBeenCalled();
		});
	});
});
