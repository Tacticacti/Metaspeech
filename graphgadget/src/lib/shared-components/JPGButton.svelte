<script lang="ts">
	import { Chart } from 'chart.js/auto';

	export let chart: Chart;

	// for testing purposes
	let isDownloadCalled = false;

	function downloadCanvasJPG() {
		const link = document.createElement('a');
		const image = chart.toBase64Image('image/jpeg', 1.0);
		link.href = image;
		link.download = 'graph_image.jpg';
		link.click();
		isDownloadCalled = true;
	}
</script>

<div>
	<button class="button" on:click={downloadCanvasJPG}>JPG</button>
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
