import DataFrame from 'dataframe-js';
import WarningGenerator from './WarningGenerator.svelte';
import { selectedColumns } from '$lib/ColumnSelector/Store';
import { data } from '$lib/Store';
import { render } from '@testing-library/svelte';

const df1 = new DataFrame(
	{
		column1: [3, 6, 8],
		column2: [3, 4, 5],
		column3: ['a', 'b', 'c']
	},
	['column1', 'column2', 'column3']
);

describe('warning generator', () => {
	it('show non number columns', () => {
		data.set(df1);
		selectedColumns.set(['column1', 'column2', 'column3']);
		const { getByTestId } = render(WarningGenerator, {
			needNumbers: true,
			columnsAreLimited: false,
			maxColumns: 2
		});
		expect(getByTestId('warning-column3')).to.exist;
	});
	it('columns exceed max columns', () => {
		data.set(df1);
		selectedColumns.set(['column1', 'column2', 'column3']);
		const { getByText } = render(WarningGenerator, {
			needNumbers: false,
			columnsAreLimited: true,
			maxColumns: 1
		});
		expect(getByText('Number of columns are limited. Limit: 1. Number of selected columns: 3')).to
			.exist;
	});
	it('columns exceed max columns and non number columns', () => {
		data.set(df1);
		selectedColumns.set(['column1', 'column2', 'column3']);
		const { getByText, getByTestId } = render(WarningGenerator, {
			needNumbers: true,
			columnsAreLimited: true,
			maxColumns: 1
		});
		expect(getByTestId('warning-column3')).to.exist;
		expect(getByText('Number of columns are limited. Limit: 1. Number of selected columns: 3')).to
			.exist;
	});
});
