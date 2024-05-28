import DataFrame from 'dataframe-js';
import WarningGenerator from './WarningGenerator.svelte';
import { selectedColumns, selectedValues } from '$lib/ColumnSelector/Store';
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

describe('warning generator for groupby ', () => {
	it('show non number columns', () => {
		data.set(df1);
		selectedColumns.set(['column1', 'column2', 'column3']);
		const { getByTestId } = render(WarningGenerator, {
			needNumbers: true,
			columnsAreLimited: false,
			maxColumns: 2,
			valuesAreLimited: false,
			maxValues: 100
		});
		expect(getByTestId('warning-column3')).to.exist;
	});
	it('columns exceed max columns', () => {
		data.set(df1);
		selectedColumns.set(['column1', 'column2', 'column3']);
		const { getByTestId } = render(WarningGenerator, {
			needNumbers: false,
			columnsAreLimited: true,
			maxColumns: 1,
			valuesAreLimited: false,
			maxValues: 100
		});
		expect(getByTestId('groupby-limit')).to.exist;
		expect(getByTestId('groupby-limit').innerHTML).toBe(
			'Number of columns are limited. Limit: 1. Number of selected columns: 3'
		);
	});
	it('columns exceed max columns but doesnt give warning', () => {
		data.set(df1);
		selectedColumns.set(['column1', 'column2', 'column3']);
		const { queryByTestId } = render(WarningGenerator, {
			needNumbers: false,
			columnsAreLimited: false,
			maxColumns: 1,
			valuesAreLimited: false,
			maxValues: 100
		});
		expect(queryByTestId('groupby-limit')).not.toBeInTheDocument();
	});
	it('columns dont exceed max columns', () => {
		data.set(df1);
		selectedColumns.set(['column1']);
		const { queryByTestId } = render(WarningGenerator, {
			needNumbers: false,
			columnsAreLimited: true,
			maxColumns: 1,
			valuesAreLimited: false,
			maxValues: 100
		});
		expect(queryByTestId('groupby-limit')).not.toBeInTheDocument();
	});
	it('columns exceed max columns and non number columns', () => {
		data.set(df1);
		selectedColumns.set(['column1', 'column2', 'column3']);
		const { getByTestId } = render(WarningGenerator, {
			needNumbers: true,
			columnsAreLimited: true,
			maxColumns: 1,
			valuesAreLimited: false,
			maxValues: 100
		});
		expect(getByTestId('warning-column3')).to.exist;
		expect(getByTestId('groupby-limit')).to.exist;
		expect(getByTestId('groupby-limit').innerHTML).toBe(
			'Number of columns are limited. Limit: 1. Number of selected columns: 3'
		);
	});
});
describe('warning generator for select ', () => {
	it('shows error when to many select values', () => {
		data.set(df1);
		selectedValues.set(['column1', 'column2', 'column3']);
		const { getByTestId } = render(WarningGenerator, {
			needNumbers: false,
			columnsAreLimited: false,
			maxColumns: 2,
			valuesAreLimited: true,
			maxValues: 1
		});

		expect(getByTestId('select-limit')).to.exist;
		expect(getByTestId('select-limit').innerHTML).toBe(
			'Number of select values are limited. Limit: 1. Number of selected select values: 3'
		);
	});
	it('doesnt show error although select values are more than maxValues', () => {
		data.set(df1);
		selectedValues.set(['column1', 'column2', 'column3']);
		const { queryByTestId } = render(WarningGenerator, {
			needNumbers: false,
			columnsAreLimited: false,
			maxColumns: 2,
			valuesAreLimited: false,
			maxValues: 1
		});

		expect(queryByTestId('select-limit')).not.toBeInTheDocument();
	});
	it('select values dont exceed maxValues', () => {
		data.set(df1);
		selectedValues.set(['column1']);
		const { queryByTestId } = render(WarningGenerator, {
			needNumbers: false,
			columnsAreLimited: false,
			maxColumns: 2,
			valuesAreLimited: true,
			maxValues: 1
		});

		expect(queryByTestId('select-limit')).not.toBeInTheDocument();
	});
	it('select values dont exceed maxValues and no limit', () => {
		data.set(df1);
		selectedValues.set([]);
		const { queryByTestId } = render(WarningGenerator, {
			needNumbers: false,
			columnsAreLimited: false,
			maxColumns: 2,
			valuesAreLimited: false,
			maxValues: 1
		});

		expect(queryByTestId('select-limit')).not.toBeInTheDocument();
	});
});
