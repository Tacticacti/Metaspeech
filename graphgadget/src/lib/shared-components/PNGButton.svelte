<script lang="ts">
	import { Chart } from 'chart.js/auto';

	export let chart: Chart;

	// for testing purposes
	let isDownloadCalled = false;

	function downloadCanvasPNG() {
		console.log(chart);
		const link = document.createElement('a');
		link.href = chart.toBase64Image();
		link.download = 'graph_image.png';
		link.click();
		isDownloadCalled = true;
	}
</script>

<div>
	<button class="button" on:click={downloadCanvasPNG}>PNG</button>
</div>

{#if isDownloadCalled}
	<div data-testid="download-function-called"></div>
{/if}

<style>
	.button {
		font-size: 16px;
		font-weight: bold;
		color: #333;
		margin: 10px 0;
		padding: 10px 20px;
		display: inline-block;
		background-color: #f9f9f9;
		border-radius: 4px;
		cursor: pointer;
		transition:
			color 0.3s ease,
			background-color 0.3s ease;
		text-align: center;
		border: 1px solid #ccc;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.button:hover {
		color: #007bff;
		background-color: #e0e0e0;
	}
</style>