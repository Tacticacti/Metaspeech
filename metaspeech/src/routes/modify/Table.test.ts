import { describe, it, expect, vi } from 'vitest';
import { df } from '$lib/Store';
import sut from './Table.svelte';
import { fireEvent, render } from '@testing-library/svelte';
import * as h from './Table.help';
import { fromText } from '$lib/dataframe/DataFrame';

vi.mock('$components/CustomVirtualList.svelte');

beforeEach(() => {
	vi.clearAllMocks();
});

describe('Table', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	it('should render a table with headers and rows based on provided data', async () => {
		// Create a mock DataFrame
		df.set(fromText('col1,col2\nRow1Col1,Row1Col2\nRow2Col1,Row2Col2'));
		const r = render(sut);

		// Check if headers are present
		expect(h.getHeaderInput(r, 'col1')).toBeDefined();
		expect(h.getHeaderInput(r, 'col2')).toBeDefined();

		// Check if data is present
		expect(h.getCell(r, 'Row1Col1')).toBeDefined();
		expect(h.getCell(r, 'Row1Col2')).toBeDefined();
		expect(h.getCell(r, 'Row2Col1')).toBeDefined();
		expect(h.getCell(r, 'Row2Col2')).toBeDefined();
	});
	it('should be able to render an empty table', async () => {
		df.set({ columns: [], rows: [] });
		const { container } = render(sut);

		expect(container).toBeTruthy();
	});
	it('should update the table when data updates', async () => {
		let mockData = fromText('col1\nRow1Col1');

		df.set(mockData);
		const r = render(sut);

		mockData = fromText('col1\nRow2Col1');

		df.set(mockData);
		await h.rerender(r);

		expect(h.getCell(r, 'Row1Col1')).toBeNull();
		expect(h.getCell(r, 'Row2Col1')).toBeDefined();
	});
	it('Should show how many items are visible in the table', () => {
		df.set(fromText('col1,col2\nRow1Col1,Row1Col2\nRow2Col1,Row2Col2'));
		const r = render(sut);

		expect(h.getByText(r, 'Showing 0-2 of 2 rows')).toBeVisible();
	});
	it('Should only contain row type 1 if one row', () => {
		df.set(fromText('col1,col2\nRow1Col1,Row1Col2'));
		const r = render(sut);

		expect(h.getRowType(r, '1')).toBeVisible();
	});
	it('Should only contain row type 1 and 2 if two rows', () => {
		df.set(fromText('col1,col2\nRow1Col1,Row1Col2\nRow2Col1,Row2Col2'));
		const r = render(sut);

		expect(h.getRowType(r, '1')).toBeVisible();
		expect(h.getRowType(r, '2')).toBeVisible();
	});
	it('Cells should exist', () => {
		df.set(fromText('col1,col2\nRow1Col1,Row1Col2\nRow2Col1,Row2Col2'));
		const r = render(sut);

		expect(h.getByText(r, 'Row1Col1')).toBeVisible();
		expect(h.getByText(r, 'Row1Col2')).toBeVisible();
		expect(h.getByText(r, 'Row2Col1')).toBeVisible();
		expect(h.getByText(r, 'Row2Col2')).toBeVisible();
	});
	it('Cells shouldnt exist if nothing in table', () => {
		df.set(fromText(''));
		const r = render(sut);

		expect(h.getByText(r, 'Row1Col1')).toBeNull();
		expect(h.getByText(r, 'Row1Col2')).toBeNull();
		expect(h.getByText(r, 'Row2Col1')).toBeNull();
		expect(h.getByText(r, 'Row2Col2')).toBeNull();
	});
});

describe('Deleting', () => {
	it('should be able to be deleted', async () => {
		df.set(fromText('col1,col2\nRow1Col1,Row1Col2\nRow2Col1,Row2Col2'));
		const r = render(sut);

		const deleteButton = h.getHeaderDeleteButton(r, 'col1');
		expect(deleteButton).toBeDefined();

		await fireEvent.click(deleteButton!);
		await h.rerender(r);
		expect(h.getHeaderInput(r, 'col1')).toBeNull();
	});
});

describe('Renaming', async () => {
	it('should be able to be renamed', async () => {
		df.set(fromText('col1,col2\nRow1Col1,Row1Col2\nRow2Col1,Row2Col2'));
		const r = render(sut);

		h.renameColumn(r, 'col1', 'newName');

		expect(h.getHeaderInput(r, 'newName')).toBeDefined();
	});
	it('should reset the column name when left empty', async () => {
		df.set(fromText('col1,col2\nRow1Col1,Row1Col2\nRow2Col1,Row2Col2'));
		const r = render(sut);

		h.renameColumn(r, 'col1', '');

		expect(h.getHeaderInput(r, 'col1')).toBeDefined();
	});
	it('should not allow renaming to an existing column name', async () => {
		df.set(fromText('col1,col2\nRow1Col1,Row1Col2\nRow2Col1,Row2Col2'));
		const r = render(sut);

		h.renameColumn(r, 'col1', 'col2');

		expect(h.getHeaderInput(r, 'col1')).toBeDefined();
	});
	it('should trim whitespace from the new column name', async () => {
		df.set(fromText('col1,col2\nRow1Col1,Row1Col2\nRow2Col1,Row2Col2'));
		const r = render(sut);

		h.renameColumn(r, 'col1', ' newName ');

		expect(h.getHeaderInput(r, 'newName')).toBeDefined();
	});
});
