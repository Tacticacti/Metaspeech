<script lang="ts">
	import Filter from '$lib/filtering/Filter.svelte';
	import Importer from '$lib/importer/Importer.svelte';
	import { data } from '$lib/Store';
	import Table from '$lib/table/Table.svelte';
	import { hasMissingValues, rowWiseMerge } from '$lib/utils/DataFrameUtils';
	import DataFrame from 'dataframe-js';
	import type { Bundle } from '$lib/types';
	import { onMount } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';

	$: column_names = $data.listColumns() as string[];
	$: missing_values = hasMissingValues($data);
	$: columns_with_missing = [...new Set(missing_values.map((v) => v[1]))].map(
		(v) => column_names[v]
	);

	let merge_col_1: string;
	let merge_col_2: string;

	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	onMount(() => {
		loadSession();
	});

	function handleClick() {
		// set the storage to the updated data
		sessionStorage.setItem('current-df', JSON.stringify($data));
	}

	function removeMissingValues() {
		$data = $data.dropMissingValues(column_names);
	}

	let second_data: DataFrame;
	function handleInput(event: CustomEvent<Bundle>) {
		second_data = event.detail.input;
	}

	function handleRowWiseMerge() {
		$data = rowWiseMerge($data, second_data);
	}

	function joinColumns() {
		let renamed = second_data;
		if (merge_col_1 !== merge_col_2) {
			renamed = second_data.rename(merge_col_2, merge_col_1);
		}
		$data = $data.join(renamed, merge_col_1);
	}
</script>

{#if missing_values.length !== 0}
	<span>
		<p>Warning: Missing values detected in: {columns_with_missing.join(', ')}</p>
		<button on:click={removeMissingValues} data-testid="remove-missing-button"
			>Remove missing values</button
		>
	</span>
{/if}

<a href="/select" on:click={handleClick} data-testid="next-link">Next</a>

<Importer on:input={handleInput} />

{#if second_data}
	<button on:click={handleRowWiseMerge} data-testid="merge-index-button">Index merge</button>
	<select bind:value={merge_col_1} data-testid="col1-select">
		{#each column_names as col}
			<option value={col}>{col}</option>
		{/each}
	</select>
	<select bind:value={merge_col_2} data-testid="col2-select">
		{#each second_data.listColumns() as col}
			<option value={col}>{col}</option>
		{/each}
	</select>
	{#if merge_col_1 && merge_col_2}
		<button on:click={joinColumns} data-testid="merge-keyed-button">keyed merge</button>
	{/if}
{/if}

<Filter />

<Table />
