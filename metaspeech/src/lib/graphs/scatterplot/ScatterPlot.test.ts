import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/scatterplot/ScatterPlot.svelte';
import { /* vi, */ describe, it, expect } from 'vitest';
import type { GroupedDataFrame, Column } from '$lib/Types';
import userEvent from '@testing-library/user-event';
// import * as controller from '$lib/graphs/scatterplot/ScatterPlotController';
// import { scatterStyles } from '$lib/Constants';

// const spyFunction = vi.spyOn(controller, 'getScatterDatasets');

describe('When user views', () => {
	const columns: Column[] = [
		{
			name: 'Age',
			type: 'number',
			hasMissing: false,
			groupBy: undefined,
			aggregate: false
		},
		{
			name: 'Group',
			type: 'number',
			hasMissing: false,
			groupBy: undefined,
			aggregate: false
		},
		{
			name: 'Gender',
			type: 'string',
			hasMissing: false,
			groupBy: undefined,
			aggregate: false
		},
		{
			name: 'WER',
			type: 'number',
			hasMissing: false,
			groupBy: undefined,
			aggregate: false
		}
	];

	it('does not have legend, button does not show', async () => {
		const data: GroupedDataFrame = {
			groups: [],
			groupedColumns: [columns[0]],
			aggregateColumn: columns[3]
		};

		const { container, getByTestId, queryByTestId } = render(sut, {
			data
		});

		// expect(spyFunction).toHaveBeenCalledWith(data, columns[0], undefined, scatterStyles);

		expect(container).to.exist;
		expect(getByTestId('canvas-element')).to.exist;
		expect(queryByTestId('scatter-swap-columns')).not.toBeInTheDocument;
	});

	it('has a string legend, button does not show', () => {
		const data: GroupedDataFrame = {
			groups: [],
			groupedColumns: [columns[0], columns[2]],
			aggregateColumn: columns[3]
		};

		const { container, getByTestId, queryByTestId } = render(sut, {
			data
		});

		// expect(spyFunction).toHaveBeenCalledWith(data, columns[0], columns[2], scatterStyles);

		expect(container).to.exist;
		expect(getByTestId('canvas-element')).to.exist;
		expect(queryByTestId('scatter-swap-columns')).not.toBeInTheDocument;
	});

	it('has a numeric legend, button does not show', () => {
		const data: GroupedDataFrame = {
			groups: [],
			groupedColumns: [columns[0], columns[1]],
			aggregateColumn: columns[3]
		};

		const { container, getByTestId } = render(sut, {
			data
		});

		// expect(spyFunction).toHaveBeenCalledWith(data, columns[0], columns[1], scatterStyles);

		expect(container).to.exist;
		expect(getByTestId('canvas-element')).to.exist;
		expect(getByTestId('scatter-swap-columns')).to.exist;
	});

	it('user clicks to swap columns', async () => {
		const user = userEvent.setup();

		const data: GroupedDataFrame = {
			groups: [],
			groupedColumns: [columns[0], columns[1]],
			aggregateColumn: columns[3]
		};

		const { container, getByTestId } = render(sut, {
			data
		});

		await user.click(getByTestId('scatter-swap-columns'));

		// Called with swapped columns
		// expect(spyFunction).toHaveBeenNthCalledWith(2, data, columns[1], columns[0], scatterStyles);

		expect(container).to.exist;
	});
});
