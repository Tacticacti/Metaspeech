<script lang="ts">
	import { selected_graph } from '$lib/graphs/Store';
	import Grapher from '$lib/graphs/Select-graph.svelte';
	import { GraphMetas } from '$lib/graphs/Graphs';
	import { beforeUpdate } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
	import NavBar from '$lib/shared-components/NavBar.svelte';
	import { APP_NAME } from '$lib/shared-components/shared-variables';

	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	beforeUpdate(() => {
		loadSession();
	});
</script>

<svelte:head>
	<title>Visualisations - {APP_NAME}</title>
</svelte:head>

<main class="bg-offwhite">
	<NavBar currentPage={'view'} />
	<div class="flex flex-col justify-center pt-16 m-5 max-w-full items-center">
		<Grapher graphs={GraphMetas}></Grapher>

		{#if $selected_graph}
			<div class="mt-5 w-full flex justify-center">
				<svelte:component this={$selected_graph} />
			</div>
		{/if}
	</div>
</main>
