import { act, type RenderResult } from '@testing-library/svelte';
import sut from './EditChart.svelte';

export function rerender(r: RenderResult<sut>) {
	return act(() => r.component.$set({}));
}

export function getEditButton(r: RenderResult<sut>) {
	return r.queryByText('Edit') as HTMLElement | null;
}

export function getSaveButton(r: RenderResult<sut>) {
	return r.queryByText('Save') as HTMLElement | null;
}

export function getInput(r: RenderResult<sut>, id: string) {
	return r.queryByTestId(id + '-input') as HTMLInputElement | null;
}
