<script lang="ts">
	import { graph_name, graph_description } from './Store.js';
	import GraphButton from './Select-graph-button.svelte';

	/**
	 * Graph object
	 */
	export let graphs;
</script>

<div
	class="flex flex-col lg:flex-row justify-between items-start w-full p-5 border-2 border-red-500"
>
	<div class="flex flex-col items-start w-full lg:w-1/2 p-4 bg-aqua h-full">
		<div data-testid="name-chart" class="p-2 font-bold text-lg">
			{$graph_name}
		</div>
		<div data-testid="description-chart" class="p-2 overflow-auto" style="height: 6rem;">
			{$graph_description}
		</div>
	</div>
	<div class="flex flex-col items-center w-full lg:w-1/2 p-4">
		<h1 class="text-center mb-4">Select a graph</h1>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{#each graphs as item}
				<GraphButton graph={item} />
			{/each}
		</div>
	</div>
</div>
