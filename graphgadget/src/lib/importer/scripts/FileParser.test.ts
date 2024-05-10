import { it, expect } from 'vitest';
import { Parse } from './FileParser';
import DataFrame from 'dataframe-js';

// Function to create and write data to a TSV file
function createTSVFile(data: string[][]) {
	// Convert data into TSV format
	const tsvData = data.map((row) => row.join('\t')).join('\n');
	return [tsvData];
}

it('importer pass tsv', async () => {
	const testData = [
		['Name', 'Age', 'Location'],
		['John', '30', 'New York'],
		['Alice', '25', 'London'],
		['Bob', '40', 'Paris']
	];
	const file = new File(createTSVFile(testData), 'testdata.tsv', {
		type: 'text/tab-separated-values'
	});

	const result = Parse(file);
	result.then((dataFrame) => {
		expect(dataFrame).toBeInstanceOf(DataFrame);
	});

	expect(result).toBeInstanceOf(Promise);
});

it('pass png file', async () => {
	const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

	const result = Parse(file);

	expect(result).toBeInstanceOf(Promise);
	result.catch((r) => {
		expect(r).toBe('Unsupported file type found. Type found: image/png');
	});
});

it('pass invalid name', async () => {
	const file = new File(['(⌐□_□)'], 'chucknorrispng', { type: 'nothing' });

	const result = Parse(file);

	expect(result).toBeInstanceOf(Promise);
	result.catch((r) => {
		expect(r).toBe('Unsupported file type found. Type found: nothing');
	});
});

it('pass no file', async () => {
	const result = Parse(undefined);

	expect(result).toBeInstanceOf(Promise);
	result.catch((r) => {
		expect(r).toBe('No file found.');
	});
});
