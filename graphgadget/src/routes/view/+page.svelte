<script lang="ts">
	import { df } from '$lib/Store';
	import Grapher from '$lib/graphs/SelectGraph.svelte';
	import { GraphMetas } from '$lib/graphs/Graphs';
	import { APP_NAME } from '$lib/Constants';
	import { writable, type Writable } from 'svelte/store';
	import { type Graph } from '$lib/Types';

	let selected_graph: Writable<Graph | undefined> = writable(undefined);
	const data = df.groupBy();
</script>

<svelte:head>
	<title>Visualisations - {APP_NAME}</title>
</svelte:head>

<Grapher graphs={GraphMetas} />

{#if $selected_graph}
	<div class="mt-5 flex w-full justify-center">
		<svelte:component this={$selected_graph.graph} {data} />
	</div>
{:else}
	<div class="mt-5 flex h-96 w-full justify-center">
		<p class="text-lg text-white">Please select a graph to display.</p>
	</div>
{/if}
