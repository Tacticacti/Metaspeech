<script lang="ts">
	import { df } from '$lib/Store';
	import type { Column } from '$lib/Types';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	const columns = df.columns;
	const rows = df.rows;

	/**
	 * sets the value of a column in the 'data' dataframe
	 * @param event the event that triggered the change
	 * @param previousValue the previous value of the column
	 */
	export function columnValueChanged(event: Event, column: Column) {
		const input = event.target as HTMLInputElement;
		const value = input.value.trim();

		if (value === column.name || value === '' || value === null || value === undefined) {
			// Reset the input value
			input.value = column.name;
			return;
		}

		column.name = value;
		$columns = $columns;
	}
</script>

<Table shadow striped={true} divClass="!overflow-scroll !h-full">
	<TableHead theadClass="sticky top-0 bg-offwhite">
		{#each $columns as header, i (header.name)}
			<TableHeadCell class="!p-0">
				<div class="flex max-w-48">
					<input
						class="overflow-x-scroll rounded-l-md bg-darkblue text-offwhite hover:bg-lightblue"
						type="text"
						on:change={(e) => columnValueChanged(e, header)}
						value={header.name}
						data-testid="header-{i}-input"
					/>
					<button
						class="rounded-r-md bg-red-400 px-4 text-offwhite hover:bg-red-500"
						on:click={() => df.deleteColumn(i)}
						data-testid="header-{i}-delete"
					>
						X
					</button>
				</div>
			</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody>
		{#each $rows as row}
			<TableBodyRow>
				{#each row as cell}
					<TableBodyCell class="border p-4" data-testid="{cell}-cell">
						{cell?.toString() ?? ''}
					</TableBodyCell>
				{/each}
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
