<script lang="ts">
	import { data } from '$lib/Store';
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import JpgButton from '$lib/shared-components/JPGButton.svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { setColor } from '$lib/utils/CanvasUtils';
	import { afterUpdate, onMount } from 'svelte';
	import ParameterSelector from '$lib/graphs/histogram/ParameterSelector.svelte';
	import {
		getNumericalColumns,
		calculateAxis,
		sortParallelArrays
	} from '$lib/graphs/histogram/HistogramController';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const columnNames = $data.listColumns() as string[];

	// TODO: find a better way to get the type,
	// currently only looks at first row.
	// Remember there can be undefined elements if not cleared
	const numericColumnNames = getNumericalColumns(columnNames, $data.getRow(0));

	let selectedParams: string[];
	let checkedMean: boolean;
	let parameterType: string;
	let binSizes: number[];

	// setup chart with empty config after canvas is mounted
	onMount(() => {
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		const cfg: ChartConfiguration = {
			type: 'bar',
			data: {
				labels: [],
				datasets: []
			},

			options: {
				plugins: {
					// @ts-expect-error Needs a specific type for plugin
					customCanvasBackgroundColor: {
						color: 'pink'
					}
				}
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});

	// update chart data
	afterUpdate(() => {
		let labels, values;

		[labels, values] = calculateAxis(
			$data.toCollection(true),
			selectedParams,
			checkedMean,
			parameterType,
			binSizes
		);
		[labels, values] = sortParallelArrays(labels, values);

		chart.data.labels = labels;
		chart.data.datasets = [
			{
				label: parameterType,
				data: values as number[],
				backgroundColor: 'rgba(51, 50, 200, 1)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}
		];

		chart.update();
	});
</script>

<ParameterSelector
	{columnNames}
	{numericColumnNames}
	bind:selectedParams
	bind:checkedMean
	bind:parameterType
	bind:binSizes
/>

<div>
	<canvas data-testid="canvas-element" bind:this={canvas} />
</div>

<PngButton {chart} />
<JpgButton {chart} />

<style>
	div > canvas {
		width: 800px;
	}
</style>
