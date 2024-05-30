<script lang="ts">
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import JpgButton from '$lib/shared-components/JPGButton.svelte';
	export let chart;
</script>

<div class="p-5 text-center">
	<h2 class="text-xl font-bold text-darkblue mb-4">Download your graph here:</h2>
	<div class="flex justify-center space-x-4">
		<PngButton {chart} />
		<JpgButton {chart} />
	</div>
</div>
