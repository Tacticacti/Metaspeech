<script lang="ts">
	import { Chart } from 'chart.js/auto';

	export let chart: Chart;

	// for testing purposes
	let isDownloadCalled = false;

	/**
	 * Download the canvas as a JPG image
	 */
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
	<button on:click={downloadCanvasJPG}>JPG</button>
</div>

{#if isDownloadCalled}
	<div data-testid="download-function-called"></div>
{/if}
