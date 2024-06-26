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

	// const datasets = [
	// 	{
	// 		label: 'M',
	// 		labels: ['1', '2', '4', '6'],
	// 		data: [10, 20, 40, 60],
	// 		backgroundColor: 'red',
	// 		borderColor: 'rgba(0, 0, 0, 1)',
	// 		borderWidth: 1
	// 	},
	// 	{
	// 		label: 'F',
	// 		labels: ['1', '3', '4', '5'],
	// 		data: [10, 30, 40, 50],
	// 		backgroundColor: 'blue',
	// 		borderColor: 'rgba(0, 0, 0, 1)',
	// 		borderWidth: 1
	// 	},
	// ];

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
					text: getTitleText(data, selectedFunction)
				}
			},
			scales: {
				x: {
					title: {
						display: true,
						text: getScaleXAxisText(data)
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
	<div slot="graph-slot">
		<canvas data-testid="canvas-element" bind:this={canvas} />
	</div>
</GraphContainer>
