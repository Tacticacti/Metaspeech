import {
	getXAxisCol,
	getLegendCol,
	getScatterDatasets
} from '$lib/graphs/scatterplot/ScatterPlotController';
import { describe, it, expect } from 'vitest';
import type { Column, GroupedDataFrame, ScatterDataset, ScatterStyle } from '$lib/Types';

describe('get columns test', () => {
	const cols: Column[] = [
		{
			name: 'Column 1',
			hasMissing: false,
			type: 'string'
		},
		{
			name: 'Column 2',
			hasMissing: false,
			type: 'number'
		}
	];

	describe('get x column test', () => {
		it('empty columns throws error', () => {
			expect(() => getXAxisCol([])).toThrow();
		});

		it('only string column throws error', () => {
			expect(() => getXAxisCol([cols[0]])).toThrow();
		});

		it('string and numeric column works', () => {
			expect(getXAxisCol(cols)).toEqual(cols[1]);
		});
	});

	describe('get legend column test', () => {
		it('empty columns returns undefined', () => {
			expect(getLegendCol([], cols[0])).toBeUndefined();
		});

		it('column is already in x-axis, return undefined', () => {
			expect(getLegendCol([cols[1]], cols[1])).toBeUndefined();
		});

		it('two column works', () => {
			expect(getLegendCol(cols, cols[1])).toEqual(cols[0]);
		});

		it('two column works different order', () => {
			expect(getLegendCol([cols[1], cols[0]], cols[1])).toEqual(cols[0]);
		});
	});
});

describe('get scatter datasets test', () => {
	const allColumns: Column[] = [
		{
			name: 'Age',
			type: 'number',
			hasMissing: false,
			groupBy: { type: 'specific' },
			aggregate: false
		},
		{
			name: 'Group',
			type: 'number',
			hasMissing: false,
			groupBy: { type: 'specific' },
			aggregate: false
		},
		{
			name: 'Gender',
			type: 'string',
			hasMissing: false,
			groupBy: { type: 'specific' },
			aggregate: false
		},
		{
			name: 'WER',
			type: 'number',
			hasMissing: false,
			groupBy: { type: 'specific' },
			aggregate: false
		}
	];

	const styles: ScatterStyle[] = Array.from({ length: 10 }, (_, i) => {
		return {
			backgroundColor: `BG${i}`,
			borderColor: `BC${i}`,
			pointStyle: `PS${i}`
		};
	});

	it('empty returns empty', () => {
		const groupedFrame: GroupedDataFrame = {
			groups: [],
			groupedColumns: [allColumns[0]],
			aggregateColumn: allColumns[3]
		};
		expect(getScatterDatasets(groupedFrame, allColumns[0], undefined, [])).toEqual([]);
	});

	it('WER vs age', () => {
		const groupedFrame: GroupedDataFrame = {
			groups: [
				{
					keys: [19],
					values: [20, 30, 40]
				},
				{
					keys: [39],
					values: [40, 80]
				},
				{
					keys: [89],
					values: [60, 90, 120, 2]
				}
			],
			groupedColumns: [allColumns[0]],
			aggregateColumn: allColumns[3]
		};

		const expected: ScatterDataset[] = [
			{
				label: 'Dataset',
				data: [
					[19, 20],
					[19, 30],
					[19, 40],
					[39, 40],
					[39, 80],
					[89, 60],
					[89, 90],
					[89, 120],
					[89, 2]
				],
				style: styles[0]
			}
		];

		expect(getScatterDatasets(groupedFrame, allColumns[0], undefined, styles)).toEqual(expected);
	});

	it('WER vs age, another groupped column which is not legend', () => {
		const groupedFrame: GroupedDataFrame = {
			groups: [
				{
					keys: [19],
					values: [20, 30, 40]
				},
				{
					keys: [39],
					values: [40, 80]
				},
				{
					keys: [89],
					values: [60, 90, 120, 2]
				}
			],
			groupedColumns: [allColumns[0], allColumns[2]],
			aggregateColumn: allColumns[3]
		};

		const expected: ScatterDataset[] = [
			{
				label: 'Dataset',
				data: [
					[19, 20],
					[19, 30],
					[19, 40],
					[39, 40],
					[39, 80],
					[89, 60],
					[89, 90],
					[89, 120],
					[89, 2]
				],
				style: styles[0]
			}
		];

		expect(getScatterDatasets(groupedFrame, allColumns[0], undefined, styles)).toEqual(expected);
	});

	it('WER vs age, gender legend', () => {
		const groupedFrame: GroupedDataFrame = {
			groups: [
				{
					keys: [19, 'M'],
					values: [30, 40]
				},
				{
					keys: [19, 'F'],
					values: [20]
				},
				{
					keys: [39, 'M'],
					values: [80]
				},
				{
					keys: [39, 'F'],
					values: [40]
				},
				{
					keys: [89, 'M'],
					values: [2]
				},
				{
					keys: [89, 'F'],
					values: [60, 90, 120]
				}
			],
			groupedColumns: [allColumns[0], allColumns[2]],
			aggregateColumn: allColumns[3]
		};

		const expected: ScatterDataset[] = [
			{
				label: 'M',
				data: [
					[19, 30],
					[19, 40],
					[39, 80],
					[89, 2]
				],
				style: styles[0]
			},
			{
				label: 'F',
				data: [
					[19, 20],
					[39, 40],
					[89, 60],
					[89, 90],
					[89, 120]
				],
				style: styles[1]
			}
		];

		expect(getScatterDatasets(groupedFrame, allColumns[0], allColumns[2], styles)).toEqual(
			expected
		);
	});

	it('WER vs age, group legend, style should wrap around', () => {
		const groupedFrame: GroupedDataFrame = {
			groups: [
				{
					keys: [19, 1],
					values: [30, 40]
				},
				{
					keys: [19, 2],
					values: [20]
				},
				{
					keys: [39, 3],
					values: [80]
				},
				{
					keys: [39, 4],
					values: [40]
				},
				{
					keys: [89, 1],
					values: [2]
				},
				{
					keys: [89, 2],
					values: [60, 90, 120]
				},
				{
					keys: [100, undefined],
					values: [1]
				}
			],
			groupedColumns: [allColumns[0], allColumns[2]],
			aggregateColumn: allColumns[3]
		};

		const expected: ScatterDataset[] = [
			{
				label: '1',
				data: [
					[19, 30],
					[19, 40],
					[89, 2]
				],
				style: styles[0]
			},
			{
				label: '2',
				data: [
					[19, 20],
					[89, 60],
					[89, 90],
					[89, 120]
				],
				style: styles[1]
			},
			{
				label: '3',
				data: [[39, 80]],
				style: styles[0]
			},
			{
				label: '4',
				data: [[39, 40]],
				style: styles[1]
			},
			{
				label: '-',
				data: [[100, 1]],
				style: styles[0]
			}
		];

		expect(
			getScatterDatasets(groupedFrame, allColumns[0], allColumns[2], [styles[0], styles[1]])
		).toEqual(expected);
	});

	it('WER vs age, BINNED group legend', () => {
		allColumns[2].groupBy = { type: 'binned', size: 3 };

		const groupedFrame: GroupedDataFrame = {
			groups: [
				{
					keys: [19, 0],
					values: [30, 40, 20]
				},
				{
					keys: [39, 1],
					values: [80, 40]
				},
				{
					keys: [89, 0],
					values: [2, 60, 90, 120]
				},
				{
					keys: [100, undefined],
					values: [1]
				}
			],
			groupedColumns: [allColumns[0], allColumns[2]],
			aggregateColumn: allColumns[3]
		};

		const expected: ScatterDataset[] = [
			{
				label: '[0-3)',
				data: [
					[19, 30],
					[19, 40],
					[19, 20],
					[89, 2],
					[89, 60],
					[89, 90],
					[89, 120]
				],
				style: styles[0]
			},
			{
				label: '[3-6)',
				data: [
					[39, 80],
					[39, 40]
				],
				style: styles[1]
			},
			{
				label: '-',
				data: [[100, 1]],
				style: styles[2]
			}
		];

		expect(getScatterDatasets(groupedFrame, allColumns[0], allColumns[2], styles)).toEqual(
			expected
		);
	});
});
