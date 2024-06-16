import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/histogram/Histogram.svelte';
import { describe, it, expect } from 'vitest';
import { DataFrame, fromText } from '$lib/dataframe/DataFrame';
import { get } from 'svelte/store';

describe('When user views', () => {
	it('should render', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));
		const columns = get(df.columns);
		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const { container, getByTestId } = render(sut, { data: df.groupBy() });
		expect(container).to.exist;
		expect(getByTestId('canvas-element')).to.exist;
	});
	it(' check if sum and mean exists', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));
		const columns = get(df.columns);

		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const { getByTestId } = render(sut, { data: df.groupBy() });

		const select = getByTestId('aggregation-select') as HTMLSelectElement;

		expect(select).to.exist;
		expect(select.options.length).toBe(2);
		expect(select.value).toBe('Mean');
	});
	it(' check if abs freq and rel freq exists', () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));
		const columns = get(df.columns);
		columns[0].groupBy = { type: 'specific' };

		const { getByTestId } = render(sut, { data: df.groupBy() });

		const select = getByTestId('nonaggregation-select') as HTMLSelectElement;

		expect(select).to.exist;
		expect(select.options.length).toBe(2);
		expect(select.value).toBe('Count');
	});
});
