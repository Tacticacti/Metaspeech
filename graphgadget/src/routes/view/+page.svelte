<script lang="ts">
	// @ts-nocheck
	import { selected_graph } from '$lib/graphs/Store';
	import Grapher from '$lib/graphs/Select-graph.svelte';
	import { GraphMetas } from '$lib/graphs/Graphs';

	//let selectedGraph = graphs.at(0);
</script>

<Grapher graphs={GraphMetas}></Grapher>

{#if $selected_graph}
	<svelte:component this={$selected_graph} />
{/if}
