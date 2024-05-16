import { data } from '$lib/Store';
import { get } from 'svelte/store';

export function columnValueChanged(event: Event, previousValue: string) {
	const input = event.target as HTMLInputElement;
	const value = input.value.trim();
	const _data = get(data);

	if (
		value === previousValue ||
		value === '' ||
		value === null ||
		value === undefined ||
		_data.listColumns().includes(value)
	) {
		//TODO: decide what to do in these cases
		input.value = previousValue;
		return;
	}

	data.set(_data.rename(previousValue, value));
}
export function removeColumn(column: string) {
	data.set(get(data).drop(column));
}
