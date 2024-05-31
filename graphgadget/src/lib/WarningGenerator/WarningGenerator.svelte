<script lang="ts">
	import { getNonNumericalColumns } from '$lib/ColumnSelector/ColumnHelper';
	import { data } from '$lib/Store.js';
	import { selectedColumns, selectedValues } from '$lib/Store.js';

	export let needNumbers: boolean;

	export let columnsAreLimited: boolean;
	export let maxColumns: number;

	export let valuesAreLimited: boolean;
	export let maxValues: number;

	let nonNumericColumns = getNonNumericalColumns($selectedColumns, $data.toCollection(true));
	$: _selectedColumns = $selectedColumns;
</script>

{#if needNumbers}
	{#each nonNumericColumns as column}
		<div data-testid="warning-{column}">Warning: column {column} is not a number!</div>
	{/each}
{/if}
{#if columnsAreLimited && _selectedColumns.length > maxColumns}
	<div data-testid="groupby-limit">
		Number of columns are limited. Limit: {maxColumns}. Number of selected columns: {$selectedColumns.length}
	</div>
{/if}
{#if valuesAreLimited && $selectedValues.length > maxValues}
	<div data-testid="select-limit">
		Number of select values are limited. Limit: {maxValues}. Number of selected select values: {$selectedValues.length}
	</div>
{/if}
