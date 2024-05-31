<script lang="ts">
	import { selectedValues } from '$lib/Store';
	import { selected_graph } from '$lib/graphs/Store';
	import Grapher from '$lib/graphs/Select-graph.svelte';
	import { GraphMetas } from '$lib/graphs/Graphs';
	import { beforeUpdate } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
	import NavBar from '$lib/shared-components/NavBar.svelte';
	import { APP_NAME } from '$lib/Store';
	import Footer from '$lib/shared-components/Footer.svelte';
	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	beforeUpdate(() => {
		console.log($selectedValues);

		loadSession();
	});
</script>

<svelte:head>
	<title>Visualisations - {APP_NAME}</title>
</svelte:head>

<main class="bg-lightblue">
	<NavBar currentPage={'view'} />
	<div class="flex flex-col justify-center pt-16 m-5 max-w-full items-center">
		<Grapher graphs={GraphMetas}></Grapher>

		{#if $selected_graph}
			<div class="mt-5 w-full flex justify-center mt-5">
				<svelte:component this={$selected_graph} />
			</div>
		{:else}
			<div class="mt-5 w-full h-96 flex justify-center">
				<p class="text-lg text-white">Please select a graph to display.</p>
			</div>
		{/if}
	</div>
	<Footer />
</main>
