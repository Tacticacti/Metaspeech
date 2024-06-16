<script lang="ts">
	import PngButton from '$components/exporter/png/PNGButton.svelte';
	import JpgButton from '$components/exporter/jpg/JPGButton.svelte';
	import type Chart from 'chart.js/auto';

	/**
	 * The chart to export.
	 */
	export let chart: Chart;
</script>

<div class="p-5 text-center">
	<div class="flex justify-center space-x-4">
		<PngButton {chart} />
		<JpgButton {chart} />
	</div>
</div>
