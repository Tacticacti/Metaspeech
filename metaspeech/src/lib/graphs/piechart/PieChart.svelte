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
	import { sortGroups } from '$lib/dataframe/DataFrame';
	import GraphContainer from '../GraphContainer.svelte';
	import Export from '$lib/components/exporter/GraphImageExport.svelte';
	import EditChart from '../utils/EditChart.svelte';
	import { setColor } from '../utils/CanvasUtils';

	// Register necessary Chart.js components
	Chart.register(PieController, ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

	// Svelte prop to receive the data
	export let data: GroupedDataFrame;

	$: sortGroups(data.groups);

	let chart: Chart;
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

		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		//@ts-expect-error idk man
		chart = new Chart(ctx, {
			type: 'pie',
			data: generatePieChartData(data),
			options: {
				plugins: {
					// @ts-expect-error Needs a specific type for plugin
					customCanvasBackgroundColor: {
						color: 'white'
					},
					legend: {
						position: 'top'
					},
					title: {
						display: true,
						text: getTitleText(data) // Set the title of the chart
					}
				}
			},
			// @ts-expect-error plugin needs a type same as abov
			plugins: [plugin]
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

<GraphContainer>
	<div slot="graph-slot" class="mx-auto w-[50%]">
		{#if data?.groups.length > 0}
			<canvas bind:this={canvas} data-testid="canvas-element"></canvas>
		{:else}
			<p>No data available to display</p>
		{/if}
	</div>
	<div slot="option-slot" class="flex w-full items-center justify-around">
		<Export {chart} />
		<EditChart {chart} chartType="pie"></EditChart>
	</div>
</GraphContainer>
