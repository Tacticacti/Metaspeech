<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Parse } from '$lib/importer/scripts/FileParser';
	import { DataFrame } from 'dataframe-js';
	import type { Bundle } from '$lib/types';

	// allows creating component events
	const dispatch = createEventDispatcher<{
		input: Bundle;
	}>();

	async function onInput(event: Event) {
		// get file
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// parse file
		const data: DataFrame = await Parse(file);
		// dispatch('input', data);
		const bundle = {
			input: data,
			filename: file.name
		};
		dispatch('input', bundle);
	}
</script>

<input
	data-testid="input"
	on:input={onInput}
	type="file"
	accept=".tsv, .xls, .xlsx, .json, .csv, .txt"
	id="import-data"
	hidden
/>
<label for="import-data">Import Data</label>
