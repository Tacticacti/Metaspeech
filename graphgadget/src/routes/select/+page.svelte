<script lang="ts">
	import { beforeUpdate } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
	import ColumnSelector from '$lib/column-selector/ColumnSelector.svelte';
	import { APP_NAME } from '$lib/Store';

	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	beforeUpdate(() => {
		loadSession();
	});
	// function handleClick() {
	// 	// set the storage to the updated data
	// 	sessionStorage.setItem('current-df', JSON.stringify($data));
	// }
</script>

<svelte:head>
	<title>Parameters - {APP_NAME}</title>
</svelte:head>

<a href="/view" data-testid="next-link">Next</a>

<ColumnSelector></ColumnSelector>
