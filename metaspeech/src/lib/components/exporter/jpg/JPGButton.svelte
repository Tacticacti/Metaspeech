<script lang="ts">
	import { Chart } from 'chart.js/auto';

	/**
	 * Chart object
	 */
	export let chart: Chart;

	/**
	 * Download the canvas as a JPG image
	 */
	function downloadCanvasJPG() {
		const link = document.createElement('a');
		link.href = chart.toBase64Image('image/jpeg', 1.0);
		link.download = 'graph_image.jpg';
		link.click();
	}
</script>

<div>
	<button
		class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-lg font-bold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
		on:click={downloadCanvasJPG}
	>
		JPG
	</button>
</div>
