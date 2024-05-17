<script lang="ts">
	import { data } from '$lib/Store';
	import { afterUpdate } from 'svelte';

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
			isNumberColumn = !isNaN($data.getRow(0)?.get(selectedColumn));
		}
	});

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

<button on:click={() => (isOpen = !isOpen)}>Filter</button>

{#if isOpen}
	<div data-testid="filter-window">
		<select bind:value={selectedColumn} data-testid="column-select">
			{#each $data.listColumns() as col}
				<option value={col}>{col}</option>
			{/each}
		</select>
		{#if isNumberColumn}
			<label>
				Select Range
				<input type="checkbox" bind:checked={useRangeChecked} data-testid="userange-check" />
			</label>
		{/if}

		{#if useRange}
			<input type="number" placeholder="min" bind:value={min} data-testid="minrange-input" />
			<input type="number" placeholder="max" bind:value={max} data-testid="maxrange-input" />
		{:else}
			<input
				type="text"
				placeholder="value to filter"
				bind:value={filterValue}
				data-testid="textfilter-input"
			/>
		{/if}

		<button on:click={() => filter(true)} data-testid="remove-matching-button"
			>Remove matching</button
		>
		<button on:click={() => filter(false)} data-testid="remove-nonmatching-button"
			>Remove non-matching</button
		>
	</div>
{/if}
