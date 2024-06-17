import type { DataType, Group, GroupBy, GroupedDataFrame } from '$lib/Types';
import type { ChartConfiguration, ChartData } from 'chart.js';
import { setColor } from '../utils/CanvasUtils';
import { getTitleText, keyToString } from '../sharedFunctions';
import { possibleBoxplotColours } from '$lib/Constants';

/**
 * generates datasets for the boxplot. when 1 column is selected: trivial. when 2 columns are selected: tricky.
 * @param data current grouped dataframe
 * @returns datasets
 */
export function getBoxPlotData(data: GroupedDataFrame) {
	if (data.groupedColumns.length < 1 || data.groupedColumns.length > 2) return undefined;
	if (data.groupedColumns.length === 1) {
		return {
			// define label tree
			labels: data.groups
				.map((group) => group.keys[0])
				.map((key) => keyToString(key, data.groupedColumns[0].groupBy as GroupBy)),
			datasets: [
				{
					label: '',
					backgroundColor: 'rgba(255,0,0,0.5)',
					borderColor: 'red',
					borderWidth: 1,
					outlierColor: '#999999',
					padding: 0,
					itemRadius: 5,
					data: data.groups.map((group) => group.values)
				}
			]
		};
	}
	// need 3d array for values
	const arr: number[][][] = getArrayForDatasets(data);
	const [firstKeyIndexMap, secondKeyIndexMap] = keyToIndexMap(data);

	const datasets = [];

	for (let i = 0; i < arr.length; i++) {
		let label = [...secondKeyIndexMap.keys()][i] as string;
		if (data?.groupedColumns[0]?.groupBy) {
			label = keyToString(
				[...secondKeyIndexMap.keys()][i],
				data.groupedColumns[1].groupBy as GroupBy
			);
		}
		datasets.push({
			label: label,
			backgroundColor: possibleBoxplotColours[i % possibleBoxplotColours.length],
			borderColor: possibleBoxplotColours[i % possibleBoxplotColours.length],
			borderWidth: 1,
			outlierColor: '#999999',
			padding: 0,
			itemRadius: 5,
			data: arr[i]
		});
	}
	let labels = [...firstKeyIndexMap.keys()];
	if (data?.groupedColumns[0]?.groupBy) {
		labels = [...firstKeyIndexMap.keys()]
			.map((key) => key as DataType)
			.map((key) => keyToString(key, data.groupedColumns[0].groupBy as GroupBy));
	}

	return {
		labels: labels,
		datasets: datasets
	};
}

/**
 * maps keys from groups to a index, which will be used in a array
 * @param data current grouped dataframe
 * @returns returns 2 maps, because there are only supposed to be 2 dataTypes in 1 key, because otherwise this function wouldn't be called
 */
export function keyToIndexMap(data: GroupedDataFrame) {
	const keyToIndex1 = new Map<DataType, number>();
	const keyToIndex2 = new Map<DataType, number>();
	for (let i = 0; i < data.groups.length; i++) {
		const group: Group = data.groups[i];
		if (!keyToIndex1.has(group.keys[0])) {
			keyToIndex1.set(group.keys[0], keyToIndex1.size);
		}
		if (!keyToIndex2.has(group.keys[1])) {
			keyToIndex2.set(group.keys[1], keyToIndex2.size);
		}
	}
	return [keyToIndex1, keyToIndex2];
}

/**
 * maps all values to 3d array so that it is easier to create datasets
 * @param data current grouped data frame
 * @returns 3d array
 */
export function getArrayForDatasets(data: GroupedDataFrame) {
	const [firstKeyIndexMap, secondKeyIndexMap] = keyToIndexMap(data);

	const arr: number[][][] = [];
	for (let i = 0; i < secondKeyIndexMap.size; i++) {
		const temp: number[][] = [];
		for (let j = 0; j < firstKeyIndexMap.size; j++) {
			temp.push([]);
		}
		arr.push(temp);
	}
	for (let i = 0; i < data.groups.length; i++) {
		const group: Group = data.groups[i];
		arr[secondKeyIndexMap.get(group.keys[1]) as number][
			firstKeyIndexMap.get(group.keys[0]) as number
		] = group.values.filter((val) => val !== undefined).map((val) => Number(val)) as number[];
	}
	return arr;
}

/**
 * flips all keys in groups. ['a', 2] => [2, 'a'].
 * @param data current grouped data frame
 * @returns new grouped data frame
 */
export function flipKeys(data: GroupedDataFrame) {
	if (data.groupedColumns.length !== 2) {
		return data;
	}

	const temp = data.groupedColumns[0];
	data.groupedColumns[0] = data.groupedColumns[1];
	data.groupedColumns[1] = temp;

	const groups = data.groups;
	for (let i = 0; i < groups.length; i++) {
		const group = groups[i];

		const temp = group.keys[0];
		group.keys[0] = group.keys[1];
		group.keys[1] = temp;
	}
	return data;
}

/**
 * exports config for chart
 * @param boxplotData current box plot data, which includes labels and datasets
 * @param data current grouped data frame
 * @returns config
 */
export function getChartConfig(boxplotData: ChartData, data: GroupedDataFrame): ChartConfiguration {
	const plugin = {
		id: 'customCanvasBackgroundColor',
		beforeDraw: setColor
	};

	let legendText = data.groupedColumns[0].name;
	if(data.groupedColumns.length === 2) legendText = data.groupedColumns[1].name
	const cfg: ChartConfiguration = {
		type: 'boxplot',
		data: boxplotData,

		options: {
			plugins: {
				// @ts-expect-error Needs a specific type for plugin
				customCanvasBackgroundColor: {
					color: 'white'
				},
				title: {
					display: true,
					text: getTitleText(data)
					//'Boxplot of (' + $selectedColumns.join(', ') + ')'
				},
				legend: {
					display: true,
					position: 'right',
					title: {
						display: true,
						text: legendText
					},
					labels: {
						usePointStyle: true
					}
				}
			},
			scales: {
				y: {
					title: {
						display: true,
						text: data.aggregateColumn?.name
					}
				},
				x: {
					title: {
						display: true,
						text: data.groupedColumns[0].name
					}
				}
			}
		},

		// @ts-expect-error plugin needs a type same as above
		plugins: [plugin]
	};
	return cfg;
}
