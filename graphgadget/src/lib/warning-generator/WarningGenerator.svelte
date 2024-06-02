<script lang="ts">
	import { getNonNumericalColumns } from '$lib/column-selector/ColumnHelper';
	import { data } from '$lib/Store.js';
	import { selectedColumns, selectedValues } from '$lib/Store.js';

	/**
	 * Whether the columns should be numbers
	 */
	export let needNumbers: boolean;

	/**
	 * Whether the columns amount of columns selected is limited
	 */
	export let columnsAreLimited: boolean;
	/**
	 * The limit of columns
	 */
	export let maxColumns: number;

	/**
	 * Whether the amount of selected values is limited
	 */
	export let valuesAreLimited: boolean;
	/**
	 * The limit of selected values
	 */
	export let maxValues: number;

	let nonNumericColumns = getNonNumericalColumns($selectedColumns, $data.toCollection(true));
</script>

<div class="space-y-4 mr-5">
	{#if needNumbers}
		{#each nonNumericColumns as column}
			<div data-testid="warning-{column}" class="bg-yellow-100 text-yellow-800 p-2 rounded-md">
				Warning: column {column} is not a number!
			</div>
		{/each}
	{/if}
	{#if columnsAreLimited && $selectedColumns.length > maxColumns}
		<div data-testid="groupby-limit" class="bg-red-100 text-red-800 p-2 rounded-md">
			Number of columns are limited. Limit: {maxColumns}. Number of selected columns: {$selectedColumns.length}
		</div>
	{/if}
	{#if valuesAreLimited && $selectedValues.length > maxValues}
		<div data-testid="select-limit" class="bg-red-100 text-red-800 p-2 rounded-md">
			Number of select values are limited. Limit: {maxValues}. Number of selected select values: {$selectedValues.length}
		</div>
	{/if}
</div>
