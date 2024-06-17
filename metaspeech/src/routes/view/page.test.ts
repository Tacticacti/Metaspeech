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

		expect(r.getByTestId('Table')).to.exist;
		expect(r.getByTestId('Histogram')).to.exist;
		expect(r.getByTestId('Pie Chart')).to.exist;
		expect(r.getByTestId('Scatter')).to.exist;
		expect(r.getByTestId('Box Plot')).to.exist;
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

		const button = r.getByTestId('Histogram');
		await user.hover(button);

		const tooltip = r.queryByTestId('Histogram-tooltip');
		expect(tooltip).not.to.exist;
	});
	it('pie chart should not be enabled', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByTestId('Pie Chart');
		await user.hover(button);

		const tooltip = r.queryByTestId('Pie Chart-tooltip');
		expect(tooltip).to.exist;
	});
	it('scatter should not be enabled', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByTestId('Scatter');
		await user.hover(button);

		const tooltip = r.queryByTestId('Scatter-tooltip');
		expect(tooltip).to.exist;
	});
	it('box plot should not be enabled', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByTestId('Box Plot');
		await user.hover(button);

		const tooltip = r.queryByTestId('Box Plot-tooltip');
		expect(tooltip).to.exist;
	});
	it('description exists when hovering over graph', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByTestId('Box Plot');
		await user.hover(button);

		const description = r.queryByTestId('description-chart');
		expect(description).to.exist;
	});
	it('name exists when hovering over graph', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByTestId('Box Plot');
		await user.hover(button);

		const name = r.queryByTestId('name-chart');
		expect(name).to.exist;
	});
	it('container is rendered', async () => {
		const user = userEvent.setup();
		df.set(fromText('col1,col2\n1,2'));
		df.groupBy();
		const r = render(sut);

		const button = r.getByTestId('Histogram');
		await user.click(button);

		const container = r.queryByTestId('graph-container');
		expect(container).to.exist;
	});
});
