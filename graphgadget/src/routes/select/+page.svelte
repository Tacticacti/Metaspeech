<script lang="ts">
	import ColumnSelector from './ColumnSelector.svelte';
	import { APP_NAME } from '$lib/Constants';
</script>

<svelte:head>
	<title>Parameters - {APP_NAME}</title>
</svelte:head>

<a href="/view" data-testid="next-link">Next</a>

<ColumnSelector />
