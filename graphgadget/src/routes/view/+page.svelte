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

<main class="bg-offwhite">
	<NavBar currentPage={'view'} />
	<div class="flex flex-col justify-center pt-16 m-5 max-w-full items-center">
		<Grapher graphs={GraphMetas}></Grapher>

		{#if $selected_graph}
				<svelte:component this={$selected_graph} />
		{/if}
	</div>
</main>
