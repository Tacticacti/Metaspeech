import { Row } from 'dataframe-js';

export type BinDictionary = Record<string, number>;

export const ABSOLUTE_FREQUENCY: string = 'Absolute Frequency';
export const RELATIVE_FREQUENCY: string = 'Relative Frequency';
export const SEPARATION_PARAMETERS: string = '; ';
export const SEPARATION_INTERVAL: string = ', ';
export const EMPTY_ENTRY: string = '<empty>';

/**
 * Generates a label for a parameter in a row. {value} for non-numeric fields, [lower, upper] for numeric fields if the binSize is greater than 1.
 * @param paramName The name of the parameter to generate a label for.
 * @param row The row to generate the label for.
 * @param binSizes The bin sizes for the parameters.
 * @returns The label for the parameter.
 */
function getParamLabel(paramName: string, row: Row, binSizes: BinDictionary): string {
	const paramValue = row.get(paramName);

	if (paramValue === undefined) {
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
 * Sorts the elements of the combined array. The combined array is an array of tuples where the first element is the label and the second element is the value.
 * Some of the labels are in the format of "[lower, upper]" where lower and upper are the min and max of a range.
 * @param a The first element to compare.
 * @param b The second element to compare.
 * @returns The comparison of the two elements.
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

/**
 * Calculates the labels and values for the x-axis and y-axis of the histogram.
 * @param dataRows The rows of data to calculate the histogram for.
 * @param selectedParams The parameters to calculate the histogram for.
 * @param checkedMean Whether to calculate the mean of the values.
 * @param yAxisParam The parameter to calculate the y-axis for.
 * @param binSizes The bin sizes for the parameters.
 * @returns The labels and values for the x-axis and y-axis of the histogram.
 */
export function calculateAxis(
	dataRows: Row[],
	selectedParams: string[],
	checkedMean: boolean,
	yAxisParam: string,
	binSizes: BinDictionary
): [string[], number[]] {
	const mapFrequencies = new Map<string, number>();
	const mapValues = new Map<string, number>();

	// Iterate all rows
	for (const row of dataRows) {
		// Aggregate all selected columns of that row in a comma-separated string
		// Used as key for the maps, basically represents a bar in the chart
		const xValues: string = selectedParams
			.map((paramName) => getParamLabel(paramName, row, binSizes))
			.join(SEPARATION_PARAMETERS);

		// Get the current frequency in the map with that string as key
		const currentFrequency: number | undefined = mapFrequencies.get(xValues);
		// Increment the frequency of that key
		mapFrequencies.set(xValues, currentFrequency === undefined ? 1 : currentFrequency + 1);

		if (yAxisParam != ABSOLUTE_FREQUENCY && yAxisParam != RELATIVE_FREQUENCY) {
			// Need to increment value of the selected y-axis parameter
			const valueIncrement: number = +row.get(yAxisParam);

			if (!valueIncrement) {
				// Skip this value entirely from the calculation
				// So decrement its frequency (which cannot be null, or undefined)
				mapFrequencies.set(xValues, mapFrequencies.get(xValues)! - 1);
				continue;
			}
			const currentValue = mapValues.get(xValues);
			mapValues.set(
				xValues,
				currentValue === undefined ? valueIncrement : currentValue + valueIncrement
			);
		}
	}

	// convert map to arrays
	const labels: string[] = [...mapFrequencies.keys()];
	const frequencies: number[] = [...mapFrequencies.values()];

	if (yAxisParam == ABSOLUTE_FREQUENCY) {
		return [labels, frequencies];
	}
	if (yAxisParam == RELATIVE_FREQUENCY) {
		const totalFrequency = dataRows.length;
		return [labels, frequencies.map((f) => f / totalFrequency)];
	}

	const values: number[] = [...mapValues.values()];

	if (checkedMean) {
		// Calculate means of values
		for (let idx = 0; idx < values.length; ++idx) {
			values[idx] /= frequencies[idx];
		}
	}

	return [labels, values];
}

/**
 * Sorts the labels and values in parallel.
 * @param labels The labels to sort.
 * @param values The values to sort.
 * @returns The sorted labels and values.
 */
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
