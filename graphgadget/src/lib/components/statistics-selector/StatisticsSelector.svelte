<script lang="ts">
	/**
	 * The selected values to show, excluding frequencies (absolute and relative)
	 * Because frequencies do not have mean or sum
	 */
	export let valuesNotFreq: string[];
	/**
	 * The columns selected to show the sum
	 */
	export let columnsToSum: string[];
	/**
	 * The columns selected to show the mean
	 */
	export let columnsToMean: string[];
</script>

<p>Show statistics for selected values:</p>
{#each valuesNotFreq as column}
	<input
		type="checkbox"
		data-testid="y-check-sum-{column}"
		name="y-params-sum"
		value={column}
		bind:group={columnsToSum}
	/>
	Sum {column}
	<input
		type="checkbox"
		data-testid="y-check-mean-{column}"
		name="y-params-mean"
		value={column}
		bind:group={columnsToMean}
	/>
	Mean {column}

	<br />
{/each}

<style>
</style>
