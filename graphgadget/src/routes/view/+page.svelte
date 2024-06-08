<script lang="ts">
	import { df } from '$lib/Store';
	import SelectGraph from './SelectGraph.svelte';
	import { APP_NAME } from '$lib/Constants';
	import { type GraphMeta } from '$lib/Types';

	let selectedGraph: GraphMeta | undefined;
	const data = df.groupBy();
</script>

<svelte:head>
	<title>Visualisations - {APP_NAME}</title>
</svelte:head>

<SelectGraph bind:selected={selectedGraph} />

{#if selectedGraph}
	<div class="mt-5 flex w-full justify-center">
		<svelte:component this={selectedGraph.graph} {data} />
	</div>
{:else}
	<div class="mt-5 flex h-96 w-full justify-center">
		<p class="text-lg text-white">Please select a graph to display.</p>
	</div>
{/if}
