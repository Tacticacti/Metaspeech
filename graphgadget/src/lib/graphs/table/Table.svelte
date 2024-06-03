<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { getTableInfo, isColumnFrequency } from '$components/subgroup-controller/SubgroupController';
	import { Grid } from 'gridjs';
	import 'gridjs/dist/theme/mermaid.css';
	import StatisticsSelector from '$lib/components/statistics-selector/StatisticsSelector.svelte';
	import TsvExporter from '$components/exporter/tsv/TSVExporter.svelte';
	import LatexExporter from '$components/exporter/latex/LatexExporter.svelte';

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

<div data-testid="div-element" bind:this={tableWrapper}></div>

<TsvExporter tableInfo={[tableColumns, tableData]} />
<LatexExporter tableInfo={[tableColumns, tableData]} />

<style>
</style>
