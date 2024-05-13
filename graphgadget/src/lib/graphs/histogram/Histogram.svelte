<script lang="ts">
	import { data } from '$lib/Store';
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { setColor } from '$lib/utils/CanvasUtils';
	import { afterUpdate, onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const column_names = $data.listColumns();

	// pre-select first column
	let x_axis = column_names[0];

	function calculateAxis(x_axis: string) {
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
		const [labels, counts] = calculateAxis(x_axis);

		chart.data.labels = labels;
		chart.data.datasets = [
			{
				label: x_axis,
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

<PngButton {chart} />

<style>
	div > canvas {
		width: 800px;
	}
</style>
