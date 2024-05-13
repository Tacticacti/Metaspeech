<script lang="ts">
	import { Chart } from 'chart.js/auto';

	export let chart: Chart;

	// for testing purposes
	let isDownloadCalled = false;

	function downloadCanvasPNG() {
		const link = document.createElement('a');
		link.href = chart.toBase64Image();
		link.download = 'histogram_image.png';
		link.click();
		isDownloadCalled = true;
	}
</script>

<div>
	<button on:click={downloadCanvasPNG}>PNG</button>
</div>

{#if isDownloadCalled}
	<div data-testid="download-function-called"></div>
{/if}
