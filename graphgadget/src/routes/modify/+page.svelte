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
	import NavBar from '$lib/shared-components/NavBar.svelte';
	import Footer from '$lib/shared-components/Footer.svelte';

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

<main class="bg-offwhite max-w-full min-h-screen m-0">
	<NavBar currentPage={'modify'} />
	<div class="flex justify-center pt-16 m-5 max-w-full">
		{#if missing_values.length !== 0}
			<span class="flex flex-col items-center">
				<p class="mt-2 py-2 px-6 text-red-500 font-mono">
					Warning: Missing values detected in [{columns_with_missing.join(', ')}]
				</p>
				<button
					class="mt-2 w-2/3 rounded-lg py-1 text-red-50 bg-red-400 font-bold hover:text-slate-300 hover:bg-red-500"
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
			class="flex items-center justify-center max-w-32 max-h-14 py-4 px-12 bg-darkblue rounded-lg hover:bg-blue-900"
		>
			<!-- Given that it was implemented with an a link, right now you need to click on the words to go to next page -->
			<a
				href="/select"
				class=" text-offwhite font-bold rounded-lg text-sm mr-4"
				on:click={handleClick}
				data-testid="next-link">Next</a
			>
			<img src="next.png" class=" invert w-8 h-8" alt="Next icon" />
		</div>
	</div>

	<div>
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
	</div>

	<div class="flex">
		<Table />
		<Importer on:input={handleInput} />
	</div>
	<Footer />
</main>
