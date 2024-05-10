<script lang="ts">
	import { data } from '$lib/Store';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { afterUpdate, onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const column_names = $data.listColumns();

	let x_axis = column_names[0];

	function calculateAxis(x_axis: string) {
		let map = new Map<string, number>();
		let arr: string[] = $data.toArray(x_axis);
		for (let i = 0; i < arr.length; i++) {
			let val = map.get(arr[i]);

			if (val == undefined) {
				map.set(arr[i], 1);
			} else {
				map.set(arr[i], val + 1);
			}
		}
		let xx_axis: string[] = [];
		let y_axis: number[] = [];
		map.forEach((value: number, key: string) => {
			xx_axis.push(key);
			y_axis.push(value);
		});

		return [xx_axis, y_axis];
	}
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

	afterUpdate(() => {
		let t = calculateAxis(x_axis);
		//console.log(t);

		chart.data.labels = t[0];
		chart.data.datasets = [
			{
				label: x_axis,
				// @ts-expect-error There is some typescript error here
				data: t[1],
				backgroundColor: 'rgba(51, 50, 200, 1)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}
		];

		chart.update();
	});
</script>

<select data-testid="first-select" bind:value={x_axis}>
	{#each column_names as column}
		<option value={column}>{column}</option>
	{/each}
</select>

<div>
	<canvas data-testid="canvas-element" bind:this={canvas} />
</div>

<style>
	div > canvas {
		width: 800px;
	}
</style>
