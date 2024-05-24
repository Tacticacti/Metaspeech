import {
	getNumericalColumns,
	getNonNumericalColumns,
	getNumericalColumnsAndMax
} from './ColumnHelper';
import DataFrame from 'dataframe-js';

const df1 = new DataFrame(
	{
		column1: [3, 6, 8],
		column2: [3, 4, 5],
		column3: ['a', 'b', 'c']
	},
	['column1', 'column2', 'column3']
);
const df2 = new DataFrame({}, []);

const df3 = new DataFrame(
	{
		id: [1, 2, 3, 4, 5, 6],
		age: [33, 43, 14, 19, undefined, 87],
		gender: ['M', 'F', 'M', 'M', 'F', 'F'],
		cef: ['A1', 'B2', 'B1', 'A2', undefined, 'B2'],
		duration: [100, 20, 200, 50, 10, 10]
	},
	['id', 'age', 'gender', 'cef', 'duration']
);

describe('getNumericalColumns tests', () => {
	it('pass basic dataframe', () => {
		const ans = getNumericalColumns(['column1', 'column2', 'column3'], df1.toCollection(true));
		expect(ans).toStrictEqual(['column1', 'column2']);
	});
	it('pass basic dataframe', () => {
		const ans = getNumericalColumns(['column3'], df1.toCollection(true));
		expect(ans).toStrictEqual([]);
	});
	it('pass empty dataframe', () => {
		const ans = getNumericalColumns([], df2.toCollection(true));
		expect(ans).toStrictEqual([]);
	});
	it('pass complex dataframe', () => {
		const columnNames = df3.listColumns();
		const ans = getNumericalColumns(columnNames, df3.toCollection(true));
		expect(ans).toStrictEqual(['id', 'age', 'duration']);
	});
});
describe('getNonNumericalColumns tests', () => {
	it('pass basic dataframe', () => {
		const ans = getNonNumericalColumns(['column1', 'column2', 'column3'], df1.toCollection(true));
		expect(ans).toStrictEqual(['column3']);
	});
	it('pass basic dataframe', () => {
		const ans = getNonNumericalColumns(['column1'], df1.toCollection(true));
		expect(ans).toStrictEqual([]);
	});
	it('pass empty dataframe', () => {
		const ans = getNonNumericalColumns([], df2.toCollection(true));
		expect(ans).toStrictEqual([]);
	});
	it('pass complex dataframe', () => {
		const columnNames = df3.listColumns();
		const ans = getNonNumericalColumns(columnNames, df3.toCollection(true));
		expect(ans).toStrictEqual(['gender', 'cef']);
	});
});

describe('test numerical and max columns', () => {
	it('test columnInfo complex', () => {
		const columnNames = df3.listColumns();
		const numericCols = getNumericalColumnsAndMax(columnNames, df3.toCollection(true));

		expect(numericCols).toStrictEqual([
			['id', 6],
			['age', 87],
			['duration', 200]
		]);
	});
});
