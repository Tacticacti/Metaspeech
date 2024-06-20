import { act, type RenderResult } from '@testing-library/svelte';
import sut from './+page.svelte';

export function getMergeButton(r: RenderResult<sut>): HTMLButtonElement | null {
	return r.queryByTestId('merge-button') as HTMLButtonElement | null;
}

export function getMergeTypeSelect(r: RenderResult<sut>): HTMLSelectElement | null {
	return r.queryByTestId('merge-type-select') as HTMLSelectElement | null;
}

export function getCol1Select(r: RenderResult<sut>): HTMLSelectElement | null {
	return r.queryByTestId('col1-select') as HTMLSelectElement | null;
}

export function getCol2Select(r: RenderResult<sut>): HTMLSelectElement | null {
	return r.queryByTestId('col2-select') as HTMLSelectElement | null;
}

export function rerender(r: RenderResult<sut>): Promise<void> {
	return act(() => r.component.$set({}));
}

export function getRemoveMissingButton(r: RenderResult<sut>): HTMLButtonElement | null {
	return r.queryByTestId('remove-missing-button') as HTMLButtonElement | null;
}

export function getNextLink(r: RenderResult<sut>): HTMLLinkElement | null {
	return r.queryByTestId('next-link') as HTMLLinkElement | null;
}

export function getInfoIcon(r: RenderResult<sut>): HTMLButtonElement | null {
	return r.queryByTestId('info-icon') as HTMLButtonElement | null;
}

export function getInfoBubble(r: RenderResult<sut>): HTMLButtonElement | null {
	return r.queryByTestId('info-bubble') as HTMLButtonElement | null;
}
