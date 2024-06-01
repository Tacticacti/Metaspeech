<script lang="ts">
	import { data } from '$lib/Store';
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import * as ctrl from './TableController';

	/**
	 * The columns of the data
	 */
	$: columns = $data?.listColumns() as string[];
	/**
	 * The rows of the data
	 */
	$: rows = $data?.toArray() as unknown[][];
</script>

{#if $data}
	<Table shadow striped={true} divClass="!overflow-scroll !h-full">
		<TableHead theadClass="sticky top-0">
			{#each columns as header (header)}
				<TableHeadCell class="!p-0">
					<div class="flex">
						<input
						class="bg-darkblue max-w-32 overflow-x-scroll hover:bg-lightblue text-offwhite rounded-l-md"
						type="text"
						on:change={(e) => ctrl.columnValueChanged(e, header)}
						value={header}
						data-testid="header-{header}-input"
						/>
						<button class="px-4 bg-red-400 text-offwhite hover:bg-red-500 rounded-r-md" on:click={() => ctrl.removeColumn(header)} data-testid="header-{header}-delete"
							>X
						</button
						>
					</div>
				</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each rows as row}
				<TableBodyRow>
					{#each row as cell}
						<TableBodyCell class="p-4 w-4 border" data-testid="{cell}-cell">
							{cell}
						</TableBodyCell>
					{/each}
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}