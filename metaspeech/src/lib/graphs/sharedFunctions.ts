import type { GroupedDataFrame, Group } from '$lib/Types';

/**
 * generates title for graph from current dataframe
 * @param data current dataframe
 * @returns title string
 */
export function getTitleText(data: GroupedDataFrame): string {
	if (data.groupedColumns.length === 0) {
		return 'Total Frequency';
	}
	let title: string;
	if (data.aggregateColumn) title = data.aggregateColumn.name + ' x ';
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
export function calculateMean(data: GroupedDataFrame): [string[], number[]] {
	const bins: string[] = [];
	const values: number[] = [];
	for (let i = 0; i < data.groups.length; i++) {
		const group: Group = data.groups[i];
		const name: string = JSON.stringify(group.keys);
		bins.push(name);
		let sum: number = 0;
		for (let j = 0; j < group.values.length; j++) {
			sum += group.values[j] as number; //this will always be number, because it is not possible
			//to select a non numeric column in parameter page
			//Make sure to pass only numeric columns!
		}
		values.push(sum / group.values.length);
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
		const name: string = JSON.stringify(group.keys);

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
		const name: string = JSON.stringify(group.keys);

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
		const name: string = JSON.stringify(group.keys);

		bins.push(name);

		total += group.values.length;
	}
	for (let i = 0; i < data.groups.length; i++) {
		const group: Group = data.groups[i];
		values.push((group.values.length / total) * 100);
	}
	return [bins, values];
}
