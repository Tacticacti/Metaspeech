<script lang="ts">
	import { Chart } from 'chart.js/auto';

	/**
	 * Chart object
	 */
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
	<button
		class="text-lg font-bold text-gray-800 my-2 py-2 px-4 inline-block bg-gray-100 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out border border-gray-300 shadow-md hover:text-blue-500 hover:bg-gray-200"
		on:click={downloadCanvasJPG}
	>
		JPG
	</button>
</div>

{#if isDownloadCalled}
	<div data-testid="download-function-called"></div>
{/if}
