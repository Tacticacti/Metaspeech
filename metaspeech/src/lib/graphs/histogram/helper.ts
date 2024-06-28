import { barchartStyles } from '$lib/Constants';
import { sortGroups } from '$lib/dataframe/DataFrame';
import {
	calculateMean,
	calculateSum,
	calculateAbsoluteFrequency,
	calculateRelativeFrequency,
	keyArrayToString,
	keyToString
} from '$lib/graphs/sharedFunctions';

import type { GroupedDataFrame, BarChartData, Column, BarChartDataset, DataType } from '$lib/Types';

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

function fillData(
	labels: string[],
	data: BarChartData[],
	allStringLabels: string[]
): BarChartData[] {
	const newData: BarChartData[] = [];

	for (let idxAll = 0, idxFew = 0; idxAll < allStringLabels.length; ++idxAll) {
		if (labels[idxFew] === allStringLabels[idxAll]) {
			newData.push(data[idxFew]);
			++idxFew;
		} else {
			// Does not have these keys, so push a 0 to show empty bar
			newData.push(0);
		}
	}

	return newData;
}

function contains(allLabels: DataType[][], keys: DataType[]): boolean {
	for (const labelArray of allLabels) {
		if (labelArray.length !== keys.length) {
			continue;
		}

		let equal = true;
		for (let i = 0; i < labelArray.length; ++i) {
			if (labelArray[i] !== keys[i]) {
				equal = false;
				break;
			}
		}

		if (equal) {
			return true;
		}
	}

	return false;
}

export function getBarChartData(
	data: GroupedDataFrame,
	selectedFunction: string,
	legendColumn: Column | undefined
): [string[], BarChartDataset[]] {
	if (legendColumn === undefined || legendColumn === null) {
		return [[], []];
	}

	const map = new Map<string, GroupedDataFrame>();
	const indexLegend = data.groupedColumns.indexOf(legendColumn);
	const newGroupedColumns = data.groupedColumns.filter((c) => c !== legendColumn);

	// Here do regrouping to split into different data frames
	// So that we can reuse functionality to calculate mean etc.

	for (const group of data.groups) {
		const legendKey = keyToString(group.keys[indexLegend], legendColumn.groupBy!);
		const nonLegendKeys = group.keys.filter((_, i) => i !== indexLegend);

		if (!map.has(legendKey)) {
			map.set(legendKey, {
				groups: [],
				groupedColumns: newGroupedColumns,
				aggregateColumn: data.aggregateColumn
			});
		}

		map.get(legendKey)!.groups.push({ keys: nonLegendKeys, values: group.values });
	}

	const allLabels = new Array<DataType[]>();

	for (const groupedDf of map.values()) {
		// Union of all keys of each dataset
		for (const group of groupedDf.groups) {
			if (!contains(allLabels, group.keys)) {
				allLabels.push(group.keys);
			}
		}
	}

	allLabels.sort();

	const allStringLabels = allLabels.map((keys) => keyArrayToString(keys, newGroupedColumns));

	const datasets = [...map.entries()].map(([legend, groupedDf], index) => {
		sortGroups(groupedDf.groups);
		const [labels, data] = handleData(selectedFunction, groupedDf);

		return {
			label: legend,
			data: fillData(labels, data, allStringLabels),
			...barchartStyles[index % barchartStyles.length]
		};
	});

	return [allStringLabels, datasets];
}
