<script lang="ts">
	import { GraphMetas } from '$lib/graphs/Graphs';

	let graphs = GraphMetas;
	let selectedGraph = graphs[0];
</script>

<select bind:value={selectedGraph}>
	{#each graphs as graph}
		<option value={graph}>{graph.title}</option>
	{/each}
</select>

<svelte:component this={selectedGraph.component} />
