import * as sut from './DsvLikeParser';
import { DataFrame } from 'dataframe-js';
import { describe, it, expect, vi } from 'vitest';

vi.mock('dataframe-js');

describe('DsvLikeParser', () => {
	it('should parse TSV files', async () => {
		const file = new File(['dummy data'], 'test.tsv', { type: 'text/tab-separated-values' });
		await sut.ParseTsv(file);
		expect(DataFrame.fromTSV).toBeCalledWith(file);
	});

	it('should parse CSV files', async () => {
		const file = new File(['dummy data'], 'test.csv', { type: 'text/csv' });
		await sut.ParseCsv(file);
		expect(DataFrame.fromCSV).toBeCalledWith(file);
	});
});
