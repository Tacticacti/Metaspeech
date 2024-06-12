<script lang="ts">
	import type { DataFile } from '$lib/Types';
	import { createEventDispatcher } from 'svelte';
	import { Parse } from '$components/importer/scripts/FileParser';
	import type { DataFrameLike } from '$lib/Types';

	const dispatch = createEventDispatcher<{
		input: DataFile;
	}>();

	/**
	 * Handle the input event by parsing the file and dispatching the input event
	 * @param event The input event
	 */
	async function onInput(event: Event) {
		// get file
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// parse file
		const data: DataFrameLike = JSON.parse(JSON.stringify(await Parse(file)));

		const bundle = {
			data,
			name: file.name
		};
		dispatch('input', bundle);
	}
</script>

<input
	data-testid="input"
	on:input={onInput}
	type="file"
	accept=".tsv, .xls, .xlsx, .json, .csv, .txt"
	hidden
	{...$$restProps}
/>
