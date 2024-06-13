<script lang="ts">
	import { df } from '$lib/Store';

	const columns = df.columns;

	$: missing_values = $columns.some((c) => c.hasMissing);
	$: columns_with_missing = $columns.filter((c) => c.hasMissing);

	/**
	 * Removes rows from data that miss values
	 */
	function removeMissingValues() {
		df.filter((row) => !row.some((cell) => cell === undefined || cell === null));
	}
</script>

<div class="flex justify-center">
	{#if missing_values}
		<span class="flex flex-col items-center">
			<p class="px-6 py-4 font-mono text-red-500">
				Warning: Missing values detected in [{columns_with_missing.map((c) => c.name).join(', ')}]
			</p>
			<button
				class="hover:text-slate-300 w-2/3 rounded-lg bg-red-400 py-1 font-bold text-red-50 hover:bg-red-500"
				on:click={removeMissingValues}
				data-testid="remove-missing-button"
			>
				Remove missing values
			</button>
		</span>
	{/if}
</div>
