<script lang="ts">
	import type { BarChartConfiguration, GroupedDataFrame } from '$lib/Types';
	import { onMount, afterUpdate } from 'svelte';
	import { Chart } from 'chart.js';
	import 'chartjs-chart-error-bars';
	import { sortGroups } from '$lib/dataframe/DataFrame';
	import { onDestroy } from 'svelte';
	import { getScaleXAxisText, getScaleYAxisText, getTitleText } from '$lib/graphs/sharedFunctions';
	import { getBarChartData } from './helper';
	import GraphContainer from '../GraphContainer.svelte';
	import Export from '$lib/components/exporter/GraphImageExport.svelte';
	import EditChart from '../utils/EditChart.svelte';
	import { BarWithErrorBarsChart } from 'chartjs-chart-error-bars';
	import { setColor } from '$lib/graphs/utils/CanvasUtils';

	export let data: GroupedDataFrame;
	$: sortGroups(data.groups);
	let aggregationHappens: boolean = data.aggregateColumn !== undefined;

	let legendColumn = data.groupedColumns[0];
	$: [labels, datasets] = getBarChartData(data, selectedFunction, legendColumn);
	$: newGroupedColumns = data.groupedColumns.filter((column) => column !== legendColumn);

	let selectedFunction: string = aggregationHappens ? 'Mean' : 'Count';
	let possibleFunctionsForAggregation: string[] = ['Mean', 'Mean + Standard Deviation', 'Sum'];
	let possibleFunctionsForNonAggregation: string[] = ['Count', 'Percentage'];

	let chart: Chart;
	let canvas: HTMLCanvasElement;

	onMount(() => {
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		const cfg: BarChartConfiguration = {
			type: 'barWithErrorBars',
			data: {
				datasets: []
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new BarWithErrorBarsChart(canvas, cfg);
	});

	afterUpdate(() => {
		chart.data = {
			labels: labels,
			datasets: datasets
		};

		chart.options = {
			plugins: {
				// @ts-expect-error Needs a specific type for plugin
				customCanvasBackgroundColor: {
					color: 'white'
				},
				title: {
					display: true,
					text: getTitleText(data, selectedFunction, legendColumn)
				},
				legend: {
					display: legendColumn !== undefined,
					position: 'right',
					title: {
						display: true,
						text: legendColumn?.name
					}
				}
			},
			scales: {
				x: {
					title: {
						display: true,
						text: getScaleXAxisText(newGroupedColumns)
					}
				},
				y: {
					title: {
						display: true,
						text: getScaleYAxisText(data, selectedFunction)
					}
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
				<select
					bind:value={selectedFunction}
					data-testid="nonaggregation-select"
					class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out"
				>
					{#each possibleFunctionsForNonAggregation as func}
						<option value={func} data-testid="nonaggregation-{func}">{func}</option>
					{/each}
				</select>
			{/if}
		</div>
		<Export {chart} />
		<EditChart {chart} chartType="histogram" />
	</div>

	<div slot="extra-option-slot" class="flex w-full items-center">
		<p class="font-bold text-white">Select a Legend Column:</p>
		<select
			bind:value={legendColumn}
			class="mx-4 my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out"
			data-testid="barchart-legend-select"
		>
			{#each data.groupedColumns as col}
				<option value={col} data-testid="barchart-legend-{col.name}">{col.name}</option>
			{/each}
		</select>
	</div>

	<div slot="graph-slot">
		<canvas data-testid="canvas-element" bind:this={canvas} />
	</div>
</GraphContainer>
