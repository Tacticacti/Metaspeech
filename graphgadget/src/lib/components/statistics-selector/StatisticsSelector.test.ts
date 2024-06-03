import DataFrame from 'dataframe-js';
import { render } from '@testing-library/svelte';
import sut from '$lib/components/statistics-selector/StatisticsSelector.svelte';
import { describe, it, expect } from 'vitest';
import { data } from '$lib/Store';

const df = new DataFrame(
	{
		id: [1, 2, 3, 4, 5, 6],
		age: [33, 43, 14, 19, undefined, 87],
		gender: ['M', 'F', 'M', 'M', 'F', 'F'],
		cef: ['A1', 'B2', 'B1', 'A2', undefined, 'B2'],
		duration: [100, 20, 200, 50, 10, 10]
	},
	['id', 'age', 'gender', 'cef', 'duration']

	//numeric columns are id, age, and duration
);

const valuesNotFreq: string[] = ['id', 'age', 'duration'];

describe('Statistic selector tests', () => {
	it('basic render', () => {
		const { container } = render(sut, {
			props: {
				valuesNotFreq: valuesNotFreq,
				columnsToSum: [],
				columnsToMean: []
			}
		});
		expect(container).toBeTruthy();
	});
	it('each numeric column has two checkboxes: sum and mean', () => {
		data.set(df);
		const { container, getByTestId } = render(sut, {
			props: {
				valuesNotFreq: valuesNotFreq,
				columnsToSum: [],
				columnsToMean: []
			}
		});

		const nodeList = container.querySelectorAll('input');

		expect(nodeList.length).toBe(6);

		for (const col of valuesNotFreq) {
			for (const stat of ['sum', 'mean']) {
				const element = getByTestId(`y-check-${stat}-${col}`);
				expect(element).toBeInTheDocument();
				expect((element as HTMLInputElement).type).toEqual('checkbox');
			}
		}
	});
});
