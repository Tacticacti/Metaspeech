import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/scatter/Scatter.svelte';
import { data } from '$lib/Store';
import userEvent from '@testing-library/user-event';
import DataFrame from 'dataframe-js';
import { selectedColumns } from '$lib/Store';

const df = new DataFrame(
	{
		column1: [3, 6, 8],
		column2: [3, 4, 5],
		column3: ['a', 'b', 'c']
	},
	['column1', 'column2', 'column3']
);

data.set(df);
describe('Scatter tests', () => {
	let page: RenderResult;
	beforeEach(async () => {
		data.set(df);
		selectedColumns.set(['column1', 'column2', 'column3']);
		page = render(sut);
	});

	it('2 selects exist', () => {
		const selectElements = page.container.querySelectorAll('select');
		expect(selectElements.length).toEqual(2);
	});

	it('all 6 options exist', () => {
		const optionElements = page.container.querySelectorAll('option');
		expect(optionElements.length).toEqual(6);
	});

	it('first select default value is first column', () => {
		const firstSelect = page.getByTestId('first-select') as HTMLSelectElement;
		expect(firstSelect.value).toEqual('column1');
	});

	it('second select default value is second column', () => {
		const secondSelect = page.getByTestId('second-select') as HTMLSelectElement;
		expect(secondSelect.value).toEqual('column2');
	});

	it('First and second select have first column', () => {
		const column1options = page.getAllByText('column1');
		expect(column1options.length).toEqual(2);
	});

	it('First and second select have second column', () => {
		const column2options = page.getAllByText('column2');
		expect(column2options.length).toEqual(2);
	});

	it('canvas wrapper exists', () => {
		const canvas = page.getByTestId('canvas-element');
		expect(canvas).to.exist;
	});

	it('clicking on option changes value of select 1', async () => {
		const user = userEvent.setup();
		const firstSelect = page.getByTestId('first-select') as HTMLSelectElement;
		await user.selectOptions(firstSelect, ['column2']);
		expect(firstSelect.value).toEqual('column2');
	});

	it('should update x_axis when the first select element value changes', async () => {
		const user = userEvent.setup();
		const firstSelect = page.getByTestId('first-select') as HTMLSelectElement;
		const initialValue = firstSelect.value;
		await user.selectOptions(firstSelect, ['column2']);
		expect(firstSelect.value).not.toBe(initialValue);
	});

	it('clicking on option changes value of select 2', async () => {
		const user = userEvent.setup();
		const secondSelect = page.getByTestId('second-select') as HTMLSelectElement;
		await user.selectOptions(secondSelect, ['column1']);
		expect(secondSelect.value).toEqual('column1');
	});

	it('clicking on option changes value of select 2', async () => {
		const user = userEvent.setup();
		const secondSelect = page.getByTestId('second-select') as HTMLSelectElement;
		await user.selectOptions(secondSelect, ['column1']);
		expect(secondSelect.value).toEqual('column1');
	});
});
