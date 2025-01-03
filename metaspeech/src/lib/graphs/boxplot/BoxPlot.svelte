<script lang="ts">
	import { Chart, type ChartConfiguration, LinearScale, CategoryScale } from 'chart.js';
	import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
	import { onDestroy, afterUpdate } from 'svelte';
	import type { GroupedDataFrame } from '$lib/Types';
	import { flipKeys, getBoxPlotData, getChartConfig } from './helper';
	import { sortGroups } from '$lib/dataframe/DataFrame';
	import GraphContainer from '../GraphContainer.svelte';
	import Export from '$lib/components/exporter/GraphImageExport.svelte';
	import EditChart from '../utils/EditChart.svelte';

	export let data: GroupedDataFrame;

	Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	afterUpdate(() => {
		data.groups = sortGroups(data.groups);
		const boxplotData = getBoxPlotData(data);

		// @ts-expect-error type error
		const cfg: ChartConfiguration = getChartConfig(boxplotData, data);

		chart ??= new Chart(canvas, cfg);

		//@ts-expect-error not sure the type of this obj
		chart.data = boxplotData;

		let xAxisScaleText = data.groupedColumns.length > 0 ? data.groupedColumns[0].name : 'All';
		if (chart?.options?.plugins?.legend?.title?.text) {
			chart.options.plugins.legend.title.text =
				data.groupedColumns.length === 2 ? data.groupedColumns[1].name : '';
		}

		chart.options.scales = {
			y: {
				title: {
					display: true,
					text: data.aggregateColumn?.name
				}
			},
			x: {
				title: {
					display: true,
					text: xAxisScaleText
				}
			}
		};
		chart.update();
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});
</script>

<GraphContainer>
	<div slot="option-slot" class="flex w-full items-center justify-around">
		<button
			data-testid="flip-button"
			on:click={() => (data = flipKeys(data))}
			class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
		>
			change “group by” on the x-axis</button
		>
		<Export {chart} />
		<EditChart {chart} chartType="boxplot" />
	</div>
	<div slot="graph-slot">
		<canvas data-testid="canvas-element" bind:this={canvas} class="mb-4" />
	</div>
</GraphContainer>

<style>
	div > canvas {
		width: 800px;
	}
</style>
