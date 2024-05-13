<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Parse } from '$lib/importer/scripts/FileParser';
	import { DataFrame } from 'dataframe-js';

	// allows creating component events
	const dispatch = createEventDispatcher<{
		input: DataFrame;
	}>();

	async function onInput(event: Event) {
		// get file
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// parse file
		const data = await Parse(file);
		dispatch('input', data);
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
