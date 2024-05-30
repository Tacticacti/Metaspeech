<script lang="ts">
    export let valuesNotFreq: string[];
    export let columnsToSum: string[];
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