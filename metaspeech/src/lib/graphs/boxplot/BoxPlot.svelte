
<script lang="ts">
	import { Chart, type ChartConfiguration, LinearScale, CategoryScale } from 'chart.js';
	import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import type { GroupedDataFrame } from '$lib/Types';

	export let data: GroupedDataFrame;

	Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);

	let canvas: HTMLCanvasElement;
	let chart: Chart;


	afterUpdate(() => {
		//let datasets = 
		const boxplotData = {
			// define label tree
			labels: ['label1', 'label2'],
			datasets: [
				{
					label: 'Dataset 1',
					backgroundColor: 'rgba(0,255,0,0.5)',
					borderColor: 'red',
					borderWidth: 1,
					outlierColor: '#999999',
					padding: 0,
					itemRadius: 5,
					data: [[1, 2, 3, 2, 1]]
				},
				{
					label: 'Dataset 2',
					backgroundColor: 'rgba(255,0,0,0.5)',
					borderColor: 'red',
					borderWidth: 1,
					outlierColor: '#999999',
					padding: 0,
					itemRadius: 5,
					data: [[2, 3, 4, 5, 6, 5, 6], [2, 3, 4, 5, 6, 5, 6]]
				}
			]
		};
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: 'white'
		};

		const cfg: ChartConfiguration = {
			type: 'boxplot',
			data: boxplotData,

			options: {
				plugins: {
					// @ts-expect-error Needs a specific type for plugin
					customCanvasBackgroundColor: {
						color: 'white'
					},
					title: {
						display: true,
						text: 'title'
							//'Boxplot of (' + $selectedColumns.join(', ') + ')'
					}
				}
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});

</script>

<div class="flex flex-col items-center">
	<canvas data-testid="canvas-element" bind:this={canvas} class="mb-4" />
</div>

<style>
	div > canvas {
		width: 800px;
	}
</style>
