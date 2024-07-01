import { getBarChartData, handleData } from '$lib/graphs/histogram/helper';
import { DataFrame, fromText } from '$lib/dataframe/DataFrame';
import { get } from 'svelte/store';
import type { Column, GroupedDataFrame } from '$lib/Types';
import { barchartStyles } from '$lib/Constants';

describe('handleData tests', () => {
	it('check if sum is executed and gives correct output', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = handleData('Sum', groupedDf);
		expect(labels).toStrictEqual(['18', '32']);
		expect(values).toStrictEqual([3, 4]);
	});
	it('check if mean is executed and gives correct output', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = handleData('Mean', groupedDf);

		expect(labels).toStrictEqual(['18', '32']);
		expect(values).toStrictEqual([1, 4]);
	});
	it('check if mean+stddev is executed and gives correct output', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2\n32,8'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = handleData('Mean + Standard Deviation', groupedDf);

		expect(labels).toStrictEqual(['18', '32']);
		expect(values).toStrictEqual([
			{ y: 1.5, yMin: 1, yMax: 2 },
			{ y: 6, yMin: 4, yMax: 8 }
		]);
	});
	it('check if abs freq is executed and gives correct output', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = handleData('Count', groupedDf);

		expect(labels).toStrictEqual(['18', '32']);
		expect(values).toStrictEqual([2, 1]);
	});
	it('check if rel freq is executed and gives correct output', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = handleData('Percentage', groupedDf);

		expect(labels).toStrictEqual(['18', '32']);
		expect(values).toStrictEqual([(2 / 3) * 100, (1 / 3) * 100]);
	});
	it('non function returns empty lists', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = handleData('Something random', groupedDf);

		expect(labels).toStrictEqual([]);
		expect(values).toStrictEqual([]);
	});
});

describe('Get bar chart data tests', () => {
	const allColumns: Column[] = [
		{
			name: 'Col 1',
			type: 'string',
			hasMissing: false,
			groupBy: { type: 'specific' },
			aggregate: false
		},
		{
			name: 'Col 2',
			type: 'string',
			hasMissing: false,
			groupBy: { type: 'specific' },
			aggregate: false
		},
		{
			name: 'Col 3',
			type: 'string',
			hasMissing: false,
			groupBy: { type: 'specific' },
			aggregate: false
		},
		{
			name: 'Col 4',
			type: 'number',
			hasMissing: false,
			groupBy: undefined,
			aggregate: true
		}
	];

	it('Three group bys', () => {
		const data: GroupedDataFrame = {
			groups: [
				{
					keys: ['1A', '2A', '3A'],
					values: [10, 15, 17, 18, 19, 18, 11]
				},
				{
					keys: ['1A', '2A', '3B'],
					values: [24, 25, 28, 29, 20, 28, 22]
				},

				{
					keys: ['1B', '2A', '3A'],
					values: [45, 43, 49, 42, 45, 46, 41]
				},
				{
					keys: ['1B', '2A', '3B'],
					values: [51, 58, 53, 54, 56, 52, 51]
				},
				{
					keys: ['1B', '2B', '3A'],
					values: [34, 35, 37, 38, 34, 32, 30]
				}
			],
			groupedColumns: [allColumns[0], allColumns[1], allColumns[2]],
			aggregateColumn: allColumns[3]
		};
		const selectedFunction = 'Mean + Standard Deviation';
		const legendColumn = allColumns[0];

		const [labels, datasets] = getBarChartData(data, selectedFunction, legendColumn);

		expect(labels).toEqual(['2A, 3A', '2A, 3B', '2B, 3A']);

		expect(datasets).toEqual([
			{
				label: '1A',
				data: [
					{ y: 15.428571428571429, yMin: 12.097, yMax: 18.761 },
					{ y: 25.142857142857142, yMin: 22.007, yMax: 28.279 },
					{ y: 0, yMin: 0, yMax: 0 }
				],
				...barchartStyles[0]
			},
			{
				label: '1B',
				data: [
					{ y: 44.42857142857143, yMin: 41.93, yMax: 46.928 },
					{ y: 53.57142857142857, yMin: 51.13, yMax: 56.013 },
					{ y: 34.285714285714285, yMin: 31.738, yMax: 36.833 }
				],
				...barchartStyles[1]
			}
		]);
	});

	it('Three group bys different', () => {
		const data: GroupedDataFrame = {
			groups: [
				{
					keys: ['1A', '2A'],
					values: [10, 15, 17, 18, 19, 18, 11]
				},
				{
					keys: ['1A', '2B'],
					values: [24, 25, 28, 29, 20, 28, 22]
				},

				{
					keys: ['1B', '2A'],
					values: [45, 43, 49, 42, 45, 46, 41]
				},
				{
					keys: ['1B', '2B'],
					values: [51, 58, 53, 54, 56, 52, 51]
				},
				{
					keys: ['1C', '2B'],
					values: [34, 35, 37, 38, 34, 32, 30]
				}
			],
			groupedColumns: [allColumns[0], allColumns[1]],
			aggregateColumn: allColumns[3]
		};
		const selectedFunction = 'Mean + Standard Deviation';
		const legendColumn = allColumns[0];

		const [labels, datasets] = getBarChartData(data, selectedFunction, legendColumn);

		expect(labels).toEqual(['2A', '2B']);

		expect(datasets).toEqual([
			{
				label: '1A',
				data: [
					{ y: 15.428571428571429, yMin: 12.097, yMax: 18.761 },
					{ y: 25.142857142857142, yMin: 22.007, yMax: 28.279 }
				],
				...barchartStyles[0]
			},
			{
				label: '1B',
				data: [
					{ y: 44.42857142857143, yMin: 41.93, yMax: 46.928 },
					{ y: 53.57142857142857, yMin: 51.13, yMax: 56.013 }
				],
				...barchartStyles[1]
			},
			{
				label: '1C',
				data: [
					{ y: 0, yMin: 0, yMax: 0 },
					{ y: 34.285714285714285, yMin: 31.738, yMax: 36.833 }
				],
				...barchartStyles[2]
			}
		]);
	});
});
