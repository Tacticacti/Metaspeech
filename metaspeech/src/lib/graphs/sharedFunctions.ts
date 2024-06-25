import type { GroupedDataFrame, Group, DataType, GroupBy, Column, BarChartData } from '$lib/Types';

/**
 * generates title for graph from current dataframe
 * @param data current dataframe
 * @returns title string
 */
export function getTitleText(
	data: GroupedDataFrame,
	selectedFunction: string | null = null
): string {
	// Checks if there are colums selected, if not then this is just Absolute Frequency
	// Else the title is the values x group of columns

	if (data.groupedColumns.length === 0) {
		return 'Total Frequency';
	}
	let title: string;
	if (data.aggregateColumn && selectedFunction)
		title = selectedFunction + ' of ' + data.aggregateColumn.name + ' x ';
	else if (data.aggregateColumn) title = data.aggregateColumn.name + ' x ';
	else title = 'Frequency of ';

	if (data.groupedColumns.length > 1)
		title += '(' + data.groupedColumns.map((column) => column.name).join(', ') + ')';
	else title += data.groupedColumns[0].name;
	return title;
}

/**
 * generates scale text for graph from current dataframe (x axis)
 * @param data current dataframe
 * @returns scale string
 */
export function getScaleXAxisText(data: GroupedDataFrame): string {
	if (data.groupedColumns.length === 0) {
		return 'all';
	}
	if (data.groupedColumns.length > 1) {
		return 'Group: (' + data.groupedColumns.map((column) => column.name).join(', ') + ')';
	}
	return data.groupedColumns[0].name;
}

/**
 * generates scale text for graph from current dataframe (y axis)
 * @param data current dataframe
 * @returns scale string
 */
export function getScaleYAxisText(data: GroupedDataFrame, selectedFunction: string): string {
	if (data.aggregateColumn !== undefined) {
		return data.aggregateColumn.name;
	}
	if (selectedFunction == 'Absolute Frequency') {
		return 'Absolute frequency(Count)';
	}
	if (selectedFunction == 'Relative Frequency') {
		return 'Relative frequency(%)';
	}

	return 'Unknown';
}

/**
 * calculates mean values for each of the bins
 * @param data current dataframe for which we want to calculate mean
 * @returns returns bin strings + mean values for each of the bins
 */
export function calculateMean(
	data: GroupedDataFrame,
	calculateStandardDeviation: boolean
): [string[], BarChartData[]] {
	const bins: string[] = [];
	const values: BarChartData[] = [];
	for (let i = 0; i < data.groups.length; i++) {
		const group: Group = data.groups[i];
		const name: string = keyArrayToString(group.keys, data.groupedColumns);
		bins.push(name);
		let sum: number = 0;
		for (let j = 0; j < group.values.length; j++) {
			sum += group.values[j] as number; //this will always be number, because it is not possible
			//to select a non numeric column in parameter page
			//Make sure to pass only numeric columns!
		}

		const mean = sum / group.values.length;

		if (!calculateStandardDeviation) {
			values.push(mean);
			continue;
		}

		const groupValues = group.values as number[];

		//Credits to Boris
		const sd = Math.sqrt(
			groupValues.reduce((acc, v) => acc + (v - mean) ** 2, 0) / groupValues.length
		);

		const y = mean;
		const yMin = +(y - sd).toFixed(3);
		const yMax = +(y + sd).toFixed(3);

		values.push({ y, yMin, yMax });
	}
	return [bins, values];
}

/**
 * calculates sum values for each of the bins
 * @param data current dataframe for which we want to calculate sum
 * @returns returns bin strings + sum values for each of the bins
 */
export function calculateSum(data: GroupedDataFrame): [string[], number[]] {
	const bins: string[] = [];
	const values: number[] = [];
	for (let i = 0; i < data.groups.length; i++) {
		const group: Group = data.groups[i];
		const name: string = keyArrayToString(group.keys, data.groupedColumns);

		bins.push(name);
		let sum: number = 0;
		for (let j = 0; j < group.values.length; j++) {
			sum += group.values[j] as number; //this will always be number, because it is not possible
			//to select a non numeric column in parameter page
			//Make sure to pass only numeric columns!
		}
		values.push(sum);
	}
	return [bins, values];
}

/**
 * calculates absolute frequnecy for each of the bins
 * @param data current dataframe for which we want to calculate abs freq
 * @returns returns bin strings + abs freq(count) for each of the bins
 */
export function calculateAbsoluteFrequency(data: GroupedDataFrame): [string[], number[]] {
	const bins: string[] = [];
	const values: number[] = [];
	for (let i = 0; i < data.groups.length; i++) {
		const group: Group = data.groups[i];
		const name: string = keyArrayToString(group.keys, data.groupedColumns);

		bins.push(name);
		values.push(group.values.length);
	}
	return [bins, values];
}

/**
 * calculates relative frequnecy for each of the bins in %
 * @param data current dataframe for which we want to calculate rel freq
 * @returns returns bin strings + rel freq(count/total) for each of the bins
 */
export function calculateRelativeFrequency(data: GroupedDataFrame): [string[], number[]] {
	const bins: string[] = [];
	const values: number[] = [];
	let total: number = 0;
	for (let i = 0; i < data.groups.length; i++) {
		const group: Group = data.groups[i];
		const name: string = keyArrayToString(group.keys, data.groupedColumns);

		bins.push(name);

		total += group.values.length;
	}
	for (let i = 0; i < data.groups.length; i++) {
		const group: Group = data.groups[i];
		values.push((group.values.length / total) * 100);
	}
	return [bins, values];
}

/**
 * Converts an array of keys to a string.
 * @param arr The array of keys to convert to a string
 * @param columns The array of columns with grouping information
 * @returns The final key as a string
 */
export function keyArrayToString(arr: DataType[], columns: Column[]): string {
	const keysList = arr
		.map((key, i) => {
			const groupBy = columns[i].groupBy;
			return keyToString(key, groupBy!);
		})
		.join(', ');

	return keysList;
}

/**
 * Converts the key to a string.
 * @example
 * keyToString(2, { type: 'binned', size: 10 }) => '[20-29]'
 * @param key The key to convert to a string
 * @param groupBy The group by options for that key
 * @returns The key as a string
 */
export function keyToString(key: DataType, groupBy: GroupBy): string {
	if (key === undefined || key === null) {
		return '-';
	}

	if (groupBy.type === 'binned' && groupBy.size > 1) {
		const size = groupBy.size;
		const index = key as number;

		const start = index * size;
		const end = start + size;

		return `[${start}-${end})`;
	}

	return key.toString();
}
