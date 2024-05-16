import { render } from '@testing-library/svelte';
import PieChart from './PieChart.svelte';
import { describe, it, expect } from 'vitest';
import { data } from '$lib/Store';
import { DataFrame } from 'dataframe-js';

// Mock the data store with a sample DataFrame
const df = new DataFrame(
	{
		column1: ['Red', 'Blue', 'Yellow', 'Red', 'Yellow', 'Blue', 'Red'],
		column2: [1, 2, 3, 4, 5, 6, 7]
	},
	['column1', 'column2']
);

describe('PieChart Component', () => {
	it('should render the component', () => {
		const { container } = render(PieChart);
		expect(container).toBeTruthy();
	});

	it('should have a select element with column names', () => {
		data.set(df);
		const { getByTestId } = render(PieChart);
		const selectElement = getByTestId('first-select');
		expect(selectElement).toBeInTheDocument();
		expect(selectElement.childElementCount).toBe(df.listColumns().length);
	});

	it('should pre-select the first column', () => {
		const { getByTestId } = render(PieChart);
		const selectElement = getByTestId('first-select') as HTMLSelectElement;
		expect(selectElement.value).toBe('column1');
	});
});

describe('calculateAxis function', () => {
	beforeAll(() => {
		// Mock the data store with the sample DataFrame
		data.set(df);
	});

	it('should calculate the correct frequency for column1', () => {
		const { component } = render(PieChart);
		const [labels, counts] = component.calculateAxis('column1');
		expect(labels).toEqual(['Red', 'Blue', 'Yellow']);
		expect(counts).toEqual([3, 2, 2]);
	});

	it('should calculate the correct frequency for column2', () => {
		const { component } = render(PieChart);
		const [labels, counts] = component.calculateAxis('column2');
		expect(labels).toEqual([1, 2, 3, 4, 5, 6, 7]);
		expect(counts).toEqual([1, 1, 1, 1, 1, 1, 1]);
	});

	it('should return empty arrays for a non-existent column', () => {
		const { component } = render(PieChart);
		const [labels, counts] = component.calculateAxis('non_existent_column');
		expect(labels).toEqual([]);
		expect(counts).toEqual([]);
	});
});
