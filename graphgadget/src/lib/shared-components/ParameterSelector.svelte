<script lang="ts">
    export let columnNames;
    export let numericColumnNames;

    export let selectedParams: string[];
    export let parameterType: string;
    export let checkedMean: boolean;

</script>

<p>Parameters on the x-axis</p>
{#each columnNames as column}
    <label>
        <input type="checkbox" name="params" value={column} bind:group={selectedParams} />
        {column}
    </label>
{/each}

<p>Parameter of the y-axis</p>

<select data-testid="select-y-axis-parameter" bind:value={parameterType}>
    <option value="Absolute Frequency">Absolute Frequency</option>
    <option value="Relative Frequency">Relative Frequency</option>
    {#each numericColumnNames as column}
        <option value={column}>{column}</option>
    {/each}
</select>

{#if parameterType != "Absolute Frequency" && parameterType != "Relative Frequency"}
    <label>
        <input type="checkbox" name="mean" bind:checked={checkedMean} />
        Mean
    </label>
{/if}