<script lang="ts">
	import type DataFrame from 'dataframe-js';
	import type { Writable } from 'svelte/store';

	export let data: Writable<DataFrame>;

	const column_names = $data.listColumns();
</script>

<table>
	<thead>
		<tr>
			{#each column_names as header}
				<th>{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each $data.toArray() as row}
			<tr>
				{#each row as cell}
					<td>{cell}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
