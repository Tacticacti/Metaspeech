import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { df } from '$lib/Store';
import sut from './+page.svelte';
import '@testing-library/jest-dom';
import * as h from './page.help';
import userEvent from '@testing-library/user-event';
import { fromText } from '$lib/dataframe/DataFrame';

vi.mock('$components/importer/Importer.svelte');
vi.mock('./filter.svelte');
vi.mock('./Table.svelte');

beforeEach(() => {
	vi.clearAllMocks();
	sessionStorage.clear();
});

it('should render', () => {
	const { container } = render(sut);
	expect(container).toBeDefined();
});

it('should have a link that directs to select', async () => {
	const r = render(sut);

	const link = h.getNextLink(r);
	expect(link).toBeDefined();
	expect(link).toHaveAttribute('href', '/select');
});

describe('missing values', () => {
	it('should be able to remove rows with missing values', async () => {
		df.set(fromText('a,b\n1,2\n3,'));
		const r = render(sut);

		const button = h.getRemoveMissingButton(r);
		expect(button).toBeInTheDocument();

		await fireEvent.click(button!);

		expect(df.get()).toEqual(fromText('a,b\n1,2'));
	});
});

describe('merging', () => {
	it('should be able to index-merge two DataFrames', async () => {
		df.set(fromText('d,e\n4,5'));
		const r = render(sut);

		await fireEvent.input(r.getByTestId('file-input'));

		await h.rerender(r);

		const mergeButton = h.getIndexMergeButton(r);
		expect(mergeButton).toBeInTheDocument();

		await fireEvent.click(mergeButton!);

		expect(df.get()).toEqual(fromText('d,e,a,b,c\n4,5,1,2,3'));
	});
	it('should be able to column-merge two DataFrames', async () => {
		df.set(fromText('a,d\n1,4'));
		const r = render(sut);

		await fireEvent.input(r.getByTestId('file-input'));

		const mergeButton = h.getKeyedMergeButton(r);
		expect(mergeButton).toBeInTheDocument();

		await fireEvent.click(mergeButton!);

		expect(df.get()).toEqual(fromText('a,d,b,c\n1,4,2,3'));
	});
	it('should be able to column-merge two DataFrames', async () => {
		df.set(fromText('d,e\n1,4'));
		const r = render(sut);

		await fireEvent.input(r.getByTestId('file-input'));

		const mergeButton = h.getKeyedMergeButton(r);
		expect(mergeButton).toBeInTheDocument;

		await fireEvent.click(mergeButton!);

		expect(df.get()).toEqual(fromText('d,e,b,c\n1,4,2,3'));
	});
});

describe('info icon hover', () => {
	it('Bubble appears when hovering over info icon', async () => {
		const user = userEvent.setup();
		df.set(fromText('d,e\n1,4'));
		const r = render(sut);

		await fireEvent.input(r.getByTestId('file-input'));
		const icon: HTMLButtonElement = h.getInfoIcon(r)!;
		await user.hover(icon);

		const bubble = h.getInfoBubble(r);
		expect(bubble).to.exist;
	});

	it('Bubble not there if not hovering over icon', () => {
		df.set(fromText('d,e\n1,4'));
		const r = render(sut);

		const bubble = h.getInfoBubble(r);
		expect(bubble).not.to.exist;
	});
});
