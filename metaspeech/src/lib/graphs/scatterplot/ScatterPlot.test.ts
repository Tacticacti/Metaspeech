import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/scatterplot/ScatterPlot.svelte';
import { describe, it, expect } from 'vitest';
import type { GroupedDataFrame, Column } from '$lib/Types';

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

	const data: GroupedDataFrame = {
		groups: [],
		groupedColumns: [columns[0]],
		aggregateColumn: columns[3]
	};

	it('should render', () => {
		const { container, getByTestId } = render(sut, {
			data
		});
		expect(container).to.exist;
		expect(getByTestId('canvas-element')).to.exist;
	});
});
