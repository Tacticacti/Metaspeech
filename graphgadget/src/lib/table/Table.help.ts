import { act, fireEvent, type RenderResult } from '@testing-library/svelte';
import sut from './Table.svelte';

export function getHeaderInput(r: RenderResult<sut>, header: string): HTMLInputElement | null {
	return r.queryByTestId('header-' + header + '-input') as HTMLInputElement | null;
}

export function getHeaderDeleteButton(
	r: RenderResult<sut>,
	header: string
): HTMLButtonElement | null {
	return r.queryByTestId('header-' + header + '-delete') as HTMLButtonElement | null;
}

export function getCell(r: RenderResult<sut>, cell: string): HTMLElement | null {
	return r.queryByTestId(cell + '-cell') as HTMLElement | null;
}

export function rerender(r: RenderResult<sut>) {
	act(() => r.component.$set({}));
}

export async function renameColumn(
	r: RenderResult<sut>,
	oldName: string,
	newName: string
): Promise<void> {
	const input = getHeaderInput(r, oldName)!;
	input.value = newName;
	await fireEvent.change(input);
	await rerender(r);
}
