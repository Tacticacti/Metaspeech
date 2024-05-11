import { ParseXls } from '$lib/importer/scripts/XlsParser';
import { DataFrame } from 'dataframe-js';
import { ParseJson } from './JsonParser';
import { ParseTsv, ParseCsv } from './DsvLikeParser';

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
export function Parse(file: File): Promise<DataFrame> {
	if (!file) return Promise.reject('No file found.');
	switch (GetFileExtension(file)) {
		case 'tsv':
			return ParseTsv(file);
		case 'xls':
			return ParseXls(file);
		case 'xlsx':
			return ParseXls(file);
		case 'json':
			return ParseJson(file);
		case 'csv':
			return ParseCsv(file);
		case 'txt':
			return ParseTsv(file);
	}

	return Promise.reject('Unsupported file type found. Type found: ' + file.type);
}
