import { DataFrame } from 'dataframe-js';

/**
 * takes a .tsv file and returns a DataFrame
 * @param file a file object
 * @returns a DataFrame
 */
export function ParseTsv(file: File): Promise<DataFrame> {
	return DataFrame.fromTSV(file);
}

/**
 * takes a .csv file and returns a DataFrame
 * @param file a file object
 * @returns a DataFrame
 */
export function ParseCsv(file: File): Promise<DataFrame> {
	return DataFrame.fromCSV(file);
}
