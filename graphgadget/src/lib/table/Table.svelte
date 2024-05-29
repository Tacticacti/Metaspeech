<script lang="ts">
	import { data } from '$lib/Store';
	import * as ctrl from './TableController';

	$: columns = $data?.listColumns() as string[];
	$: rows = $data?.toArray() as unknown[][];
</script>

{#if $data}
	<table class="table-fixed w-full">
		<thead>
			<tr>
				{#each columns as header (header)}
					<th class="m-0">
						<input
							class="max-w-full"
							type="text"
							on:change={(e) => ctrl.columnValueChanged(e, header)}
							value={header}
							data-testid="header-{header}-input"
						/>
						<button on:click={() => ctrl.removeColumn(header)} data-testid="header-{header}-delete"
							>X</button
						>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each rows as row}
				<tr>
					{#each row as cell}
						<td data-testid="{cell}-cell">{cell}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
