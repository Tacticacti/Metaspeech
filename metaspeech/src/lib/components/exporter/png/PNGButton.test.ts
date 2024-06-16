import { vi, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from './PNGButton.svelte';
import { type RenderResult } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';

describe('download', () => {
	let component: RenderResult<sut>;
	const chart = { toBase64Image: vi.fn() };

	beforeEach(async () => {
		// @ts-expect-error - chart is mocked
		component = render(sut, { chart: chart });
	});

	it('png button for downloading exists', () => {
		const button = component.getByText('PNG');
		expect(button).to.exist;
	});

	it('png button gets clicked', async () => {
		const user = userEvent.setup();
		const button = component.getByText('PNG');

		chart.toBase64Image.mockReturnValue('get mocked lol');
		const element = { click: vi.fn() };

		// @ts-expect-error - element is mocked
		const spy = vi.spyOn(document, 'createElement').mockReturnValue(element);

		await user.click(button);

		expect(spy).toHaveBeenCalledWith('a');
		expect(chart.toBase64Image).toHaveBeenCalledWith();
		expect(element.click).toHaveBeenCalled();
		// @ts-expect-error - element is mocked
		expect(element.href).toEqual('get mocked lol');
		// @ts-expect-error - element is mocked
		expect(element.download).toBe('graph_image.png');
	});
});
