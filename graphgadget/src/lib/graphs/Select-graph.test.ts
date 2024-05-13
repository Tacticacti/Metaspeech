import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/Select-graph.svelte';
import { describe, it, expect } from 'vitest';
import { GraphMetas } from '$lib/graphs/Graphs';
import userEvent from '@testing-library/user-event';
import Histogram from './histogram/Histogram.svelte';
import { selected_graph, graph_name, graph_description } from './Store';
import { get } from 'svelte/store';

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
	it('should contain 3 graphs', async () => {
		const { getByTestId } = render(sut, { graphs: GraphMetas });
		const hist1 = getByTestId('Histogram');
		const hist2 = getByTestId('Stem');
		const hist3 = getByTestId('Scatter');
		expect(hist1).to.exist;
		expect(hist2).to.exist;
		expect(hist3).to.exist;
	});
});

describe('hovering', () => {
	it('hover histogram', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const hist = getByTestId('Histogram');

		await user.hover(hist);

		expect(get(graph_name)).toBe('Histogram');
		expect(get(graph_description)).toBe(
			'A histogram is an approximate representation of the distribution of numerical data.'
		);
		expect(getByTestId('name-chart').innerHTML).toEqual('Histogram');
		expect(getByTestId('description-chart').innerHTML).toEqual(
			'A histogram is an approximate representation of the distribution of numerical data.'
		);
	});
	it('unhover histogram', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const hist = getByTestId('Stem');

		await user.hover(hist);
		expect(getByTestId('name-chart').innerHTML).toEqual('Stem');
		expect(getByTestId('description-chart').innerHTML).toEqual('A stem description.');

		await user.unhover(hist);

		expect(getByTestId('name-chart').innerHTML).toEqual('');
		expect(getByTestId('description-chart').innerHTML).toEqual('');
	});
});
it('click histogram', async () => {
	const user = userEvent.setup();
	const { getByTestId } = render(sut, { graphs: GraphMetas });

	const hist = getByTestId('Histogram');

	await user.click(hist);
	expect(get(selected_graph)).toBe(Histogram);
});
