<script lang="ts">
	import type { DataFile } from '$lib/Types';
	import { fromText } from '$lib/dataframe/DataFrame';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		input: DataFile;
	}>();

	function dispatchInputEvent() {
		dispatch('input', {
			data: fromText('a,b,c\n4,5,6\n7,8,9'),
			name: 'test.csv'
		});
	}
</script>

<button on:click={() => dispatchInputEvent()} {...$$restProps} />
