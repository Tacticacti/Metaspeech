<script lang="ts">
    import { df } from '$lib/Store';

    const columns = df.columns;
    const rows = df.rows;

    $: missing_values = $columns.some(c => c.hasMissing);
	$: columns_with_missing = $columns.filter(c => c.hasMissing);

    /**
	 * Removes rows from data that miss values
	 */
	function removeMissingValues() {
		$rows.filter(row => row.every(cell => cell !== undefined));
	}
</script>

<div class="flex justify-center pt-16">
    {#if missing_values}
        <span class="flex flex-col items-center">
            <p class="py-4 px-6 text-red-500 font-mono">
                Warning: Missing values detected in [{columns_with_missing.map(c => c.name).join(', ')}]
            </p>
            <button
                class="w-2/3 rounded-lg py-1 text-red-50 bg-red-400 font-bold hover:text-slate-300 hover:bg-red-500"
                on:click={removeMissingValues}
                data-testid="remove-missing-button"
            >
                Remove missing values
            </button>
        </span>
    {/if}
</div>