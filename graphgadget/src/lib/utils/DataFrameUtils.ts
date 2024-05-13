import { DataFrame } from 'dataframe-js';

/**
 * Checks if a DataFrame has missing values.
 * @param df The DataFrame to check.
 * @returns An array of indices of missing values. Indeces are in the form [row, column].
 */
export function hasMissingValues(df: DataFrame): number[][] {
	const result: number[][] = [];
	const arr = df.toArray() as unknown[][];
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[i].length; j++) {
			if (
				arr[i][j] === null ||
				arr[i][j] === undefined ||
				(typeof arr[i][j] === 'number' && isNaN(arr[i][j] as number))
			) {
				result.push([i, j]);
			}
		}
	}
	return result;
}

/**
 * Merges two DataFrames row-wise (i.e. by matching indeces).
 * @param df1 A DataFrame.
 * @param df2 The DataFrame to merge with
 * @returns A new DataFrame from the 2 dataframes.
 */
export function rowWiseMerge(df1: DataFrame, df2: DataFrame): DataFrame {
	const columns = df1.listColumns().concat(df2.listColumns()) as string[];

	const data1 = df1.toArray() as unknown[][];
	const data2 = df2.toArray() as unknown[][];

	const ndata = data1.map((row1, i) => {
		const row2 = data2[i];
		return row1.concat(row2);
	});

	return new DataFrame(ndata, columns);
}
