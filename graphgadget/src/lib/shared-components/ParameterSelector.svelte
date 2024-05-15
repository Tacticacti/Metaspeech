<script lang="ts">
    import { data } from '$lib/Store';
    
    $: columnNames = $data.listColumns() as string[];

    export let selectedParams: string[];
    export let calculationType = "Count";
    export let parameterType = "Frequency"

</script>

<p>Parameters on the x-axis</p>
{#each columnNames as column}
    <label>
        <input type="checkbox" name="params" value={column} bind:group={selectedParams} />
        {column}
    </label>
{/each}

<p>Parameter of the y-axis</p>

<select data-testid="select-y-axis-calculation" bind:value={calculationType}>
    <option value="Count">Count</option>
    <option value="Mean">Mean</option>
</select>

<select data-testid="select-y-axis-parameter" bind:value={parameterType}>
    <option value="Frequency">Frequency</option>
    {#each columnNames as column}
        <option value={column}>{column}</option>
    {/each}
</select>