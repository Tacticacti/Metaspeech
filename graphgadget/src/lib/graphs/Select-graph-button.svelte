<script lang="ts">
	import { graph_name, graph_description, selected_graph } from './Store.js';

	/**
	 * Graph object
	 */
	export let graph;
	/**
	 * Handle mouse out event
	 */
	function handleMouseOut() {
		$graph_name = '';
		$graph_description = '';
	}
</script>

<button
	tabindex="0"
	data-testid={graph.title}
	class="w-52 h-12 p-1 border border-gray-400 rounded-md flex flex-row flex-wrap justify-around hover:bg-gray-300"
	on:click={() => {
		$selected_graph = graph.component;
		$graph_name = graph.title;
		$graph_description = graph.description;
	}}
>
	<img src={graph.img_src} alt="graph img" class="self-center" />
	<div class="self-center text-lg font-bold">{graph.title}</div>
</button>
