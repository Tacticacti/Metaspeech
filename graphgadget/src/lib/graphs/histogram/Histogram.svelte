<script lang="ts">
	import { data } from '$lib/Store';
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import JpgButton from '$lib/shared-components/JPGButton.svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { setColor } from '$lib/utils/CanvasUtils';
	import { onMount } from 'svelte';
	import { calculateAxis, sortParallelArrays } from '$lib/graphs/histogram/HistogramController';
	import {
		selectedColumns,
		checkedMean,
		selectedValues,
		binSizes,
		ABSOLUTE_FREQUENCY
	} from '$lib/ColumnSelector/Store';
	import WarningGenerator from '$lib/WarningGenerator/WarningGenerator.svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	// let checkedMean: boolean;
	// let parameterType: string;
	// let binSizes: BinDictionary;

	// setup chart with empty config after canvas is mounted
	onMount(() => {
		if ($selectedValues.length === 0) {
			$selectedValues = [ABSOLUTE_FREQUENCY];
		}

		let labels, values;
		[labels, values] = calculateAxis(
			$data.toCollection(true),
			$selectedColumns,
			$checkedMean,
			$selectedValues[0],
			$binSizes
		);
		[labels, values] = sortParallelArrays(labels, values);
		let datasets = [
			{
				label: $selectedValues[0],
				data: values as number[],
				backgroundColor: 'rgba(51, 50, 200, 1)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}
		];
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		const cfg: ChartConfiguration = {
			type: 'bar',
			data: {
				labels: labels,
				datasets: datasets
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
</script>

<!-- <ParameterSelector
	{numericColumns}
	bind:checkedMean
	bind:parameterType
	bind:binSizes
/> -->
<WarningGenerator
	needNumbers={false}
	columnsAreLimited={false}
	maxColumns={100}
	valuesAreLimited={true}
	maxValues={1}
></WarningGenerator>
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
