<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { getTableInfo, isColumnFrequency } from '$lib/graphs/histogram/HistogramController';
	import { Grid } from 'gridjs';
	import { data, selectedColumns, selectedValues, binSizes } from '$lib/Store';
	import 'gridjs/dist/theme/mermaid.css';
	import StatisticsSelector from '$lib/statistics-selector/StatisticsSelector.svelte';

	let tableWrapper: HTMLDivElement;

	let valuesNotFreq: string[] = $selectedValues.filter((v) => !isColumnFrequency(v));
	let columnsToMean: string[] = valuesNotFreq;
	let columnsToSum: string[] = [];

	let grid: Grid;

	$: [tableColumns, tableData] = getTableInfo(
		$data.toCollection(true),
		$selectedColumns,
		$selectedValues,
		$binSizes,
		columnsToSum,
		columnsToMean
	);

	onMount(() => {
		grid = new Grid({
			columns: [],
			data: []
		}).render(tableWrapper);
	});

	afterUpdate(() => {
		grid
			.updateConfig({
				columns: tableColumns,
				data: tableData
			})
			.forceRender();
	});
</script>

<StatisticsSelector bind:columnsToSum bind:columnsToMean bind:valuesNotFreq />

<div bind:this={tableWrapper}></div>

<style>
</style>
