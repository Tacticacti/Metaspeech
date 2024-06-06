<script lang="ts">
	import { df } from '$lib/Store';
	import type { DataFrameLike } from '$lib/dataframe/DataFrame';

	const columns = df.columns;

	export let second_data: DataFrameLike;
	let merge_col_1: number;
	let merge_col_2: number;
	/**
	 * Merges the dataframes row-wise, i.e. joins them based on the index
	 */
	function handleRowWiseMerge() {
		df.join(second_data);
	}

	/**
	 * Merges the dataframes based on the selected columns
	 */
	function joinColumns() {
		df.keyedJoin(second_data, merge_col_1, merge_col_2);
	}
</script>

<div>
	{#if second_data}
		<button on:click={handleRowWiseMerge} data-testid="merge-index-button">Index merge</button>
		<select bind:value={merge_col_1} data-testid="col1-select">
			{#each $columns as col, i}
				<option value={i}>{col.name}</option>
			{/each}
		</select>
		<select bind:value={merge_col_2} data-testid="col2-select">
			{#each second_data.columns as col, i}
				<option value={i}>{col.name}</option>
			{/each}
		</select>
		{#if merge_col_1 && merge_col_2}
			<button on:click={joinColumns} data-testid="merge-keyed-button">keyed merge</button>
		{/if}
	{/if}
</div>
