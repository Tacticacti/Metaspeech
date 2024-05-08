<script lang="ts">
	import { state, StateEnum } from '$lib/store';
	import Importer from '$lib/importer/importer.svelte';
	import Tableview from '$lib/tableview/tableview.svelte';
	import Grapher from '$lib/grapher/grapher.svelte';
</script>

{#if $state === StateEnum.input}
	<Importer />
{/if}

{#if $state === StateEnum.modify}
	<Tableview />
{/if}

{#if $state === StateEnum.graph}
	<Grapher />
{/if}
