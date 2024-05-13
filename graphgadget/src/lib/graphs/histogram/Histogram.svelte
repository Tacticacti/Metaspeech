<script lang="ts">
	import { data } from '$lib/Store';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { afterUpdate, onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const column_names = $data.listColumns();

	// pre-select first column
	let x_axis = column_names[0];

	export function calculateAxis(x_axis: string) {
		// calculate the frequency of each unique value
		let map = new Map<string, number>();
		const arr: string[] = $data.toArray(x_axis) as string[];
		for (let i = 0; i < arr.length; i++) {
			let val = map.get(arr[i]);

			map.set(arr[i], val === undefined ? 1 : val + 1);
		}

		// convert map to arrays
		const labels: string[] = [...map.keys()];
		let counts: number[] = [...map.values()];

		return [labels, counts];
	}
	function calculateNumberAxis(x_axis: string) {
		// calculate the frequency of each unique value
		let map = new Map<number, number>();
		const arr: number[] = $data.toArray(x_axis) as number[];

		for (let i = 0; i < arr.length; i++) {
			arr[i] = Number(arr[i]);
		}
		for (let i = 0; i < arr.length; i++) {
			let val = map.get(arr[i]);

			map.set(arr[i], val === undefined ? 1 : val + 1);
		}

		const labels: number[] = [...map.keys()];
		const min_val = Math.min(...labels);
		const max_val = Math.max(...labels);

		let sorted_labels: number[] = [];
		let sorted_counts: number[] = [];
		// fills the gaps with 0 and makes sure it is sorted
		for (let i = min_val; i <= max_val; i++) {
			let val = map.get(i);

			sorted_counts.push(val === undefined ? 0 : val);
			sorted_labels.push(i);
		}

		return [sorted_labels, sorted_counts];
	}

	// setup chart with empty config after canvas is mounted
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

	// update chart data
	afterUpdate(() => {
		let labels, counts;
		//checks if the first entry is a number
		if (!isNaN(+$data.toArray(x_axis)[0]) && typeof +$data.toArray(x_axis)[0] == 'number') {
			[labels, counts] = calculateNumberAxis(x_axis);
		} else {
			[labels, counts] = calculateAxis(x_axis);
		}
		chart.data.labels = labels;
		chart.data.datasets = [
			{
				label: 'count',
				data: counts as number[],
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
