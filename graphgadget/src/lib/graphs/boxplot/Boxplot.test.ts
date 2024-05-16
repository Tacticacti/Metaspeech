import { render, screen } from '@testing-library/svelte';
import sut from '$lib/graphs/boxplot/Boxplot.svelte';
import { describe, it, expect } from 'vitest';
import DataFrame from 'dataframe-js';
import { data } from '$lib/Store';


const df1 = new DataFrame(
	{
		column1: [3, 6, 8],
		column2: [3, 4, 5],
		column3: ['a', 'b', 'c']
	},
	['column1', 'column2', 'column3']
);
const df2 = new DataFrame(
	{
	},
	[]
);
describe('getColumnNames  function tests', () => {
	it('with basic table', () => {
        data.set(df1);
        const { component } = render(sut);
        expect(component.getColumnNames(df1.listColumns())).toStrictEqual(['column1', 'column2']);
	});
    it('with empty table', () => {
        data.set(df2);
        const { component } = render(sut);
        expect(component.getColumnNames(df2.listColumns())).toStrictEqual([]);
	});
});
describe('getColumnData  function tests', () => {
	it('with basic table', () => {
        data.set(df1);
        const { component } = render(sut);
        expect(component.getColumnData(df1.listColumns())).toStrictEqual([[3, 6, 8], [3, 4, 5]]);
	});
    it('with empty table', () => {
        data.set(df2);
        const { component } = render(sut);
        expect(component.getColumnData(df2.listColumns())).toStrictEqual([]);
	});
});
describe('When user views', () => {
	it('should render', () => {
		const { container, getByTestId } = render(sut);
		expect(container).to.exist;
        expect(getByTestId("canvas-element")).to.exist;
	});
    it('warning shows', () => {
        data.set(df1);
		const { getByText } = render(sut);
        const warning = getByText("Warning: Column column3 doesn't contain numbers!")
        expect(warning).to.exist;
	});
});

