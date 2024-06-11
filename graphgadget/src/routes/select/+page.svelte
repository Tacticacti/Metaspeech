<script lang="ts">
	import { df } from '$lib/Store';
	import type { Column, DataTypeString } from '$lib/Types';

	const columns = df.columns;
	$: aggregatableColumns = $columns.filter((c) => c.type === 'number' && !c.groupBy);
	let aggregateBy: number = $columns.findIndex((c) => c.aggregate);

	$: selectColumnForAggregation(aggregateBy);

	function getGroupingOptions(type: DataTypeString): string[] {
		const typeOptions = {
			string: ['specific'],
			number: ['specific', 'binned']
		};
		return typeOptions[type] ?? [];
	}

	function selectColumnForGrouping(column: Column, select: boolean) {
		column.groupBy = select ? { type: 'specific' } : undefined;
		df.forceStoreUpdate();
	}
	function translateIndex(index: number){
		let count = -1;
		for(let i = 0; i < $columns.length; i++){
			if($columns[i].type === 'number'){
				count++;
				if(count == index){
					return i;
				}
			}
		}
		return -1;
	}
	function selectColumnForAggregation(index: number) {
		index = translateIndex(index);
		for (let i = 0; i < $columns.length; i++) {
			$columns[i].aggregate = i === index;
		}
		
	}
</script>

<a href="/view" data-testid="next-link">Next</a>
<div class="flex">
	<div class="flex flex-col">
		{#each $columns as column}
			<span>
				<label>
					{column.name}
					<input
						type="checkbox"
						on:input={(e) => selectColumnForGrouping(column, e.currentTarget.checked)}
						checked={Boolean(column.groupBy)}
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
			</span>
		{/each}
	</div>

	<div class="flex flex-col">
		<label>
			Frequency
			<input type="radio" bind:group={aggregateBy} value={-1} />
		</label>
		{#each aggregatableColumns as column, index}
			<label>
				{column.name}
				<input type="radio" bind:group={aggregateBy} value={index} />
			</label>
		{/each}
	</div>
</div>
