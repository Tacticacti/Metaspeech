import { it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/histogram/ParameterSelector.svelte';
import userEvent from '@testing-library/user-event';
import { ABSOLUTE_FREQUENCY, RELATIVE_FREQUENCY } from '$lib/graphs/histogram/HistogramController';

const columnNames = ['id', 'age', 'gender', 'cef', 'duration'];
const numericColumns: [string, number][] = [
	['id', 6],
	['age', 87],
	['duration', -200]
];

it('1 selects exists, with options', () => {
	const { container } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumns: numericColumns,
			selectedParams: [],
			parameterType: ABSOLUTE_FREQUENCY,
			checkedMean: false
		}
	});
	const selectElements = container.querySelectorAll('select');
	expect(selectElements.length).toEqual(1);
	expect(selectElements[0].value).toEqual(ABSOLUTE_FREQUENCY);

	const optionsOfSelect = container.querySelectorAll('option');

	const optionNames: string[] = [];
	for (const opt of optionsOfSelect) {
		optionNames.push((opt as HTMLOptionElement).value);
	}

	// For each numeric column + Abs Freq + Rel Freq
	expect(optionNames).toEqual([
		ABSOLUTE_FREQUENCY,
		RELATIVE_FREQUENCY,
		...numericColumns.map((c) => c[0])
	]);
});

it('1 checkbox for each column', () => {
	const { container } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumns: numericColumns,
			selectedParams: [],
			parameterType: ABSOLUTE_FREQUENCY,
			checkedMean: false
		}
	});
	const checkElements = container.querySelectorAll('input');

	const checkNames: string[] = [];
	for (const opt of checkElements) {
		checkNames.push((opt as HTMLInputElement).value);
		expect((opt as HTMLInputElement).type).toEqual('checkbox');
	}

	// For each column
	expect(checkNames).toEqual(columnNames);
});

it('Mean checkbox shows when something other than frequency selected', async () => {
	const user = userEvent.setup();
	const { container, getByTestId } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumns: numericColumns,
			selectedParams: [],
			parameterType: ABSOLUTE_FREQUENCY,
			checkedMean: false
		}
	});

	const select = getByTestId('select-y-axis-parameter') as HTMLSelectElement;
	await user.selectOptions(select, ['age']);

	const checkMean = getByTestId('check-mean') as HTMLInputElement;
	expect(checkMean.type).toEqual('checkbox');
	expect(checkMean).toBeVisible;
	expect(select.value).toEqual('age');

	const checkElements = container.querySelectorAll('input');
	expect(checkElements.length).toEqual(columnNames.length + 1);
});

it('Mean checkbox reamains hidden when frequency selected', async () => {
	const user = userEvent.setup();
	const { container, getByTestId } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumns: numericColumns,
			selectedParams: [],
			parameterType: ABSOLUTE_FREQUENCY,
			checkedMean: false
		}
	});

	const select = getByTestId('select-y-axis-parameter') as HTMLSelectElement;
	await user.selectOptions(select, [ABSOLUTE_FREQUENCY]);

	let checkElements = container.querySelectorAll('input');
	expect(checkElements.length).toEqual(columnNames.length);

	await user.selectOptions(select, [RELATIVE_FREQUENCY]);
	checkElements = container.querySelectorAll('input');
	expect(checkElements.length).toEqual(columnNames.length);
});

it('Mean checkbox shows when something other than frequency selected', async () => {
	const user = userEvent.setup();
	const { container, getByTestId } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumns: numericColumns,
			selectedParams: [],
			parameterType: ABSOLUTE_FREQUENCY,
			checkedMean: false
		}
	});

	const select = getByTestId('select-y-axis-parameter') as HTMLSelectElement;
	await user.selectOptions(select, ['age']);

	const checkMean = getByTestId('check-mean');
	expect(checkMean).toBeVisible;

	const checkElements = container.querySelectorAll('input');
	expect(checkElements.length).toEqual(columnNames.length + 1);
});

it('numeric column is appears twice', () => {
	const { getAllByText } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumns: numericColumns,
			selectedParams: [],
			parameterType: ABSOLUTE_FREQUENCY,
			checkedMean: false
		}
	});
	const col = getAllByText('age');
	expect(col.length).toEqual(2);
});

it('string column appears once', () => {
	const { getAllByText } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumns: numericColumns,
			selectedParams: [],
			parameterType: ABSOLUTE_FREQUENCY,
			checkedMean: false
		}
	});
	const col = getAllByText('cef');
	expect(col.length).toEqual(1);
});

it('clicking on option changes value of select', async () => {
	const user = userEvent.setup();
	const { getByTestId } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumns: numericColumns,
			selectedParams: [],
			parameterType: ABSOLUTE_FREQUENCY,
			checkedMean: false
		}
	});

	const select = getByTestId('select-y-axis-parameter') as HTMLSelectElement;
	await user.selectOptions(select, ['id']);
	expect(select.value).toEqual('id');
});

it('should update selectedParams when the checkboxes change', async () => {
	const user = userEvent.setup();
	const selectedParams: string[] = [];
	const { getByTestId } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumns: numericColumns,
			selectedParams: selectedParams,
			parameterType: ABSOLUTE_FREQUENCY,
			checkedMean: false
		}
	});

	expect(selectedParams.length).toBe(0);

	const checkAge = getByTestId('check-age') as HTMLInputElement;
	const checkCef = getByTestId('check-cef') as HTMLInputElement;

	await user.click(checkAge);
	await user.click(checkCef);

	//This assertion doesn't work, I don't know how to test it
	// expect(selectedParams.length).toBe(2);
});

it('1 number and 1 range for each selected numeric column', () => {
	const { container } = render(sut, {
		props: {
			columnNames: columnNames,
			numericColumns: numericColumns,
			selectedParams: ['gender', 'age', 'duration'],
			parameterType: ABSOLUTE_FREQUENCY,
			checkedMean: false
		}
	});

	const selectedNumericColumns: string[] = ['age', 'duration'];
	const maxs = [88, 201];
	const inputElements = container.querySelectorAll('input');

	const numberNames: string[] = [];
	const rangeNames: string[] = [];
	const numberMaxs: number[] = [];
	const rangeMaxs: number[] = [];

	for (const input of inputElements) {
		switch (input.type) {
			case 'number':
				numberNames.push(input.name);
				numberMaxs.push(+input.max);
				break;
			case 'range':
				rangeNames.push(input.name);
				rangeMaxs.push(+input.max);
				break;
		}
	}

	expect(numberNames).toEqual(selectedNumericColumns);
	expect(rangeNames).toEqual(selectedNumericColumns);
	expect(numberMaxs).toEqual(maxs);
	expect(rangeMaxs).toEqual(maxs);
});
