<script lang="ts">
	import { getNumericalColumnsAndMax } from '$lib/ColumnSelector/ColumnHelper';
	import { data } from '$lib/Store';
	import { afterUpdate, onMount } from 'svelte';
	import {
		getTableInfo,
		type BinDictionary,
		ABSOLUTE_FREQUENCY,
		RELATIVE_FREQUENCY
	} from '$lib/graphs/histogram/HistogramController';
	import { Grid } from "gridjs";
	import { selectedColumns } from '$lib/ColumnSelector/Store';
	import "gridjs/dist/theme/mermaid.css";

	let tableWrapper: HTMLDivElement;

	const columnNames = $data.listColumns() as string[];
	const numericColumns = getNumericalColumnsAndMax(columnNames, $data.toCollection(true));
	let displayColumns: string[] = [];
	let columnsToMean: string[] = [];
	let binSizes: BinDictionary = {};

	let grid: Grid;

	$: [tableColumns, tableData] = getTableInfo($data.toCollection(true), $selectedColumns, displayColumns, binSizes);

	onMount(() => {
		grid = new Grid({
			columns: [],
			data: [],
		}).render(tableWrapper);
	});

	afterUpdate(() => {
		grid.updateConfig({
			columns: tableColumns,
			data: tableData
		}).forceRender();
	});
</script>

{#each numericColumns as column}
	{#if $selectedColumns.includes(column[0])}
		<br />
		<label>
			{column[0]} Bin Size:
			<input
				type="number"
				bind:value={binSizes[column[0]]}
				data-testid="number-bin-{column[0]}"
				name={column[0]}
				min="1"
				max={Math.abs(column[1]) + 1}
			/>
			<input
				type="range"
				bind:value={binSizes[column[0]]}
				data-testid="range-bin-{column[0]}"
				name={column[0]}
				min="1"
				max={Math.abs(column[1]) + 1}
			/>
		</label>
	{/if}
{/each}

<p>Parameters on the y-axis</p>
<label>
	<input
		type="checkbox"
		data-testid="y-check-absolute-frequency"
		name="y-params"
		value={ABSOLUTE_FREQUENCY}
		bind:group={displayColumns}
	/>
	{ABSOLUTE_FREQUENCY}
</label>
<label>
	<input
		type="checkbox"
		data-testid="y-check-relative-frequency"
		name="y-params"
		value={RELATIVE_FREQUENCY}
		bind:group={displayColumns}
	/>
	{RELATIVE_FREQUENCY}
</label>
{#each numericColumns as column}
	<label>
		<input
			type="checkbox"
			data-testid="y-check-{column[0]}"
			name="y-params"
			value={column[0]}
			bind:group={displayColumns}
		/>
		{column[0]}
	</label>
{/each}

<br />
{#each displayColumns as column}
	<input
		type="checkbox"
		data-testid="y-check-mean-{column}"
		name="y-params-mean"
		value={column}
		bind:group={columnsToMean}
	/>
	Mean {column}
{/each}

<div bind:this={tableWrapper}></div>

<style>
</style>
