<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import {
		getTableInfo
	} from '$lib/graphs/histogram/HistogramController';
	import { Grid } from "gridjs";
	import { 
		data,
		selectedColumns,
		selectedValues,
		binSizes
	} from '$lib/Store';
	import "gridjs/dist/theme/mermaid.css";

	let tableWrapper: HTMLDivElement;

	let columnsToMean: string[] = [];

	let grid: Grid;

	$: [tableColumns, tableData] = getTableInfo($data.toCollection(true), $selectedColumns, $selectedValues, $binSizes);

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


<p>Parameters on the y-axis</p>

{#each $selectedValues as column}
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
