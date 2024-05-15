<script lang="ts">
    import { data } from '$lib/Store';
    
    $: columnNames = $data.listColumns() as string[];

    export let selectedParams: string[];
    export let parameterType = "Absolute Frequency"
    export let checkedMean = false;

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
    {#each columnNames as column}
        <option value={column}>{column}</option>
    {/each}
</select>

{#if parameterType != "Absolute Frequency" && parameterType != "Relative Frequency"}
    <label>
        <input type="checkbox" name="mean" bind:checked={checkedMean} />
        Mean
    </label>
{/if}