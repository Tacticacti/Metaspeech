import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import DataFrame from 'dataframe-js';
import { data } from '$lib/Store';
import sut from './+page.svelte';
import '@testing-library/jest-dom';
import { get } from 'svelte/store';
import * as h from './page.help';

vi.mock('$lib/importer/Importer.svelte');
vi.mock('$lib/filtering/filter.svelte');
vi.mock('$lib/table/Table.svelte');

beforeEach(() => {
	vi.clearAllMocks();
	sessionStorage.clear();
});

it('should render', () => {
	const { container } = render(sut);
	expect(container).toBeDefined();
});

it('should have a link that directs to view', async () => {
	const r = render(sut);

	const link = h.getNextLink(r);
	expect(link).toBeDefined();
	expect(link).toHaveAttribute('href', '/view');
});

describe('missing values', () => {
	it('should be able to remove rows with missing values', async () => {
		const df = new DataFrame([
			{ a: 1, b: 2 },
			{ a: 3, b: undefined }
		]);
		data.set(df);
		const r = render(sut);

		const button = h.getRemoveMissingButton(r);
		expect(button).toBeInTheDocument();

		await fireEvent.click(button!);

		expect(get(data).toText()).toEqual('a;b\n1;2');
	});
});

describe('merging', () => {
	it('should be able to index-merge two DataFrames', async () => {
		const df1 = new DataFrame([{ d: 4, e: 5 }]);
		data.set(df1);
		const r = render(sut);

		await fireEvent.input(r.getByTestId('file-input'));

		await h.rerender(r);

		const mergeButton = h.getIndexMergeButton(r);
		expect(mergeButton).toBeInTheDocument();

		await fireEvent.click(mergeButton!);

		expect(get(data).toText()).toEqual('d;e;a;b;c\n4;5;1;2;3');
	});
	it('should be able to column-merge two DataFrames', async () => {
		const df1 = new DataFrame([{ a: '1', d: '4' }]);
		data.set(df1);
		const r = render(sut);

		await fireEvent.input(r.getByTestId('file-input'));

		const mergeButton = h.getKeyedMergeButton(r);
		expect(mergeButton).toBeInTheDocument();

		await fireEvent.click(mergeButton!);

		expect(get(data).toText()).toEqual('a;d;b;c\n1;4;2;3');
	});
	it('should be able to column-merge two DataFrames', async () => {
		const df1 = new DataFrame([{ d: '1', e: '4' }]);
		data.set(df1);
		const r = render(sut);

		await fireEvent.input(r.getByTestId('file-input'));

		const mergeButton = h.getKeyedMergeButton(r);
		expect(mergeButton).toBeInTheDocument();

		await fireEvent.click(mergeButton!);

		expect(get(data).toText()).toEqual('d;e;b;c\n1;4;2;3');
	});
});

describe('session storage', () => {
	it('Table should be same on refresh mount', async () => {
		const df1 = new DataFrame([{ a: '1', b: '2', c: '3' }]);
		data.set(df1);
		const r = render(sut);
		expect(JSON.stringify(get(data))).toEqual(JSON.stringify(df1));

		const link: HTMLLinkElement = h.getNextLink(r) as HTMLLinkElement;
		await fireEvent.click(link);

		expect(JSON.stringify(get(data))).toEqual(JSON.stringify(df1));
	});

	it('Should recover from session storage', async () => {
		const df1 = new DataFrame([{ a: '1', b: '2', c: '3' }]);
		sessionStorage.setItem('current-df', JSON.stringify(df1));

		render(sut);

		expect(JSON.stringify(get(data))).toEqual(JSON.stringify(df1));
	});
});
