<script lang="ts">
	import { df } from '$lib/Store';
	import type { DataFrameLike } from '$lib/Types';
	import info from '$assets/icons/info.svg';
	import { Tooltip, Button } from 'flowbite-svelte';

	const columns1 = df.columns;
	$: columns2 = second_data?.columns;

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
		<div class="flex w-full items-center justify-center px-10">
			<button><img src={info} alt="info icon" class="mr-2 h-12" data-testid="info-icon" /></button>
			<Tooltip
				placement="top"
				class="z-20 w-48 bg-gray-600 text-sm font-light opacity-90"
				data-testid="info-bubble"
			>
				Use the <span class="font-bold">Index merge</span> to attach columns in their index order,
				if not select the column names from the datasets that you want to match and do a
				<span class="font-bold">Keyed merge</span>.
			</Tooltip>
			<select
				class="focus:ring-primary-500 focus:border-primary-500 mr-2 h-12 max-w-32 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900"
				bind:value={merge_col_1}
				data-testid="col1-select"
			>
				{#each $columns1 as col, i}
					<option value={i}>{col.name}</option>
				{/each}
			</select>
			<select
				class="focus:ring-primary-500 focus:border-primary-500 mr-2 h-12 max-w-32 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900"
				bind:value={merge_col_2}
				data-testid="col2-select"
			>
				{#each second_data.columns as col, i}
					<option value={i}>{col.name}</option>
				{/each}
			</select>
			<Button
				class="mr-2 h-12 rounded-md border border-gray-300 bg-white text-sm font-bold text-darkblue hover:bg-gray-100"
				on:click={handleRowWiseMerge}
				data-testid="merge-index-button">Index merge</Button
			>
			{#if $columns1[merge_col_1] !== undefined && columns2[merge_col_2] !== undefined}
				<Button
					class="h-12 rounded-md border border-gray-300 bg-white text-sm font-bold text-darkblue hover:bg-gray-100"
					on:click={joinColumns}
					data-testid="merge-keyed-button">Keyed merge</Button
				>
			{/if}
		</div>
	{/if}
</div>
