<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { DataFrame } from 'dataframe-js';
	import type { Bundle } from '$lib/types';

	// allows creating component events
	const dispatch = createEventDispatcher<{
		input: Bundle;
	}>();

	async function onInput() {
		const bundle: Bundle = {
			input: new DataFrame([{ a: '1', b: '2', c: '3' }]),
			filename: 'testfile'
		};

		dispatch('input', bundle);
	}
</script>

<input type="file" accept=".tsv" on:input={onInput} data-testid="file-input" />
