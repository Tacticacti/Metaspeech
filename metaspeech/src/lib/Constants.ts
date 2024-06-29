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
import Table_img from '$assets/graphs/table.svg';

/**
 * The name of the application.
 */
export const APP_NAME = 'MetaSpeech';

/**
 * The copyright year.
 */
export const COPYRIGHT_YEAR = 2024;

/**
 * The graphs that we support in the application.
 */
export const graphs: GraphMeta[] = [
	{
		title: 'Barchart',
		description:
			'A barchart is a graphical representation of the distribution of numerical data. It groups data into bins and displays the frequency of data points in each bin using bars.',
		img: Histogram_img,
		canRender: () => true,
		graph: Histogram
	},
	{
		title: 'Table',
		description: 'A table is a grid of data that can be sorted, filtered, and searched.',
		img: Table_img,
		canRender: () => true,
		graph: Table
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
			data.aggregateColumn !== undefined &&
			data.groupedColumns &&
			data.groupedColumns.some(
				(col) =>
					col.type === 'number' && (col.groupBy?.type === 'specific' || col.groupBy!.size <= 1)
			),
		graph: ScatterPlot
	},
	{
		title: 'Box Plot',
		description:
			'In descriptive statistics, a box plot or boxplot is a type of chart often used in explanatory data analysis. Box plots visually show the distribution of numerical data and skewness by displaying the data quartiles (or percentiles) and averages.',
		img: BoxPlot_img,
		canRender: (data) =>
			data.groupedColumns.length <= 2 &&
			data.aggregateColumn != undefined &&
			data.aggregateColumn.type == 'number',
		graph: BoxPlot
	}
];

/**
 * Reasons why a graph would not be able to be rendered
 */
export const noRenderReasons: Record<string, string> = {
	Table: 'Unknown reason for not rendering.',
	Histogram: 'Unknown reason for not rendering.',
	'Pie Chart':
		' Pie chart can only be shown if count/percentage is selected in show and when the selected columns in groupby is non-empty.',
	Scatter:
		'Scatter plot can only be shown if at least one numeric column in groupby(without binning) and selected one numeric column in show(not count/percentage option)',
	'Box Plot':
		'Box plot can only be shown if selected less than 3 columns in group by and selected column in show(not count/percentage).'
};

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
	}
];

/**
 * Constants for merge types in the modify page
 */

export const mergeTypes = ['Merge files row-by-row', 'Merge files by key'];

/**
 * Possible legend colors
 */
export const possibleColors: string[] = [
	'Orange',
	'Chartreuse',
	'MediumPurple',
	'OliveDrab',
	'Sienna',
	'MistyRose',
	'MediumSpringGreen',
	'MediumOrchid',
	'DarkSlateGrey',
	'SkyBlue',
	'PowderBlue',
	'SaddleBrown',
	'OldLace',
	'MediumSeaGreen',
	'DarkCyan',
	'DarkSlateBlue',
	'GoldenRod',
	'LightBlue',
	'DarkViolet',
	'DarkSlateGray',
	'Orchid',
	'Black',
	'Khaki',
	'Snow',
	'Coral',
	'Red',
	'Peru',
	'DarkSeaGreen',
	'GhostWhite',
	'AliceBlue',
	'MintCream',
	'Maroon',
	'Gray',
	'AntiqueWhite',
	'SeaShell',
	'Aqua',
	'LightCoral',
	'HoneyDew',
	'LightSalmon',
	'LightSteelBlue',
	'MediumTurquoise',
	'SlateBlue',
	'LemonChiffon',
	'MediumSlateBlue',
	'White',
	'LawnGreen',
	'Green',
	'DarkGreen',
	'PaleGoldenRod',
	'DarkRed',
	'MediumAquaMarine',
	'Salmon',
	'LightSeaGreen',
	'Fuchsia',
	'CornflowerBlue',
	'OrangeRed',
	'SlateGray',
	'DarkKhaki',
	'Blue',
	'LightGreen',
	'PeachPuff',
	'DimGray',
	'Navy',
	'Gold',
	'Gainsboro',
	'Cornsilk',
	'RoyalBlue',
	'MediumBlue',
	'DarkGray',
	'Pink',
	'DarkTurquoise',
	'DarkMagenta',
	'Moccasin',
	'WhiteSmoke',
	'Purple',
	'DarkSalmon',
	'DarkGoldenRod',
	'CadetBlue',
	'SlateGrey',
	'Silver',
	'Tan',
	'BlueViolet',
	'GreenYellow',
	'SeaGreen',
	'Aquamarine',
	'Lavender',
	'FloralWhite',
	'LightSkyBlue',
	'Crimson',
	'Tomato',
	'Indigo',
	'Brown',
	'Azure',
	'Lime',
	'Magenta',
	'RebeccaPurple',
	'Bisque',
	'MediumVioletRed',
	'Ivory',
	'NavajoWhite',
	'PaleGreen',
	'LavenderBlush',
	'DeepSkyBlue',
	'LightGoldenRodYellow',
	'PaleTurquoise',
	'YellowGreen',
	'IndianRed',
	'Plum',
	'LightPink',
	'DeepPink',
	'Beige',
	'ForestGreen',
	'MidnightBlue',
	'Olive',
	'Violet',
	'BurlyWood',
	'PapayaWhip',
	'Yellow',
	'SpringGreen',
	'LightYellow',
	'DarkOliveGreen',
	'RosyBrown',
	'Wheat',
	'BlanchedAlmond',
	'SteelBlue',
	'LightGray',
	'LimeGreen',
	'PaleVioletRed',
	'DarkGrey',
	'HotPink',
	'Linen',
	'DarkOrange',
	'Cyan',
	'Teal',
	'FireBrick',
	'Thistle',
	'Chocolate',
	'DarkBlue',
	'DodgerBlue',
	'LightSlateGray',
	'LightCyan',
	'SandyBrown',
	'LightGrey',
	'Turquoise',
	'DarkOrchid'
];

/**
 * Possible styles for bars
 */
export const barchartStyles = possibleColors.map((color) => {
	return {
		backgroundColor: color,
		borderColor: 'rgba(0, 0, 0, 1)',
		borderWidth: 1
	};
});
