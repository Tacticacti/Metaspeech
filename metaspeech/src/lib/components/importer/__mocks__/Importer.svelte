<script lang="ts">
	import type { DataFile } from '$lib/Types';
	import { fromText } from '$lib/dataframe/DataFrame';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		input: DataFile;
	}>();

	function dispatchInputEvent() {
		dispatch('input', {
			data: fromText('a,b,c\n1,2,3\n2,3,4'),
			name: 'test.csv'
		});
	}
</script>

<input on:input={() => dispatchInputEvent()} {...$$restProps} />
