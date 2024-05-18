import { data } from '$lib/Store';
import DataFrame from 'dataframe-js';

export function loadSession() {
	const jsonData = sessionStorage.getItem('current-df');
	let parsed = jsonData ? JSON.parse(jsonData) : null;

	if (parsed === null) return;

	parsed = JSON.parse(parsed);

	const df = new DataFrame(parsed);
	data.set(df);
}
