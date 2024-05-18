import { it, expect, vi } from 'vitest';
import DataFrame from 'dataframe-js';
import { Parse, GetFileExtension } from './FileParser';
import { ParseXls } from './XlsParser';
import { UnsupportedFileError } from '../../../CustomErrors';

// Function to create and write data to a TSV file
function createTSVFile(data: string[][]) {
	// Convert data into TSV format
	const tsvData = data.map((row) => row.join('\t')).join('\n');
	return [tsvData];
}

describe('Tests for GetFileExtension function', () => {
	it('should return the correct file extension for standard file names', () => {
		const file = new File([], 'example.txt');
		expect(GetFileExtension(file)).toBe('txt');
	});

	it('should return the correct file extension for file names with multiple dots', () => {
		const file = new File([], 'example.with.multiple.dots.jpg');
		expect(GetFileExtension(file)).toBe('jpg');
	});

	it('should return an empty string for files without an extension', () => {
		const file = new File([], 'example');
		expect(GetFileExtension(file)).toBe('');
	});

	it('should return an empty string for files with a dot but no extension', () => {
		const file = new File([], 'example.');
		expect(GetFileExtension(file)).toBe('');
	});

	it('should return the correct file extension for files with complex names', () => {
		const file = new File([], 'complex_example_file.tar.gz');
		expect(GetFileExtension(file)).toBe('gz');
	});

	it('should handle cases with null or undefined file names', () => {
		const file = new File([], ''); // Simulate an empty file name scenario
		expect(GetFileExtension(file)).toBe('');
	});

	it('should return the correct file extension regardless of case sensitivity', () => {
		const file = new File([], 'EXAMPLE.PDF');
		expect(GetFileExtension(file)).toBe('PDF');
	});
});

describe('Tests for Parse', () => {
	vi.mock('./XlsParser', () => ({
		ParseXls: vi.fn(() => Promise.resolve(new DataFrame([])))
	}));
	vi.mock('./JsonParser', () => ({
		ParseJson: vi.fn(() => Promise.resolve(new DataFrame([])))
	}));
	vi.mock('./DsvLikeParser', () => ({
		ParseTsv: vi.fn(() => Promise.resolve(new DataFrame([]))),
		ParseCsv: vi.fn(() => Promise.resolve(new DataFrame([])))
	}));

	it('should correctly parse .xls files', async () => {
		const file = new File(['dummy content'], 'test.xls', { type: 'application/vnd.ms-excel' });
		const result = Parse(file);
		expect(result).toBeInstanceOf(Promise);
		await expect(result).resolves.toBeInstanceOf(DataFrame);
		expect(ParseXls).toHaveBeenCalled();
	});

	it('should correctly parse .xlsx files', async () => {
		const file = new File(['dummy content'], 'test.xlsx', {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		const result = Parse(file);
		expect(result).toBeInstanceOf(Promise);
		await expect(result).resolves.toBeInstanceOf(DataFrame);
		expect(ParseXls).toHaveBeenCalled();
	});

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

	it('should pass csv', async () => {
		const file = new File([], 'testdata.csv', {
			type: 'text/csv'
		});

		const result = Parse(file);
		result.then((dataFrame) => {
			expect(dataFrame).toBeInstanceOf(DataFrame);
		});

		expect(result).toBeInstanceOf(Promise);
	});

	it('should pass txt', async () => {
		const file = new File([], 'testdata.txt', {
			type: 'text/plain'
		});

		const result = Parse(file);
		result.then((dataFrame) => {
			expect(dataFrame).toBeInstanceOf(DataFrame);
		});

		expect(result).toBeInstanceOf(Promise);
	});

	it('should pass json', async () => {
		const file = new File(['{"name": "John", "age": 30}'], 'testdata.json', {
			type: 'application/json'
		});

		const result = Parse(file);
		result.then((dataFrame) => {
			expect(dataFrame).toBeInstanceOf(DataFrame);
		});

		expect(result).toBeInstanceOf(Promise);
	});

	it('should not pass png file', async () => {
		const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

		const result = Parse(file);

		expect(result).toBeInstanceOf(Promise);

		try {
			await result;
		} catch (error) {
			expect(error).toBeInstanceOf(UnsupportedFileError);
			expect(error.message).toBe('Unsupported file type found. Type found: image/png');
		}
	});

	it('pass invalid name', async () => {
		const file = new File(['(⌐□_□)'], 'chucknorrispng', { type: 'nothing' });

		const result = Parse(file);

		expect(result).toBeInstanceOf(Promise);
		try {
			await result;
		} catch (error) {
			expect(error).toBeInstanceOf(UnsupportedFileError);
			expect(error.message).toBe('Unsupported file type found. Type found: nothing');
		}
	});

	it('pass no file', async () => {
		// @ts-expect-error Undefined is not nice for typescript
		const result = Parse(undefined);

		expect(result).toBeInstanceOf(Promise);
		result.catch((r) => {
			expect(r).toBe('No file found.');
		});
	});
});
