import { render } from '@testing-library/svelte';
import PieChart from '$lib/graphs/piechart/PieChart.svelte';
import { describe, it, expect } from 'vitest';
import type { GroupedDataFrame } from '$lib/Types';

describe('PieChart', () => {
	const sampleData: GroupedDataFrame = {
		groups: [
			{ keys: ['A'], values: [10, 20, 30] },
			{ keys: ['B'], values: [15, 25, 35] },
			{ keys: ['C'], values: [20, 30, 40] },
			{ keys: ['D'], values: [25, 35, 45] },
			{ keys: ['E'], values: [30, 40, 50] },
			{ keys: ['F'], values: [35, 45, 55] },
			{ keys: ['G'], values: [40, 50, 60] }
		],
		groupedColumns: [{ name: 'Category', type: 'string', hasMissing: false }],
		aggregateColumn: { name: 'Value', type: 'number', hasMissing: false }
	};

	it('should render the chart with the provided data', () => {
		const { getByTestId } = render(PieChart, { data: sampleData });
		const canvas = getByTestId('canvas-element');
		expect(canvas).toBeInTheDocument();
	});

	it('should display a message when no data is available', () => {
		const { getByText } = render(PieChart, {
			data: { groups: [], groupedColumns: [], aggregateColumn: undefined }
		});
		expect(getByText('No data available to display')).toBeInTheDocument();
	});
});
