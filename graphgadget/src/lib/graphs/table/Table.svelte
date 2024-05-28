<script lang="ts">
	import { getNumericalColumnsAndMax } from '$lib/ColumnSelector/ColumnHelper';
	import { data } from '$lib/Store';
	import { afterUpdate, onMount } from 'svelte';
	import {
		getFrequenciesAndValues,
		getTableInfo,
		type BinDictionary,
		type MapDictionary
	} from '$lib/graphs/histogram/HistogramController';
	import { Grid } from "gridjs";
	import { selectedColumns } from '$lib/ColumnSelector/Store';
	import "gridjs/dist/theme/mermaid.css";

	let tableWrapper: HTMLDivElement;

	const columnNames = $data.listColumns() as string[];
	const numericColumns = getNumericalColumnsAndMax(columnNames, $data.toCollection(true));
	let displayColumns: string[] = [];
	let binSizes: BinDictionary = {};

	let grid: Grid;

	$: maps = getFrequenciesAndValues($data.toCollection(true), $selectedColumns, displayColumns, binSizes);
	$: [tableColumns, tableData] = getTableInfo(maps, $selectedColumns, displayColumns);

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

<div bind:this={tableWrapper}></div>

<style>
</style>
