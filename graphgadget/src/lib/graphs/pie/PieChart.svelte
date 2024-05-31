<script lang="ts">
	import { data } from '$lib/Store';
	import PngButton from '$lib/exporter/PNGButton.svelte';
	import JpgButton from '$lib/exporter/JPGButton.svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { setColor } from '$lib/utils/CanvasUtils';
	import { afterUpdate, onMount } from 'svelte';
	import { selectedColumns } from '$lib/Store';
	import WarningGenerator from '$lib/warning-generator/WarningGenerator.svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	/**
	 * Calculate the frequency of each unique value in the x-axis column
	 * @param x_axis the column to calculate the frequency of
	 * @returns a tuple of two arrays, the first containing the unique values and the second containing the frequency of each value
	 */
	export function calculateAxis(x_axis: string): [string[], number[]] {
		try {
			// Calculate the frequency of each unique value
			let map = new Map<string, number>();
			const arr: string[] = $data.toArray(x_axis) as string[];
			for (let i = 0; i < arr.length; i++) {
				let val = map.get(arr[i]);
				map.set(arr[i], val === undefined ? 1 : val + 1);
			}

			// Convert map to arrays
			const labels: string[] = [...map.keys()];
			let counts: number[] = [...map.values()];

			return [labels, counts];
		} catch (NoSuchColumnError) {
			return [[], []];
		}
	}

	// Setup chart with empty config after canvas is mounted
	onMount(() => {
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		const cfg: ChartConfiguration = {
			type: 'pie',
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

	// Update chart data
	afterUpdate(() => {
		const [labels, counts] = calculateAxis($selectedColumns[0]);
		chart.data.labels = labels;
		chart.data.datasets = [
			{
				label: $selectedColumns[0],
				data: counts as number[],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
			}
		];

		chart.update();
	});
</script>

<WarningGenerator
	needNumbers={false}
	columnsAreLimited={true}
	maxColumns={1}
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
