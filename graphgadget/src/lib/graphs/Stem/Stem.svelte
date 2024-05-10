<script lang="ts">
	import { data } from '$lib/Store';
	import { Chart, type ChartConfiguration, type ChartOptions } from 'chart.js/auto';
	import { afterUpdate, onMount, onDestroy } from 'svelte';
	import { setColor } from '$lib/utils/CanvasUtils';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const column_names = $data.listColumns();

	let x_axis = column_names[0];
	let y_axis = column_names[1];

	// for testing purposes
	let isDownloadCalled = false;



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

	function downloadCanvasPNG() {
		const link = document.createElement('a');
		link.href = chart.toBase64Image();
		link.download = 'histogram_image.png';
		link.click();
		isDownloadCalled = true;
	}

	onDestroy(() => {
		if (chart) chart.destroy();
	});
</script>

<select data-testid="first-select" bind:value={x_axis}>
	{#each column_names as column}
		<option value={column}>{column}</option>
	{/each}
</select>
<select data-testid="second-select" bind:value={y_axis}>
	{#each column_names as column}
		<option value={column}>{column}</option>
	{/each}
</select>

<div>
	<canvas data-testid="canvas-element" bind:this={canvas} />
</div>

<div>
	<button on:click={downloadCanvasPNG}>PNG</button>
</div>

{#if isDownloadCalled}
	<div data-testid="download-function-called"></div>
{/if}

<style>
	div > canvas {
		width: 800px;
	}
</style>
