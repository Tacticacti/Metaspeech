import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/histogram/ParameterSelector.svelte';
//import userEvent from '@testing-library/user-event';

const columnNames = ['id', 'age', 'gender', 'cef', 'duration'];
const numericColumnNames = ['id', 'age', 'duration'];

it('1 selects exists', () => {
	const { container } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumnNames: numericColumnNames,
			selectedParams: [],
			parameterType: 'Absolute Frequency',
			checkedMean: false
		}
	});
	const selectElements = container.querySelectorAll('select');
	expect(selectElements.length).toEqual(1);
});

// it('all 2 options exist', () => {
// 	const { container } = render(sut);
// 	const optionElements = container.querySelectorAll('option');
// 	expect(optionElements.length).toEqual(2);
// });

// it('first select default value is first column', () => {
// 	const { getByTestId } = render(sut);
// 	const firstSelect = getByTestId('first-select') as HTMLSelectElement;
// 	expect(firstSelect.value).toEqual('column1');
// });

// it('column1 is only repeated once', () => {
// 	const { getAllByText } = render(sut);
// 	const column1options = getAllByText('column1');
// 	expect(column1options.length).toEqual(1);
// });

// it('column2 is only repeated once', () => {
// 	const { getAllByText } = render(sut);
// 	const column2options = getAllByText('column2');
// 	expect(column2options.length).toEqual(1);
// });

// it('clicking on option changes value of select 1', async () => {
// 	const user = userEvent.setup();
// 	const { getByTestId } = render(sut);
// 	const firstSelect = getByTestId('first-select') as HTMLSelectElement;
// 	await user.selectOptions(firstSelect, ['column2']);
// 	expect(firstSelect.value).toEqual('column2');
// });

// shoudl change selectedParams when...
// it('should update x_axis when the first select element value changes', async () => {
// 	const user = userEvent.setup();
// 	const { getByTestId } = render(sut);
// 	const firstSelect = getByTestId('first-select') as HTMLSelectElement;
// 	const initialValue = firstSelect.value;
// 	await user.selectOptions(firstSelect, ['column2']);
// 	expect(firstSelect.value).not.toBe(initialValue);
// });
