import { render } from '@testing-library/svelte';
import sut from './+page.svelte';
import { describe, it, expect } from 'vitest';
import { fromText } from '$lib/dataframe/DataFrame';
import { df } from '$lib/Store';
import userEvent from '@testing-library/user-event';

describe('View', () => {
	it('should render', () => {
		const { container } = render(sut);
		expect(container).to.exist;
	});
	it('buttons exist', () => {
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		expect(r.getByText('Table')).to.exist;
		expect(r.getByText('Histogram')).to.exist;
		expect(r.getByText('Pie Chart')).to.exist;
		expect(r.getByText('Scatter')).to.exist;
		expect(r.getByText('Box Plot')).to.exist;
	});
	it('table should be enabled', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByText('Table');
		await user.hover(button);

		const tooltip = r.queryByTestId('Table-tooltip');
		expect(tooltip).not.to.exist;
	});
	it('histogram should be enabled', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByText('Histogram');
		await user.hover(button);

		const tooltip = r.queryByTestId('Histogram-tooltip');
		expect(tooltip).not.to.exist;
	});
	it('pie chart should not be enabled', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByText('Pie Chart');
		await user.hover(button);

		const tooltip = r.queryByTestId('Pie Chart-tooltip');
		expect(tooltip).to.exist;
	});
	it('scatter should not be enabled', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByText('Scatter');
		await user.hover(button);

		const tooltip = r.queryByTestId('Scatter-tooltip');
		expect(tooltip).to.exist;
	});
	it('box plot should not be enabled', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByText('Box Plot');
		await user.hover(button);

		const tooltip = r.queryByTestId('Box Plot-tooltip');
		expect(tooltip).to.exist;
	});
});
