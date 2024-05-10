import { hasMissingValues } from './DataFrameUtils';
import { DataFrame } from 'dataframe-js';
import { expect, it, describe } from 'vitest';

describe('DataFrameUtils', () => {
	it('should return the correct indices of missing values', () => {
		const df = new DataFrame([
			{ a: 1, b: 2 },
			{ a: 3, b: null },
			{ a: 5, b: 6 }
		]);
		const result = hasMissingValues(df);
		expect(result).toEqual([[1, 1]]);
	});
	it('should return an empty array if there are no missing values', () => {
		const df = new DataFrame([
			{ a: 1, b: 2 },
			{ a: 3, b: 4 },
			{ a: 5, b: 6 }
		]);
		const result = hasMissingValues(df);
		expect(result).toEqual([]);
	});
	it('should return the correct indices of missing values when there are undefined values', () => {
		const df = new DataFrame([
			{ a: 1, b: 2 },
			{ a: 3, b: undefined },
			{ a: 5, b: 6 }
		]);
		const result = hasMissingValues(df);
		expect(result).toEqual([[1, 1]]);
	});
	it('should return the correct indices of missing values when there are NaN values', () => {
		const df = new DataFrame([
			{ a: 1, b: 2 },
			{ a: 3, b: NaN },
			{ a: 5, b: 6 }
		]);
		const result = hasMissingValues(df);
		expect(result).toEqual([[1, 1]]);
	});
	it('should return the correct indices of multiple missing values', () => {
		const df = new DataFrame([
			{ a: 1, b: 2 },
			{ a: undefined, b: null },
			{ a: null, b: 6 }
		]);
		const result = hasMissingValues(df);
		expect(result).toEqual([
			[1, 0],
			[1, 1],
			[2, 0]
		]);
	});
});
