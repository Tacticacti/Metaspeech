import { ParseTsv } from './TsvParser';
import { DataFrame } from 'dataframe-js';

function GetFileExtension(file: File): string {
	return file.name.split('.').pop() || '';
}

export function Parse(file: File): Promise<DataFrame> {
	if (!file) return Promise.reject('No file found.');

	switch (GetFileExtension(file)) {
		case 'tsv':
			return ParseTsv(file);
	}

	return Promise.reject('Unsupported file type found. Type found: ' + file.type);
}
