import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import sut from './Filter.svelte';
import * as h from './Filter.help';
import { df } from '$lib/Store';
import { fromText } from '$lib/dataframe/DataFrame';

beforeEach(() => {
	vi.clearAllMocks();
});

it('should render', () => {
	const r = render(sut);
	expect(r.container).to.exist;
});

describe('hiding window', () => {
	it('should start hidden', async () => {
		const r = render(sut);
		expect(h.getFilterWindow(r)).to.be.null;
	});
	it('should render when shown', async () => {
		const r = render(sut);

		await h.openFilterWindow(r);

		expect(h.getFilterWindow(r)).to.exist;
	});
	it('should hide again', async () => {
		const r = render(sut);
		await h.openFilterWindow(r);
		// I know it says open but it actually closes the window shhh 🗿
		await h.openFilterWindow(r);

		expect(h.getFilterWindow(r)).to.be.null;
	});
});

describe('select column', () => {
	it('should render all columns'),
		async () => {
			df.set(fromText('a,b,c\n1,2,3'));

			const r = render(sut);
			await h.openFilterWindow(r);

			const columnSelect = h.getColumnSelect(r);
			expect(columnSelect).to.exist;
			expect(columnSelect?.options.length).to.equal(3);
		};
	it('should pre-select a column'),
		async () => {
			df.set(fromText('a,b,c\n1,2,3'));

			const r = render(sut);
			await h.openFilterWindow(r);

			const columnSelect = h.getColumnSelect(r);
			expect(columnSelect?.value).toBeDefined();
		};
	it('should update the column when it is removed'),
		async () => {
			df.set(fromText('a,b,c\n1,2,3'));

			const r = render(sut);
			await h.openFilterWindow(r);

			// drop currently selected column from $data
			const columnSelect = h.getColumnSelect(r);
			const oldColumn = columnSelect?.value ?? 0;
			df.deleteColumn(Number(oldColumn));
			await h.rerender(r);

			expect(columnSelect?.value).to.not.equal(oldColumn);
		};
});

describe('range checkbox', () => {
	it('should be enabled for numeric columns'),
		async () => {
			df.set(fromText('a,b,c\n1,2,3'));

			const r = render(sut);
			await h.openFilterWindow(r);

			await h.setColumnSelect(r, 'a');

			const useRangeCheckbox = h.getUseRangeCheckbox(r);
			expect(useRangeCheckbox).to.exist;
		};

	it('should be disabled for non-numeric columns'),
		async () => {
			df.set(fromText('a,b,c\n1,a,3'));

			const r = render(sut);
			await h.openFilterWindow(r);

			await h.setColumnSelect(r, 'b');

			const useRangeCheckbox = h.getUseRangeCheckbox(r);
			expect(useRangeCheckbox).to.be.null;
		};
});

describe('range inputs', () => {
	it('should be disabled when the checkbox is not checked'),
		async () => {
			df.set(fromText('a,b,c\n1,2,3'));

			const r = render(sut);
			await h.openFilterWindow(r);

			await h.setUseRangeCheckbox(r, false);

			expect(h.getMinRangeInput(r)).to.be.null;
			expect(h.getMaxRangeInput(r)).to.be.null;
		};
	it('should be enabled when the checkbox is checked'),
		async () => {
			df.set(fromText('a,b,c\n1,2,3'));

			const r = render(sut);
			await h.openFilterWindow(r);

			await h.setUseRangeCheckbox(r, true);

			expect(h.getMinRangeInput(r)).to.exist;
			expect(h.getMaxRangeInput(r)).to.exist;
		};
});

describe('text input', () => {
	it('should be enabled for all columns', async () => {
		df.set(fromText('a,b,c\n1,2,3'));

		const r = render(sut);
		await h.openFilterWindow(r);

		await h.setUseRangeCheckbox(r, false);

		expect(h.getTextFilterInput(r)).to.exist;
	});
	it('should be hidden when range is used', async () => {
		df.set(fromText('a,b,c\n1,2,3'));

		const r = render(sut);
		await h.openFilterWindow(r);

		await h.setUseRangeCheckbox(r, true);

		expect(h.getTextFilterInput(r)).to.be.null;
	});
});

describe('text filtering', () => {
	it('should be able to filter by text (matching)', async () => {
		df.set(fromText('a,b,c\n1,2,3\n2,3,4\n3,4,5'));

		// open filter window
		const r = render(sut);
		await h.openFilterWindow(r);

		await h.setColumnSelect(r, '0');

		await h.setUseRangeCheckbox(r, false);

		const textFilterInput = h.getTextFilterInput(r)!;
		textFilterInput.value = '2';
		await fireEvent.input(textFilterInput);

		await h.removeMatching(r);

		expect(df.get()).toEqual(fromText('a,b,c\n1,2,3\n3,4,5'));
	});
	it('should be able to filter by text (non-matching)', async () => {
		df.set(fromText('a,b,c\n1,2,3\n2,3,4\n3,4,5'));

		// open filter window
		const r = render(sut);
		await h.openFilterWindow(r);

		await h.setColumnSelect(r, '0');
		await h.setUseRangeCheckbox(r, false);

		const textFilterInput = h.getTextFilterInput(r)!;
		textFilterInput.value = '2';
		await fireEvent.input(textFilterInput);

		await h.removeNonMatching(r);

		expect(df.get()).toEqual(fromText('a,b,c\n2,3,4'));
	});
});
describe('range filtering', () => {
	it('should be able to filter by range (matching)', async () => {
		df.set(fromText('a,b,c\n1,2,3\n2,3,4\n3,4,5'));

		// open filter window
		const r = render(sut);
		await h.openFilterWindow(r);

		await h.setColumnSelect(r, '0');
		await h.setUseRangeCheckbox(r, true);

		const minRangeInput = h.getMinRangeInput(r)!;
		const maxRangeInput = h.getMaxRangeInput(r)!;
		minRangeInput.value = '2';
		maxRangeInput.value = '3';
		await fireEvent.input(minRangeInput);
		await fireEvent.input(maxRangeInput);

		await h.removeMatching(r);

		expect(df.get()).toEqual(fromText('a,b,c\n1,2,3'));
	});

	it('should be able to filter by range (non-matching)', async () => {
		df.set(fromText('a,b,c\n1,2,3\n2,3,4\n3,4,5'));

		// open filter window
		const r = render(sut);
		await h.openFilterWindow(r);

		await h.setColumnSelect(r, '0');
		await h.setUseRangeCheckbox(r, true);

		const minRangeInput = h.getMinRangeInput(r)!;
		const maxRangeInput = h.getMaxRangeInput(r)!;
		minRangeInput.value = '2';
		maxRangeInput.value = '3';
		await fireEvent.input(minRangeInput);
		await fireEvent.input(maxRangeInput);

		await h.removeNonMatching(r);

		expect(df.get()).toEqual(fromText('a,b,c\n2,3,4\n3,4,5'));
	});
});
