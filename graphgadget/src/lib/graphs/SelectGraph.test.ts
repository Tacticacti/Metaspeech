import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/SelectGraph.svelte';
import { describe, it, expect } from 'vitest';
import { GraphMetas } from '$lib/graphs/Graphs';
import userEvent from '@testing-library/user-event';
import { graph_name, graph_description } from './Store';
import { get } from 'svelte/store';
import PieChart from './pie/PieChart.svelte';
import Scatter from './scatter/Scatter.svelte';
import Boxplot from './boxplot/Boxplot.svelte';

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
		const hist = getByTestId('Histogram');
		const scatter = getByTestId('Scatter');
		const pie = getByTestId('Pie Chart');
		const box = getByTestId('Box plot');
		expect(hist).to.exist;
		expect(scatter).to.exist;
		expect(pie).to.exist;
		expect(box).to.exist;
	});
});

describe('When user clicks', () => {
	it('should describe histogram', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const hist = getByTestId('Histogram');

		await user.click(hist);

		expect(get(graph_name)).toBe('Histogram');
		expect(get(graph_description)).toBe(
			'A histogram is a graphical representation of the distribution of numerical data. It groups data into bins and displays the frequency of data points in each bin using bars.'
		);
		expect(getByTestId('name-chart').innerHTML).toEqual('Histogram');
		expect(getByTestId('description-chart').innerHTML).toEqual(
			'A histogram is a graphical representation of the distribution of numerical data. It groups data into bins and displays the frequency of data points in each bin using bars.'
		);
	});
	it('should describe pie chart', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const pie = getByTestId('Pie Chart');

		await user.click(pie);

		expect(get(graph_name)).toBe('Pie Chart');
		expect(get(graph_description)).toBe(
			"A pie chart is a circular statistical graphic that is divided into slices to illustrate numerical proportions. Each slice represents a category's contribution to the whole. Pie charts are ideal for showing relative sizes of data parts to the whole, making it easy to compare individual segments."
		);
		expect(getByTestId('name-chart').innerHTML).toEqual('Pie Chart');
		expect(getByTestId('description-chart').innerHTML).toEqual(
			"A pie chart is a circular statistical graphic that is divided into slices to illustrate numerical proportions. Each slice represents a category's contribution to the whole. Pie charts are ideal for showing relative sizes of data parts to the whole, making it easy to compare individual segments."
		);
	});
	it('should describe scatter', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const hist = getByTestId('Scatter');

		await user.click(hist);

		expect(get(graph_name)).toBe('Scatter');
		expect(get(graph_description)).toBe(
			'A scatterplot shows the relationship between two quantitative variables measured for the same individuals. The values of one variable appear on the horizontal axis, and the values of the other variable appear on the vertical axis. Each individual in the data appears as a point on the graph.'
		);
		expect(getByTestId('name-chart').innerHTML).toEqual('Scatter');
		expect(getByTestId('description-chart').innerHTML).toEqual(
			'A scatterplot shows the relationship between two quantitative variables measured for the same individuals. The values of one variable appear on the horizontal axis, and the values of the other variable appear on the vertical axis. Each individual in the data appears as a point on the graph.'
		);
	});
	it('should describe boxplot', async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(sut, { graphs: GraphMetas });

		const pie = getByTestId('Box plot');

		await user.click(pie);

		expect(get(graph_name)).toBe('Box plot');
		expect(get(graph_description)).toBe(
			'In descriptive statistics, a box plot or boxplot is a type of chart often used in explanatory data analysis. Box plots visually show the distribution of numerical data and skewness by displaying the data quartiles (or percentiles) and averages.'
		);
		expect(getByTestId('name-chart').innerHTML).toEqual('Box plot');
		expect(getByTestId('description-chart').innerHTML).toEqual(
			'In descriptive statistics, a box plot or boxplot is a type of chart often used in explanatory data analysis. Box plots visually show the distribution of numerical data and skewness by displaying the data quartiles (or percentiles) and averages.'
		);
	});
});
