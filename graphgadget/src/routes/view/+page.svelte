<script lang="ts">
	import { selected_graph } from '$lib/graphs/Store';
	import Grapher from '$lib/graphs/Select-graph.svelte';
	import { GraphMetas } from '$lib/graphs/Graphs';
	import { data } from '$lib/Store';
	import { beforeUpdate } from 'svelte';
	import DataFrame from 'dataframe-js';

	beforeUpdate(() => {
		if (sessionStorage.getItem('current-df') !== null) {
			var jsonData = sessionStorage.getItem('current-df');
			var parsed = jsonData ? JSON.parse(jsonData) : null;

			if (parsed === null) return;

			parsed = JSON.parse(parsed);

			const df = new DataFrame(parsed);
			data.set(df);
		}
	});
</script>

<Grapher graphs={GraphMetas}></Grapher>

{#if $selected_graph}
	<svelte:component this={$selected_graph} />
{/if}
