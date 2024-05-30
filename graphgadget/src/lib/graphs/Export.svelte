<script lang="ts">
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import JpgButton from '$lib/shared-components/JPGButton.svelte';
	export let chart;
</script>

<div class="flex space-x-4">
	<PngButton {chart} />
	<JpgButton {chart} />
</div>
