<script lang="ts">
	import Grapher from './../graphs/Grapher.svelte';
	import { selected_graph } from '$lib/graphs/Store';
	import { GraphMetas } from '$lib/graphs/Graphs';

	let graphs = GraphMetas;
</script>

<Grapher {graphs}></Grapher>
<svelte:component this={$selected_graph} />
