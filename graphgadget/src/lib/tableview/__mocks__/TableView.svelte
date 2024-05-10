<script lang="ts">
	import type DataFrame from 'dataframe-js';
	import type { Writable } from 'svelte/store';

	export let data: Writable<DataFrame>;
</script>

<h1 data-testid="placeholder-table">{$data.toText()}</h1>
