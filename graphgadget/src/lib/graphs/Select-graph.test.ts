import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/Select-graph.svelte';
import { describe, it, expect } from 'vitest';
import { GraphMetas } from '$lib/graphs/Graphs';
import userEvent from '@testing-library/user-event';
import Histogram from './histogram/Histogram.svelte';
import { selected_graph, graph_name, graph_description } from './Store';
import { get } from 'svelte/store';
import PieChart from './PieChart/PieChart.svelte';
import Stem from './Stem/Stem.svelte';

describe('When user views', () => {
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
		const scatter = getByTestId('Scatter');
		const pie = getByTestId('Pie Chart');
		expect(hist1).to.exist;
		expect(hist2).to.exist;
		expect(scatter).to.exist;
		expect(pie).to.exist;
	});
});

describe('When user hovers', () => {
	it('should describe histogram', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const hist = getByTestId('Histogram');

		await user.hover(hist);

		expect(get(graph_name)).toBe('Histogram');
		expect(get(graph_description)).toBe(
			'A histogram is a graphical representation of the distribution of numerical data. It groups data into bins and displays the frequency of data points in each bin using bars.'
		);
		expect(getByTestId('name-chart').innerHTML).toEqual('Histogram');
		expect(getByTestId('description-chart').innerHTML).toEqual(
			'A histogram is a graphical representation of the distribution of numerical data. It groups data into bins and displays the frequency of data points in each bin using bars.'
		);

		await user.unhover(hist);

		expect(getByTestId('name-chart').innerHTML).toEqual('');
		expect(getByTestId('description-chart').innerHTML).toEqual('');
	});
	it('should describe stem', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const hist = getByTestId('Stem');

		await user.hover(hist);
		expect(getByTestId('name-chart').innerHTML).toEqual('Stem');
		expect(getByTestId('description-chart').innerHTML).toEqual(
			'A stem plot (or stem-and-leaf plot) is a method of displaying quantitative data in a graphical format, similar to a histogram, to show its distribution. Each data value is split into a "stem" and a "leaf," with stems representing the leading digits and leaves representing the trailing digits.'
		);

		await user.unhover(hist);

		expect(getByTestId('name-chart').innerHTML).toEqual('');
		expect(getByTestId('description-chart').innerHTML).toEqual('');
	});
	it('should describe pie chart', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const pie = getByTestId('Pie Chart');

		await user.hover(pie);

		expect(get(graph_name)).toBe('Pie Chart');
		expect(get(graph_description)).toBe(
			"A pie chart is a circular statistical graphic that is divided into slices to illustrate numerical proportions. Each slice represents a category's contribution to the whole. Pie charts are ideal for showing relative sizes of data parts to the whole, making it easy to compare individual segments."
		);
		expect(getByTestId('name-chart').innerHTML).toEqual('Pie Chart');
		expect(getByTestId('description-chart').innerHTML).toEqual(
			"A pie chart is a circular statistical graphic that is divided into slices to illustrate numerical proportions. Each slice represents a category's contribution to the whole. Pie charts are ideal for showing relative sizes of data parts to the whole, making it easy to compare individual segments."
		);

		await user.unhover(pie);

		expect(getByTestId('name-chart').innerHTML).toEqual('');
		expect(getByTestId('description-chart').innerHTML).toEqual('');
	});
});

describe('When user clicks', () => {
	it('should display histogram', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const hist = getByTestId('Histogram');

		await user.click(hist);
		expect(get(selected_graph)).toBe(Histogram);
	});
	it('should display stem', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const stem = getByTestId('Stem');

		await user.click(stem);
		expect(get(selected_graph)).toBe(Stem);
	});
	it('should display piechart', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const pie = getByTestId('Pie Chart');

		await user.click(pie);
		expect(get(selected_graph)).toBe(PieChart);
	});
});
