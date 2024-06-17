<script lang="ts">
	import { type DataType } from '$lib/Types';
	import { df } from '$lib/Store';
	import { afterUpdate } from 'svelte';
	import { get } from 'svelte/store';
	import { Button, Checkbox, Input, Select } from 'flowbite-svelte';
	import filterImg from '$assets/icons/filter.png';

	const columns = df.columns;

	let isOpen: boolean = false;
	let selectedIndex = 0;
	let filterValue: string = '';
	let useRangeChecked: boolean = true;
	let min: string = '';
	let max: string = '';

	$: selectedColumn = $columns[selectedIndex];
	$: columnNames = $columns.map((col) => col.name);
	$: useRange = selectedColumn?.type === 'number' && useRangeChecked;

	afterUpdate(() => {
		// pre-select a column
		if (selectedIndex >= columnNames.length) {
			selectedIndex = 0;
		}
	});

	/**
	 * Validate the input values and set error messages if invalid
	 * @returns true if the inputs are valid, false otherwise
	 */
	function validateInputs() {
		const minVal = parseFloat(min);
		const maxVal = parseFloat(max);

		const invalidRange =
			useRange &&
			(isNaN(minVal) || isNaN(maxVal) || min.trim() === '' || max.trim() === '' || minVal > maxVal);
		const invalidValue = !useRange && !filterValue.trim();

		if (invalidRange) {
			throw new Error('Please enter valid range values.');
		}
		if (invalidValue) {
			throw new Error('Please enter a value to filter');
		}
	}

	/**
	 * Filter the data based on the selected column and the filter value
	 * @param useMatching if true, remove rows that match the filter value. if false, remove rows that do not match the filter value.
	 */
	function filter(useMatching: boolean) {
		validateInputs();

		const originalCount = get(df.rows).length;

		df.filter((row) => matches(row[selectedIndex]) !== useMatching);

		const newCount = get(df.rows).length;

		if (newCount === originalCount) {
			const errorMessage = useRange
				? `No matching rows found for range ${min}-${max} in column "${selectedColumn.name}".`
				: `No matching rows found for value "${filterValue}" in column "${selectedColumn.name}".`;
			throw new Error(errorMessage);
		}
	}

	/**
	 * Check if the value matches the filter value
	 * @param value The value to check
	 * @returns true if the value matches the filter value, false otherwise
	 */
	function matches(value: DataType): boolean {
		if (useRange) {
			const num = value as number;
			const minValue = parseFloat(min);
			const maxValue = parseFloat(max);
			return num >= minValue && num <= maxValue;
		}

		return (value?.toString() ?? '') === filterValue;
	}
</script>

<Button
	class="max-h-14 max-w-32 rounded-lg bg-darkblue px-12 py-4 font-bold text-offwhite hover:bg-blue-900"
	on:click={() => (isOpen = !isOpen)}
>
	<img src={filterImg} class="mr-4 h-8 w-8 invert" alt="Filter icon" />
	Filter
</Button>

{#if isOpen}
	<div class="flex flex-wrap justify-center" data-testid="filter-window">
		<Select class="mr-2 max-w-28" bind:value={selectedIndex} data-testid="column-select">
			{#each $columns as col, index}
				<option value={index}>{col.name}</option>
			{/each}
		</Select>
		{#if selectedColumn?.type === 'number'}
			<Checkbox class="mx-2" bind:checked={useRangeChecked} data-testid="userange-check">
				Select Range
			</Checkbox>
		{/if}

		{#if useRange}
			<div class="mr-5 flex justify-center">
				<Input
					class="mr-1 max-w-16"
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
				class="mr-2 max-w-28"
				type="text"
				placeholder="Value to filter"
				bind:value={filterValue}
				data-testid="textfilter-input"
			/>
		{/if}

		<div class="flex flex-wrap justify-center">
			<Button
				color="light"
				class="mr-2 rounded-md px-5 py-3 font-bold text-darkblue"
				on:click={() => filter(true)}
				data-testid="remove-matching-button"
			>
				Remove matching
			</Button>
			<Button
				color="light"
				class="rounded-md px-5 py-3 font-bold text-darkblue"
				on:click={() => filter(false)}
				data-testid="remove-nonmatching-button"
			>
				Remove non-matching
			</Button>
		</div>
	</div>
{/if}
