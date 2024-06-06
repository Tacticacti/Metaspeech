<script lang="ts">
	import SelectGraphButton from './SelectGraphButton.svelte';
	import { graphs } from '$lib/Constants';
	import type { GraphMeta } from '$lib/Types';

	export let selected: GraphMeta | undefined = undefined;
	let displayed: GraphMeta | undefined = undefined;

	function show(graph: GraphMeta, isSelected: boolean) {
		if (isSelected)
			selected = graph;
		displayed = graph;
	}
</script>

<div class="flex flex-col lg:flex-row justify-between items-start w-full p-5 border-2 bg-offwhite">
	<div class="flex flex-col items-start w-full lg:w-1/2 p-4 bg-aqua h-full">
		<div data-testid="name-chart" class="p-2 font-bold text-lg">
			{hovered?. || selected.name}
		</div>
		<div data-testid="description-chart" class="p-2" style="height: 6rem;">
			{$graph_description}
		</div>
	</div>
	<div class="flex flex-col items-center w-full lg:w-1/2 p-4">
		<h1 class="text-xl text-black mb-4">Select a graph</h1>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{#each graphs as item}
				<SelectGraphButton graph={item} on:click={() => show(item, true)} on:mouseover={() => show(item, false)} on:focus={() => show(item, false)} />
			{/each}
		</div>
	</div>
</div>
