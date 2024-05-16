<script lang="ts">
	import { data } from '$lib/Store';
	import * as ctrl from './TableController';
</script>

<table>
	<thead>
		<tr>
			{#each $data.listColumns() as header (header)}
				<th>
					<input type="text" on:change={(e) => ctrl.columnValueChanged(e, header)} value={header} />
					<button on:click={() => ctrl.removeColumn(header)}>X</button>
				</th>
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
