import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/scatter/Scatter.svelte';
import { data } from '$lib/Store';
import userEvent from '@testing-library/user-event';
import DataFrame from 'dataframe-js';

const df = new DataFrame(
	{
		column1: [3, 6, 8],
		column2: [3, 4, 5],
		column3: ['a', 'b', 'c']
	},
	['column1', 'column2', 'column3']
);

data.set(df);

it('2 selects exist', () => {
	const { container } = render(sut);
	const selectElements = container.querySelectorAll('select');
	expect(selectElements.length).toEqual(2);
});

it('all 6 options exist', () => {
	const { container } = render(sut);
	const optionElements = container.querySelectorAll('option');
	expect(optionElements.length).toEqual(6);
});

it('first select default value is first column', () => {
	const { getByTestId } = render(sut);
	const firstSelect = getByTestId('first-select') as HTMLSelectElement;
	expect(firstSelect.value).toEqual('column1');
});

it('second select default value is second column', () => {
	const { getByTestId } = render(sut);
	const secondSelect = getByTestId('second-select') as HTMLSelectElement;
	expect(secondSelect.value).toEqual('column2');
});

it('First and second select have first column', () => {
	const { getAllByText } = render(sut);
	const column1options = getAllByText('column1');
	expect(column1options.length).toEqual(2);
});

it('First and second select have second column', () => {
	const { getAllByText } = render(sut);
	const column2options = getAllByText('column2');
	expect(column2options.length).toEqual(2);
});

it('canvas wrapper exists', () => {
	const { getByTestId } = render(sut);
	const canvas = getByTestId('canvas-element');
	expect(canvas).to.exist;
});

it('clicking on option changes value of select 1', async () => {
	const user = userEvent.setup();
	const { getByTestId } = render(sut);
	const firstSelect = getByTestId('first-select') as HTMLSelectElement;
	await user.selectOptions(firstSelect, ['column2']);
	expect(firstSelect.value).toEqual('column2');
});

it('should update x_axis when the first select element value changes', async () => {
	const user = userEvent.setup();
	const { getByTestId } = render(sut);
	const firstSelect = getByTestId('first-select') as HTMLSelectElement;
	const initialValue = firstSelect.value;
	await user.selectOptions(firstSelect, ['column2']);
	expect(firstSelect.value).not.toBe(initialValue);
});

it('clicking on option changes value of select 2', async () => {
	const user = userEvent.setup();
	const { getByTestId } = render(sut);
	const secondSelect = getByTestId('second-select') as HTMLSelectElement;
	await user.selectOptions(secondSelect, ['column1']);
	expect(secondSelect.value).toEqual('column1');
});

it('clicking on option changes value of select 2', async () => {
	const user = userEvent.setup();
	const { getByTestId } = render(sut);
	const secondSelect = getByTestId('second-select') as HTMLSelectElement;
	await user.selectOptions(secondSelect, ['column1']);
	expect(secondSelect.value).toEqual('column1');
});

it('clicking on option in first select which doesnt have number entries gives warning', async () => {
	const user = userEvent.setup();
	const { getByTestId } = render(sut);

	const firstSelect = getByTestId('first-select');
	const x_axis_warning = getByTestId('x-axis-warning');

	await user.selectOptions(firstSelect, ['column1']);

	expect(x_axis_warning.innerHTML).toBe('');

	await user.selectOptions(firstSelect, ['column3']);

	expect(x_axis_warning.innerHTML).toBe('Warning: x_axis is not a number!');
});

it('clicking on option in second select which doesnt have number entries gives warning', async () => {
	const user = userEvent.setup();
	const { getByTestId } = render(sut);

	const secondSelect = getByTestId('second-select');
	const y_axis_warning = getByTestId('y-axis-warning');

	await user.selectOptions(secondSelect, ['column1']);

	expect(y_axis_warning.innerHTML).toBe('');

	await user.selectOptions(secondSelect, ['column3']);

	expect(y_axis_warning.innerHTML).toBe('Warning: y_axis is not a number!');
});
