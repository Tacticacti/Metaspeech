<script lang="ts">
	import { data } from '$lib/Store';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { afterUpdate, onMount, onDestroy } from 'svelte';
	import { setColor } from '$lib/utils/CanvasUtils';
	import WarningGenerator from '$lib/warning-generator/WarningGenerator.svelte';
	import { selectedColumns } from '$lib/Store';
	import Export from '$lib/graphs/GraphImageExport.svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	let x_axis = $selectedColumns[0];
	let y_axis = $selectedColumns[1];

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
						color: 'lightgreen'
					}
				}
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});

	// called when  x_axis or y_axis changes
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

<WarningGenerator
	needNumbers={true}
	columnsAreLimited={false}
	maxColumns={100}
	valuesAreLimited={true}
	maxValues={1}
></WarningGenerator>
<div class="flex flex-col items-center w-full">
	<div class="mb-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
		<select
			data-testid="first-select"
			bind:value={x_axis}
			class="p-2 border border-gray-300 rounded-md"
		>
			{#each $selectedColumns as column}
				<option value={column}>{column}</option>
			{/each}
		</select>
		<select
			data-testid="second-select"
			bind:value={y_axis}
			class="p-2 border border-gray-300 rounded-md"
		>
			{#each $selectedColumns as column}
				<option value={column}>{column}</option>
			{/each}
		</select>
	</div>
	<canvas data-testid="canvas-element" bind:this={canvas} class="mb-4 w-800" />
	<Export {chart} />
</div>

<style>
	.w-800 {
		width: 800px;
	}
</style>
