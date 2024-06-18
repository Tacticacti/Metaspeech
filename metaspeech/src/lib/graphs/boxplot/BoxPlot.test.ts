import { render } from '@testing-library/svelte';
import sut from '$lib/graphs/boxplot/BoxPlot.svelte';
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
		expect(getByTestId('flip-button')).to.exist;
	});
	it('click flip button', async () => {
		const user = userEvent.setup();

		const df = new DataFrame();
		df.set(fromText('age,cars,trains\n18,1,1\n32,4,1\n18,2,1'));
		const columns = get(df.columns);
		columns[2].aggregate = true;
		columns[0].groupBy = { type: 'specific' };
		columns[1].groupBy = { type: 'specific' };

		const groupedDf = df.groupBy();

		const { getByTestId, component } = render(sut, { data: groupedDf });

		const flipButton = getByTestId('flip-button');

		expect(component.$$.ctx[0].groups[0].keys).toStrictEqual([18, 1]);
		expect(component.$$.ctx[0].groups[1].keys).toStrictEqual([18, 2]);
		expect(component.$$.ctx[0].groups[2].keys).toStrictEqual([32, 4]);

		await user.click(flipButton);

		expect(component.$$.ctx[0].groups[0].keys).toStrictEqual([1, 18]);
		expect(component.$$.ctx[0].groups[1].keys).toStrictEqual([2, 18]);
		expect(component.$$.ctx[0].groups[2].keys).toStrictEqual([4, 32]);
	});
});
