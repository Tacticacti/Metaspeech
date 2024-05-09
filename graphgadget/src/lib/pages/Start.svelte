<script lang="ts">
	import Importer from '$lib/importer/Importer.svelte';
	import { data, state, StateEnum } from '$lib/store';
	import type DataFrame from 'dataframe-js';

	function handleInput(event: CustomEvent<DataFrame>) {
		data.set(event.detail);
		state.set(StateEnum.modify);
	}
</script>

<Importer on:input={handleInput} />
