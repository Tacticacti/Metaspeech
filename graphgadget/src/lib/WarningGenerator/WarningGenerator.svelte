<script lang="ts">
	import { selectedColumns } from './../ColumnSelector/Store';
	import { getNonNumericalColumns } from '$lib/ColumnSelector/ColumnHelper';
	import { afterUpdate } from 'svelte';
	import { data } from '$lib/Store.js';

	export let needNumbers: boolean;
	export let columnsAreLimited: boolean;
	export let maxColumns: number;

	let nonNumericColumns = getNonNumericalColumns($selectedColumns, $data);
	afterUpdate(() => {
		console.log(
			'needNumbers: ' + needNumbers + ', limited: ' + columnsAreLimited + ', max: ' + maxColumns
		);

		nonNumericColumns = getNonNumericalColumns($selectedColumns, $data);
	});
</script>

{#if needNumbers}
	{#each nonNumericColumns as column}
		<div data-testid="warning-{column}">Warning: column {column} is not a number!</div>
	{/each}
{/if}
{#if columnsAreLimited && $selectedColumns.length > maxColumns}
	<div>
		Number of columns are limited. Limit: {maxColumns}. Number of selected columns: {$selectedColumns.length}
	</div>
{/if}
