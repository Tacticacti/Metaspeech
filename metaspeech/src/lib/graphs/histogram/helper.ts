import {
	calculateMean,
	calculateSum,
	calculateAbsoluteFrequency,
	calculateRelativeFrequency
} from '$lib/graphs/sharedFunctions';
import type { GroupedDataFrame } from '$lib/Types';
import { type ChartConfiguration, type ChartDataset } from 'chart.js';
import { titleText, scaleXAxisText, scaleYAxisText } from '$lib/graphs/sharedFunctions';

/**
 * Sets the background color of the chart
 * @param chart the chart to set the color to
 * @param ignored not used, but required for the function signature
 * @param options the options to set the color to
 */
// @ts-expect-error Not sure the type of chart (not Chart), ignored can be any type

function setColor(chart, ignored: string, options: ChartOptions) {
	const { ctx } = chart;
	ctx.save();
	ctx.globalCompositeOperation = 'destination-over';
	ctx.fillStyle = options.color || '#99ffff';
	ctx.fillRect(0, 0, chart.width, chart.height);
	ctx.restore();
}

/**
 * determines which aggregation or frequency function to use
 * @param selectedFunction determines which function user has selected
 * @param data current data frame
 * @returns bin strings and values for chart
 */
export function handleData(selectedFunction: string, data: GroupedDataFrame): [string[], number[]] {
	switch (selectedFunction) {
		case 'sum':
			return calculateSum(data);
		case 'mean':
			return calculateMean(data);
		case 'Absolute Frequency':
			return calculateAbsoluteFrequency(data);
		case 'Relative Frequency':
			return calculateRelativeFrequency(data);
	}
	return [[], []];
}

/**
 * creates datasets which are used later on to create a chart
 * @param data current grouped dataframe
 * @param values current aggragated values
 * @param selectedFunction selected function name
 * @returns datasets for chart
 */
export function createDatasets(data: GroupedDataFrame, values: number[], selectedFunction: string) {
	const datasets = [
		{
			label: createDatasetsLabel(data, values, selectedFunction),
			data: values,
			backgroundColor: 'rgba(51, 50, 200, 1)',
			borderColor: 'rgba(255, 99, 132, 1)',
			borderWidth: 1
		}
	];
	return datasets;
}

/**
 * makes label for datasets object
 * @param data current grouped dataframe
 * @param values current values
 * @param selectedFunction current selected function
 * @returns label for datasets
 */
export function createDatasetsLabel(
	data: GroupedDataFrame,
	values: number[],
	selectedFunction: string
) {
	return data.aggregateColumn //not sure if this is readable
		? data.aggregateColumn.name
		: selectedFunction == 'Absolute Frequency'
			? 'Count'
			: 'Percentage';
}

/**
 * creates config object for chart
 * @param labels bin names
 * @param datasets values for each of the bins
 * @param data current grouped dataframe
 * @param selectedFunction user selected function
 * @returns config object
 */
export function createConfig(
	labels: string[],
	datasets: ChartDataset[],
	data: GroupedDataFrame,
	selectedFunction: string
): ChartConfiguration {
	const plugin = {
		id: 'customCanvasBackgroundColor',
		beforeDraw: setColor
	};

	const cfg: ChartConfiguration = {
		type: 'bar',
		data: {
			labels: labels,
			datasets: datasets
		},

		options: {
			plugins: {
				// @ts-expect-error Needs a specific type for plugin
				customCanvasBackgroundColor: {
					color: 'white'
				},
				title: {
					display: true,
					// Checks if there are colums selected, if not then this is just Absolute Frequency
					// Else the title is the values x group of columns
					text: titleText(data)
				}
			},
			scales: {
				x: {
					title: {
						display: true,
						text: scaleXAxisText(data)
					}
				},
				y: {
					title: {
						display: true,
						text: scaleYAxisText(data, selectedFunction)
					}
				}
			}
		},
		//@ts-expect-error dont know plugin type
		plugins: [plugin]
	};
	return cfg;
}
