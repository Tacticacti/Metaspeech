<script lang="ts">
	import type { GroupedDataFrame } from '$lib/Types';
	import { afterUpdate } from 'svelte';
	import { Chart } from 'chart.js';
	import 'chartjs-chart-error-bars';
	import { sortGroups } from '$lib/dataframe/DataFrame';
	import { onDestroy } from 'svelte';
	import { getScaleYAxisText } from '$lib/graphs/sharedFunctions';
	import { createConfig, createDatasets, handleData } from './helper';
	import GraphContainer from '../GraphContainer.svelte';
	import Export from '$lib/components/exporter/GraphImageExport.svelte';
	import EditChart from '../utils/EditChart.svelte';
	import { BarWithErrorBarsChart } from 'chartjs-chart-error-bars';

	export let data: GroupedDataFrame;
	$: sortGroups(data.groups);
	let aggregationHappens: boolean = data.aggregateColumn !== undefined;

	let selectedFunction: string = aggregationHappens ? 'Mean' : 'Count';
	let possibleFunctionsForAggregation: string[] = ['Mean', 'Mean + Standard Deviation', 'Sum'];
	let possibleFunctionsForNonAggregation: string[] = ['Count', 'Percentage'];

	let chart: Chart;
	let canvas: HTMLCanvasElement;

	afterUpdate(() => {
		const [labels, values] = handleData(selectedFunction, data);

		const datasets = createDatasets(data, values, selectedFunction);

		const cfg = createConfig(labels, datasets, data, selectedFunction);

		chart ??= new BarWithErrorBarsChart(canvas, cfg);

		chart.options.plugins!.title!.text = cfg.options!.plugins!.title!.text;

		chart.data.labels = labels;
		chart.data.datasets = datasets;
		chart.options.scales = {
			y: {
				title: {
					display: true,
					text: getScaleYAxisText(data, selectedFunction)
				}
			}
		};

		chart.update();
	});

	onDestroy(() => {
		chart?.destroy();
	});
</script>

<GraphContainer>
	<div slot="option-slot" class="flex w-full items-center justify-around">
		<div>
			{#if aggregationHappens}
				<select
					bind:value={selectedFunction}
					class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out"
					data-testid="aggregation-select"
				>
					{#each possibleFunctionsForAggregation as func}
						<option value={func} data-testid="aggregation-{func}">{func}</option>
					{/each}
				</select>
			{:else}
				<select bind:value={selectedFunction} data-testid="nonaggregation-select" class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out">
					{#each possibleFunctionsForNonAggregation as func}
						<option value={func} data-testid="nonaggregation-{func}">{func}</option>
					{/each}
				</select>
			{/if}
		</div>
		<Export {chart} />
		<EditChart {chart} chartType="histogram" />
	</div>
	<div slot="graph-slot">
		<canvas data-testid="canvas-element" bind:this={canvas} />
	</div>
</GraphContainer>
