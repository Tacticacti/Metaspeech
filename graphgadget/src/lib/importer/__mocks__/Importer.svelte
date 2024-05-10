<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { DataFrame } from 'dataframe-js';

	// allows creating component events
	const dispatch = createEventDispatcher<{
		input: DataFrame;
	}>();

	async function onInput() {
		dispatch('input', new DataFrame([{ a: '1', b: '2', c: '3' }]));
	}
</script>

<input type="file" accept=".tsv" on:input={onInput} data-testid="file-input" />
