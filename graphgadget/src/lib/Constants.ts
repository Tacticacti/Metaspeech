import type { GraphMeta, ScatterStyle } from '$lib/Types';
import Histogram from './graphs/histogram/Histogram.svelte';
import BoxPlot from './graphs/boxplot/BoxPlot.svelte';
import PieChart from './graphs/piechart/PieChart.svelte';
import ScatterPlot from './graphs/scatterplot/ScatterPlot.svelte';
import Table from './graphs/table/Table.svelte';
import Histogram_img from '$assets/graphs/histogram.png';
import BoxPlot_img from '$assets/graphs/boxplot.png';
import PieChart_img from '$assets/graphs/piechart.png';
import ScatterPlot_img from '$assets/graphs/scatterplot.png';
import Table_img from '$assets/graphs/table.png';

/**
 * The name of the application.
 */
export const APP_NAME = 'GraphGadget';

/**
 * The copyright year.
 */
export const COPYRIGHT_YEAR = 2024;

/**
 * The graphs that we support in the application.
 */
export const graphs: GraphMeta[] = [
	{
		title: 'Histogram',
		description:
			'A histogram is a graphical representation of the distribution of numerical data. It groups data into bins and displays the frequency of data points in each bin using bars.',
		img: Histogram_img,
		canRender: () => true,
		graph: Histogram
	},
	{
		title: 'Pie Chart',
		description:
			"A pie chart is a circular statistical graphic that is divided into slices to illustrate numerical proportions. Each slice represents a category's contribution to the whole. Pie charts are ideal for showing relative sizes of data parts to the whole, making it easy to compare individual segments.",
		img: PieChart_img,
		canRender: (data) => data.groupedColumns.length >= 1 && data.aggregateColumn === undefined,
		graph: PieChart
	},
	{
		title: 'Scatter',
		description:
			'A scatterplot shows the relationship between two quantitative variables measured for the same individuals. The values of one variable appear on the horizontal axis, and the values of the other variable appear on the vertical axis. Each individual in the data appears as a point on the graph.',
		img: ScatterPlot_img,
		canRender: (data) =>
			data.aggregateColumn !== undefined && data.groupedColumns && data.groupedColumns.some((col) => col.type === 'number'),
		graph: ScatterPlot
	},
	{
		title: 'Box plot',
		description:
			'In descriptive statistics, a box plot or boxplot is a type of chart often used in explanatory data analysis. Box plots visually show the distribution of numerical data and skewness by displaying the data quartiles (or percentiles) and averages.',
		img: BoxPlot_img,
		canRender: (data) => data.groupedColumns.length === 1,
		graph: BoxPlot
	},
	{
		title: 'Table',
		description: 'A table is a grid of data that can be sorted, filtered, and searched.',
		img: Table_img,
		canRender: () => true,
		graph: Table
	}
];

/**
 * Ten custom dataset styles for the scatterplot
 */
export const scatterStyles: ScatterStyle[] = [
	{
		backgroundColor: 'blue',
		borderColor: 'blue',
		pointStyle: 'circle'
	},
	{
		backgroundColor: 'red',
		borderColor: 'red',
		pointStyle: 'cross'
	},
	{
		backgroundColor: 'orange',
		borderColor: 'orange',
		pointStyle: 'crossRot'
	},
	{
		backgroundColor: 'black',
		borderColor: 'black',
		pointStyle: 'dash'
	},
	{
		backgroundColor: 'purple',
		borderColor: 'purple',
		pointStyle: 'line'
	},
	{
		backgroundColor: 'yellow',
		borderColor: 'yellow',
		pointStyle: 'rect'
	},
	{
		backgroundColor: 'magenta',
		borderColor: 'magenta',
		pointStyle: 'rectRounded'
	},
	{
		backgroundColor: 'cyan',
		borderColor: 'cyan',
		pointStyle: 'rectRot'
	},
	{
		backgroundColor: 'brown',
		borderColor: 'brown',
		pointStyle: 'star'
	},
	{
		backgroundColor: 'pink',
		borderColor: 'pink',
		pointStyle: 'triangle'
	},
];