<script lang="ts">
    import { 
        selectedValues
    } from '$lib/Store';

    import {
        columnIsFrequency
    } from '$lib/graphs/histogram/HistogramController'

    let valuesNotFreq : string[] = $selectedValues.filter(v => !columnIsFrequency(v));
    export let columnsToSum: string[] = valuesNotFreq;
    export let columnsToMean: string[] = [];

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