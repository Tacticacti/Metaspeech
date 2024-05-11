import { hasMissingValues, rowWiseMerge } from './DataFrameUtils';
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
	it('should be able to merge two DataFrames row-wise', () => {
		const df1 = new DataFrame([
			{ a: 1, b: 2 },
			{ a: 3, b: 4 },
			{ a: 5, b: 6 }
		]);
		const df2 = new DataFrame([
			{ c: 7, d: 8 },
			{ c: 9, d: 10 },
			{ c: 11, d: 12 }
		]);
		const result = rowWiseMerge(df1, df2);
		expect(result.toCollection()).toEqual([
			{ a: 1, b: 2, c: 7, d: 8 },
			{ a: 3, b: 4, c: 9, d: 10 },
			{ a: 5, b: 6, c: 11, d: 12 }
		]);
	});
});
