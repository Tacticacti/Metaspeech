import { it, expect } from 'vitest';
import {
	getNumericalColumns,
	calculateAxis,
	sortParallelArrays
} from '$lib/graphs/histogram/HistogramController';
import DataFrame from 'dataframe-js';

const df = new DataFrame(
	{
		id: [1, 2, 3, 4, 5, 6],
		age: [33, 43, 14, 19, undefined, 87],
		gender: ['M', 'F', 'M', 'M', 'F', 'F'],
		cef: ['A1', 'B2', 'B1', 'A2', undefined, 'B2'],
		duration: [100, 20, 200, 50, 10, 10]
	},
	['id', 'age', 'gender', 'cef', 'duration']
);

it('test sort parallel arrays empty', () => {
	const labels: string[] = [];
	const values: number[] = [];

	const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

	expect(labelsSorted.length).toBe(0);
	expect(valuesSorted.length).toBe(0);
});

it('test sort parallel arrays one', () => {
	const labels: string[] = ['B'];
	const values: number[] = [30];

	const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

	expect(labelsSorted).toStrictEqual(['B']);
	expect(valuesSorted).toStrictEqual([30]);
});

it('test sort parallel arrays three', () => {
	const labels: string[] = ['B', 'A', 'C'];
	const values: number[] = [30, 20, 10];

	const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

	expect(labelsSorted).toStrictEqual(['A', 'B', 'C']);
	expect(valuesSorted).toStrictEqual([20, 30, 10]);
});

it('test sort parallel arrays complex label', () => {
	const labels: string[] = ['10, A', '2, B', '2, C', '1, C'];
	const values: number[] = [30, 20, 10, 40];

	const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

	expect(labelsSorted).toStrictEqual(['1, C', '2, B', '2, C', '10, A']);
	expect(valuesSorted).toStrictEqual([40, 20, 10, 30]);
});

it('test sort parallel arrays complex label reversed', () => {
	const labels: string[] = ['B, 2', 'A, 10', 'C, 2', 'C, 1'];
	const values: number[] = [30, 20, 10, 40];

	const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

	expect(labelsSorted).toStrictEqual(['A, 10', 'B, 2', 'C, 1', 'C, 2']);
	expect(valuesSorted).toStrictEqual([20, 30, 40, 10]);
});

it('test sort parallel arrays complex label reversed equal elements', () => {
	const labels: string[] = ['B, 2', 'B, 2', 'C, 2', 'C, 1'];
	const values: number[] = [30, 20, 10, 40];

	const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

	expect(labelsSorted).toStrictEqual(['B, 2', 'B, 2', 'C, 1', 'C, 2']);
	expect(valuesSorted).toStrictEqual([30, 20, 40, 10]);
});

it('test columnInfo simple', () => {
	const columnNames = df.listColumns();
	const numericCols = getNumericalColumns(columnNames, df.getRow(0));

	expect(numericCols).toStrictEqual(['id', 'age', 'duration']);
});

it('test calculateAxis function empty', () => {
	const dataRows = df.toCollection(true);
	const selectedParams: string[] = [];
	const checkedMean = false;
	const yAxisParam = 'Absolute Frequency';

	let [labels, values] = calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);

	// This function has already been tested:
	[labels, values] = sortParallelArrays(labels, values);

	// F before M because sorted
	expect(labels).toStrictEqual(['']);
	expect(values).toStrictEqual([6]);
});

it('test calculateAxis function simple', () => {
	const dataRows = df.toCollection(true);
	const selectedParams = ['gender'];
	const checkedMean = false;
	const yAxisParam = 'Absolute Frequency';

	let [labels, values] = calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);

	// This function has already been tested:
	[labels, values] = sortParallelArrays(labels, values);

	// F before M because sorted
	expect(labels).toStrictEqual(['F', 'M']);
	expect(values).toStrictEqual([3, 3]);
});

it('test calculateAxis function simple relative', () => {
	const dataRows = df.toCollection(true);
	const selectedParams = ['gender'];
	const checkedMean = false;
	const yAxisParam = 'Relative Frequency';

	let [labels, values] = calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);
	[labels, values] = sortParallelArrays(labels, values);

	expect(labels).toStrictEqual(['F', 'M']);
	expect(values).toStrictEqual([1 / 2, 1 / 2]);
});

it('test calculateAxis function total age', () => {
	const dataRows = df.toCollection(true);
	const selectedParams = ['gender'];
	const checkedMean = false;
	const yAxisParam = 'age';

	let [labels, values] = calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);
	[labels, values] = sortParallelArrays(labels, values);

	expect(labels).toStrictEqual(['F', 'M']);
	expect(values).toStrictEqual([130, 66]);
});

it('test calculateAxis function average age', () => {
	const dataRows = df.toCollection(true);
	const selectedParams = ['gender'];
	const checkedMean = true;
	const yAxisParam = 'age';

	let [labels, values] = calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);
	[labels, values] = sortParallelArrays(labels, values);

	expect(labels).toStrictEqual(['F', 'M']);
	expect(values).toStrictEqual([65, 22]);
	``;
});

it('test calculateAxis function frequency of complex group', () => {
	const dataRows = df.toCollection(true);
	const selectedParams = ['gender', 'cef'];
	const checkedMean = false;
	const yAxisParam = 'Absolute Frequency';

	let [labels, values] = calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);
	[labels, values] = sortParallelArrays(labels, values);

	// Doesn't return columns with empty count
	expect(labels).toStrictEqual(['F, <empty>', 'F, B2', 'M, A1', 'M, A2', 'M, B1']);
	expect(values).toStrictEqual([1, 2, 1, 1, 1]);
});
