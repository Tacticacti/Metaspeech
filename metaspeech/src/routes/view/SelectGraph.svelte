<script lang="ts">
	import SelectGraphButton from './SelectGraphButton.svelte';
	import { graphs } from '$lib/Constants';
	import type { GraphMeta, GroupedDataFrame } from '$lib/Types';

	export let selected: GraphMeta | undefined = graphs[0];
	export let data: GroupedDataFrame;
	let displayed: GraphMeta | undefined = graphs[0];

	function show(graph: GraphMeta, isSelected: boolean) {
		if (isSelected) selected = graph;
		displayed = graph;
	}
</script>

<div
	class="flex w-full flex-col items-start justify-between border-2 bg-offwhite p-5 align-baseline lg:flex-row"
>
	<div class="bg-aqua flex h-full w-full flex-col items-start p-4 lg:w-1/2">
		<div data-testid="name-chart" class="p-2 text-lg font-bold">
			{displayed?.title || selected?.title || 'Select a graph'}
		</div>
		<div data-testid="description-chart" class="p-2" style="height: 6rem;">
			{displayed?.description || selected?.description || 'Select a graph'}
		</div>
	</div>
	<div class="flex w-full flex-col items-center p-4 lg:w-1/2">
		<h1 class="mb-4 text-xl text-black">Select a graph</h1>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each graphs as item}
				<SelectGraphButton
					graph={item}
					isSelected={selected === item}
					{data}
					on:click={() => show(item, true)}
					on:mouseover={() => show(item, false)}
					on:focus={() => show(item, false)}
				/>
			{/each}
		</div>
	</div>
</div>
