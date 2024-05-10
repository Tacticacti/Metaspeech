import { act, render } from '@testing-library/svelte';
import TableView from './TableView.svelte';
import DataFrame from 'dataframe-js';
import '@testing-library/jest-dom';
import { writable } from 'svelte/store';

describe('TableView', () => {
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
		const { getByText } = render(TableView, { data: writable(mockData) });

		// Check if headers are present
		expect(getByText('col1')).toBeInTheDocument();
		expect(getByText('col2')).toBeInTheDocument();

		// Check if data is present
		expect(getByText('Row1Col1')).toBeInTheDocument();
		expect(getByText('Row1Col2')).toBeInTheDocument();
		expect(getByText('Row2Col1')).toBeInTheDocument();
		expect(getByText('Row2Col2')).toBeInTheDocument();
	});
	it('should update the table when the data store is updated', async () => {
		const df = writable(new DataFrame([{ a: '1', b: '2', c: '3' }]));
		const { getByText, component } = render(TableView, { data: df });
		df.set(new DataFrame([{ a: '4', b: '5', c: '6' }]));
		await act(() => component.$set({ data: df }));

		expect(getByText('4')).toBeInTheDocument();
	});
	it('should be able to render an empty table', async () => {
		const df = writable(new DataFrame([]));
		const { container } = render(TableView, { data: df });

		expect(container).toBeTruthy();
	});
	it('should not fail with undefined or null', async () => {
		const df = writable(new DataFrame([{ a: undefined, b: null }]));
		const { component } = render(TableView, { data: df });
		expect(component).toBeTruthy();
	});
});
