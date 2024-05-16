import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/histogram/Histogram.svelte';
import { data } from '$lib/Store';
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
	const { component } = render(sut);

	const labels: string[] = [];
	const values: number[] = [];

	const [labelsSorted, valuesSorted] = component.sortParallelArrays(labels, values);

	expect(labelsSorted.length).toBe(0);
	expect(valuesSorted.length).toBe(0);
});

it('test sort parallel arrays one', () => {
	const { component } = render(sut);

	const labels: string[] = ['B'];
	const values: number[] = [30];

	const [labelsSorted, valuesSorted] = component.sortParallelArrays(labels, values);

	expect(labelsSorted).toStrictEqual(['B']);
	expect(valuesSorted).toStrictEqual([30]);
});

it('test sort parallel arrays three', () => {
	const { component } = render(sut);

	const labels: string[] = ['B', 'A', 'C'];
	const values: number[] = [30, 20, 10];

	const [labelsSorted, valuesSorted] = component.sortParallelArrays(labels, values);

	expect(labelsSorted).toStrictEqual(['A', 'B', 'C']);
	expect(valuesSorted).toStrictEqual([20, 30, 10]);
});

it('test sort parallel arrays complex label', () => {
	const { component } = render(sut);

	const labels: string[] = ['10, A', '2, B', '2, C', '1, C'];
	const values: number[] = [30, 20, 10, 40];

	const [labelsSorted, valuesSorted] = component.sortParallelArrays(labels, values);

	expect(labelsSorted).toStrictEqual(['1, C', '2, B', '2, C', '10, A']);
	expect(valuesSorted).toStrictEqual([40, 20, 10, 30]);
});

it('test sort parallel arrays complex label reversed', () => {
	const { component } = render(sut);

	const labels: string[] = ['B, 2', 'A, 10', 'C, 2', 'C, 1'];
	const values: number[] = [30, 20, 10, 40];

	const [labelsSorted, valuesSorted] = component.sortParallelArrays(labels, values);

	expect(labelsSorted).toStrictEqual(['A, 10', 'B, 2', 'C, 1', 'C, 2']);
	expect(valuesSorted).toStrictEqual([20, 30, 40, 10]);
});

it('test sort parallel arrays complex label reversed equal elements', () => {
	const { component } = render(sut);

	const labels: string[] = ['B, 2', 'B, 2', 'C, 2', 'C, 1'];
	const values: number[] = [30, 20, 10, 40];

	const [labelsSorted, valuesSorted] = component.sortParallelArrays(labels, values);

	expect(labelsSorted).toStrictEqual(['B, 2', 'B, 2', 'C, 1', 'C, 2']);
	expect(valuesSorted).toStrictEqual([30, 20, 40, 10]);
});

it('canvas wrapper exists', () => {
	const { getByTestId } = render(sut);
	const canvas = getByTestId('canvas-element');
	expect(canvas).to.exist;
});

it('test columnInfo simple', () => {
	data.set(df);
	const { component } = render(sut);

	const columnNames = df.listColumns();
	const numericCols = component.getNumericalColumns(columnNames);

	expect(numericCols).toStrictEqual(['id', 'age', 'duration']);
});

it('test calculateAxis function empty', () => {
	data.set(df);
	const { component } = render(sut);

	const dataRows = df.toCollection();
	const selectedParams: string[] = [];
	const checkedMean = false;
	const yAxisParam = 'Absolute Frequency';

	let [labels, values] = component.calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);

	// This function has already been tested:
	[labels, values] = component.sortParallelArrays(labels, values);

	// F before M because sorted
	expect(labels).toStrictEqual(['']);
	expect(values).toStrictEqual([6]);
});

it('test calculateAxis function simple', () => {
	data.set(df);
	const { component } = render(sut);

	const dataRows = df.toCollection();
	const selectedParams = ['gender'];
	const checkedMean = false;
	const yAxisParam = 'Absolute Frequency';

	let [labels, values] = component.calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);

	// This function has already been tested:
	[labels, values] = component.sortParallelArrays(labels, values);

	// F before M because sorted
	expect(labels).toStrictEqual(['F', 'M']);
	expect(values).toStrictEqual([3, 3]);
});

it('test calculateAxis function simple relative', () => {
	data.set(df);
	const { component } = render(sut);

	const dataRows = df.toCollection();
	const selectedParams = ['gender'];
	const checkedMean = false;
	const yAxisParam = 'Relative Frequency';

	let [labels, values] = component.calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);
	[labels, values] = component.sortParallelArrays(labels, values);

	expect(labels).toStrictEqual(['F', 'M']);
	expect(values).toStrictEqual([1 / 2, 1 / 2]);
});

it('test calculateAxis function total age', () => {
	data.set(df);
	const { component } = render(sut);

	const dataRows = df.toCollection();
	const selectedParams = ['gender'];
	const checkedMean = false;
	const yAxisParam = 'age';

	let [labels, values] = component.calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);
	[labels, values] = component.sortParallelArrays(labels, values);

	expect(labels).toStrictEqual(['F', 'M']);
	expect(values).toStrictEqual([130, 66]);
});

it('test calculateAxis function average age', () => {
	data.set(df);
	const { component } = render(sut);

	const dataRows = df.toCollection();
	const selectedParams = ['gender'];
	const checkedMean = true;
	const yAxisParam = 'age';

	let [labels, values] = component.calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);
	[labels, values] = component.sortParallelArrays(labels, values);

	expect(labels).toStrictEqual(['F', 'M']);
	expect(values).toStrictEqual([65, 22]);
});

it('test calculateAxis function frequency of complex group', () => {
	data.set(df);
	const { component } = render(sut);

	const dataRows = df.toCollection();
	const selectedParams = ['gender', 'cef'];
	const checkedMean = false;
	const yAxisParam = 'Absolute Frequency';

	let [labels, values] = component.calculateAxis(dataRows, selectedParams, checkedMean, yAxisParam);
	[labels, values] = component.sortParallelArrays(labels, values);

	// Doesn't return columns with empty count
	expect(labels).toStrictEqual(['F, <empty>', 'F, B2', 'M, A1', 'M, A2', 'M, B1']);
	expect(values).toStrictEqual([1, 2, 1, 1, 1]);
});
