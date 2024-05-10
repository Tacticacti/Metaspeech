import { ParseTsv } from '$lib/importer/scripts/TsvParser';
import { ParseXls } from '$lib/importer/scripts/XlsParser';
import { DataFrame } from 'dataframe-js';

function GetFileExtension(file: File): string {
	return file.name.split('.').pop() || '';
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
