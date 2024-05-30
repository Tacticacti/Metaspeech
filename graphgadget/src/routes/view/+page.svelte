<script lang="ts">
	import { selected_graph } from '$lib/graphs/Store';
	import Grapher from '$lib/graphs/Select-graph.svelte';
	import { GraphMetas } from '$lib/graphs/Graphs';
	import { beforeUpdate } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
	import NavBar from '$lib/shared-components/NavBar.svelte';

	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	beforeUpdate(() => {
		loadSession();
	});
</script>

<style>

	.graph-options {
		display: flex;
		justify-content: center;
		margin: 20px 0;
	}

	.graph-description {
		background-color: #d1e7dd;
		padding: 20px;
		border-radius: 8px;
		margin-bottom: 20px;
	}

	.graph {
		display: flex;
		justify-content: center;
		padding: 20px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}
</style>

<main class="bg-offwhite">
	<NavBar currentPage={'view'} />
	<div class="flex flex-col justify-center pt-16 m-5 max-w-full items-center">
		<div class="graph-options">
			<Grapher graphs={GraphMetas}></Grapher>
		</div>

		{#if $selected_graph}
			<div class="graph-description">
				{console.log($selected_graph.name)}
				{#if $selected_graph.name === 'Proxy<PieChart>'}
					<p>Almost heaven, West Virginia</p>
					<p>Blue Ridge Mountains, Shenandoah River</p>
					<p>Life is old there, older than the trees</p>
					<p>Younger than the mountains, growin' like a breeze</p>
				{/if}
			</div>

			<div class="graph">
				<svelte:component this={$selected_graph} />
			</div>
		{/if}
	</div>

</main>
