import { render } from '@testing-library/svelte';
import sut from '$lib/components/column-selector/ColumnSelector.svelte';
import { describe, it, expect } from 'vitest';
import DataFrame from 'dataframe-js';
import { data } from '$lib/Store';
import userEvent from '@testing-library/user-event';
import { selectedColumns, binSizes, selectedValues, checkedMean } from '$lib/Store';
import { get } from 'svelte/store';

const df1 = new DataFrame(
	{
		column1: [3, 6, 8],
		column2: [3, 4, 5],
		column3: ['a', 'b', 'c']
	},
	['column1', 'column2', 'column3']
);
describe('ColumnSelector tests', () => {
	it('basic render', () => {
		const { container } = render(sut);
		expect(container).toBeTruthy();
	});
	it('can see all of the columns and each of the columns appear twice (once in group by and once in select)', () => {
		data.set(df1);
		const { getAllByText } = render(sut);
		expect(getAllByText('column1').length).toBe(2);
		expect(getAllByText('column2').length).toBe(2);
		expect(getAllByText('column3').length).toBe(1);
	});
});

describe('group by tests', () => {
	it('clicking column changes selectedColumns', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('groupby-column1');
		await user.click(column1Button);

		expect(get(selectedColumns).length).toBe(1);
		expect(get(selectedColumns)[0]).toBe('column1');
	});
	it('clicking 2 columns changes selectedColumns', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('groupby-column1');
		const column3Button = getByTestId('groupby-column3');
		await user.click(column1Button);
		await user.click(column3Button);

		expect(get(selectedColumns)).toStrictEqual(['column1', 'column3']);
	});
	it('clicking twice columns changes selectedColumns', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('groupby-column1');
		const column3Button = getByTestId('groupby-column3');
		await user.click(column1Button);
		await user.click(column3Button);

		expect(get(selectedColumns)).toStrictEqual(['column1', 'column3']);

		await user.click(column1Button);

		expect(get(selectedColumns)).toStrictEqual(['column3']);

		await user.click(column3Button);

		expect(get(selectedColumns)).toStrictEqual([]);
	});
});

describe('binning tests', () => {
	it('shows column1 bin', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('groupby-column1');
		await user.click(column1Button);

		expect(getByTestId('number-bin-column1')).to.exist;
		expect(getByTestId('range-bin-column1')).to.exist;
	});
	it('shows column1, column2 bin, but not column3', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId, queryByTestId } = render(sut);
		const column1Button = getByTestId('groupby-column1');
		const column2Button = getByTestId('groupby-column2');
		const column3Button = getByTestId('groupby-column3');
		await user.click(column1Button);
		await user.click(column2Button);
		await user.click(column3Button);

		expect(getByTestId('number-bin-column1')).to.exist;
		expect(getByTestId('number-bin-column2')).to.exist;
		expect(queryByTestId('number-bin-column3')).not.toBeInTheDocument();

		expect(getByTestId('range-bin-column1')).to.exist;
		expect(getByTestId('range-bin-column2')).to.exist;
		expect(queryByTestId('range-bin-column3')).not.toBeInTheDocument();
	});
	it('can type column1 bin', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('groupby-column1');
		await user.click(column1Button);

		const column1Bin = getByTestId('number-bin-column1');
		await user.type(column1Bin, '4');

		expect(get(binSizes)['column1']).toBe(4);
	});
	it('typing column1 bin size larger than max', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('groupby-column1');
		await user.click(column1Button);

		const column1Bin = getByTestId('number-bin-column1');
		await user.type(column1Bin, '400');

		expect(get(binSizes)['column1']).toBe(400);
	});
	it('can type column1 bin and column2 bin', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('groupby-column1');
		const column2Button = getByTestId('groupby-column2');
		await user.click(column1Button);
		await user.click(column2Button);

		const column1Bin = getByTestId('number-bin-column1');
		const column2Bin = getByTestId('number-bin-column2');
		await user.type(column1Bin, '4');
		await user.type(column2Bin, '6');

		expect(get(binSizes)['column1']).toBe(4);
		expect(get(binSizes)['column2']).toBe(6);
	});
});
describe('select tests', () => {
	it('clicking column changes selectedValues', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('select-column1');
		await user.click(column1Button);

		expect(get(selectedValues).length).toBe(1);
		expect(get(selectedValues)[0]).toBe('column1');
	});
	it('clicking 2 columns changes selectedColumns', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('select-column1');
		const column2Button = getByTestId('select-column2');
		await user.click(column1Button);
		await user.click(column2Button);

		expect(get(selectedValues)).toStrictEqual(['column1', 'column2']);
	});
	it('clicking twice columns changes selectedColumns', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('select-column1');
		const column2Button = getByTestId('select-column2');
		await user.click(column1Button);
		await user.click(column2Button);

		expect(get(selectedValues)).toStrictEqual(['column1', 'column2']);

		await user.click(column1Button);

		expect(get(selectedValues)).toStrictEqual(['column2']);

		await user.click(column2Button);

		expect(get(selectedValues)).toStrictEqual([]);
	});
});
describe('groupby and select tests', () => {
	it('clicking column in groupby removes column from select', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId, queryByTestId } = render(sut);

		const column1groupby = getByTestId('groupby-column1');

		expect(getByTestId('select-column1')).to.exist;

		await user.click(column1groupby);

		expect(queryByTestId('select-column1')).not.toBeInTheDocument();
	});
	it('clicking column1, column3 in groupby and clicking column2 in select, column2 is not in groupby and column3, column1 are checked', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const page = render(sut);

		const column1groupby = page.getByTestId('groupby-column1');
		const column3groupby = page.getByTestId('groupby-column3');

		expect(page.getByTestId('select-column1')).to.exist;
		expect(page.getByTestId('groupby-column2')).to.exist;
		expect(page.queryByTestId('select-column3')).not.toBeInTheDocument();

		await user.click(column1groupby);
		await user.click(column3groupby);

		const column2select = page.getByTestId('select-column2');
		await user.click(column2select);

		expect(page.queryByTestId('select-column1')).not.toBeInTheDocument();
		expect(page.queryByTestId('groupby-column2')).not.toBeInTheDocument();

		expect(get(selectedColumns)).toStrictEqual(['column1', 'column3']);
		expect(get(selectedValues)).toStrictEqual(['column2']);
	});
});
describe('checkedMean button tests', () => {
	it('clicking checkedMean button changes checkedMean', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);

		expect(get(checkedMean)).toBe(false);

		const checkedMeanButton = getByTestId('checked-mean-button');
		await user.click(checkedMeanButton);

		expect(get(checkedMean)).toBe(true);

		await user.click(checkedMeanButton);

		expect(get(checkedMean)).toBe(false);
	});
});
