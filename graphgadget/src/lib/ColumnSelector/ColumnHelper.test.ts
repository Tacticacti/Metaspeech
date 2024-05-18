import { getNumericalColumns, getNonNumericalColumns } from './ColumnHelper';
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

describe('getNumericalColumns tests', () => {
	it('pass basic dataframe', () => {
		const ans = getNumericalColumns(['column1', 'column2', 'column3'], df1);
		expect(ans).toStrictEqual(['column1', 'column2']);
	});
	it('pass basic dataframe', () => {
		const ans = getNumericalColumns(['column3'], df1);
		expect(ans).toStrictEqual([]);
	});
	it('pass empty dataframe', () => {
		const ans = getNumericalColumns([], df2);
		expect(ans).toStrictEqual([]);
	});
	// it('pass empty dataframe with non empty selected columns', () => {                       //impossible
	//     const ans = getNumericalColumns(["column1", "column2", "column3"], df2);
	//     expect(ans).toStrictEqual([]);
	// });
});
describe('getNonNumericalColumns tests', () => {
	it('pass basic dataframe', () => {
		const ans = getNonNumericalColumns(['column1', 'column2', 'column3'], df1);
		expect(ans).toStrictEqual(['column3']);
	});
	it('pass basic dataframe', () => {
		const ans = getNonNumericalColumns(['column1'], df1);
		expect(ans).toStrictEqual([]);
	});
	it('pass empty dataframe', () => {
		const ans = getNonNumericalColumns([], df2);
		expect(ans).toStrictEqual([]);
	});
});
