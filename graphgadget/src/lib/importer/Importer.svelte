<script lang="ts">
	import { UnsupportedFileError } from '../../CustomErrors';
	import { createEventDispatcher } from 'svelte';
	import { GetFileExtension, Parse } from '$lib/importer/scripts/FileParser';
	import { DataFrame } from 'dataframe-js';
	import type { Bundle } from '$lib/types';
	import { writable } from 'svelte/store';
	import ErrorModal from './ErrorModal.svelte';

	// allows creating component events
	const dispatch = createEventDispatcher<{
		input: Bundle;
	}>();

	/**
	 * Error message to display to the user
	 */
	export const errorMessage = writable<string | null>(null);

	async function onInput(event: Event) {
		// Clear any previous error messages
		errorMessage.set(null);

		// get file
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		// parse file
		try {
			const data: DataFrame = await Parse(file);
			const bundle = {
				input: data,
				filename: file.name
			};
			dispatch('input', bundle);
		} catch (error) {
			if (error instanceof UnsupportedFileError) {
				errorMessage.set(
					`Unsupported file type: .${GetFileExtension(file)}. Please upload a supported file type.`
				);
				return;
			}
			errorMessage.set('An error occurred while parsing the file. Please try again.');
		}
	}

	function closeModal() {
		errorMessage.set(null);
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

{#if $errorMessage}
	<ErrorModal message={$errorMessage} on:close={closeModal} />
{/if}
