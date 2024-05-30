<script lang="ts">
	import { graph_name, graph_description, selected_graph } from './Store.js';
	export let graph;
</script>

<button
	tabindex="0"
	data-testid={graph.title}
	class="s"
	on:click={() => {
		$selected_graph = graph.component;
		$graph_name = graph.title;
		$graph_description = graph.description;
	}}
>
	<img src={graph.img_src} alt="graph img" />
	<div style="align-self:center; font-size: 20px; font-weight: bold;">{graph.title}</div>
</button>

<style>
	.s:hover {
		background-color: gray;
	}
	.s {
		width: 200px;
		height: 50px;
		padding: 5px;
		border: 1px solid gray;
		border-radius: 5px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
	}
</style>
