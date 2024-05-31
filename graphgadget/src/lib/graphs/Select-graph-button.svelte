<script lang="ts">
	import { graph_name, graph_description, selected_graph } from './Store.js';
	import { writable } from 'svelte/store';

	/**
	 * Graph object
	 */
	export let graph;

	// Create a store to track the currently selected graph
	let selected = writable(null);
</script>

<button
	tabindex="0"
	data-testid={graph.title}
	class="w-52 h-12 p-1 border border-gray-400 rounded-md flex flex-row flex-wrap justify-around hover:bg-gray-300"
	class:selected={graph.title === $selected}
	on:click={() => {
		$selected_graph = graph.component;
		$graph_name = graph.title;
		$graph_description = graph.description;
		selected.set(graph.title);
	}}
	on:mouseover={() => {
		$graph_name = graph.title;
		$graph_description = graph.description;
	}}
	on:focus
>
	<img src={graph.img_src} alt="graph img" class="self-center" />
	<div class="self-center text-lg font-bold">{graph.title}</div>
</button>

<style>
	.selected {
		background-color: #D1E7DD; /* Light green background for the selected state */
		border-color: #0D6EFD; /* Blue border for the selected state */
	}
</style>