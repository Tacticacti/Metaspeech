import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import DataFrame from 'dataframe-js';
import { data } from '$lib/Store';
import sut from './+page.svelte';
import { goto } from '$app/navigation';
import { act } from '@testing-library/svelte';

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
	it('should contain TableView', async () => {
		const { getByTestId } = render(sut);
		const table = getByTestId('placeholder-table');
		expect(table).to.exist;
	});
	it('should pass data to TableView', async () => {
		const df = new DataFrame([{ a: '1', b: '2', c: '3' }]);
		data.set(df);

		const { getByTestId } = render(sut);
		const table = getByTestId('placeholder-table');

		expect(table.textContent).toBe(df.toText());
	});
	it('should update the passed data', async () => {
		let df = new DataFrame([{ a: '1', b: '2', c: '3' }]);
		data.set(df);

		const { getByTestId, component } = render(sut);
		const table = getByTestId('placeholder-table');

		df = new DataFrame([{ a: '4', b: '5', c: '6' }]);
		data.set(df);

		await act(() => component.$set({}));

		expect(table.textContent).toBe(df.toText());
	});
});
