<!-- <script lang="ts">
	import { data } from '$lib/Store';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { afterUpdate, onMount, onDestroy } from 'svelte';
	import { setColor } from '$lib/utils/CanvasUtils';
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import JpgButton from '$lib/shared-components/JPGButton.svelte';
	import { selectedColumns } from '$lib/ColumnSelector/Store';
	import ColumnSelector from '$lib/ColumnSelector/ColumnSelector.svelte';
	import WarningGenerator from '$lib/WarningGenerator/WarningGenerator.svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	let x_axis = undefined;
	let y_axis = undefined;
	// setup chart after canvas is mounted
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
						color: 'lightgreen'
					}
				}
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});

	// called when x_axis or y_axis changes
	afterUpdate(() => {
		chart.data.labels = $data.toArray(x_axis);
		chart.data.datasets = [
			{
				label: y_axis,
				data: $data.toArray(y_axis),
				backgroundColor: 'rgba(51, 50, 200, 1)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}
		];

		chart.update();
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});
</script>

<ColumnSelector></ColumnSelector>
<WarningGenerator needNumbers={true} columnsAreLimited={false} maxColumns={100}></WarningGenerator>

<div>
	<select data-testid="first-select" bind:value={x_axis}>
		{#each $selectedColumns as column}
			<option value={column}>{column}</option>
		{/each}
	</select>
	<select data-testid="second-select" bind:value={y_axis}>
		{#each $selectedColumns as column}
			<option value={column}>{column}</option>
		{/each}
	</select>
</div>

<div>
	<canvas data-testid="canvas-element" bind:this={canvas} />
</div>

<PngButton {chart} />
<JpgButton {chart} />

<style>
	div > canvas {
		width: 800px;
	}
</style> -->
