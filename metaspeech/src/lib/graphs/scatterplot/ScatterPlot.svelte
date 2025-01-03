<script lang="ts">
	import type { GroupedDataFrame } from '$lib/Types';
	import { scatterStyles } from '$lib/Constants';
	import { afterUpdate, onMount, onDestroy } from 'svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import Export from '$lib/components/exporter/GraphImageExport.svelte';
	import {
		getScatterDatasets,
		getXAxisCol,
		getLegendCol
	} from '$lib/graphs/scatterplot/ScatterPlotController';
	import { setColor } from '$lib/graphs/utils/CanvasUtils';
	import { sortGroups } from '$lib/dataframe/DataFrame';
	import GraphContainer from '../GraphContainer.svelte';
	import EditChart from '../utils/EditChart.svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	export let data: GroupedDataFrame;

	const yAxisCol = data.aggregateColumn!;
	let xAxisCol = getXAxisCol(data.groupedColumns);
	let legendCol = getLegendCol(data.groupedColumns, xAxisCol);

	$: sortGroups(data.groups);

	$: y_axis = yAxisCol.name;
	$: x_axis = xAxisCol.name;
	$: legend = legendCol?.name;

	$: datasets = getScatterDatasets(data, xAxisCol, legendCol, scatterStyles);

	/**
	 * Swaps the x-axis column with the legend column
	 */
	function swapGroupColumns() {
		if (legendCol?.type !== 'number') return;

		[legendCol, xAxisCol] = [xAxisCol, legendCol];
	}

	onMount(() => {
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		const cfg: ChartConfiguration = {
			type: 'scatter',
			data: {
				datasets: []
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});

	afterUpdate(() => {
		chart.options = {
			plugins: {
				// @ts-expect-error Needs a specific type for plugin
				customCanvasBackgroundColor: {
					color: 'white'
				},
				title: {
					display: true,
					text: `${y_axis} against ${x_axis} ${legend ? 'grouped by ' + legend! : ''}`
				},
				legend: {
					display: legendCol !== undefined,
					position: 'right',
					title: {
						display: true,
						text: legend
					},
					labels: {
						usePointStyle: true
					}
				}
			},
			scales: {
				x: {
					title: {
						display: true,
						text: x_axis
					}
				},
				y: {
					title: {
						display: true,
						text: y_axis
					}
				}
			}
		};

		chart.data.datasets = datasets.map((ds) => {
			return {
				data: ds.data,
				label: ds.label,
				...ds.style,
				radius: 7
			};
		});

		chart.update();
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<GraphContainer>
	<div slot="option-slot" class="flex w-full items-center justify-around">
		{#if legendCol?.type === 'number'}
			<div>
				<button
					data-testid="scatter-swap-columns"
					on:click={swapGroupColumns}
					class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
				>
					Swap x-axis and legend
				</button>
			</div>
		{/if}
		<Export {chart} />
		<EditChart {chart} chartType="scatter"></EditChart>
	</div>
	<div slot="graph-slot">
		<canvas data-testid="canvas-element" bind:this={canvas} class="mb-4" />
	</div>
</GraphContainer>
