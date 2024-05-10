<script lang="ts">
	import type DataFrame from 'dataframe-js';

	export let data: DataFrame;
</script>

<h1 data-testid="placeholder-table">{data.toText()}</h1>
