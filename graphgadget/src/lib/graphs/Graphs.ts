import Histogram from './histogram/Histogram.svelte';
import Scatter from './scatter/Scatter.svelte';
import PieChart from './PieChart/PieChart.svelte';
import Boxplot from './boxplot/Boxplot.svelte';

// type with the metadata of a graph
export type GraphMeta = {
	title: string;
	description: string;
	img_src: string;
	component: ConstructorOfATypedSvelteComponent;
};

// the graphs we support as options
export const GraphMetas: GraphMeta[] = [
	{
		title: 'Histogram',
		description:
			'A histogram is a graphical representation of the distribution of numerical data. It groups data into bins and displays the frequency of data points in each bin using bars.',
		img_src: 'histogram.png',
		component: Histogram
	},
	{
		title: 'Scatter',
		description:
			'A scatterplot shows the relationship between two quantitative variables measured for the same individuals. The values of one variable appear on the horizontal axis, and the values of the other variable appear on the vertical axis. Each individual in the data appears as a point on the graph.',
		img_src: 'scatterPlot.png',
		component: Scatter
	},
	{
		title: 'Pie Chart',
		description:
			"A pie chart is a circular statistical graphic that is divided into slices to illustrate numerical proportions. Each slice represents a category's contribution to the whole. Pie charts are ideal for showing relative sizes of data parts to the whole, making it easy to compare individual segments.",
		img_src: 'pieChart.png',
		component: PieChart
	},
	{
		title: 'Box plot',
		description:
			'In descriptive statistics, a box plot or boxplot is a type of chart often used in explanatory data analysis. Box plots visually show the distribution of numerical data and skewness by displaying the data quartiles (or percentiles) and averages.',
		img_src: 'boxPlot.png',
		component: Boxplot
	}
];
// {
// 	title: 'Stem',
// 	description:
// 		'A stem plot (or stem-and-leaf plot) is a method of displaying quantitative data in a graphical format, similar to a histogram, to show its distribution. Each data value is split into a "stem" and a "leaf," with stems representing the leading digits and leaves representing the trailing digits.',
// 	img_src: 'histogram-img.png',
// 	component: Stem
// }
