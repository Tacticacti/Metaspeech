<script lang="ts">
	import { df } from '$lib/Store';
	import type { Column } from '$lib/Types';
	import CustomVirtualList from '$components/CustomVirtualList.svelte';

	const columns = df.columns;
	const rows = df.rows;

	let start: number;
	let end: number;

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

<CustomVirtualList items={$rows} bind:start bind:end>
	<div slot="header-slot" class="sticky top-0 w-full">
		<div class="flex w-full">
			{#each $columns as header, i (header)}
				<div class="flex w-full min-w-48">
					<input
						class="w-full overflow-x-scroll rounded-l-md bg-darkblue text-offwhite hover:bg-lightblue"
						type="text"
						on:change={(e) => columnValueChanged(e, header)}
						value={header.name}
						data-testid="header-{header.name}-input"
					/>
					<button
						class="rounded-r-md bg-red-400 px-4 text-offwhite hover:bg-red-500"
						on:click={() => df.deleteColumn(i)}
						data-testid="header-{header.name}-delete"
						>X
					</button>
				</div>
			{/each}
		</div>
	</div>
	<div slot="row-type1" class="flex w-full max-w-full bg-gray-400" let:item data-testid="row-type1">
		{#each item as cell}
			<div
				class="scrollbar-hide scrollbar-hide::-webkit-scrollbar w-full min-w-48 overflow-x-scroll border bg-offwhite p-4 hover:bg-gray-300"
				data-testid="{cell}-cell"
			>
				{cell ?? ''}
			</div>
		{/each}
	</div>
	<div slot="row-type2" class="flex w-full max-w-full bg-gray-400" let:item data-testid="row-type2">
		{#each item as cell}
			<div
				class="scrollbar-hide scrollbar-hide::-webkit-scrollbar w-full min-w-48 overflow-x-scroll border bg-blue-100 p-4 hover:bg-blue-200"
				data-testid="{cell}-cell"
			>
				{cell ?? ''}
			</div>
		{/each}
	</div>
</CustomVirtualList>
<p class=" text-lg font-semibold">Showing {start}-{end} of {$rows.length} rows</p>
