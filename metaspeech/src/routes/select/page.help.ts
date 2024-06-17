import { act, type RenderResult } from '@testing-library/svelte';
import sut from './+page.svelte';

export function rerender(r: RenderResult<sut>) {
	return act(() => r.component.$set({}));
}

export function getDisplayValues(r: RenderResult<sut>, id: string) {
	return r.queryAllByText(id) as HTMLElement[] | null;
}

export function getCheckboxes(r: RenderResult<sut>) {
	return r.queryAllByRole('checkbox') as HTMLElement[] | null;
}

export function getRadios(r: RenderResult<sut>) {
	return r.queryAllByRole('radio') as HTMLElement[] | null;
}

export function getBinByPlaceHolder(r: RenderResult<sut>, placeholder: string) {
	return r.queryByPlaceholderText(placeholder) as HTMLElement | null;
}

export function getInfoButton(r: RenderResult<sut>, id: string) {
	return r.queryByTestId('info-icon-' + id) as HTMLElement | null;
}

export function getInfoBubble(r: RenderResult<sut>, id: string) {
	return r.queryByTestId('info-bubble-' + id) as HTMLElement | null;
}
