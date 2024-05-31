<script lang="ts">
	import { selectedValues } from '$lib/Store';
	import { selected_graph } from '$lib/graphs/Store';
	import Grapher from '$lib/graphs/SelectGraph.svelte';
	import { GraphMetas } from '$lib/graphs/Graphs';
	import { beforeUpdate } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	beforeUpdate(() => {
		console.log($selectedValues);

		loadSession();
	});
</script>

<Grapher graphs={GraphMetas}></Grapher>

{#if $selected_graph}
	<svelte:component this={$selected_graph} />
{/if}
