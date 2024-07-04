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
	'#FFA500', // Orange
	'#7FFF00', // Chartreuse
	'#9370DB', // MediumPurple
	'#6B8E23', // OliveDrab
	'#A0522D', // Sienna
	'#FFE4E1', // MistyRose
	'#00FA9A', // MediumSpringGreen
	'#BA55D3', // MediumOrchid
	'#2F4F4F', // DarkSlateGrey
	'#87CEEB', // SkyBlue
	'#B0E0E6', // PowderBlue
	'#8B4513', // SaddleBrown
	'#FDF5E6', // OldLace
	'#3CB371', // MediumSeaGreen
	'#008B8B', // DarkCyan
	'#483D8B', // DarkSlateBlue
	'#DAA520', // GoldenRod
	'#ADD8E6', // LightBlue
	'#9400D3', // DarkViolet
	'#2F4F4F', // DarkSlateGray
	'#DA70D6', // Orchid
	'#000000', // Black
	'#F0E68C', // Khaki
	'#FFFAFA', // Snow
	'#FF7F50', // Coral
	'#FF0000', // Red
	'#CD853F', // Peru
	'#8FBC8F', // DarkSeaGreen
	'#F8F8FF', // GhostWhite
	'#F0F8FF', // AliceBlue
	'#F5FFFA', // MintCream
	'#800000', // Maroon
	'#808080', // Gray
	'#FAEBD7', // AntiqueWhite
	'#FFF5EE', // SeaShell
	'#00FFFF', // Aqua
	'#F08080', // LightCoral
	'#F0FFF0', // HoneyDew
	'#FFA07A', // LightSalmon
	'#B0C4DE', // LightSteelBlue
	'#48D1CC', // MediumTurquoise
	'#6A5ACD', // SlateBlue
	'#FFFACD', // LemonChiffon
	'#7B68EE', // MediumSlateBlue
	'#FFFFFF', // White
	'#7CFC00', // LawnGreen
	'#008000', // Green
	'#006400', // DarkGreen
	'#EEE8AA', // PaleGoldenRod
	'#8B0000', // DarkRed
	'#66CDAA', // MediumAquaMarine
	'#FA8072', // Salmon
	'#20B2AA', // LightSeaGreen
	'#FF00FF', // Fuchsia
	'#6495ED', // CornflowerBlue
	'#FF4500', // OrangeRed
	'#708090', // SlateGray
	'#BDB76B', // DarkKhaki
	'#0000FF', // Blue
	'#90EE90', // LightGreen
	'#FFDAB9', // PeachPuff
	'#696969', // DimGray
	'#000080', // Navy
	'#FFD700', // Gold
	'#DCDCDC', // Gainsboro
	'#FFF8DC', // Cornsilk
	'#4169E1', // RoyalBlue
	'#0000CD', // MediumBlue
	'#A9A9A9', // DarkGray
	'#FFC0CB', // Pink
	'#00CED1', // DarkTurquoise
	'#8B008B', // DarkMagenta
	'#FFE4B5', // Moccasin
	'#F5F5F5', // WhiteSmoke
	'#800080', // Purple
	'#E9967A', // DarkSalmon
	'#B8860B', // DarkGoldenRod
	'#5F9EA0', // CadetBlue
	'#708090', // SlateGrey
	'#C0C0C0', // Silver
	'#D2B48C', // Tan
	'#8A2BE2', // BlueViolet
	'#ADFF2F', // GreenYellow
	'#2E8B57', // SeaGreen
	'#7FFFD4', // Aquamarine
	'#E6E6FA', // Lavender
	'#FFFAF0', // FloralWhite
	'#87CEFA', // LightSkyBlue
	'#DC143C', // Crimson
	'#FF6347', // Tomato
	'#4B0082', // Indigo
	'#A52A2A', // Brown
	'#F0FFFF', // Azure
	'#00FF00', // Lime
	'#FF00FF', // Magenta
	'#663399', // RebeccaPurple
	'#FFE4C4', // Bisque
	'#C71585', // MediumVioletRed
	'#FFFFF0', // Ivory
	'#FFDEAD', // NavajoWhite
	'#98FB98', // PaleGreen
	'#FFF0F5', // LavenderBlush
	'#00BFFF', // DeepSkyBlue
	'#FAFAD2', // LightGoldenRodYellow
	'#AFEEEE', // PaleTurquoise
	'#9ACD32', // YellowGreen
	'#CD5C5C', // IndianRed
	'#DDA0DD', // Plum
	'#FFB6C1', // LightPink
	'#FF1493', // DeepPink
	'#F5F5DC', // Beige
	'#228B22', // ForestGreen
	'#191970', // MidnightBlue
	'#808000', // Olive
	'#EE82EE', // Violet
	'#DEB887', // BurlyWood
	'#FFEFD5', // PapayaWhip
	'#FFFF00', // Yellow
	'#00FF7F', // SpringGreen
	'#FFFFE0', // LightYellow
	'#556B2F', // DarkOliveGreen
	'#BC8F8F', // RosyBrown
	'#F5DEB3', // Wheat
	'#FFEBCD', // BlanchedAlmond
	'#4682B4', // SteelBlue
	'#D3D3D3', // LightGray
	'#32CD32', // LimeGreen
	'#DB7093', // PaleVioletRed
	'#A9A9A9', // DarkGrey
	'#FF69B4', // HotPink
	'#FAF0E6', // Linen
	'#FF8C00', // DarkOrange
	'#00FFFF', // Cyan
	'#008080', // Teal
	'#B22222', // FireBrick
	'#D8BFD8', // Thistle
	'#D2691E', // Chocolate
	'#00008B', // DarkBlue
	'#1E90FF', // DodgerBlue
	'#778899', // LightSlateGray
	'#E0FFFF', // LightCyan
	'#F4A460', // SandyBrown
	'#D3D3D3', // LightGrey
	'#40E0D0', // Turquoise
	'#9932CC' // DarkOrchid
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
