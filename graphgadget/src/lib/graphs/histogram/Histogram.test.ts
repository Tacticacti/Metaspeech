import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/histogram/Histogram.svelte';
import { describe, it, expect } from 'vitest';
import { DataFrame, fromText } from '$lib/dataframe/DataFrame';
import { get } from 'svelte/store';
import userEvent from '@testing-library/user-event';

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
	it(' check if sum and mean exists', async () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));
		const columns = get(df.columns);
		const user = userEvent.setup();

		columns[1].aggregate = true;
		columns[0].groupBy = { type: 'specific' };

		const { getByTestId } = render(sut, { data: df.groupBy() });

		const sumButton = getByTestId('aggregation-sum');
		const meanButton = getByTestId('aggregation-mean');

		expect(sumButton).to.exist;
		expect(sumButton).toBeChecked();
		expect(meanButton).to.exist;

		await user.click(meanButton);

		expect(meanButton).toBeChecked();
		expect(sumButton).not.toBeChecked();
	});
	it(' check if abs freq and rel freq exists', async () => {
		const df = new DataFrame();
		df.set(fromText('age,cars\n18,1\n32,4\n18,2'));
		const columns = get(df.columns);
		const user = userEvent.setup();
		columns[0].groupBy = { type: 'specific' };

		const { getByTestId } = render(sut, { data: df.groupBy() });

		const absButton = getByTestId('nonaggregation-Absolute Frequency');
		const relButton = getByTestId('nonaggregation-Relative Frequency');

		expect(absButton).to.exist;
		expect(relButton).to.exist;

		await user.click(absButton);

		expect(absButton).toBeChecked();
		expect(relButton).not.toBeChecked();

		await user.click(relButton);

		expect(relButton).toBeChecked();
		expect(absButton).not.toBeChecked();
	});
});
