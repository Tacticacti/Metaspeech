<script lang="ts">
	import { Chart } from 'chart.js/auto';

	/**
	 * Chart object
	 */
	export let chart: Chart;

	// for testing purposes
	let isDownloadCalled = false;

	/**
	 * Download the canvas as a PNG image
	 */
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
	<button
		class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-lg font-bold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
		on:click={downloadCanvasPNG}
	>
		PNG
	</button>
</div>

{#if isDownloadCalled}
	<div data-testid="download-function-called"></div>
{/if}
