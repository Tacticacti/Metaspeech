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
		expect(df.get()).toEqual(fromText('a,b,d\n1,2,6\n3,4'));
	});
});

describe('DataFrame group by', () => {});

describe('DataFrame get and set', () => {});

describe('DataFrame empty', () => {});

describe('Get array sub type', () => {});

describe('Has missing values', () => {});

describe('Cast', () => {});

describe('To grouper', () => {});
