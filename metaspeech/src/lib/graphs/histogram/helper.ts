import { barchartStyles } from '$lib/Constants';
import {
	calculateMean,
	calculateSum,
	calculateAbsoluteFrequency,
	calculateRelativeFrequency
} from '$lib/graphs/sharedFunctions';

import type { GroupedDataFrame, BarChartData, Column, BarChartDataset } from '$lib/Types';

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

export function getBarChartData(
	data: GroupedDataFrame,
	selectedFunction: string,
	legendColumn: Column
) : [string[], BarChartDataset[]] {
	const map = new Map<string, GroupedDataFrame>();
	const indexLegend = data.groupedColumns.indexOf(legendColumn);
	const newGroupedColumns = data.groupedColumns.filter(c => c !== legendColumn);

	// Here do regrouping to split into different data frames
	// So that we can reuse functionality to calculate mean etc.

	for (const group of data.groups) {
		const legendKey = group.keys[indexLegend]+"";
		const nonLegendKeys = group.keys.filter((v, i) => i !== indexLegend);

		if (!map.has(legendKey)) {
			map.set(legendKey, {
				groups: [],
				groupedColumns: newGroupedColumns,
				aggregateColumn: data.aggregateColumn
			});
		}

		map.get(legendKey)!.groups.push({ keys: nonLegendKeys, values: group.values})
	}

	const datasets = [...map.entries()].map((entry, index) => {
		const [labels, data] = handleData(selectedFunction, entry[1]);
		return {
			label: entry[0],
			labels,
			data,
			...barchartStyles[index]
		}
	});

	return [[], datasets];
}