import { Row } from 'dataframe-js';

// gets numerical columns and their maximum value
export function getNumericalColumnsAndMax(columnNames: string[], rows: Row[]): [string, number][] {
	const numericNamesAndMaxs: [string, number][] = [];

	for (const column of columnNames) {
		let maxValue = Number.MIN_VALUE;
		let isNumeric: boolean = true;

		for (const row of rows) {
			const value = row.get(column);
			if (value === undefined) {
				continue;
			}
			const numericValue = +value;

			if (isNaN(numericValue)) {
				// if there is any string, column is not numeric
				isNumeric = false;
				break;
			}

			if (numericValue > maxValue) {
				maxValue = numericValue;
			}
		}

		if (isNumeric) {
			numericNamesAndMaxs.push([column, maxValue]);
		}
	}

	return numericNamesAndMaxs;
}
export function getNumericalColumns(columnNames: string[], rows: Row[]): string[] {
	const numericNames: string[] = [];

	for (const column of columnNames) {
		let isNumeric: boolean = true;

		for (const row of rows) {
			const value = row.get(column);
			if (value === undefined) {
				continue;
			}
			const numericValue = +value;

			if (isNaN(numericValue)) {
				// if there is any string, column is not numeric
				isNumeric = false;
				break;
			}
		}

		if (isNumeric) {
			numericNames.push(column);
		}
	}

	return numericNames;
}
export function getNonNumericalColumns(columnNames: string[], rows: Row[]): string[] {
	const NonNumericNames: string[] = [];

	for (const column of columnNames) {
		let isNumeric: boolean = true;

		for (const row of rows) {
			const value = row.get(column);
			if (value === undefined) {
				continue;
			}
			const numericValue = +value;

			if (isNaN(numericValue)) {
				isNumeric = false;
				break;
			}
		}

		if (!isNumeric) {
			NonNumericNames.push(column);
		}
	}

	return NonNumericNames;
}
