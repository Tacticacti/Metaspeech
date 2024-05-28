// import { it, expect } from 'vitest';
// import { render, screen } from '@testing-library/svelte';
// import sut from '$lib/graphs/Stem/Stem.svelte';
// import { data } from '$lib/Store';
// import userEvent from '@testing-library/user-event';
// import DataFrame from 'dataframe-js';
// import type { RenderResult } from '@testing-library/svelte';

// const df = new DataFrame(
// 	{
// 		column1: [3, 6, 8],
// 		column2: [3, 4, 5]
// 	},
// 	['column1', 'column2']
// );

// describe('Stem tests', () => {
// 	let page: RenderResult;
// 	beforeEach(async () => {
// 		data.set(df);
// 		page = render(sut);
// 		const user = userEvent.setup();
// 		await user.click(page.getByTestId('check-column1'));
// 		await user.click(page.getByTestId('check-column2'));
// 	});
// 	it('2 selects exist', async () => {
// 		const selectElements = page.container.querySelectorAll('select');
// 		expect(selectElements.length).toEqual(2);
// 	});

// 	it('all 4 options exist', () => {
// 		const optionElements = page.container.querySelectorAll('option');
// 		expect(optionElements.length).toEqual(4);
// 	});

// 	it('first select default value is empty string', () => {
// 		const firstSelect = page.getByTestId('first-select') as HTMLSelectElement;
// 		expect(firstSelect.value).toEqual('');
// 	});

// 	it('second select default value is empty string', () => {
// 		const secondSelect = page.getByTestId('second-select') as HTMLSelectElement;
// 		expect(secondSelect.value).toEqual('');
// 	});

// 	it('First and second select have first column + also from columnSelector', () => {
// 		const column1options = page.getAllByText('column1');
// 		expect(column1options.length).toEqual(2 + 1);
// 	});

// 	it('First and second select have second column + also from columnSelector', () => {
// 		const column2options = page.getAllByText('column2');
// 		expect(column2options.length).toEqual(2 + 1);
// 	});

// 	it('canvas wrapper exists', () => {
// 		const canvas = page.getByTestId('canvas-element');
// 		expect(canvas).to.exist;
// 	});

// 	it('clicking on option changes value of select 1', async () => {
// 		const user = userEvent.setup();
// 		const firstSelect = page.getByTestId('first-select') as HTMLSelectElement;
// 		await user.selectOptions(firstSelect, ['column2']);
// 		expect(firstSelect.value).toEqual('column2');
// 	});

// 	it('should update x_axis when the first select element value changes', async () => {
// 		const user = userEvent.setup();
// 		const firstSelect = page.getByTestId('first-select') as HTMLSelectElement;
// 		const initialValue = firstSelect.value;
// 		await user.selectOptions(firstSelect, ['column2']);
// 		expect(firstSelect.value).not.toBe(initialValue);
// 	});

// 	it('clicking on option changes value of select 2', async () => {
// 		const user = userEvent.setup();
// 		const secondSelect = page.getByTestId('second-select') as HTMLSelectElement;
// 		await user.selectOptions(secondSelect, ['column1']);
// 		expect(secondSelect.value).toEqual('column1');
// 	});

// 	it('clicking on option changes value of select 2', async () => {
// 		const user = userEvent.setup();
// 		const secondSelect = page.getByTestId('second-select') as HTMLSelectElement;
// 		await user.selectOptions(secondSelect, ['column1']);
// 		expect(secondSelect.value).toEqual('column1');
// 	});

// 	it('png button for downloading exists', () => {
// 		const button = page.getByText('PNG');
// 		expect(button).to.exist;
// 	});

// 	it('jpg button for downloading exists', () => {
// 		const button = page.getByText('JPG');
// 		expect(button).to.exist;
// 	});

// 	it('png button gets clicked', async () => {
// 		const user = userEvent.setup();
// 		const button = page.getByText('PNG');

// 		await user.click(button);

// 		const expectedDiv = page.getByTestId('download-function-called');
// 		expect(expectedDiv).to.exist;
// 	});

// 	it('jpg button gets clicked', async () => {
// 		const user = userEvent.setup();
// 		const button = page.getByText('JPG');

// 		await user.click(button);

// 		const expectedDiv = page.getByTestId('download-function-called');
// 		expect(expectedDiv).to.exist;
// 	});

// 	it('if no button is not clicked download is not called', () => {
// 		const expectedDiv = screen.queryAllByTestId('download-function-called');
// 		expect(expectedDiv).toHaveLength(0);
// 	});
// });
