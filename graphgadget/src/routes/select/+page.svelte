<script lang="ts">
	import { beforeUpdate } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
	import ColumnSelector from '$lib/ColumnSelector/ColumnSelector.svelte';
	import NavBar from '$lib/shared-components/NavBar.svelte';

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
<main class="bg-offwhite max-w-full min-h-screen m-0">
	<NavBar currentPage={'select'} />
	<div class="pt-16 m-5 max-w-full">
		<a href="/view" data-testid="next-link">Next</a>
		<ColumnSelector></ColumnSelector>
	</div>
</main>

