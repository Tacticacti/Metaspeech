<script lang="ts">
    import { data } from '$lib/Store';
    
    $: column_names = $data.listColumns() as string[];

    export let selectedParams: string[];
    let calculationType = "Count";
    let parameterType = "Frequency"

</script>

<p>Parameters on the x-axis</p>
{#each column_names as column}
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
    {#each column_names as column}
        <option value={column}>{column}</option>
    {/each}
</select>