<script lang="ts">
	import Filter from '$lib/filtering/Filter.svelte';
	import Importer from '$lib/importer/Importer.svelte';
	import { APP_NAME, df } from '$lib/Store';
	import Table from '$lib/table/Table.svelte';
	import { hasMissingValues, rowWiseMerge } from '$lib/utils/DataFrameUtils';
	import DataFrame from 'dataframe-js';
	import { onMount } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
	import { Button } from 'flowbite-svelte';
	import nextImg from '$lib/static/next.png';
	import { type DataFrameLike } from '$lib/dataframe/DataFrame';

	const columns = df.columns;
	const rows = df.rows;
	
	$: missing_values = $columns.some(c => c.hasMissing);
	$: columns_with_missing = $columns.filter(c => c.hasMissing);

	let merge_col_1: number;
	let merge_col_2: number;

	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	onMount(() => {
		loadSession();
	});

	/**
	 * Saves the data to the session storage
	 */
	function saveCurrentDF() {
		// set the storage to the updated data
		sessionStorage.setItem('current-df', JSON.stringify(df.get()));
	}

	/**
	 * Removes rows from data that miss values
	 */
	function removeMissingValues() {
		$rows.filter(row => row.every(cell => cell !== undefined));
	}

	let second_data: DataFrameLike;

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

<svelte:head>
	<title>Data - {APP_NAME}</title>
</svelte:head>

<div class="h-full flex flex-col justify-around pt-4">
	<div class="flex justify-center pt-16">
		{#if missing_values}
			<span class="flex flex-col items-center">
				<p class="py-4 px-6 text-red-500 font-mono">
					Warning: Missing values detected in [{columns_with_missing.map(c => c.name).join(', ')}]
				</p>
				<button
					class="w-2/3 rounded-lg py-1 text-red-50 bg-red-400 font-bold hover:text-slate-300 hover:bg-red-500"
					on:click={removeMissingValues}
					data-testid="remove-missing-button"
				>
					Remove missing values
				</button>
			</span>
		{/if}
	</div>

	<div class="flex justify-between items-center p-5">
		<Filter />
		<div
			class="flex items-center justify-center max-w-32 max-h-14 h-full w-full bg-darkblue rounded-lg hover:bg-blue-900"
		>
			<!-- Given that it was implemented with an a link, right now you need to click on the words to go to next page -->
			<Button
				href="/select"
				class=" text-offwhite font-bold rounded-lg text-sm w-full"
				on:click={saveCurrentDF}
				data-testid="next-link"
			>
				<div class="flex justify-center items-center">
					Next
					<img src={nextImg} class=" invert w-8 h-8 ml-4" alt="Next icon" />
				</div>
			</Button>
		</div>
	</div>

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

	<div class="flex items-center justify-center content-between h-[60%] px-24">
		<div class="h-full w-full p-4">
			<Table />
		</div>
		<div class="ml-10">
			<Importer on:input={(e) => (second_data = e.detail.data)} />
		</div>
	</div>
</div>
