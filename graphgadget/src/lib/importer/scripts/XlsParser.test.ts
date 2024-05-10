import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataFrame } from 'dataframe-js';
import * as XLSX from '@e965/xlsx';
import { ParseXls } from './XlsParser';

// Mocking XLSX
vi.mock('@e965/xlsx', () => ({
	read: vi.fn(),
	utils: {
		sheet_to_json: vi.fn()
	}
}));

describe('XlsParser', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});
	it('Should return a dataframe', async () => {
		const file = new File(['dummy data'], 'test.xls', { type: 'application/vnd.ms-excel' });
		const jsonMock = [
			['Header1', 'Header2'],
			['Data1', 'Data2']
		];
		XLSX.read.mockReturnValue({
			SheetNames: ['Sheet1'],
			Sheets: { Sheet1: {} }
		});
		XLSX.utils.sheet_to_json.mockReturnValue(jsonMock);
		const readAsArrayBufferSpy = jest.spyOn(FileReader.prototype, 'readAsArrayBuffer');
		const result = await ParseXls(file);
		expect(result).toBeInstanceOf(DataFrame);
		expect(result.count()).toBe(1);
		expect(readAsArrayBufferSpy).toBeCalledWith(file);
		expect(readAsArrayBufferSpy).toBeCalledTimes(1);
	});
	it('Should reject invalid file', async () => {
		const file = new File([], 'test.xls', { type: 'application/vnd.ms-excel' });
		try {
			await ParseXls(file);
			throw new Error('Test failed: Expected ParseXls to throw an error but did not.');
		} catch (error) {
			expect(error).toBeInstanceOf(TypeError);
			expect(error.message).toContain("Cannot read properties of undefined (reading 'SheetNames')");
		}
	});
	it('Should have invalid header when converting to dataframe from json', async () => {
		const file = new File(['dummy data'], 'test.xls', { type: 'application/vnd.ms-excel' });
		const jsonMock = [];
		XLSX.read.mockReturnValue({
			SheetNames: ['Sheet1'],
			Sheets: { Sheet1: {} }
		});
		XLSX.utils.sheet_to_json.mockReturnValue(jsonMock);
		try {
			await ParseXls(file);
			throw new Error('Test failed: Expected ParseXls to throw an error but did not.');
		} catch (error) {
			expect(error).toBeInstanceOf(SyntaxError);
			expect(error.message).toContain('Header row format is incorrect or missing');
		}
	});
});
