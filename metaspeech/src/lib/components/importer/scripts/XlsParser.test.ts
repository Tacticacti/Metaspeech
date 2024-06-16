import { describe, it, expect, vi } from 'vitest';
import { read, utils } from '@e965/xlsx';
import { parseXlS } from './XlsParser';
import { fromText } from '$lib/dataframe/DataFrame';

// Mocking XLSX
vi.mock('@e965/xlsx', () => ({
	read: vi.fn(),
	utils: {
		sheet_to_json: vi.fn()
	}
}));

describe('XlsParser', () => {
	it('Should return a dataframe', async () => {
		const file = new File(['dummy data'], 'test.xls', { type: 'application/vnd.ms-excel' });
		const jsonMock = [
			['Header1', 'Header2'],
			['Data1', 'Data2']
		];
		// @ts-expect-error ignore
		read.mockReturnValue({
			SheetNames: ['Sheet1'],
			Sheets: { Sheet1: {} }
		});
		// @ts-expect-error ignore
		utils.sheet_to_json.mockReturnValue(jsonMock);
		const readAsArrayBufferSpy = jest.spyOn(FileReader.prototype, 'readAsArrayBuffer');
		const result = await parseXlS(file);
		expect(result).toEqual(fromText('Header1,Header2\nData1,Data2'));
		expect(readAsArrayBufferSpy).toBeCalledWith(file);
		expect(readAsArrayBufferSpy).toHaveBeenCalledOnce();
	});
	it('Should reject invalid file', async () => {
		const file = new File([], 'test.xls', { type: 'application/vnd.ms-excel' });
		try {
			await parseXlS(file);
			throw new Error('Test failed: Expected ParseXls to throw an error but did not.');
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);

			expect((error as TypeError).message).toContain(
				"Cannot read properties of undefined (reading 'SheetNames')"
			);
		}
	});
	it('Should have invalid header when converting to dataframe from json', async () => {
		const file = new File(['dummy data'], 'test.xls', { type: 'application/vnd.ms-excel' });
		// @ts-expect-error ignore
		read.mockReturnValue({
			SheetNames: ['Sheet1'],
			Sheets: { Sheet1: {} }
		});
		// @ts-expect-error ignore
		utils.sheet_to_json.mockReturnValue([]);
		try {
			await parseXlS(file);
			throw new Error('Test failed: Expected ParseXls to throw an error but did not.');
		} catch (error) {
			expect(error).toBeInstanceOf(SyntaxError);
			// @ts-expect-error ignore
			expect(error.message).toContain('Header row format is incorrect or missing');
		}
	});
	it('handles reader onerror', async () => {
		// Mock the FileReader object and its methods
		// @ts-expect-error ignore
		window.FileReader = jest.fn().mockImplementation(() => ({
			readAsArrayBuffer: function () {
				this.onerror(new Error());
			}
		}));

		// Call the parseFile function with a dummy file
		const file = new File([''], 'filename.xls', { type: 'application/vnd.ms-excel' });
		await expect(parseXlS(file)).rejects.toThrow();
	});
	it('handles data missing', async () => {
		// Mock the FileReader object and its methods
		// @ts-expect-error ignore
		window.FileReader = jest.fn().mockImplementation(() => ({
			readAsArrayBuffer: function () {
				this.onload({ target: { result: null } });
			}
		}));

		// Call the parseFile function with a dummy file
		const file = new File([''], 'filename.xls', { type: 'application/vnd.ms-excel' });
		await expect(parseXlS(file)).rejects.toThrow();
	});
});
