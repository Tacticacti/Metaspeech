<script lang="ts">
	import { df } from '$lib/Store';
	import type { DataFrameLike } from '$lib/Types';
	import info from '$assets/icons/info.svg';
	import { Tooltip, Button } from 'flowbite-svelte';
	import { mergeTypes } from '$lib/Constants';
	import Toast from '$components/Toast.svelte';

	const columns1 = df.columns;
	$: columns2 = second_data?.columns;

	export let second_data: DataFrameLike | undefined;
	let merge_col_1: number;
	let merge_col_2: number;

	let selectedMergeType: string = mergeTypes[0];

	/**
	 * Merges the dataframes, either with index or with key
	 */
	function handleMerge() {
		if (selectedMergeType === mergeTypes[0]) {
			df.join(second_data!);
			message = 'File merged by indexes';
			showCustomToast();
			second_data = undefined;
			return;
		}

		if ($columns1[merge_col_1] === undefined || columns2![merge_col_2] === undefined) {
			throw new Error('Please select the columns to use as keys.');
		}

		df.keyedJoin(second_data!, merge_col_1, merge_col_2);
		message = 'File merged by keys';
		showCustomToast();
		second_data = undefined;
	}

	/**
	 * Everything for the toast
	 */
	let showToast: boolean = false;
	let message: string = 'File merged by keys';

	function showCustomToast() {
		showToast = true;
	}

	function handleClose() {
		showToast = false;
	}
</script>

<div>
	{#if second_data}
		<div class="flex w-full items-center justify-center px-10">
			<select
				bind:value={selectedMergeType}
				class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out"
				data-testid="merge-type-select"
			>
				{#each mergeTypes as type}
					<option value={type} data-testid={type}>{type}</option>
				{/each}
			</select>
			<button
				><img src={info} alt="info icon" class="ml-2 mr-10 h-12" data-testid="info-icon" /></button
			>
			<Tooltip
				placement="top"
				class="z-20 w-48 bg-gray-600 text-sm font-light opacity-90"
				data-testid="info-bubble"
			>
				Use the <span class="font-bold">{mergeTypes[0]}</span> to attach columns in the order they
				appear in the files. Use the <span class="font-bold">{mergeTypes[1]}</span> to select the column
				names from the datasets that you want to join.
			</Tooltip>

			{#if selectedMergeType === mergeTypes[1]}
				<select
					class="focus:ring-primary-500 focus:border-primary-500 mr-2 h-12 max-w-32 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900"
					bind:value={merge_col_1}
					data-testid="col1-select"
				>
					{#each $columns1 as col, i}
						<option value={i}>{col.name}</option>
					{/each}
				</select>
				<Tooltip
					placement="top"
					class="z-20 w-48 bg-gray-600 text-sm font-light opacity-90"
					data-testid="info-bubble"
				>
					Select a column from the first file you imported.
				</Tooltip>
				<select
					class="focus:ring-primary-500 focus:border-primary-500 mr-2 h-12 max-w-32 rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900"
					bind:value={merge_col_2}
					data-testid="col2-select"
				>
					{#each second_data.columns as col, i}
						<option value={i}>{col.name}</option>
					{/each}
				</select>
				<Tooltip
					placement="top"
					class="z-20 w-48 bg-gray-600 text-sm font-light opacity-90"
					data-testid="info-bubble"
				>
					Select a column from the second file you imported.
				</Tooltip>
			{/if}

			<Button
				class="mr-2 h-12 rounded-md border border-gray-300 bg-white text-sm font-bold text-darkblue hover:bg-gray-100"
				on:click={handleMerge}
				data-testid="merge-button">Merge</Button
			>
		</div>
	{/if}
</div>

{#if showToast}
	<Toast {message} color="green" duration={3000} on:close={handleClose} />
{/if}
