import { it, expect, vi } from 'vitest';
import { Parse, GetFileExtension } from './FileParser';
import { UnsupportedFileError } from '$lib/Types';
import { parseXlS } from './XlsParser';
import { ParseJson } from './JsonParser';
import { fromText } from '$lib/dataframe/DataFrame';

vi.mock('./XlsParser');
vi.mock('./JsonParser');

const df = fromText('a,b\n1,2\n3,4');

beforeEach(() => {
	// @ts-expect-error Mocking is not nice for typescript
	parseXlS.mockReturnValue(Promise.resolve(df));
	// @ts-expect-error Mocking is not nice for typescript
	ParseJson.mockReturnValue(Promise.resolve(df));
});

describe('GetFileExtension', () => {
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
	it('should correctly parse .xls files', async () => {
		const file = new File(['dummy content'], 'test.xls', { type: 'application/vnd.ms-excel' });
		const result = await Parse(file);

		expect(result).toEqual(df);
		expect(parseXlS).toHaveBeenCalled();
	});

	it('should correctly parse .xlsx files', async () => {
		const file = new File(['dummy content'], 'test.xlsx', {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		const result = await Parse(file);

		expect(result).toEqual(df);
		expect(parseXlS).toHaveBeenCalled();
	});

	it('importer pass tsv', async () => {
		const file = new File(['a\tb\n1\t2\n3\t4'], 'testdata.tsv', {
			type: 'text/tab-separated-values'
		});

		const result = await Parse(file);

		expect(result).toEqual(df);
	});

	it('should pass csv', async () => {
		const file = new File(['a,b\n1,2\n3,4'], 'testdata.csv', {
			type: 'text/csv'
		});

		const result = await Parse(file);

		expect(result).toEqual(df);
	});

	it('should pass txt', async () => {
		const file = new File(['a\tb\n1\t2\n3\t4'], 'testdata.txt', {
			type: 'text/plain'
		});

		const result = await Parse(file);

		expect(result).toEqual(df);
	});

	it('should pass json', async () => {
		const file = new File(['{"a": "1", "b": 2}'], 'testdata.json', {
			type: 'application/json'
		});

		const result = await Parse(file);

		expect(result).toEqual(df);
	});

	it('should not pass png file', async () => {
		const file = new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' });

		const result = Parse(file);

		await expect(result).rejects.toBeInstanceOf(UnsupportedFileError);
	});

	it('pass invalid name', async () => {
		const file = new File(['(⌐□_□)'], 'chucknorrispng', { type: 'nothing' });

		const result = Parse(file);

		await expect(result).rejects.toBeInstanceOf(UnsupportedFileError);
	});

	it('pass no file', async () => {
		// @ts-expect-error Undefined is not nice for typescript
		const result = Parse(undefined);

		await expect(result).rejects.toBeInstanceOf(UnsupportedFileError);
	});
});
