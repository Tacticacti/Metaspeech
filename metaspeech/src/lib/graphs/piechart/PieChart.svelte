<script lang="ts">
	import { onMount } from 'svelte';
	import type { GroupedDataFrame } from '$lib/Types';
	import { calculateRelativeFrequency, getTitleText } from '$lib/graphs/sharedFunctions';
	import {
		Chart,
		PieController,
		ArcElement,
		Tooltip,
		Legend,
		CategoryScale,
		LinearScale
	} from 'chart.js';

	// Register necessary Chart.js components
	Chart.register(PieController, ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

	// Svelte prop to receive the data
	export let data: GroupedDataFrame;

	let chart: Chart | null = null;
	let canvas: HTMLCanvasElement | null = null;

	/**
	 * Generate the data for the pie chart.
	 * This function processes the input GroupedDataFrame and returns a data object
	 * structured for Chart.js, including labels and datasets for the pie chart.
	 *
	 * @param data - The GroupedDataFrame to be processed for the pie chart.
	 * @returns An object containing labels and datasets for the pie chart.
	 */
	function generatePieChartData(data: GroupedDataFrame) {
		const [labels, values] = calculateRelativeFrequency(data);
		return {
			labels,
			datasets: [
				{
					label: 'Relative Frequency (%)',
					data: values,
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1
				}
			]
		};
	}

	/**
	 * Draw a white background on the canvas before rendering the chart.
	 *
	 * @param chart - The Chart.js chart instance.
	 */
	function drawWhiteBackground(chart: Chart) {
		const ctx = chart.canvas.getContext('2d');
		if (!ctx) {
			console.error('Failed to get 2D context for chart canvas');
			return;
		}
                ctx.save();
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, chart.width, chart.height);
		ctx.restore();
	}

	/**
	 * Initialize the Chart.js pie chart.
	 */
	function initChart() {
		// Ensure canvas and data are defined before proceeding
		if (!canvas || !data) return;

		const ctx = canvas.getContext('2d');
		// Check if the context is successfully retrieved
		if (!ctx) return;

		// Destroy any existing chart instance to avoid duplicates
		if (chart) chart.destroy();

		chart = new Chart(ctx, {
			type: 'pie',
			data: generatePieChartData(data),
			options: {
				responsive: false,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'top'
					},
					title: {
						display: true,
						text: getTitleText(data) // Set the title of the chart
					}
				}
			},
			plugins: [
				{
					id: 'whiteBackground',
					beforeDraw: drawWhiteBackground
				}
			]
		});
	}

	// Reactive statement to update the chart when data or canvas changes
	$: {
		if (canvas && data) {
			initChart();
		}
	}

	// Initialize the chart when the component is mounted
	onMount(() => {
		initChart();
	});
</script>

{#if data?.groups.length > 0}
	<!-- Bind the canvas element to the canvas variable for later use -->
	<canvas bind:this={canvas} width="400" height="400" data-testid="canvas-element" class="mb-4"
	></canvas>
{:else}
	<p>No data available to display</p>
{/if}

<style>
	.mb-4 {
		margin-bottom: 1rem;
	}
</style>
