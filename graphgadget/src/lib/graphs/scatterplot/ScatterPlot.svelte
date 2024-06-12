<script lang="ts">
	import type { GroupedDataFrame, Column } from '$lib/Types';
	import { afterUpdate, onMount, onDestroy } from 'svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import Export from '$lib/components/exporter/GraphImageExport.svelte';
	import { setColor } from '$lib/graphs/utils/CanvasUtils';
	import { getScatterDatasets, getXAxisCol, getLegendCol } from '$lib/graphs/scatterplot/ScatterPlotController';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	export let data: GroupedDataFrame;

	const yAxisCol = data.aggregateColumn!;
	let xAxisCol = getXAxisCol(data.groupedColumns);
	let legendCol = getLegendCol(data.groupedColumns, xAxisCol);

	$: y_axis = yAxisCol.name;
	$: x_axis = xAxisCol.name;
	$: legend = legendCol?.name;

	$: datasets = getScatterDatasets(data, yAxisCol, xAxisCol, legendCol);

	function swapGroupColumns() {
		if (legendCol === undefined) {
			return;
		}
		if (legendCol!.type !== 'number') {
			return;
		}

		const temp = legendCol!;
		legendCol = xAxisCol;
		xAxisCol = temp;
	}

	onMount(() => {
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		const cfg: ChartConfiguration = {
			type: 'scatter',
			data: {
				labels: [],
				datasets: []
			},

			options: {
				plugins: {
					// @ts-expect-error Needs a specific type for plugin
					customCanvasBackgroundColor: {
						color: 'white'
					},
					title: {
						display: true,
						text: y_axis + ' x ' + x_axis
					},
					legend: {
						display: true,
						position: 'right',
						title: {
							display: true,
							text: legend,
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
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});


	// called when datasets change
	afterUpdate(() => {
		for (const ds of datasets) {
			chart.data.datasets.push({
				...ds,
				radius: 7
			});
		}

		chart.update();
	});

	onDestroy(() => {
		if (chart) { 
			chart.destroy();
		}
	});
</script>

{#if legendCol?.type === 'number'}
	<button on:click={swapGroupColumns}>
		Swap x-axis and legend
	</button>
{/if}

<div class="flex flex-col items-center w-full w-1200">
	<canvas data-testid="canvas-element" bind:this={canvas} class="mb-4" />
	<Export {chart} />
</div>

<style>
	.w-1200 {
		width: 1200px;
	}
</style>

