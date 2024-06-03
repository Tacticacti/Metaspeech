import { Row } from 'dataframe-js';

/**
 * Finds the columns that are numerical and their max values.
 * @param columnNames The names of the columns to check.
 * @param rows The rows to check.
 * @returns An array of tuples where the first element is the column name and the second element is the max value of that column.
 */
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

/**
 * Finds the columns that are numerical.
 * @param columnNames The names of the columns to check.
 * @param rows The rows to check.
 * @returns An array of column names that are numerical.
 */
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

/**
 * Finds the columns that are non-numerical.
 * @param columnNames the names of the columns to check.
 * @param rows the rows to check.
 * @returns an array of column names that are non-numerical.
 */
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
