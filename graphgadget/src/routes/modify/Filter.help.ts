import { act, fireEvent, type RenderResult } from '@testing-library/svelte';
import sut from './Filter.svelte';

export function rerender(r: RenderResult<sut>) {
	return act(() => r.component.$set({}));
}

export function getFilterButton(r: RenderResult<sut>): HTMLElement {
	return r.getByText('Filter');
}

export function getFilterWindow(r: RenderResult<sut>): HTMLElement | null {
	return r.queryByTestId('filter-window');
}

export function getColumnSelect(r: RenderResult<sut>): HTMLSelectElement | null {
	return r.queryByTestId('column-select') as HTMLSelectElement;
}

export function getUseRangeCheckbox(r: RenderResult<sut>): HTMLInputElement | null {
	return r.queryByTestId('userange-check') as HTMLInputElement;
}

export function getMinRangeInput(r: RenderResult<sut>): HTMLInputElement | null {
	return r.queryByTestId('minrange-input') as HTMLInputElement;
}

export function getMaxRangeInput(r: RenderResult<sut>): HTMLInputElement | null {
	return r.queryByTestId('maxrange-input') as HTMLInputElement;
}

export function getTextFilterInput(r: RenderResult<sut>): HTMLInputElement | null {
	return r.queryByTestId('textfilter-input') as HTMLInputElement;
}

export async function removeMatching(r: RenderResult<sut>): Promise<void> {
	const button = r.queryByTestId('remove-matching-button')!;
	await fireEvent.click(button);
}

export async function removeNonMatching(r: RenderResult<sut>): Promise<void> {
	const button = r.queryByTestId('remove-nonmatching-button')!;
	await fireEvent.click(button);
}

export async function openFilterWindow(r: RenderResult<sut>): Promise<void> {
	const filterButton = getFilterButton(r);
	await fireEvent.click(filterButton);
	await rerender(r);
}

export async function setUseRangeCheckbox(r: RenderResult<sut>, checked: boolean): Promise<void> {
	const useRangeCheckbox = getUseRangeCheckbox(r)!;
	if (useRangeCheckbox.checked !== checked) {
		fireEvent.click(useRangeCheckbox);
		await rerender(r);
	}
}

export async function setColumnSelect(r: RenderResult<sut>, column: string): Promise<void> {
	const columnSelect = getColumnSelect(r)!;
	columnSelect.value = column;
	await fireEvent.change(columnSelect);
	await rerender(r);
}
