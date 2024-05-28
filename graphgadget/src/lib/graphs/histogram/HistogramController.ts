import { Row } from 'dataframe-js';

export type BinDictionary = Record<string, number>;
export type MapDictionary = Record<string, Map<string, [number, number]>>;

export const ABSOLUTE_FREQUENCY: string = 'Absolute Frequency';
export const RELATIVE_FREQUENCY: string = 'Relative Frequency';
export const SEPARATION_PARAMETERS: string = '; ';
export const SEPARATION_INTERVAL: string = ', ';
export const EMPTY_ENTRY: string = '<empty>';

/**
 * Generates the label for a parameter considering whether it is binned or not
 * @param paramName the name of the column
 * @param row the current row of the table
 * @param binSizes a dictionary that has the bin size for each parameter
 * 
 * @returns a label with the value of that column
 */
function getParamLabel(paramName: string, row: Row, binSizes: BinDictionary): string {
	const paramValue = row.get(paramName);

	if (paramValue === undefined || paramValue === null) {
		return EMPTY_ENTRY;
	}

	const binSize = binSizes[paramName] ?? 1;

	if (binSize === 1) {
		return paramValue;
	}

	const paramNumberValue = +paramValue;

	if (isNaN(paramNumberValue)) {
		return paramValue;
	}

	const rangeGroup = Math.floor(paramNumberValue / binSize);
	const lowerBound = rangeGroup * binSize;
	const upperBound = (rangeGroup + 1) * binSize - 1;

	return `[${lowerBound}${SEPARATION_INTERVAL}${upperBound}]`;
}

/**
 * Compares two elements, where each element is a pair with a label and a value.
 * This function is used to sort the arrays of labels and values for the histogram
 * @param a the first element
 * @param b the second element
 * @returns negative number if less than, positive number if greater than, zero if equal to
 */
function compareElementsOfCombinedArray(a: [string, number], b: [string, number]): number {
	const paramsA = a[0].split(SEPARATION_PARAMETERS);
	const paramsB = b[0].split(SEPARATION_PARAMETERS);
	let comparison = 0;

	// Loop will finish when it has read all parameters
	// or when comparison is not zero (so one of them precedes the other)
	for (let idx = 0; comparison == 0 && idx < paramsA.length; ++idx) {
		const [labelA, labelB] = [paramsA[idx], paramsB[idx]];

		if (!isNaN(+labelA) && !isNaN(+labelB)) {
			// It is a numeric field
			comparison = +labelA - +labelB;
			continue;
		}

		if (labelA.startsWith('[') && labelB.startsWith('[')) {
			// It is a bin interval in the format "[lower, upper]"

			const lowerA = labelA.substring(1, labelA.indexOf(SEPARATION_INTERVAL));
			const lowerB = labelB.substring(1, labelB.indexOf(SEPARATION_INTERVAL));

			// It is enough to compare lower because if they are equal,
			// this implies upper is equal as well (range is the same)
			comparison = +lowerA - +lowerB;
			continue;
		}

		// It is a string field
		comparison = labelA.localeCompare(labelB);
	}

	// If all equal, 0
	return comparison;
}

function transpose(matrix: string[][]): string[][] {
	const result: string[][] = [];
	const m = matrix.length;
	const n = matrix[0].length;

	// Matrix is (m x n). Transpose is (n x m).

	for (let i = 0; i < n; ++i) {
		result.push([]);
		for (let j = 0; j < m; ++j) {
			result[i].push(matrix[j][i]);
		}
	}

	return result;
}

export function getFrequenciesAndValues(
	dataRows: Row[],
	selectedParams: string[],
	yAxisParams: string[],
	binSizes: BinDictionary): MapDictionary {

	const maps: MapDictionary = {};

	// Iterate all rows
	for (const row of dataRows) {
		// Aggregate all selected columns of that row in a comma-separated string
		// Used as key for the maps, basically represents a bar in the chart
		const xValues: string = selectedParams
			.map((paramName) => getParamLabel(paramName, row, binSizes))
			.join(SEPARATION_PARAMETERS);

		// For each y-axis parameter that is being calculated
		for (const yParam of yAxisParams) {
			let increment = 0;
			if (yParam === ABSOLUTE_FREQUENCY || yParam === RELATIVE_FREQUENCY) {
				// If frequency, value to increment is one (one row)
				increment = 1;
			} else {
				// Otherwise value is the value of that attribute of the row
				increment = +row.get(yParam);

				if (isNaN(increment)) {
					// Skip this value entirely from the calculation
					continue;
				}
			}

			if (maps[yParam] === undefined) {
				maps[yParam] = new Map();
			}

			// Get the current value and frequency in the map with that string as key
			// If entry does not exist, use zeros
			const [labelValue, labelFrequency] = maps[yParam].get(xValues) ?? [0, 0];

			// Increment the pair of value and frequency in the map
			maps[yParam].set(xValues, [labelValue + increment, labelFrequency + 1]);
		}
	}

	return maps;
}

export function calculateAxis(
	dataRows: Row[],
	selectedParams: string[],
	checkedMean: boolean,
	yAxisParam: string,
	binSizes: BinDictionary
): [string[], number[]] {
	const maps = getFrequenciesAndValues(dataRows, selectedParams, [yAxisParam], binSizes);

	// Get the map of that y-axis parameter
	const yParamMap = maps[yAxisParam];

	// Labels are the keys of the map
	const labels: string[] = [...yParamMap.keys()];
	// Frequencies are the second element of each pair stored as value of the map
	const frequencies: number[] = [...yParamMap.values()].map(pair => pair[1]);

	if (yAxisParam == ABSOLUTE_FREQUENCY) {
		return [labels, frequencies];
	}
	if (yAxisParam == RELATIVE_FREQUENCY) {
		const totalFrequency = dataRows.length;
		return [labels, frequencies.map((f) => f / totalFrequency)];
	}

	const values: number[] = [...yParamMap.values()].map(pair => pair[0]);

	if (checkedMean) {
		// Calculate means of values
		for (let idx = 0; idx < values.length; ++idx) {
			values[idx] /= frequencies[idx];
		}
	}

	return [labels, values];
}

// Sorts two arrays based on the labels
export function sortParallelArrays(labels: string[], values: number[]): [string[], number[]] {
	const combinedArray: [string, number][] = [];
	for (let idx = 0; idx < labels.length; ++idx) {
		combinedArray.push([labels[idx], values[idx]]);
	}

	combinedArray.sort(compareElementsOfCombinedArray);

	const newLabels: string[] = [];
	const newValues: number[] = [];

	for (const [lbl, val] of combinedArray) {
		newLabels.push(lbl);
		newValues.push(val);
	}

	return [newLabels, newValues];
}

// Gets columns and table data
export function getTableInfo(maps: MapDictionary, xColumns: string[], yColumns: string[]): [string[], string[][]] {
	if (xColumns.length === 0 || yColumns.length === 0) {
		return [[], []];
	}
	
	// Get the labels from the map of the first selected y column
	// (Any selected y column would do: they all have maps with labels as keys)
	const labels: string[] = [...maps[yColumns[0]].keys()];

	const listOfColumns: string[][] = [];

	for (const ycol of yColumns) {
		// For each y column selected, get its column values
		const columnValues: number[] = [...maps[ycol].values()].map(pair => pair[0]);

		// Sort column according to labels
		const [sortedLabels, sortedColumnValues] = sortParallelArrays(labels, columnValues);

		if (listOfColumns.length === 0) {
			// If running loop for the first time, add sorted labels
			listOfColumns.push(sortedLabels);
		}

		listOfColumns.push(sortedColumnValues.map(v => v+""));
	}

	const listOfRows = transpose(listOfColumns);

	return [
		["Subgroup Label", ...yColumns],
		listOfRows
	];
}
