import { DataFrame } from 'dataframe-js';

export function hasMissingValues(df: DataFrame): number[][] {
	const result: number[][] = [];
	const arr = df.toArray() as unknown[][];
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < arr[i].length; j++) {
			if (arr[i][j] === null || arr[i][j] === undefined || isNaN(arr[i][j] as number)) {
				result.push([i, j]);
			}
		}
	}
	return result;
}
