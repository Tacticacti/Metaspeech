import { get } from 'svelte/store';
import { DataFrame, fromFile, fromObjects, fromText } from './DataFrame';
import { describe, it, expect } from 'vitest';

describe('importing a DataFrame', () => {
	it('should import a DataFrame from text', () => {
		const df = fromText('a,b\n1,2\n3,4');

		expect(df).toEqual({
			columns: [
				{
					hasMissing: false,
					name: 'a',
					type: 'number'
				},
				{
					hasMissing: false,
					name: 'b',
					type: 'number'
				}
			],
			rows: [
				[1, 2],
				[3, 4]
			]
		});
	});

	it('should import a DataFrame from a file', async () => {
		const file = new File(['a,b\n1,2\n3,4'], 'test.csv');
		const df = await fromFile(file);
		const expected = fromText('a,b\n1,2\n3,4');

		expect(df).toEqual(expected);
	});

	it('should import a DataFrame from objects', () => {
		const df = fromObjects([
			{ a: 1, b: 2 },
			{ a: 3, b: 4 }
		]);
		const expected = fromText('a,b\n1,2\n3,4');

		expect(df).toEqual(expected);
	});

	it('should import an empty DataFrame from an empty array', () => {
		const df = fromObjects([]);

		expect(df).toEqual({
			columns: [],
			rows: []
		});
	});

	it('should import a DataFrame with missing values (objects)', () => {
		const df = fromObjects([{ a: 1, b: 2 }, { a: 3 }]);

		expect(df).toEqual({
			columns: [
				{
					hasMissing: false,
					name: 'a',
					type: 'number'
				},
				{
					hasMissing: true,
					name: 'b',
					type: 'number'
				}
			],
			rows: [
				[1, 2],
				[3, undefined]
			]
		});
	});

	it('should import a DataFrame with string values', () => {
		const df = fromObjects([
			{ a: '1', b: '2' },
			{ a: '3', b: '4' }
		]);

		expect(df).toEqual({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[3, 4]
			]
		});
	});

	it('should replace undefined columns with empty string', () => {
		const df = fromText(',b\n1,2\n3,4');

		expect(df).toEqual({
			columns: ['', 'b'],
			rows: [
				[1, 2],
				[3, 4]
			]
		});
	});

	it('should import a DataFrame with missing values (text)', () => {
		const df = fromText('a,b\n1,2\n3');

		expect(df).toEqual({
			columns: ['a', 'b'],
			rows: [[1, 2], [3]]
		});
	});

	it('should replace missing values with undefined', () => {
		const df = fromText('a,b\n1,2\n3,');
		expect(df).toEqual({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[3, undefined]
			]
		});
	});
});

describe('DataFrame basics', () => {
	it('should have columns and rows', () => {
		const df = new DataFrame();
		const data = fromText('a,b\na,2\nb,4');
		df.set(data);

		expect(get(df.columns)).toEqual([
			{ name: 'a', type: 'string', hasMissing: false },
			{ name: 'b', type: 'number', hasMissing: false }
		]);
		expect(get(df.rows)).toEqual([
			['a', 2],
			['b', 4]
		]);
		expect(df.get()).toEqual(data);
	});

	it('should replace undefined with empty array', () => {
		const df = new DataFrame();
		df.set({
			// @ts-expect-error testing undefined
			columns: undefined,
			// @ts-expect-error testing undefined
			rows: undefined
		});

		expect(get(df.columns)).toEqual([]);
		expect(get(df.rows)).toEqual([]);
	});

	it('should return the correct shape', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[3, 4],
				[5, 6]
			]
		});

		expect(df.shape()).toEqual([3, 2]);
	});

	it('should return the correct shape when empty', () => {
		const df = new DataFrame();
		df.set({
			columns: [],
			rows: []
		});

		expect(df.shape()).toEqual([0, 0]);
	});
});

describe('DataFrame operations', () => {
	it('should select columns', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[3, 4]
			]
		});

		const selected = df.selectColumn(0);
		expect(selected).toEqual([1, 3]);
	});

	it('should read missing as undefined', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [[1, 2], [3]]
		});

		const selected = df.selectColumn(1);
		expect(selected).toEqual([2, undefined]);
	});

	it('should filter rows', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[3, 4]
			]
		});

		df.filter((row) => row[0] === 3);
		expect(df.get()).toEqual({
			columns: ['a', 'b'],
			rows: [[3, 4]]
		});
	});

	it('should delete columns', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[3, 4]
			]
		});

		df.deleteColumn(0);
		expect(df.get()).toEqual({
			columns: ['b'],
			rows: [[2], [4]]
		});
	});

	it('should do nothing when deleting a non-existent column', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[3, 4]
			]
		});

		df.deleteColumn(-1);
		expect(df.get()).toEqual({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[3, 4]
			]
		});
	});
});

describe('DataFrame joining', () => {
	it('should join two DataFrames', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[3, 4]
			]
		});

		df.join(
			{
				columns: ['c', 'd'],
				rows: [
					[1, 6],
					[3, 8]
				]
			},
			0,
			0
		);
		expect(df.get()).toEqual({
			columns: ['a', 'b', 'd'],
			rows: [
				[1, 2, 6],
				[3, 4, 8]
			]
		});
	});

	it('should left join two DataFrames', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[3, 4]
			]
		});

		df.join(
			{
				columns: ['c', 'd'],
				rows: [
					[1, 6],
					[2, 8] //different key
				]
			},
			0,
			0
		);
		expect(df.get()).toEqual({
			columns: ['a', 'b', 'd'],
			rows: [
				[1, 2, 6],
				[3, 4]
			]
		});
	});
});

describe('DataFrame grouping and aggregating', () => {
	it('should group by a column', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[1, 4],
				[2, 6]
			]
		});

		df.groupBy([Specific(0)], [Count('count')], false);
		expect(df.get()).toEqual({
			columns: ['count'],
			rows: [[2], [1]]
		});
	});

	it('should default to excluding group key', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[1, 4],
				[2, 6]
			]
		});

		df.groupBy([Specific(0)], [Count('count')]);
		expect(df.get()).toEqual({
			columns: ['count'],
			rows: [[2], [1]]
		});
	});

	it('should be able to include the generated key', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[1, 4],
				[2, 6]
			]
		});

		df.groupBy([Specific(0)], [Count('count')], true);
		expect(df.get()).toEqual({
			columns: ['groups', 'count'],
			rows: [
				[JSON.stringify(['1']), 2],
				[JSON.stringify(['2']), 1]
			]
		});
	});

	it('should be able to do the aggregations', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[1, 4],
				[2, 6],
				[2, 8],
				[2, 10],
				[3, 12],
				[3, 14],
				[3, 16]
			]
		});
		df.groupBy(
			[Specific(0)],
			[
				Count('count'),
				Percent('percent', get(df.rows).length),
				Mean('mean', 1),
				Min('min', 1),
				Max('max', 1),
				Median('median', 1),
				Std('std', 1),
				Var('var', 1),
				Sum('sum', 1)
			]
		);
		expect(df.get()).toEqual({
			columns: ['count', 'percent', 'mean', 'min', 'max', 'median', 'std', 'var', 'sum'],
			rows: [
				[2, 0.25, 3, 2, 4, 3, 1, 1, 6],
				[3, 0.375, 8, 6, 10, 8, 1.632993161855452, 2.6666666666666665, 24],
				[3, 0.375, 14, 12, 16, 14, 1.632993161855452, 2.6666666666666665, 42]
			]
		});
	});

	it('should replace undefined with empty string for specific grouping', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[undefined, 4],
				[2, 6],
				[undefined, 8]
			]
		});
		df.groupBy([Specific(0)], [Count('count')], true);
		expect(df.get()).toEqual({
			columns: ['groups', 'count'],
			rows: [
				[JSON.stringify(['1']), 1],
				[JSON.stringify(['']), 2],
				[JSON.stringify(['2']), 1]
			]
		});
	});

	it('should be able to group by bins', () => {
		const df = new DataFrame();
		df.set({
			columns: ['a', 'b'],
			rows: [
				[1, 2],
				[1, 4],
				[2, 6],
				[2, 8],
				[2, 10],
				[3, 12],
				[3, 14],
				[3, 16]
			]
		});

		df.groupBy([Bins(0, 2)], [Count('count')], true);
		expect(df.get()).toEqual({
			columns: ['groups', 'count'],
			rows: [
				[JSON.stringify(['0']), 2],
				[JSON.stringify(['1']), 6]
			]
		});
	});
});
