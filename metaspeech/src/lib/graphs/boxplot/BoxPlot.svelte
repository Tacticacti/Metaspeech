<script lang="ts">
	import { Chart, type ChartConfiguration, LinearScale, CategoryScale } from 'chart.js';
	import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
	import { onDestroy, afterUpdate } from 'svelte';
	import type { GroupedDataFrame } from '$lib/Types';
	import { flipKeys, getBoxPlotData, getChartConfig } from './helper';
	import { sortGroups } from '$lib/dataframe/DataFrame';

	export let data: GroupedDataFrame;

	Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	afterUpdate(() => {
		data.groups = sortGroups(data.groups);
		const boxplotData = getBoxPlotData(data);

		const cfg: ChartConfiguration = getChartConfig(boxplotData, data);

		chart ??= new Chart(canvas, cfg);

		//@ts-expect-error not sure the type of this obj
		chart.data = boxplotData;

		chart!.options!.plugins!.legend!.title!.text = data.groupedColumns[0].name;

		chart.options.scales = {
			x: {
				title: {
					display: true,
					text: data.groupedColumns[0].name
				}
			}
		};
		chart.update();
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});
</script>

<div class="flex flex-col items-center">
	<button data-testid="flip-button" on:click={() => (data = flipKeys(data))}> Flip Axis</button>
	<canvas data-testid="canvas-element" bind:this={canvas} class="mb-4" />
</div>

<style>
	div > canvas {
		width: 800px;
	}
</style>
