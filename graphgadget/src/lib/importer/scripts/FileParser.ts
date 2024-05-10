import { ParseTsv } from '$lib/importer/scripts/TsvParser';
import { ParseXls } from '$lib/importer/scripts/XlsParser';
import { DataFrame } from 'dataframe-js';

/**
 * Extracts the file extension from a File object.
 * @param file The File object.
 * @returns The file extension, or an empty string if no extension could be determined.
 */
function GetFileExtension(file: File): string {
	if (!file || !file.name) {
		return '';
	}
	const fileName = file.name;
	const lastDotIndex = fileName.lastIndexOf('.');

	// Check if the dot is not the first character and there is something after the dot
	if (lastDotIndex > 0 && lastDotIndex < fileName.length - 1) {
		return fileName.substring(lastDotIndex + 1);
	}
	return '';
}

export function Parse(file: File): Promise<DataFrame> {
	if (!file) return Promise.reject('No file found.');
	switch (GetFileExtension(file)) {
		case 'tsv':
			return ParseTsv(file);
		case 'xls':
			return ParseXls(file);
		case 'xlsx':
			return ParseXls(file);
	}

	return Promise.reject('Unsupported file type found. Type found: ' + file.type);
}
export { ParseXls, GetFileExtension };
