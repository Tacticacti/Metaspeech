<script lang="ts">
	import { selected_graph } from '$lib/graphs/Store';
	import Grapher from '$lib/graphs/Select-graph.svelte';
	import { GraphMetas } from '$lib/graphs/Graphs';
	import { beforeUpdate } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';

	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	beforeUpdate(() => {
		loadSession();
	});
</script>

<Grapher graphs={GraphMetas}></Grapher>

{#if $selected_graph}
	<svelte:component this={$selected_graph} />
{/if}
