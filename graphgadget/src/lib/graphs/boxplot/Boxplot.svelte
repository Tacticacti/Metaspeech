<script lang="ts">
	import { data } from '$lib/Store';
	import { Chart, type ChartConfiguration, LinearScale, CategoryScale } from 'chart.js';
	import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
	import { onMount, onDestroy, afterUpdate } from 'svelte';
	import { setColor } from '$lib/utils/CanvasUtils';
	import PngButton from '$lib/exporter/png/PNGButton.svelte';
	import JpgButton from '$lib/exporter/jpg/JPGButton.svelte';
	import { selectedColumns } from '$lib/Store';
	import WarningGenerator from '$lib/warning-generator/WarningGenerator.svelte';

	Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	// setup chart after canvas is mounted
	onMount(() => {
		const boxplotData = {
			// define label tree
			labels: [],
			datasets: [{}]
		};
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		const cfg: ChartConfiguration = {
			type: 'boxplot',
			data: boxplotData,

			options: {
				plugins: {
					// @ts-expect-error Needs a specific type for plugin
					customCanvasBackgroundColor: {
						color: 'lightgreen'
					}
				}
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});
	afterUpdate(() => {
		const boxplotData = {
			// define label tree
			labels: $selectedColumns,
			datasets: [
				{
					label: 'Dataset 1',
					backgroundColor: 'rgba(255,0,0,0.5)',
					borderColor: 'red',
					borderWidth: 1,
					outlierColor: '#999999',
					padding: 0,
					itemRadius: 5,
					data: getColumnData($selectedColumns)
				}
			]
		};
		chart.data = boxplotData;
		chart.update();
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});

	export function getColumnData(column_names: string[]) {
		let ret: string[][] = [];
		for (let i = 0; i < column_names.length; i++) {
			ret.push($data.toArray(column_names[i]));
		}
		return ret;
	}
</script>

<WarningGenerator
	needNumbers={true}
	columnsAreLimited={false}
	maxColumns={100}
	valuesAreLimited={true}
	maxValues={1}
></WarningGenerator>

<div class="flex flex-col items-center">
	<canvas data-testid="canvas-element" bind:this={canvas} class="mb-4" />
	<Export {chart} />
</div>

<style>
	div > canvas {
		width: 800px;
	}
</style>
