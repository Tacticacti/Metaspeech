import { parseXlS } from '$lib/components/importer/scripts/XlsParser';
import { ParseJson } from './JsonParser';
import { UnsupportedFileError } from '$lib/Types';
import type { DataFrameLike } from '$lib/dataframe/DataFrame';
import { fromFile } from '$lib/dataframe/DataFrame';

/**
 * Extracts the file extension from a File object.
 * @param file The File object.
 * @returns The file extension, or an empty string if no extension could be determined.
 */
export function GetFileExtension(file: File): string {
	if (!file || !file.name) {
		return '';
	}
	// get index of last dot in file name
	const fileName = file.name;
	const lastDotIndex = fileName.lastIndexOf('.');

	// Check if the dot is not the first character and there is something after the dot
	if (lastDotIndex <= 0 || lastDotIndex >= fileName.length - 1) {
		return '';
	}

	return fileName.substring(lastDotIndex + 1);
}

/**
 * Parses a file into a DataFrame. It accepts .tsv, .xls, .xlsx, .json, .csv, and .txt files.
 * @param file The file to parse.
 * @returns A Promise that resolves to a DataFrame.
 */
export function Parse(file: File): Promise<DataFrameLike> {
	if (!file) return Promise.reject('No file found.');
	switch (GetFileExtension(file)) {
		case 'txt':
		case 'tsv':
			return fromFile(file, '\t', '\n');
		case 'csv':
			return fromFile(file, ',', '\n');
		case 'xls':
		case 'xlsx':
			return parseXlS(file);
		case 'json':
			return ParseJson(file);
		default:
			return Promise.reject(
				new UnsupportedFileError('Unsupported file type found. Type found: ' + file.type)
			);
	}
}
