<script lang="ts">
	import { data } from '$lib/Store';
	import { selectedColumns } from './Store';

	let columnNames = $data.listColumns();
	let currentlySelectedColumns: string[] = [];
	$: selectedColumns.set(currentlySelectedColumns);
</script>

<p>Parameters on the x-axis</p>
{#each columnNames as column}
	<label>
		<input
			type="checkbox"
			data-testid="check-{column}"
			name="params"
			value={column}
			bind:group={currentlySelectedColumns}
		/>
		{column}
	</label>
{/each}
