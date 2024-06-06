<script lang="ts">
	import { df } from '$lib/Store';
	import type { Column, DataTypeString } from '$lib/Types';

	const columns = df.columns;

	function getGroupingOptions(type: DataTypeString): string[] {
		const typeOptions = {
			string: ['specific'],
			number: ['specific', 'binned']
		};
		return typeOptions[type] ?? [];
	}

	function selectColumnForGrouping(column: Column, select: boolean) {
		column.groupBy = select ? { type: 'specific' } : undefined;
	}
	function selectColumnForAggregation(index: number) {
		for (let i = 0; i < $columns.length; i++) {
			$columns[i].aggregate = i === index;
		}
	}
</script>

<a href="/view" data-testid="next-link">Next</a>

{#each $columns as column}
	<label>
		{column.name}
		<input
			type="checkbox"
			on:input={(e) => selectColumnForGrouping(column, Boolean(e.currentTarget.value))}
		/>
	</label>
	{#if column.groupBy}
		<select bind:value={column.groupBy.type}>
			{#each getGroupingOptions(column.type) as groupingOption}
				<option value={groupingOption}>{groupingOption}</option>
			{/each}
		</select>
		{#if column.groupBy.type === 'binned'}
			<input type="number" bind:value={column.groupBy.size} />
		{/if}
	{/if}
{/each}

<label>
	Frequency
	<input type="radio" on:input={() => selectColumnForAggregation(-1)} />
</label>
{#each $columns as column, index}
	<label>
		{column.name}
		<input type="radio" on:input={() => selectColumnForAggregation(index)} />
	</label>
{/each}
