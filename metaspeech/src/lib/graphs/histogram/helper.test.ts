import {
	createConfig,
	createDatasets,
	createDatasetsLabel,
	handleData
} from '$lib/graphs/histogram/helper';
import { DataFrame, fromText } from '$lib/dataframe/DataFrame';
import { get } from 'svelte/store';

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

describe('createDatasets tests', () => {
	it('create datasets with aggregated column', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();
		const values: number[] = [5, 7];
		const selectedFunction: string = 'some function';

		const datasets = createDatasets(groupedDf, values, selectedFunction);
		expect(datasets).to.exist;
	});
	it('create datasets with abs freq', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;

		const groupedDf = df.groupBy();
		const values: number[] = [5, 7];
		const selectedFunction: string = 'Count';

		const datasets = createDatasets(groupedDf, values, selectedFunction);
		expect(datasets).to.exist;
	});
});

describe('createDatasetsLabel tests', () => {
	it('create label with aggregated column', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();
		const values: number[] = [5, 7];
		const selectedFunction: string = 'some function';

		const label = createDatasetsLabel(groupedDf, values, selectedFunction);
		expect(label).toBe('cars');
	});
	it('create label with abs freq', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();
		const values: number[] = [5, 7];
		const selectedFunction: string = 'Count';

		const label = createDatasetsLabel(groupedDf, values, selectedFunction);
		expect(label).toBe('Count');
	});
	it('create label with rel freq', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();
		const values: number[] = [5, 7];
		const selectedFunction: string = 'Percentage';

		const label = createDatasetsLabel(groupedDf, values, selectedFunction);
		expect(label).toBe('Percentage');
	});
});

it('create config test', () => {
	const df = new DataFrame();
	df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

	const columns = get(df.columns);
	columns[1].aggregate = true;
	columns[0].groupBy = { type: 'specific' };

	const groupedDf = df.groupBy();
	const labels: string[] = ['18', '32'];
	const values: number[] = [5, 7];
	const selectedFunction: string = 'some function';

	const datasets = createDatasets(groupedDf, values, selectedFunction);
	const config = createConfig(labels, datasets, groupedDf, selectedFunction);

	expect(config).to.exist;
});
