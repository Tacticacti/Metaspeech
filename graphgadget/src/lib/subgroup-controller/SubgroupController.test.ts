import { it, expect } from 'vitest';
import {
	calculateAxis,
	sortParallelArrays,
	isColumnFrequency,
	getTableInfo,
	nameWithSum,
	nameWithMean,
	SEPARATION_PARAMETERS,
	SEPARATION_INTERVAL,
	SUBGROUP_LABEL,
	EMPTY_ENTRY
} from '$lib/subgroup-controller/SubgroupController';
import DataFrame from 'dataframe-js';
import { ABSOLUTE_FREQUENCY, RELATIVE_FREQUENCY, type BinDictionary } from '$lib/Store';

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

describe('sort parallel arrays tests', () => {
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

	it('sanity check', () => {
		const labels: string[] = ['M', 'F'];
		const values: number[] = [3, 3];

		const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

		expect(labelsSorted).toStrictEqual(['F', 'M']);
		expect(valuesSorted).toStrictEqual([3, 3]);
	});

	it('sanity check 2', () => {
		const labels: string[] = ['F', 'M'];
		const values: number[] = [3, 3];

		const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

		expect(labelsSorted).toStrictEqual(['F', 'M']);
		expect(valuesSorted).toStrictEqual([3, 3]);
	});

	it('test sort parallel arrays three', () => {
		const labels: string[] = ['B', 'A', 'C'];
		const values: number[] = [30, 20, 10];

		const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

		expect(labelsSorted).toStrictEqual(['A', 'B', 'C']);
		expect(valuesSorted).toStrictEqual([20, 30, 10]);
	});

	it('test sort parallel arrays complex label', () => {
		const labels: string[] = [
			`10${SEPARATION_PARAMETERS}A`,
			`2${SEPARATION_PARAMETERS}B`,
			`2${SEPARATION_PARAMETERS}C`,
			`1${SEPARATION_PARAMETERS}C`
		];
		const values: number[] = [30, 20, 10, 40];

		const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

		expect(labelsSorted).toStrictEqual([
			`1${SEPARATION_PARAMETERS}C`,
			`2${SEPARATION_PARAMETERS}B`,
			`2${SEPARATION_PARAMETERS}C`,
			`10${SEPARATION_PARAMETERS}A`
		]);
		expect(valuesSorted).toStrictEqual([40, 20, 10, 30]);
	});

	it('test sort parallel arrays complex label reversed', () => {
		const labels: string[] = [
			`B${SEPARATION_PARAMETERS}2`,
			`A${SEPARATION_PARAMETERS}10`,
			`C${SEPARATION_PARAMETERS}2`,
			`C${SEPARATION_PARAMETERS}1`
		];
		const values: number[] = [30, 20, 10, 40];

		const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

		expect(labelsSorted).toStrictEqual([
			`A${SEPARATION_PARAMETERS}10`,
			`B${SEPARATION_PARAMETERS}2`,
			`C${SEPARATION_PARAMETERS}1`,
			`C${SEPARATION_PARAMETERS}2`
		]);
		expect(valuesSorted).toStrictEqual([20, 30, 40, 10]);
	});

	it('test sort parallel arrays complex label reversed equal elements', () => {
		const labels: string[] = [
			`B${SEPARATION_PARAMETERS}2`,
			`B${SEPARATION_PARAMETERS}2`,
			`C${SEPARATION_PARAMETERS}2`,
			`C${SEPARATION_PARAMETERS}1`
		];
		const values: number[] = [30, 20, 10, 40];

		const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

		expect(labelsSorted).toStrictEqual([
			`B${SEPARATION_PARAMETERS}2`,
			`B${SEPARATION_PARAMETERS}2`,
			`C${SEPARATION_PARAMETERS}1`,
			`C${SEPARATION_PARAMETERS}2`
		]);
		expect(valuesSorted).toStrictEqual([30, 20, 40, 10]);
	});

	it('test sort parallel arrays with binning intervals', () => {
		const labels: string[] = [
			`B${SEPARATION_PARAMETERS}[3${SEPARATION_INTERVAL}5]${SEPARATION_PARAMETERS}1`,
			`B${SEPARATION_PARAMETERS}[2${SEPARATION_INTERVAL}4]${SEPARATION_PARAMETERS}2`,
			`C${SEPARATION_PARAMETERS}[1${SEPARATION_INTERVAL}2]${SEPARATION_PARAMETERS}2`,
			`C${SEPARATION_PARAMETERS}[1${SEPARATION_INTERVAL}2]${SEPARATION_PARAMETERS}1`
		];
		const values: number[] = [30, 20, 10, 40];

		const [labelsSorted, valuesSorted] = sortParallelArrays(labels, values);

		expect(labelsSorted).toStrictEqual([
			`B${SEPARATION_PARAMETERS}[2${SEPARATION_INTERVAL}4]${SEPARATION_PARAMETERS}2`,
			`B${SEPARATION_PARAMETERS}[3${SEPARATION_INTERVAL}5]${SEPARATION_PARAMETERS}1`,
			`C${SEPARATION_PARAMETERS}[1${SEPARATION_INTERVAL}2]${SEPARATION_PARAMETERS}1`,
			`C${SEPARATION_PARAMETERS}[1${SEPARATION_INTERVAL}2]${SEPARATION_PARAMETERS}2`
		]);
		expect(valuesSorted).toStrictEqual([20, 30, 40, 10]);
	});
});

describe('test calculate axis', () => {
	it('test calculateAxis function empty', () => {
		const dataRows = df.toCollection(true);
		const selectedParams: string[] = [];
		const checkedMean = false;
		const yAxisParam = 'Absolute Frequency';
		const binSizes: BinDictionary = {};

		const [labels, values] = calculateAxis(
			dataRows,
			selectedParams,
			checkedMean,
			yAxisParam,
			binSizes
		);

		// F before M because sorted
		expect(labels).toStrictEqual(['']);
		expect(values).toStrictEqual([6]);
	});

	it('test calculateAxis function simple', () => {
		const dataRows = df.toCollection(true);
		const selectedParams = ['gender'];
		const checkedMean = false;
		const yAxisParam = ABSOLUTE_FREQUENCY;
		const binSizes: BinDictionary = {};

		const [labels, values] = calculateAxis(
			dataRows,
			selectedParams,
			checkedMean,
			yAxisParam,
			binSizes
		);

		// F before M because sorted
		expect(labels).toStrictEqual(['F', 'M']);
		expect(values).toStrictEqual([3, 3]);
	});

	it('test calculateAxis function simple relative', () => {
		const dataRows = df.toCollection(true);
		const selectedParams = ['gender'];
		const checkedMean = false;
		const yAxisParam = RELATIVE_FREQUENCY;
		const binSizes: BinDictionary = {};

		const [labels, values] = calculateAxis(
			dataRows,
			selectedParams,
			checkedMean,
			yAxisParam,
			binSizes
		);

		expect(labels).toStrictEqual(['F', 'M']);
		expect(values).toStrictEqual([1 / 2, 1 / 2]);
	});

	it('test calculateAxis function total age', () => {
		const dataRows = df.toCollection(true);
		const selectedParams = ['gender'];
		const checkedMean = false;
		const yAxisParam = 'age';
		const binSizes: BinDictionary = {};

		const [labels, values] = calculateAxis(
			dataRows,
			selectedParams,
			checkedMean,
			yAxisParam,
			binSizes
		);

		expect(labels).toStrictEqual(['F', 'M']);
		expect(values).toStrictEqual([130, 66]);
	});

	it('test calculateAxis function average age', () => {
		const dataRows = df.toCollection(true);
		const selectedParams = ['gender'];
		const checkedMean = true;
		const yAxisParam = 'age';
		const binSizes: BinDictionary = {};

		const [labels, values] = calculateAxis(
			dataRows,
			selectedParams,
			checkedMean,
			yAxisParam,
			binSizes
		);

		expect(labels).toStrictEqual(['F', 'M']);
		expect(values).toStrictEqual([65, 22]);
		``;
	});

	it('test calculateAxis function frequency of complex group', () => {
		const dataRows = df.toCollection(true);
		const selectedParams = ['gender', 'cef'];
		const checkedMean = false;
		const yAxisParam = ABSOLUTE_FREQUENCY;
		const binSizes: BinDictionary = {};

		const [labels, values] = calculateAxis(
			dataRows,
			selectedParams,
			checkedMean,
			yAxisParam,
			binSizes
		);

		// Doesn't return columns with empty count
		expect(labels).toStrictEqual([
			`F${SEPARATION_PARAMETERS}${EMPTY_ENTRY}`,
			`F${SEPARATION_PARAMETERS}B2`,
			`M${SEPARATION_PARAMETERS}A1`,
			`M${SEPARATION_PARAMETERS}A2`,
			`M${SEPARATION_PARAMETERS}B1`
		]);
		expect(values).toStrictEqual([1, 2, 1, 1, 1]);
	});

	it('test calculateAxis function frequency with binning intervals', () => {
		const dataRows = df.toCollection(true);
		const selectedParams = ['gender', 'age'];
		const checkedMean = false;
		const yAxisParam = 'Absolute Frequency';
		const binSizes: BinDictionary = {
			age: 10
			//[0, 9], [10, 19] etc.
			//gender: ['M', 'F', 'M', 'M', 'F', 'F'],
			//age: [33, 43, 14, 19, undefined, 87],
			//so [10, 19] has 2, [30, 39] has 1, [40, 49] has 1,
			//<empty> has 1, [80,89] has one
		};

		const [labels, values] = calculateAxis(
			dataRows,
			selectedParams,
			checkedMean,
			yAxisParam,
			binSizes
		);

		expect(labels).toStrictEqual([
			`F${SEPARATION_PARAMETERS}[40${SEPARATION_INTERVAL}49]`,
			`F${SEPARATION_PARAMETERS}[80${SEPARATION_INTERVAL}89]`,
			`F${SEPARATION_PARAMETERS}${EMPTY_ENTRY}`,
			`M${SEPARATION_PARAMETERS}[10${SEPARATION_INTERVAL}19]`,
			`M${SEPARATION_PARAMETERS}[30${SEPARATION_INTERVAL}39]`
		]);
		expect(values).toStrictEqual([1, 1, 1, 2, 1]);
	});

	it('test calculateAxis function with incorrect binning', () => {
		const dataRows = df.toCollection(true);
		const selectedParams = ['gender'];
		const checkedMean = true;
		const yAxisParam = 'age';
		const binSizes: BinDictionary = {
			gender: 10
			// this should be ignored by the label
		};

		const [labels, values] = calculateAxis(
			dataRows,
			selectedParams,
			checkedMean,
			yAxisParam,
			binSizes
		);

		expect(labels).toStrictEqual(['F', 'M']);
		expect(values).toStrictEqual([65, 22]);
	});
});

describe('is column frequency', () => {
	it('abs freq', () => {
		expect(isColumnFrequency(ABSOLUTE_FREQUENCY)).toBe(true);
	});
	it('rel freq', () => {
		expect(isColumnFrequency(RELATIVE_FREQUENCY)).toBe(true);
	});
	it('age', () => {
		expect(isColumnFrequency('age')).toBe(false);
	});
	it('empty', () => {
		expect(isColumnFrequency('')).toBe(false);
	});
	it(' not freq', () => {
		expect(isColumnFrequency('Frequency')).toBe(false);
	});
});

describe('get table info test', () => {
	it('simple', () => {
		const xColumns: string[] = ['gender'];
		const yColumns: string[] = [ABSOLUTE_FREQUENCY];
		const binSizes: BinDictionary = {};
		const columnsToSum: string[] = [];
		const columnsToMean: string[] = [];

		const tableInfo = getTableInfo(
			df.toCollection(true),
			xColumns,
			yColumns,
			binSizes,
			columnsToSum,
			columnsToMean
		);

		expect(tableInfo).toEqual([
			[SUBGROUP_LABEL, ABSOLUTE_FREQUENCY],
			[
				['F', '3'],
				['M', '3']
			]
		]);
	});

	it('empty', () => {
		const xColumns: string[] = [];
		const yColumns: string[] = [];
		const binSizes: BinDictionary = {};
		const columnsToSum: string[] = [];
		const columnsToMean: string[] = [];

		const tableInfo = getTableInfo(
			df.toCollection(true),
			xColumns,
			yColumns,
			binSizes,
			columnsToSum,
			columnsToMean
		);

		expect(tableInfo).toEqual([[], []]);
	});

	it('age but not sum nor mean', () => {
		const xColumns: string[] = ['gender'];
		const yColumns: string[] = ['age'];
		const binSizes: BinDictionary = {};
		const columnsToSum: string[] = [];
		const columnsToMean: string[] = [];

		const tableInfo = getTableInfo(
			df.toCollection(true),
			xColumns,
			yColumns,
			binSizes,
			columnsToSum,
			columnsToMean
		);

		expect(tableInfo).toEqual([[SUBGROUP_LABEL], [['F'], ['M']]]);
	});

	it('age with sum', () => {
		const xColumns: string[] = ['gender'];
		const yColumns: string[] = ['age'];
		const binSizes: BinDictionary = {};
		const columnsToSum: string[] = ['age'];
		const columnsToMean: string[] = [];

		const tableInfo = getTableInfo(
			df.toCollection(true),
			xColumns,
			yColumns,
			binSizes,
			columnsToSum,
			columnsToMean
		);

		expect(tableInfo).toEqual([
			[SUBGROUP_LABEL, nameWithSum('age')],
			[
				['F', '130'],
				['M', '66']
			]
		]);
	});

	it('age with sum & mean', () => {
		const xColumns: string[] = ['gender'];
		const yColumns: string[] = ['age'];
		const binSizes: BinDictionary = {};
		const columnsToSum: string[] = ['age'];
		const columnsToMean: string[] = ['age'];

		const tableInfo = getTableInfo(
			df.toCollection(true),
			xColumns,
			yColumns,
			binSizes,
			columnsToSum,
			columnsToMean
		);

		expect(tableInfo).toEqual([
			[SUBGROUP_LABEL, nameWithSum('age'), nameWithMean('age')],
			[
				['F', '130', '65'],
				['M', '66', '22']
			]
		]);
	});
});
