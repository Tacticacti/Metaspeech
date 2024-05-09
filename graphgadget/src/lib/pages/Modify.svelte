<script lang="ts">
	import TableView from '$lib/TableView.svelte';
	import { data, state, StateEnum } from '$lib/store';
</script>

<button on:click={() => state.set(StateEnum.view)}>Next</button>

<TableView data={$data} />
