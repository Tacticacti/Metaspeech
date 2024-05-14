<script lang="ts">
	import { data } from '$lib/Store';
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import JpgButton from '$lib/shared-components/JPGButton.svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { setColor } from '$lib/utils/CanvasUtils';
	import { afterUpdate, onMount } from 'svelte';
	import ParameterSelector from '$lib/shared-components/ParameterSelector.svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const column_names = $data.listColumns() as string[];

	$: x_axis_data = selectedParams.map((columnName) => $data.toArray(columnName))
		.reduce((column1, column2) => cross_join(column1, column2), []);

	let selectedParams: string[] = [];

	function cross_join(array1: any[], array2: any[]): string[] {
		let result: any[] = [];

		for (const e1 of array1) {
			for (const e2 of array2) {
				result.push(`${e1}, ${e2}`);
			}
		}

		return result;
	}

	export function calculateAxis() {
		// calculate the frequency of each unique value
		let map = new Map<string, number>();
		const arr: string[] = x_axis_data as string[];
		for (let i = 0; i < arr.length; i++) {
			let val = map.get(arr[i]);

			map.set(arr[i], val === undefined ? 1 : val + 1);
		}

		// convert map to arrays
		const labels: string[] = [...map.keys()];
		let counts: number[] = [...map.values()];

		return [labels, counts];
	}
	export function calculateNumberAxis() {
		// calculate the frequency of each unique value
		let map = new Map<number, number>();
		const arr: number[] = x_axis_data.map(Number) as number[];

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
		let labels, counts;
		//checks if the first entry is a number
		if (!isNaN(+x_axis_data[0]) && typeof +x_axis_data[0] == 'number') {
			[labels, counts] = calculateNumberAxis();
		} else {
			[labels, counts] = calculateAxis();
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

<ParameterSelector bind:selectedParams />

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
