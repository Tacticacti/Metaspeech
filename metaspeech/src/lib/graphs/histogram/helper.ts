import {
	calculateMean,
	calculateSum,
	calculateAbsoluteFrequency,
	calculateRelativeFrequency
} from '$lib/graphs/sharedFunctions';

import type { GroupedDataFrame, BarChartData } from '$lib/Types';
import { type ChartConfiguration, type ChartDataset } from 'chart.js';
import 'chartjs-chart-error-bars';

import { setColor } from '$lib/graphs/utils/CanvasUtils';

type BarChartDataset = ChartDataset<'barWithErrorBars'>;
type BarChartConfiguration = ChartConfiguration<'barWithErrorBars'>;

import { getTitleText, getScaleXAxisText, getScaleYAxisText } from '$lib/graphs/sharedFunctions';

/**
 * determines which aggregation or frequency function to use
 * @param selectedFunction determines which function user has selected
 * @param data current data frame
 * @returns bin strings and values for chart
 */
export function handleData(
	selectedFunction: string,
	data: GroupedDataFrame
): [string[], BarChartData[]] {
	switch (selectedFunction) {
		case 'Sum':
			return calculateSum(data);
		case 'Mean':
			return calculateMean(data, false);
		case 'Mean + Standard Deviation':
			return calculateMean(data, true);
		case 'Count':
			return calculateAbsoluteFrequency(data);
		case 'Percentage':
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
export function createDatasets(
	data: GroupedDataFrame,
	values: BarChartData[],
	selectedFunction: string
) {
	return [
		{
			label: createDatasetsLabel(data, values, selectedFunction),
			data: values,
			backgroundColor: 'rgba(51, 50, 200, 1)',
			borderColor: 'rgba(0, 0, 0, 1)',
			borderWidth: 1
		}
	];
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
	values: BarChartData[],
	selectedFunction: string
) {
	if (data.aggregateColumn) {
		return data.aggregateColumn.name;
	}
	if (selectedFunction === 'Count') {
		return 'Count';
	}
	return 'Percentage';
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
	datasets: BarChartDataset[],
	data: GroupedDataFrame,
	selectedFunction: string
): BarChartConfiguration {
	const plugin = {
		id: 'customCanvasBackgroundColor',
		beforeDraw: setColor
	};

	const cfg: BarChartConfiguration = {
		type: 'barWithErrorBars',
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
					text: getTitleText(data, selectedFunction)
				}
			},
			scales: {
				x: {
					title: {
						display: true,
						text: getScaleXAxisText(data)
					}
				},
				y: {
					title: {
						display: true,
						text: getScaleYAxisText(data, selectedFunction)
					}
				}
			}
		},
		//@ts-expect-error dont know plugin type
		plugins: [plugin]
	};
	return cfg;
}
