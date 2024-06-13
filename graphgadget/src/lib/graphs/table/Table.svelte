<script lang="ts">
	import type { GroupedDataFrame } from '$lib/Types';
	import {
		aggregateOptions_none,
		aggregateOptions_single,
		type AggregateOption,
		createTable
	} from './Table';

	export let data: GroupedDataFrame;
	const aggregateOptions =
		data?.aggregateColumn === undefined ? aggregateOptions_none : aggregateOptions_single;
	let selectedOption: AggregateOption;

	$: table = createTable(data, selectedOption);
</script>

<div class="w-screen">
	<div>
		<select bind:value={selectedOption} data-testid="aggregate">
			{#each aggregateOptions as option}
				<option value={option} data-testid={option.name}>{option.name}</option>
			{/each}
		</select>
	</div>

	<table class="max-w-screen overflow-auto">
		{#each table as row}
			<tr>
				{#each row as cell}
					{#if !cell.skip}
						<td
							colspan={cell.colSpan}
							rowspan={cell.rowSpan}
							class={cell.class}
							data-testid="cell-{cell.content}"
						>
							{cell.content}
						</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</table>
</div>

<style>
	table {
		border-collapse: collapse;
	}

	td {
		border: 1px solid black;
		padding: 5px;
	}

	td.header {
		background-color: #f0f0f0;
	}

	td.data {
		background-color: #f8f8f8;
	}
</style>
