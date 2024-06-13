import { render } from '@testing-library/svelte';
import sut from './+page.svelte';
import { describe, it, expect } from 'vitest';
import { df } from '$lib/Store';
import { fromText } from '$lib/dataframe/DataFrame';
import * as h from './page.help';
import userEvent from '@testing-library/user-event';
import { get } from 'svelte/store';

describe('Select Visuals', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	it('should contain link to next page', async () => {
		const r = render(sut);
		const nextLink = h.getByTestId(r, 'next-link');

		expect(nextLink).toBeDefined();
		expect(nextLink).toHaveAttribute('href', '/view');
	});
	it('Numeric column should appear in gruop by and select', () => {
		df.set(fromText('col1,col2\nrow1,2'));
		const r = render(sut);

		expect(h.getDisplayValues(r, 'col2')!.length).toBe(2);
	});
	it('Non-numeric column should only appear in group by', () => {
		df.set(fromText('col1,col2\nrow1,2'));
		const r = render(sut);

		expect(h.getDisplayValues(r, 'col1')!.length).toBe(1);
	});
	it('Numeric should dissapear from select if clicked on group by', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\nrow1,2'));
		const r = render(sut);

		const checkbox = h.getCheckboxes(r)![1];
		await user.click(checkbox);

		await h.rerender(r);

		const radios = h.getRadios(r)!;

		// Only Frequency should be present
		expect(radios.length).toBe(1);
	});
	it('Groupby type should be binned when input in bin', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1\n1'));
		const r = render(sut);

		const checkbox = h.getCheckboxes(r)![0];
		await user.click(checkbox);

		await h.rerender(r);

		const binSize = h.getBinByPlaceHolder(r, '1')!;
		await user.type(binSize, '2');

		const columns = get(df.columns);
		expect(columns[0].groupBy!.type).toBe('binned');
	});
	it('Checking on non numeric column should keep it specific', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1\nrow1'));
		const r = render(sut);

		const checkbox = h.getCheckboxes(r)![0];
		await user.click(checkbox);

		const columns = get(df.columns);
		expect(columns[0].groupBy!.type).toBe('specific');
	});
	it('Checking on nothig should keep group by type undefined', async () => {
		df.set(fromText('col1\nrow1'));
		render(sut);

		const columns = get(df.columns);
		expect(columns[0].groupBy).toBe(undefined);
	});
});
