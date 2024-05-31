import Histogram from './histogram/Histogram.svelte';
import Scatter from './scatter/Scatter.svelte';
import PieChart from './pie/PieChart.svelte';
import Boxplot from './boxplot/Boxplot.svelte';
import Table from './table/Table.svelte';

/**
 * A type that represents the metadata of a graph.
 */
export type GraphMeta = {
	title: string;
	description: string;
	img_src: string;
	component: ConstructorOfATypedSvelteComponent;
};

/**
 * The metadata of the graphs that can be displayed.
 */
export const GraphMetas: GraphMeta[] = [
	{
		title: 'Histogram',
		description:
			'A histogram is a graphical representation of the distribution of numerical data. It groups data into bins and displays the frequency of data points in each bin using bars.',
		img_src: 'histogram-img.png',
		component: Histogram
	},
	{
		title: 'Scatter',
		description:
			'A scatterplot shows the relationship between two quantitative variables measured for the same individuals. The values of one variable appear on the horizontal axis, and the values of the other variable appear on the vertical axis. Each individual in the data appears as a point on the graph.',
		img_src: 'histogram-img.png',
		component: Scatter
	},
	{
		title: 'Pie Chart',
		description:
			"A pie chart is a circular statistical graphic that is divided into slices to illustrate numerical proportions. Each slice represents a category's contribution to the whole. Pie charts are ideal for showing relative sizes of data parts to the whole, making it easy to compare individual segments.",
		img_src: 'pie-chart.png',
		component: PieChart
	},
	{
		title: 'Box plot',
		description:
			'In descriptive statistics, a box plot or boxplot is a type of chart often used in explanatory data analysis. Box plots visually show the distribution of numerical data and skewness by displaying the data quartiles (or percentiles) and averages.',
		img_src: 'histogram-img.png',
		component: Boxplot
	},
	{
		title: 'Table',
		description:
			'The table shows the data where rows have the subgroups and columns have the parameters to be shown for each subgroup.',
		img_src: 'histogram-img.png',
		component: Table
	}
];
