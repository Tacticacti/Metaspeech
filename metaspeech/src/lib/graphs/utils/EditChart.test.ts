import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/utils/EditChart.svelte';
import { describe, it, expect } from 'vitest';
import * as h from './EditChart.help';
import userEvent from '@testing-library/user-event';
import { Chart } from 'chart.js';

const testChart = new Chart('testChart', {
	type: 'scatter',
	data: {
		labels: ['a'],
		datasets: [
			{
				label: 'testSet',
				data: [1]
			}
		]
	},
	options: {}
});

describe('Title input show up for graphs except table', () => {
	it('Has title input for every graph', async () => {
		const user = userEvent.setup();
		const r = render(sut, { chart: testChart, chartType: 'histogram' });
		const editButton = h.getEditButton(r)!;

		await user.click(editButton);
		expect(h.getInput(r, 'title')).to.exist;
	});
	it('Has title input for every graph', async () => {
		const user = userEvent.setup();
		const r = render(sut, { chart: testChart, chartType: 'scatter' });
		const editButton = h.getEditButton(r)!;

		await user.click(editButton);
		expect(h.getInput(r, 'title')).to.exist;
	});
	it('Has title input for every graph', async () => {
		const user = userEvent.setup();
		const r = render(sut, { chart: testChart, chartType: 'pie' });
		const editButton = h.getEditButton(r)!;

		await user.click(editButton);
		expect(h.getInput(r, 'title')).to.exist;
	});
	it('Has title input for every graph', async () => {
		const user = userEvent.setup();
		const r = render(sut, { chart: testChart, chartType: 'boxplot' });
		const editButton = h.getEditButton(r)!;

		await user.click(editButton);
		expect(h.getInput(r, 'title')).to.exist;
	});
	it('Has title input for every graph', async () => {
		const user = userEvent.setup();
		const r = render(sut, { chart: testChart, chartType: 'table' });
		const editButton = h.getEditButton(r)!;

		await user.click(editButton);
		expect(h.getInput(r, 'title')).not.to.exist;
	});
});

describe('Save button show up for graphs except table', () => {
	it('Has Save button for every graph', async () => {
		const user = userEvent.setup();
		const r = render(sut, { chart: testChart, chartType: 'histogram' });
		const editButton = h.getEditButton(r)!;

		await user.click(editButton);
		expect(h.getSaveButton(r)).to.exist;
	});
	it('Has Save button for every graph', async () => {
		const user = userEvent.setup();
		const r = render(sut, { chart: testChart, chartType: 'scatter' });
		const editButton = h.getEditButton(r)!;

		await user.click(editButton);
		expect(h.getSaveButton(r)).to.exist;
	});
	it('Has Save button for every graph', async () => {
		const user = userEvent.setup();
		const r = render(sut, { chart: testChart, chartType: 'pie' });
		const editButton = h.getEditButton(r)!;

		await user.click(editButton);
		expect(h.getSaveButton(r)).to.exist;
	});
	it('Has Save button for every graph', async () => {
		const user = userEvent.setup();
		const r = render(sut, { chart: testChart, chartType: 'boxplot' });
		const editButton = h.getEditButton(r)!;

		await user.click(editButton);
		expect(h.getSaveButton(r)).to.exist;
	});

	it('Has Save button for every graph', async () => {
		const user = userEvent.setup();
		const r = render(sut, { chart: testChart, chartType: 'table' });
		const editButton = h.getEditButton(r)!;

		await user.click(editButton);
		expect(h.getSaveButton(r)).not.to.exist;
	});
});
