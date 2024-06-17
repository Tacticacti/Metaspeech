import { DataFrame, fromText } from '$lib/dataframe/DataFrame';
import { get } from 'svelte/store';
import { flipKeys, getArrayForDatasets, getBoxPlotData, getChartConfig } from './helper';

describe('getBoxPlotData tests', () => {
	it('0 grouped columns', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;

		const groupedDf = df.groupBy();

		const data = getBoxPlotData(groupedDf);
		expect(data).toBeUndefined();
	});
	it('3 grouped columns', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars,trains,bottles\n18,1,1,1\n32,4,1,1\n18,2,1,1'));

		const columns = get(df.columns);
		columns[0].aggregate = true;
		columns[1].groupBy = { type: 'specific' };
		columns[2].groupBy = { type: 'specific' };
		columns[3].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const data = getBoxPlotData(groupedDf);
		expect(data).toBeUndefined();
	});
	it('1 grouped column', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const data = getBoxPlotData(groupedDf);
		expect(data).toBeDefined();
		expect(data?.labels).toStrictEqual(['18', '32']);
		expect(data?.datasets[0].data).toStrictEqual([[1, 2], [4]]);
	});
	it('2 grouped columns', () => {
		const df = new DataFrame();
		df.set(fromText('age,gender,cars\n18,F,1\n18,F,2\n20,M,1'));

		const columns = get(df.columns);
		columns[2].aggregate = true;
		columns[0].groupBy = { type: 'specific' };
		columns[1].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const data = getBoxPlotData(groupedDf);
		expect(data).toBeDefined();
		expect(data?.labels).toStrictEqual(['18', '20']);
		expect(data?.datasets.length).toBe(2);

		expect(data?.datasets[0].label).toBe('F');
		expect(data?.datasets[0].data).toStrictEqual([[1, 2], []]);

		expect(data?.datasets[1].label).toBe('M');
		expect(data?.datasets[1].data).toStrictEqual([[], [1]]);
	});
});

describe('getArrayForDatasets tests', () => {
	it('without missing values', () => {
		const df = new DataFrame();
		df.set(fromText('age,gender,cars\n18,F,1\n20,M,1\n18,F,2\n20,F,3\n18,M,1'));

		const columns = get(df.columns);
		columns[2].aggregate = true;
		columns[0].groupBy = { type: 'specific' };
		columns[1].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const arr = getArrayForDatasets(groupedDf);
		console.log(arr);

		expect(arr).toStrictEqual([
			[[1, 2], [3]],
			[[1], [1]]
		]);
	});
	it('with missing values', () => {
		const df = new DataFrame();
		df.set(fromText('age,gender,cars\n18,F,1\n18,F,2\n20,M,1'));

		const columns = get(df.columns);
		columns[2].aggregate = true;
		columns[0].groupBy = { type: 'specific' };
		columns[1].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const arr = getArrayForDatasets(groupedDf);
		expect(arr).toStrictEqual([
			[[1, 2], []],
			[[], [1]]
		]);
	});
	it('with undefined values', () => {
		const df = new DataFrame();
		df.set(fromText('age,gender,cars\n18,F,undefined\n20,M,1\n18,F,2\n20,F,3\n18,M,1'));
		get(df.rows)[0][2] = undefined;

		const columns = get(df.columns);
		columns[2].aggregate = true;
		columns[0].groupBy = { type: 'specific' };
		columns[1].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const arr = getArrayForDatasets(groupedDf);
		expect(arr).toStrictEqual([
			[[2], [3]],
			[[1], [1]]
		]);
	});
});

describe('flipKeys tests', () => {
	it('1 grouped column', () => {
		const df = new DataFrame();
		df.set(fromText('age,gender,cars\n18,F,1\n20,M,1\n18,F,2\n20,F,3\n18,M,1'));

		const columns = get(df.columns);
		columns[2].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();
		const newGroupedDf = flipKeys(groupedDf);

		expect(newGroupedDf).toBe(groupedDf);
	});
	it('3 grouped column', () => {
		const df = new DataFrame();
		df.set(fromText('age,gender,cars\n18,F,1\n20,M,1\n18,F,2\n20,F,3\n18,M,1'));

		const columns = get(df.columns);
		columns[2].aggregate = true;
		columns[0].groupBy = { type: 'specific' };
		columns[1].groupBy = { type: 'specific' };
		columns[2].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();
		const newGroupedDf = flipKeys(groupedDf);

		expect(newGroupedDf).toBe(groupedDf);
	});
	it('basic df', () => {
		const df = new DataFrame();
		df.set(fromText('age,gender,cars\n18,F,1\n20,M,1\n18,F,2\n20,F,3\n18,M,1'));

		const columns = get(df.columns);
		columns[2].aggregate = true;
		columns[0].groupBy = { type: 'specific' };
		columns[1].groupBy = { type: 'specific' };

		let groupedDf = df.groupBy();

		expect(groupedDf.groups[0].keys).toStrictEqual([18, 'F']);
		expect(groupedDf.groups[1].keys).toStrictEqual([20, 'M']);
		expect(groupedDf.groups[2].keys).toStrictEqual([20, 'F']);
		expect(groupedDf.groups[3].keys).toStrictEqual([18, 'M']);
		expect(groupedDf.groupedColumns.map((col) => col.name)).toStrictEqual(['age', 'gender']);

		groupedDf = flipKeys(groupedDf);

		expect(groupedDf.groups[0].keys).toStrictEqual(['F', 18]);
		expect(groupedDf.groups[1].keys).toStrictEqual(['M', 20]);
		expect(groupedDf.groups[2].keys).toStrictEqual(['F', 20]);
		expect(groupedDf.groups[3].keys).toStrictEqual(['M', 18]);
		expect(groupedDf.groupedColumns.map((col) => col.name)).toStrictEqual(['gender', 'age']);
	});
});

describe('getChartConfig tests', () => {
	it('basic case', () => {
		const df = new DataFrame();
		df.set(fromText('age,gender,cars\n18,F,1\n20,M,1\n18,F,2\n20,F,3\n18,M,1'));

		const columns = get(df.columns);
		columns[2].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();
		const data = getBoxPlotData(groupedDf);
		console.log('aaaaaa');

		const config = getChartConfig(data, groupedDf);

		expect(config).toBeDefined();
		// expect(config.options?.plugins?.title?.text).toBe('cars x age');
		// //@ts-expect-error don't know why there is type error
		// expect(config.options?.scales.y?.title?.text).toBe('cars');
	});
});
