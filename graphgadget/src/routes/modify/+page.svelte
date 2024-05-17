<script lang="ts">
	import Filter from '$lib/filtering/Filter.svelte';
	import Importer from '$lib/importer/Importer.svelte';
	import { data } from '$lib/Store';
	import Table from '$lib/table/Table.svelte';
	import { hasMissingValues, rowWiseMerge } from '$lib/utils/DataFrameUtils';
	import DataFrame from 'dataframe-js';

	$: column_names = $data.listColumns() as string[];
	$: missing_values = hasMissingValues($data);
	$: columns_with_missing = [...new Set(missing_values.map((v) => v[1]))].map(
		(v) => column_names[v]
	);

	function removeMissingValues() {
		$data = $data.dropMissingValues(column_names);
	}

	let second_data: DataFrame;
	function handleInput(event: CustomEvent<DataFrame>) {
		second_data = event.detail;
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

	let merge_col_1: string;
	let merge_col_2: string;
</script>

{#if missing_values.length !== 0}
	<span>
		<p>Warning: Missing values detected in: {columns_with_missing.join(', ')}</p>
		<button on:click={removeMissingValues} data-testid="remove-missing-button" >Remove missing values</button>
	</span>
{/if}

<a href="/view" data-testid="next-link" >Next</a>

<Importer on:input={handleInput} />

{#if second_data}
	<button on:click={handleRowWiseMerge} data-testid="merge-index-button" >Index merge</button>
	<select bind:value={merge_col_1} data-testid="col1-select" >
		{#each column_names as col}
			<option value={col}>{col}</option>
		{/each}
	</select>
	<select bind:value={merge_col_2} data-testid="col2-select" >
		{#each second_data.listColumns() as col}
			<option value={col}>{col}</option>
		{/each}
	</select>
	{#if merge_col_1 && merge_col_2}
		<button on:click={joinColumns} data-testid="merge-keyed-button" >keyed merge</button>
	{/if}
{/if}

<Filter />

<Table />
