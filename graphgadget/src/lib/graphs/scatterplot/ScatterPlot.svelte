<script lang="ts">
	import type { GroupedDataFrame } from '$lib/Types';
	import { afterUpdate, onMount, onDestroy } from 'svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import Export from '$lib/components/exporter/GraphImageExport.svelte';
	import { setColor } from '$lib/graphs/utils/CanvasUtils';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	export let data: GroupedDataFrame;

	type ScatterDataset = {
		data: [number, number][];
		label: string;
		backgroundColor: string;
		borderColor: string;
		pointStyle: string;
	}

	let datasets: ScatterDataset[] = [
		{
			data: [
				[19, 10],
				[20, 30],
				[42, 32],
				[50, 33]
			],
			label: 'Male',
			backgroundColor: 'rgba(51, 50, 200, 1)',
			borderColor: 'rgba(51, 50, 200, 1)',
			pointStyle: 'cross'
		},
		{
			data: [
				[19, 20],
				[19, 40],
				[40, 40],
				[52, 30],
				[60, 50]
			],
			label: 'Female',
			backgroundColor: 'rgba(255, 99, 132, 1)',
			borderColor: 'rgba(255, 99, 132, 1)',
			pointStyle: 'rect'
		}
	];

	let x_axis = 'Age', y_axis = 'WER', legend = 'Gender';

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

<div class="flex flex-col items-center w-full w-1200">
	<canvas data-testid="canvas-element" bind:this={canvas} class="mb-4" />
	<Export {chart} />
</div>

<style>
	.w-1200 {
		width: 1200px;
	}
</style>

