<script lang="ts">
	import { selected_graph } from '$lib/graphs/Store';
	import Grapher from '$lib/graphs/SelectGraph.svelte';
	import { GraphMetas } from '$lib/graphs/Graphs';
	import { APP_NAME } from '$lib/Constants';
</script>

<svelte:head>
	<title>Visualisations - {APP_NAME}</title>
</svelte:head>

<Grapher graphs={GraphMetas} />

{#if $selected_graph}
	<div class="mt-5 w-full flex justify-center">
		<svelte:component this={$selected_graph} />
	</div>
{:else}
	<div class="mt-5 w-full h-96 flex justify-center">
		<p class="text-lg text-white">Please select a graph to display.</p>
	</div>
{/if}