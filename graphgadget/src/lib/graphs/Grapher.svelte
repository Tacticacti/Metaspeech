<script lang="ts">
	import { graph_name, graph_description } from './Store.ts';
	import GraphButton from './Grapher-button.svelte';

	export let graphs;
	// function createBox(graphs: GraphMeta[]){
	// 	let i = 0;
	// 	while(i < graphs.length){
	// 		if(i <= graphs.length-2){
	// 			let element = document.createElement("div");

	// 		}
	// 	}
	// }
</script>

<div class="main-container">
	<div class="right-container">
		<div data-testid="name-chart" class="name-chart">
			{$graph_name}
		</div>
		<div data-testid="description-chart" class="description-chart">
			{$graph_description}
		</div>
	</div>
	<div class="left-container">
		<h1 style="text-align:center;">Select a graph</h1>
		<div class="t1">
			<div class="r">
				{#each graphs as item}
					<GraphButton graph={item} />
				{/each}
			</div>
			<!-- <div class="r">
				<div class="s">cc</div>
				<div class="s">dd</div>
			</div> -->
		</div>
	</div>
</div>

<style>
	.r {
		padding: 10px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	.t1 {
		height: 80vh;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
	}
	.main-container {
		height: 50vh;
		border: 2px solid red;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
	}
	.right-container {
		background-color: aqua;
		width: 50vh;
		height: 50vh;
	}
	.left-container {
		width: 700px;
		align-self: center;
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		justify-content: space-around;
	}
</style>
