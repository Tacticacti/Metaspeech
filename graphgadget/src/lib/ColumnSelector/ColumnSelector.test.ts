import { render } from '@testing-library/svelte';
import sut from '$lib/ColumnSelector/ColumnSelector.svelte';
import { describe, it, expect } from 'vitest';
import DataFrame from 'dataframe-js';
import { data } from '$lib/Store';
import userEvent from '@testing-library/user-event';
import { selectedColumns } from './Store';
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
	it('can see all of the columns', () => {
		data.set(df1);
		const { getByText } = render(sut);
		expect(getByText('column1')).to.exist;
		expect(getByText('column2')).to.exist;
		expect(getByText('column3')).to.exist;
	});
	it('clicking column changes selectedColumns', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('check-column1');
		await user.click(column1Button);

		expect(get(selectedColumns).length).toBe(1);
		expect(get(selectedColumns)[0]).toBe('column1');
	});
	it('clicking 2 columns changes selectedColumns', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('check-column1');
		const column3Button = getByTestId('check-column3');
		await user.click(column1Button);
		await user.click(column3Button);

		expect(get(selectedColumns)).toStrictEqual(['column1', 'column3']);
	});
	it('clicking twice columns changes selectedColumns', async () => {
		data.set(df1);
		const user = userEvent.setup();

		const { getByTestId } = render(sut);
		const column1Button = getByTestId('check-column1');
		const column3Button = getByTestId('check-column3');
		await user.click(column1Button);
		await user.click(column3Button);

		expect(get(selectedColumns)).toStrictEqual(['column1', 'column3']);

		await user.click(column1Button);

		expect(get(selectedColumns)).toStrictEqual(['column3']);

		await user.click(column3Button);

		expect(get(selectedColumns)).toStrictEqual([]);
	});
});
