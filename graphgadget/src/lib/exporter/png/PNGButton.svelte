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
		class="text-lg font-bold text-gray-800 my-2 py-2 px-4 inline-block bg-gray-100 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out border border-gray-300 shadow-md hover:text-blue-500 hover:bg-gray-200"
		on:click={downloadCanvasPNG}
	>
		PNG
	</button>
</div>

{#if isDownloadCalled}
	<div data-testid="download-function-called"></div>
{/if}
