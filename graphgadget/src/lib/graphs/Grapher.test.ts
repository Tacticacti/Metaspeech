import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/Grapher.svelte';
import { describe, it, expect } from 'vitest';
import { GraphMetas } from '$lib/graphs/Graphs';
import userEvent from '@testing-library/user-event';

//vi.mock('$lib/graphs/Grapher-button.svelte');

describe('View', () => {
	it('should render', () => {
		const { container } = render(sut, { graphs: GraphMetas });
		expect(container).to.exist;
	});
	it('should contain name of the chart', async () => {
		const { getByTestId } = render(sut, { graphs: GraphMetas });
		const name = getByTestId('name-chart');
		expect(name).to.exist;
		expect(name.innerHTML).toBe('');
	});
	it('should contain decription', async () => {
		const { getByTestId } = render(sut, { graphs: GraphMetas });
		const name = getByTestId('description-chart');
		expect(name).to.exist;
		expect(name.innerHTML).toBe('');
	});
});

describe('hovering', () => {
	it('hover histogram', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const hist = getByTestId('Histogram');

		await user.hover(hist);
		expect(getByTestId('name-chart').innerHTML).toEqual('Histogram');
		expect(getByTestId('description-chart').innerHTML).toEqual(
			'A histogram is an approximate representation of the distribution of numerical data.'
		);
	});
	it('unhover histogram', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const hist = getByTestId('Histogram2');

		await user.hover(hist);
		expect(getByTestId('name-chart').innerHTML).toEqual('Histogram2');
		expect(getByTestId('description-chart').innerHTML).toEqual(
			'A histogram is an approximate representation of the distribution of numerical data.'
		);

		await user.unhover(hist);

		expect(getByTestId('name-chart').innerHTML).toEqual('');
		expect(getByTestId('description-chart').innerHTML).toEqual('');
	});
});
