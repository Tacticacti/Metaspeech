<script lang="ts">
	import { data } from '$lib/Store';
	import { afterUpdate } from 'svelte';
	import { isNumber } from 'chart.js/helpers';
	import { Button, Checkbox, Input, Select } from 'flowbite-svelte';
	import filterImg from '$lib/static/filter.png';

	let isOpen: boolean = false;

	let filterValue: string = '';
	let useRangeChecked: boolean = true;
	let min: number = 0;
	let max: number = 0;
	let selectedColumn: string;
	let isNumberColumn: boolean = false;

	$: useRange = isNumberColumn && useRangeChecked;

	afterUpdate(() => {
		const columns = $data.listColumns();

		// pre-select a column
		if (!selectedColumn || !columns.includes(selectedColumn)) {
			selectedColumn = columns[0];
		}

		// if statement for when there are no columns
		if (selectedColumn) {
			isNumberColumn = isNumber($data.getRow(0)?.get(selectedColumn));
		}
	});

	/**
	 * Filter the data based on the selected column and the filter value
	 * @param useMatching if true, remove rows that match the filter value. if false, remove rows that do not match the filter value.
	 */
	function filter(useMatching: boolean) {
		if (useRange) {
			// range filter
			$data = $data.filter(
				// @ts-expect-error dataframe badly defined types
				(row) => (row.get(selectedColumn) >= min && row.get(selectedColumn) <= max) !== useMatching
			);
			return;
		}

		// text filter
		// @ts-expect-error dataframe badly defined types
		$data = $data.filter((row) => (row.get(selectedColumn) == filterValue) !== useMatching);
	}
</script>

<Button
	class="max-w-32 max-h-14 py-4 px-12 font-bold rounded-lg bg-darkblue text-offwhite hover:bg-blue-900"
	on:click={() => (isOpen = !isOpen)}
>
	<img src={filterImg} class=" invert w-8 h-8 mr-4" alt="Filter icon" />
	Filter
</Button>

{#if isOpen}
	<div class="flex justify-center flex-wrap" data-testid="filter-window">
		<Select class="max-w-28 mr-2" bind:value={selectedColumn} data-testid="column-select">
			{#each $data.listColumns() as col}
				<option value={col}>{col}</option>
			{/each}
		</Select>
		{#if isNumberColumn}
			<Checkbox class="mx-2" bind:checked={useRangeChecked} data-testid="userange-check"
				>Select Range</Checkbox
			>
		{/if}

		{#if useRange}
			<div class="flex justify-center mr-5">
				<Input
					class="max-w-16 mr-1"
					type="number"
					placeholder="min"
					bind:value={min}
					data-testid="minrange-input"
				/>
				<Input
					class="max-w-16"
					type="number"
					placeholder="max"
					bind:value={max}
					data-testid="maxrange-input"
				/>
			</div>
		{:else}
			<Input
				class="max-w-28 mr-2"
				type="text"
				placeholder="Value to filter"
				bind:value={filterValue}
				data-testid="textfilter-input"
			/>
		{/if}

		<div class="flex justify-center flex-wrap">
			<Button
				color="light"
				class="px-5 py-3 mr-2 rounded-md font-bold text-darkblue"
				on:click={() => filter(true)}
				data-testid="remove-matching-button"
			>
				Remove matching
			</Button>
			<Button
				color="light"
				class="px-5 py-3 rounded-md font-bold text-darkblue"
				on:click={() => filter(false)}
				data-testid="remove-nonmatching-button"
			>
				Remove non-matching
			</Button>
		</div>
	</div>
{/if}
