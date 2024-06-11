import { get } from 'svelte/store';
import { DataFrame, fromFile, fromObjects, fromText, fromArrays } from './DataFrame';
import { describe, it, expect } from 'vitest';
import type { DataFrameLike, Group } from '$lib/Types';

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

	it('should import a DataFrame with string number values', () => {
		const df = fromObjects([
			{ a: '1', b: '2' },
			{ a: '3', b: '4' }
		]);

		expect(df).toEqual({
			columns: [
				{ name: 'a', type: 'number', hasMissing: false },
				{ name: 'b', type: 'number', hasMissing: false }
			],
			rows: [
				[1, 2],
				[3, 4]
			]
		});
	});

	it('should import a DataFrame from 2d array', () => {
		const df = fromArrays([
			['a', 'b'],
			[1, null],
			[3, 4]
		]);

		expect(df).toEqual({
			columns: [
				{ name: 'a', type: 'number', hasMissing: false },
				{ name: 'b', type: 'number', hasMissing: true }
			],
			rows: [
				[1, undefined],
				[3, 4]
			]
		});
	});

	it('should replace undefined columns with empty string', () => {
		const df = fromText(',b\n1,2\n3,4');

		expect(df).toEqual({
			columns: [
				{ name: '', type: 'number', hasMissing: false },
				{ name: 'b', type: 'number', hasMissing: false }
			],
			rows: [
				[1, 2],
				[3, 4]
			]
		});
	});

	it('should replace undefined columns with two empty strings', () => {
		const df = fromText(',\n1,2\n3,4');

		expect(df).toEqual({
			columns: [
				{ name: '', type: 'number', hasMissing: false },
				{ name: '', type: 'number', hasMissing: false }
			],
			rows: [
				[1, 2],
				[3, 4]
			]
		});
	});

	it('empty columns but has rows', () => {
		const df = fromText('\n1,2\n3,4');
		// TODO: check if this is really the desired behavior in this edge case
		expect(df).toEqual({
			columns: [{ name: '', type: 'number', hasMissing: false }],
			rows: [
				[1, '2'],
				[3, '4']
			]
		});
	});

	it('only a new line', () => {
		const df = fromText('\n');
		// TODO: check if this is really the desired behavior in this edge case
		expect(df).toEqual({
			columns: [{ name: '', type: 'number', hasMissing: false }],
			rows: []
		});
	});

	it('should import a DataFrame with missing values (text)', () => {
		const df = fromText('a,b\n1,2\n3');

		expect(df).toEqual({
			columns: [
				{ name: 'a', type: 'number', hasMissing: false },
				{ name: 'b', type: 'number', hasMissing: true }
			],
			rows: [[1, 2], [3]]
		});
	});

	it('should replace missing values with undefined', () => {
		const df = fromText('a,b\n1,2\n3,');
		expect(df).toEqual({
			columns: [
				{ name: 'a', type: 'number', hasMissing: false },
				{ name: 'b', type: 'number', hasMissing: true }
			],
			rows: [
				[1, 2],
				[3, undefined]
			]
		});
	});

	// TODO: test from arrays
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
		df.set(fromText('a,b\n1,2\n3,4\n5,6'));

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
		df.set(fromText('a,b\n1,2\n3,4'));

		const selected = df.selectColumn(0);
		expect(selected).toEqual([1, 3]);
	});

	it('should read missing as undefined', () => {
		const df = new DataFrame();
		df.set(fromText('a,b\n1,2\n3,'));

		const selected = df.selectColumn(1);
		expect(selected).toEqual([2, undefined]);
	});

	it('should filter rows', () => {
		const df = new DataFrame();
		df.set(fromText('a,b\n1,2\n3,4'));

		df.filter((row) => row[0] === 3);
		expect(df.get()).toEqual(fromText('a,b\n3,4'));
	});

	it('should delete columns', () => {
		const df = new DataFrame();
		df.set(fromText('a,b\n1,2\n3,4'));

		df.deleteColumn(0);
		expect(df.get()).toEqual(fromText('b\n2\n4'));
	});

	it('should do nothing when deleting a non-existent column', () => {
		const df = new DataFrame();
		df.set(fromText('a,b\n1,2\n3,4'));

		df.deleteColumn(-1);
		expect(df.get()).toEqual(fromText('a,b\n1,2\n3,4'));
	});
});

describe('DataFrame joining', () => {
	it('should join two DataFrames (keyed)', () => {
		const df = new DataFrame();
		df.set(fromText('a,b\n1,2\n3,4'));

		df.keyedJoin(fromText('c,d\n1,6\n3,8'), 0, 0);
		expect(df.get()).toEqual(fromText('a,b,d\n1,2,6\n3,4,8'));
	});

	it('should left join two DataFrames', () => {
		const df = new DataFrame();
		df.set(fromText('a,b\n1,2\n3,4'));

		df.keyedJoin(fromText('c,d\n1,6\n2,8'), 0, 0);
		expect(df.get()).toEqual(fromText('a,b,d\n1,2,6\n3,4, '));
		// `
		//  a | b     c | d      a | b | d
		//  1 | 2  x  1 | 6  ->  1 | 2 | 6
		//  3 | 4     2 | 8      3 | 4 | undefined
		// `
	});
});

describe('DataFrame empty', () => {
	it('empty string content', () => {
		const df = new DataFrame();
		df.set(fromText(''));

		expect(df.isEmpty()).toBe(true);
	});
	it('normal file content', () => {
		const df = new DataFrame();
		df.set(fromText('a,b\n1,2\n3,4'));

		expect(df.isEmpty()).toBe(false);
	});
	it('has columns but no rows', () => {
		const df = new DataFrame();
		df.set(fromText('a,b'));

		expect(df.isEmpty()).toBe(true);
	});
});

describe('DataFrame group by', () => {
	const csvData = `Id,Gender,Age,Language,WER
1,M,10,PT,10
2,M,14,PT,10
3,F,20,,20
4,F,24,PT,10
5,M,30,ES,30
6,M,34,PT,10
7,F,39,LA,40`;
	const df = new DataFrame();
	let dflike: DataFrameLike;

	beforeEach(() => {
		df.set(fromText(csvData));
		dflike = df.get();
	});

	it('by nothing, agg wer', () => {
		// group by nothing
		// aggregate WER
		dflike.columns[4].aggregate = true;

		df.set(dflike);
		const dfgroup = df.groupBy();

		expect(dfgroup.groupedColumns).toEqual([]);
		expect(dfgroup.aggregateColumn).toEqual(dflike.columns[4]);

		expect(dfgroup.groups).toHaveLength(1);

		expect(dfgroup.groups).toContainEqual({
			keys: [],
			values: [10, 10, 20, 10, 30, 10, 40]
		});
	});

	it('by gender, agg nothing', () => {
		// group by gender
		dflike.columns[1].groupBy = { type: 'specific' };
		// aggregate nothing

		df.set(dflike);
		const dfgroup = df.groupBy();

		expect(dfgroup.groupedColumns).toEqual([dflike.columns[1]]);
		expect(dfgroup.aggregateColumn).not.toBeDefined();

		expect(dfgroup.groups).toHaveLength(2);

		expect(dfgroup.groups).toContainEqual({
			keys: ['M'],
			values: [undefined, undefined, undefined, undefined]
		});

		expect(dfgroup.groups).toContainEqual({
			keys: ['F'],
			values: [undefined, undefined, undefined]
		});
	});

	it('by nothing, agg nothing', () => {
		// group by nothing
		// aggregate nothing

		df.set(dflike);
		const dfgroup = df.groupBy();

		expect(dfgroup.groupedColumns).toEqual([]);
		expect(dfgroup.aggregateColumn).not.toBeDefined();

		expect(dfgroup.groups).toHaveLength(1);

		expect(dfgroup.groups).toContainEqual({
			keys: [],
			values: [undefined, undefined, undefined, undefined, undefined, undefined, undefined]
		});
	});

	it('by gender, agg wer', () => {
		// group by gender
		dflike.columns[1].groupBy = { type: 'specific' };
		// aggregate WER
		dflike.columns[4].aggregate = true;

		df.set(dflike);
		const dfgroup = df.groupBy();

		expect(dfgroup.groupedColumns).toEqual([dflike.columns[1]]);
		expect(dfgroup.aggregateColumn).toEqual(dflike.columns[4]);

		expect(dfgroup.groups).toHaveLength(2);

		expect(dfgroup.groups).toContainEqual({
			keys: ['M'],
			values: [10, 10, 30, 10]
		});

		expect(dfgroup.groups).toContainEqual({
			keys: ['F'],
			values: [20, 10, 40]
		});
	});

	it('by gender and age, agg wer', () => {
		// group by gender and age
		dflike.columns[1].groupBy = { type: 'specific' };
		dflike.columns[2].groupBy = { type: 'binned', size: 10 };
		// aggregate WER
		dflike.columns[4].aggregate = true;

		df.set(dflike);
		const dfgroup = df.groupBy();

		expect(dfgroup.groupedColumns).toEqual([dflike.columns[1], dflike.columns[2]]);
		expect(dfgroup.aggregateColumn).toEqual(dflike.columns[4]);

		expect(dfgroup.groups).toHaveLength(4);

		const expectedGroups: Group[] = [
			{ keys: ['M', 1], values: [10, 10] },
			{ keys: ['F', 2], values: [20, 10] },
			{ keys: ['M', 3], values: [30, 10] },
			{ keys: ['F', 3], values: [40] }
		];

		for (const group of expectedGroups) {
			expect(dfgroup.groups).toContainEqual(group);
		}
	});
});
