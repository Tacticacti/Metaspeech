import { data } from '$lib/Store';
import { get } from 'svelte/store';

/**
 * sets the value of a column in the 'data' dataframe
 * @param event the event that triggered the change
 * @param previousValue the previous value of the column
 */
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
		// Reset the input value
		input.value = previousValue;
		return;
	}

	data.set(_data.rename(previousValue, value));
}

/**
 * removes a column from the 'data' dataframe
 * @param column The name of the column to remove
 */
export function removeColumn(column: string) {
	data.set(get(data).drop(column));
}
