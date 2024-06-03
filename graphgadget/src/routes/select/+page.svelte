<script lang="ts">
	import { onMount } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
	import ColumnSelector from '$lib/column-selector/ColumnSelector.svelte';
	import { APP_NAME } from '$lib/Store';

	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	onMount(() => {
		loadSession();
	});
</script>

<svelte:head>
	<title>Parameters - {APP_NAME}</title>
</svelte:head>

<a href="/view" data-testid="next-link">Next</a>

<ColumnSelector></ColumnSelector>
