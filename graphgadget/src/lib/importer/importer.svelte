<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Parse } from './scripts/FileParser';
	import { DataFrame } from 'dataframe-js';

	// allows creating component events
	const dispatch = createEventDispatcher<{
		input: DataFrame;
	}>();

	function onInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		Parse(file).then((data) => {
			dispatch('input', data);
		});
	}
</script>

<input type="file" accept=".tsv" on:input={onInput} />
