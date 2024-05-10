import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import DataFrame from 'dataframe-js';
import { data } from '$lib/Store';
import sut from './+page.svelte';
import { goto } from '$app/navigation';
import '@testing-library/jest-dom';

vi.mock('$lib/tableview/TableView.svelte');
vi.mock('$app/navigation');

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
});
