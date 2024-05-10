<script lang="ts">
	import TableView from '$lib/tableview/TableView.svelte';
	import { data, state, StateEnum } from '$lib/Store';

	function handleClick() {
		state.set(StateEnum.view);
	}
</script>

<button on:click={handleClick}>Next</button>

<TableView data={$data} />
