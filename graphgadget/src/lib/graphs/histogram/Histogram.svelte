<script lang="ts">
	import { data } from '$lib/store';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { afterUpdate, onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const column_names = $data.listColumns();

	let x_axis = column_names[0];
	let y_axis = column_names[1];

	// setup chart after canvas is mounted
	onMount(() => {
		const cfg: ChartConfiguration = {
			type: 'bar',
			data: {
				labels: [],
				datasets: []
			}
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
</script>

<select bind:value={x_axis}>
	{#each column_names as column}
		<option value={column}>{column}</option>
	{/each}
</select>
<select bind:value={y_axis}>
	{#each column_names as column}
		<option value={column}>{column}</option>
	{/each}
</select>

<div>
	<canvas bind:this={canvas} />
</div>

<style>
	div > canvas {
		width: 800px;
	}
</style>
