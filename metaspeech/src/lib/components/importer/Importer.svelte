<script lang="ts">
	import type { DataFile } from '$lib/Types';
	import { createEventDispatcher } from 'svelte';
	import { Parse } from '$components/importer/scripts/FileParser';
	import type { DataFrameLike } from '$lib/Types';
	import { UnsupportedFileError } from '$lib/Types';
	import { GetFileExtension } from '$components/importer/scripts/FileParser';

	const dispatch = createEventDispatcher<{
		input: DataFile;
	}>();

	/**
	 * Handle the input event by parsing the file and dispatching the input event.
	 * If the file is unsupported or an error occurs during parsing, an error message is shown in a modal.
	 *
	 * @param event - The input event triggered when a file is selected.
	 */
	async function onInput(event: Event) {
		// Get the file from the input event
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		try {
			// Parse the file
			const data: DataFrameLike = await Parse(file);

			const bundle = {
				data,
				name: file.name
			};
			// Dispatch the parsed data
			dispatch('input', bundle);
		} catch (error) {
			// Handle unsupported file error and other errors
			if (error instanceof UnsupportedFileError) {
				throw new Error(
					`Invalid file input. .${GetFileExtension(file)} is not supported in this application.`
				);
			}

			throw new Error('An unknown error occurred while processing the file.');
		}
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
