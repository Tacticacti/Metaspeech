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

<div class="flex h-full min-h-screen w-full justify-center bg-lightblue">
	<div class="w-[80vw]">
		<div class="">
			<SelectGraph bind:selected={selectedGraph} {data} />
			{#if selectedGraph}
				<div class="flex w-full" data-testid="graph-container">
					<svelte:component this={selectedGraph.graph} {data} />
				</div>
			{:else}
				<div class="mt-5 flex h-96 w-full justify-center">
					<p class="text-lg text-white">Please select a graph to display.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
