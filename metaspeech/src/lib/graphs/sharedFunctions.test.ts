import {
	getScaleXAxisText,
	getTitleText,
	getScaleYAxisText,
	calculateMean,
	calculateSum,
	calculateAbsoluteFrequency,
	calculateRelativeFrequency
} from './sharedFunctions';
import { DataFrame, fromText } from '$lib/dataframe/DataFrame';
import { get } from 'svelte/store';

describe('title text tests ', () => {
	it('no grouped columns', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const groupedDf = df.groupBy();
		const title = getTitleText(groupedDf);

		expect(title).toBe('Total Frequency');
	});
	it('1 grouped columns', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();
		const title = getTitleText(groupedDf);

		expect(title).toBe('cars x age');
	});
	it('1 grouped columns no aggregation', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();
		const title = getTitleText(groupedDf);

		expect(title).toBe('Frequency of age');
	});
	it('2 grouped columns', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars,trains\n18,1,1\n32,4,1\n18,2,1'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };
		columns[2].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();
		const title = getTitleText(groupedDf);

		expect(title).toBe('cars x (age, trains)');
	});
});

describe('scaleXAxisText tests ', () => {
	it('no grouped columns', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const groupedDf = df.groupBy();
		const axis = getScaleXAxisText(groupedDf);

		expect(axis).toBe('all');
	});
	it('1 grouped columns', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const axis = getScaleXAxisText(groupedDf);

		expect(axis).toBe('age');
	});
	it('2 grouped columns', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars,trains\n18,1,1\n32,4,1\n18,2,1'));

		const columns = get(df.columns);

		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };
		columns[2].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const axis = getScaleXAxisText(groupedDf);

		expect(axis).toBe('Group: (age, trains)');
	});
});

describe('scaleYAxisText tests ', () => {
	it('aggregate selected', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const columns = get(df.columns);
		columns[1].aggregate = true;

		const groupedDf = df.groupBy();
		const selectedFunction = 'sum';

		const axis = getScaleYAxisText(groupedDf, selectedFunction);

		expect(axis).toBe('cars');
	});
	it('abs freq selected', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const groupedDf = df.groupBy();
		const selectedFunction = 'Absolute Frequency';

		const axis = getScaleYAxisText(groupedDf, selectedFunction);

		expect(axis).toBe('Absolute frequency(Count)');
	});
	it('rel freq selected', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const groupedDf = df.groupBy();
		const selectedFunction = 'Relative Frequency';

		const axis = getScaleYAxisText(groupedDf, selectedFunction);

		expect(axis).toBe('Relative frequency(%)');
	});
	it('unknown selected', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));

		const groupedDf = df.groupBy();
		const selectedFunction = 'unknown func';

		const axis = getScaleYAxisText(groupedDf, selectedFunction);

		expect(axis).toBe('Unknown');
	});
});

describe('calculate mean tests', () => {
	it('1 entry', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateMean(groupedDf);

		expect(labels).toStrictEqual(['18']);
		expect(values).toStrictEqual([1]);
	});
	it('2 entries', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n18,3'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateMean(groupedDf);

		expect(labels).toStrictEqual(['18']);
		expect(values).toStrictEqual([2]);
	});
	it('2 different entries', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n22,3'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateMean(groupedDf);

		expect(labels).toStrictEqual(['18', '22']);
		expect(values).toStrictEqual([1, 3]);
	});

	it('mixed', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2\n17,1\n17,1\n16,0'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateMean(groupedDf);

		expect(labels).toStrictEqual(['18', '32', '17', '16']);
		expect(values).toStrictEqual([1.5, 4, 1, 0]);
	});
});

describe('calculate sum tests', () => {
	it('1 entry', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateSum(groupedDf);

		expect(labels).toStrictEqual(['18']);
		expect(values).toStrictEqual([1]);
	});
	it('2 entries', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n18,3'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateSum(groupedDf);

		expect(labels).toStrictEqual(['18']);
		expect(values).toStrictEqual([4]);
	});
	it('2 different entries', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n22,3'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateSum(groupedDf);

		expect(labels).toStrictEqual(['18', '22']);
		expect(values).toStrictEqual([1, 3]);
	});
	it('mixed', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2\n17,1\n17,1\n16,0'));

		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateSum(groupedDf);

		expect(labels).toStrictEqual(['18', '32', '17', '16']);
		expect(values).toStrictEqual([3, 4, 2, 0]);
	});
});

describe('calculate abs freq tests', () => {
	it('1 entry', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateAbsoluteFrequency(groupedDf);

		expect(labels).toStrictEqual(['18']);
		expect(values).toStrictEqual([1]);
	});
	it('2 entries', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n18,3'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateAbsoluteFrequency(groupedDf);

		expect(labels).toStrictEqual(['18']);
		expect(values).toStrictEqual([2]);
	});
	it('2 different entries', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n22,3'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateAbsoluteFrequency(groupedDf);

		expect(labels).toStrictEqual(['18', '22']);
		expect(values).toStrictEqual([1, 1]);
	});
	it('mixed', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2\n17,1\n17,1\n16,0'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateAbsoluteFrequency(groupedDf);

		expect(labels).toStrictEqual(['18', '32', '17', '16']);
		expect(values).toStrictEqual([2, 1, 2, 1]);
	});
});

describe('calculate rel freq tests', () => {
	it('1 entry', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateRelativeFrequency(groupedDf);

		expect(labels).toStrictEqual(['18']);
		expect(values).toStrictEqual([100]);
	});
	it('2 entries', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n18,3'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateRelativeFrequency(groupedDf);

		expect(labels).toStrictEqual(['18']);
		expect(values).toStrictEqual([100]);
	});
	it('2 different entries', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n22,3'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateRelativeFrequency(groupedDf);

		expect(labels).toStrictEqual(['18', '22']);
		expect(values).toStrictEqual([50, 50]);
	});
	it('mixed', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2\n17,1\n17,1\n16,0'));

		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const [labels, values] = calculateRelativeFrequency(groupedDf);

		expect(labels).toStrictEqual(['18', '32', '17', '16']);
		expect(values).toStrictEqual([(2 / 6) * 100, (1 / 6) * 100, (2 / 6) * 100, (1 / 6) * 100]);
	});
});
