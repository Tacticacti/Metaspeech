import { Row } from 'dataframe-js';

export const ABSOLUTE_FREQUENCY: string = 'Absolute Frequency';
export const RELATIVE_FREQUENCY: string = 'Relative Frequency';

export function getNumericalColumns(columnNames: string[], row: Row): string[] {
	return columnNames.filter((name) => !isNaN(+row.get(name)));
}

export function calculateAxis(
	dataRows: Row[],
	selectedParams: string[],
	checkedMean: boolean,
	yAxisParam: string
): [string[], number[]] {
	const mapFrequencies = new Map<string, number>();
	const mapValues = new Map<string, number>();

	// Iterate all rows
	for (const row of dataRows) {
		// Aggregate all selected columns of that row in a comma-separated string
		// Used as key for the maps, basically represents a bar in the chart
		const xValues: string = selectedParams
			.map((paramName) => row.get(paramName) ?? '<empty>')
			.join(', ');

		// Get the current frequency in the map with that string as key
		const currentFrequency: number | undefined = mapFrequencies.get(xValues);
		// Increment the frequency of that key
		mapFrequencies.set(xValues, currentFrequency === undefined ? 1 : currentFrequency + 1);

		if (yAxisParam != ABSOLUTE_FREQUENCY && yAxisParam != RELATIVE_FREQUENCY) {
			// Need to increment value of the selected y-axis parameter
			const valueIncrement: number = +row.get(yAxisParam);

			if (valueIncrement === undefined) {
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

// Sorts two arrays based on the labels
export function sortParallelArrays(labels: string[], values: number[]): [string[], number[]] {
	const combinedArray: [string, number][] = [];
	for (let idx = 0; idx < labels.length; ++idx) {
		combinedArray.push([labels[idx], values[idx]]);
	}

	combinedArray.sort((a, b) => {
		const paramsA = a[0].split(', ');
		const paramsB = b[0].split(', ');

		for (let idx = 0; idx < paramsA.length; ++idx) {
			let comparison = 0;

			const [labelA, labelB] = [paramsA[idx], paramsB[idx]];

			if (!isNaN(+labelA) && !isNaN(+labelB)) {
				// Numeric field
				comparison = +labelA - +labelB;
			} else {
				// String field
				comparison = labelA.localeCompare(labelB);
			}

			if (comparison != 0) {
				// If not equal, return number
				return comparison;
			}
		}

		// If all equal, they are equal
		return 0;
	});

	const newLabels: string[] = [];
	const newValues: number[] = [];

	for (const [lbl, val] of combinedArray) {
		newLabels.push(lbl);
		newValues.push(val);
	}

	return [newLabels, newValues];
}
