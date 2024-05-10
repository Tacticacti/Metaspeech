<script lang="ts">
	import TableView from '$lib/tableview/TableView.svelte';
	import { data } from '$lib/Store';
	import { goto } from '$app/navigation';

	function handleClick() {
		goto('/view');
	}
</script>

<button on:click={handleClick}>Next</button>

<TableView data={$data} />
