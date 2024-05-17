import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/svelte';
import DataFrame from 'dataframe-js';
import { data } from '$lib/Store';
import sut from './+page.svelte';
import { goto } from '$app/navigation';
import '@testing-library/jest-dom';
import { get } from 'svelte/store';

vi.mock('$lib/importer/Importer.svelte');
vi.mock('$app/navigation');

beforeEach(() => {
	sessionStorage.clear();
});

describe('Modify', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	it('should have a button that directs to view', async () => {
		const { getByText } = render(sut);
		const button = getByText('Next');
		expect(button).to.exist;
		await fireEvent.click(button);
		expect(goto).toHaveBeenCalledWith('/view');
	});
	it('should render a table with headers and rows based on provided data', async () => {
		// Create a mock DataFrame
		const mockData = new DataFrame(
			[
				{ col1: 'Row1Col1', col2: 'Row1Col2' },
				{ col1: 'Row2Col1', col2: 'Row2Col2' }
			],
			['col1', 'col2']
		);

		// Render the component with mock data
		data.set(mockData);
		const { getByText, getByDisplayValue } = render(sut);

		// Check if headers are present
		expect(getByDisplayValue('col1')).toBeInTheDocument();
		expect(getByDisplayValue('col2')).toBeInTheDocument();

		// Check if data is present
		expect(getByText('Row1Col1')).toBeInTheDocument();
		expect(getByText('Row1Col2')).toBeInTheDocument();
		expect(getByText('Row2Col1')).toBeInTheDocument();
		expect(getByText('Row2Col2')).toBeInTheDocument();
	});
	it('should be able to render an empty table', async () => {
		const df = new DataFrame([]);
		data.set(df);
		const { container } = render(sut);

		expect(container).toBeTruthy();
	});
	it('should not fail with undefined or null', async () => {
		const df = new DataFrame([{ a: undefined, b: null }]);
		data.set(df);
		const { component } = render(sut);
		expect(component).toBeTruthy();
	});
	it('should allow changing the column name', async () => {
		const df = new DataFrame([{ a: 1, b: 2 }]);
		data.set(df);
		const { getByDisplayValue, component } = render(sut);

		const input = getByDisplayValue('a');
		await fireEvent.change(input, { target: { value: 'newName' } });

		act(() => component.$set({}));

		expect(getByDisplayValue('newName')).toBeInTheDocument();
	});
	it('should allow deleting a column', async () => {
		const df = new DataFrame([{ a: 1, b: 2 }]);
		data.set(df);
		const { getByText, getAllByText } = render(sut);

		const button = getAllByText('X');
		await fireEvent.click(button[0]);
		await fireEvent.click(getByText('Next'));

		expect(get(data).toText()).toEqual('b\n2');
	});
	it('should reset the column name when left empty', async () => {
		const df = new DataFrame([{ a: 1, b: 2 }]);
		data.set(df);
		const { getByDisplayValue, component } = render(sut);

		const input = getByDisplayValue('a');
		await fireEvent.change(input, { target: { value: '' } });

		act(() => component.$set({}));

		expect(getByDisplayValue('a')).toBeInTheDocument();
	});
	it('should reset the column name when left whitespace', async () => {
		const df = new DataFrame([{ a: 1, b: 2 }]);
		data.set(df);
		const { getByDisplayValue, component } = render(sut);

		const input = getByDisplayValue('a');
		await fireEvent.change(input, { target: { value: '  ' } });

		act(() => component.$set({}));

		expect(getByDisplayValue('a')).toBeInTheDocument();
	});
	it('should reset the column name when same as other column', async () => {
		const df = new DataFrame([{ a: 1, b: 2 }]);
		data.set(df);
		const { getByDisplayValue, component } = render(sut);

		const input = getByDisplayValue('a');
		await fireEvent.change(input, { target: { value: 'b' } });

		await act(() => component.$set({}));

		expect(getByDisplayValue('a')).toBeInTheDocument();
	});
	it('should be able to clean the data', async () => {
		const df = new DataFrame([
			{ a: 1, b: 2 },
			{ a: 3, b: undefined }
		]);
		data.set(df);
		const { getByText, component } = render(sut);

		const cleanButton = getByText('Remove missing values');
		expect(cleanButton).toBeInTheDocument();

		await fireEvent.click(cleanButton);
		await fireEvent.click(getByText('Next'));

		await act(() => component.$set({}));

		expect(get(data).toText()).toEqual('a;b\n1;2');
	});
	it('should be able to row-merge two DataFrames', async () => {
		const df1 = new DataFrame([{ d: 4, e: 5 }]);
		data.set(df1);
		const { getByText, component, getByTestId } = render(sut);

		await fireEvent.input(getByTestId('file-input'));

		act(() => component.$set({}));

		const mergeButton = getByText('row-wise merge');
		expect(mergeButton).toBeInTheDocument();

		await fireEvent.click(mergeButton);
		await fireEvent.click(getByText('Next'));

		await act(() => component.$set({}));

		expect(get(data).toText()).toEqual('d;e;a;b;c\n4;5;1;2;3');
	});
	it('should be able to column-merge two DataFrames', async () => {
		const df1 = new DataFrame([{ a: '1', d: '4' }]);
		data.set(df1);
		const { getByText, component, getByTestId } = render(sut);

		await fireEvent.input(getByTestId('file-input'));

		act(() => component.$set({}));

		const mergeButton = getByText('join columns');
		expect(mergeButton).toBeInTheDocument();

		await fireEvent.click(mergeButton);
		await fireEvent.click(getByText('Next'));

		await act(() => component.$set({}));

		expect(get(data).toText()).toEqual('a;d;b;c\n1;4;2;3');
	});
	it('should be able to column-merge two DataFrames when col-names differ', async () => {
		const df1 = new DataFrame([{ d: '1', e: '4' }]);
		data.set(df1);
		const { getByText, component, getByTestId } = render(sut);

		await fireEvent.input(getByTestId('file-input'));

		act(() => component.$set({}));

		const mergeButton = getByText('join columns');
		expect(mergeButton).toBeInTheDocument();

		await fireEvent.click(mergeButton);
		await fireEvent.click(getByText('Next'));

		await act(() => component.$set({}));

		expect(get(data).toText()).toEqual('d;e;b;c\n1;4;2;3');
	});
});
