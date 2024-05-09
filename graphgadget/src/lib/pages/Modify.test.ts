import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { state, StateEnum } from '$lib/Store';
import DataFrame from 'dataframe-js';
import { data } from '$lib/Store';
import sut from './Modify.svelte';

vi.mock('$lib/tableview/TableView.svelte');

describe('Modify', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	it('should have a button that changes state on click', async () => {
		const { getByText } = render(sut);
		const button = getByText('Next');
		expect(button).to.exist;
		await fireEvent.click(button);
		expect(get(state)).toEqual(StateEnum.view);
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
});
