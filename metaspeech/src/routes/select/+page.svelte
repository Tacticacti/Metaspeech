<script lang="ts">
	import { df } from '$lib/Store';
	import type { Column } from '$lib/Types';
	import { Button } from 'flowbite-svelte';
	import nextImg from '$assets/icons/next.png';

	const columns = df.columns;
	$: aggregatableColumns = $columns.filter((c) => c.type === 'number' && !c.groupBy);
	let aggregateBy: number = $columns.findIndex((c) => c.aggregate);

	$: selectColumnForAggregation(aggregateBy);

	function resetAggregateBy() {
		aggregateBy = -1;
	}

	function selectColumnForGrouping(column: Column, select: boolean) {
		column.groupBy = select
			? column.type === 'number'
				? { type: 'binned', size: 1 }
				: { type: 'specific' }
			: undefined;
		df.forceStoreUpdate();
	}

	function translateIndex(index: number) {
		let count = -1;
		for (let i = 0; i < $columns.length; i++) {
			if ($columns[i].type === 'number' && $columns[i].groupBy === undefined) {
				count++;
				if (count == index) {
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

<div class="flex h-[90vh] flex-col items-center justify-around">
	<div class="flex w-full justify-center border-4 py-5">
		<div class="mx-20 flex w-full max-w-[100vh] flex-col items-center">
			<span class="text-xl font-bold"> GROUP BY </span>
			<div class="mt-5 flex w-fit flex-col">
				{#each $columns as column}
					<span class=" mb-2 flex w-full min-w-96 items-center justify-between">
						<label class="flex items-center">
							<input
								class="mr-2 h-5 w-5 rounded-xl border-2 transition-all duration-200 ease-in-out"
								type="checkbox"
								on:input={(e) => selectColumnForGrouping(column, e.currentTarget.checked)}
								checked={Boolean(column.groupBy)}
								on:change={resetAggregateBy}
							/>
							<span class="w-36 truncate">
								{column.name}
							</span>
						</label>
						{#if column.groupBy && column.groupBy.type === 'binned'}
							<div class="ml-10">
								<span>Bin Size:</span>
								<input
									class="remove-arrow max-h-6 max-w-16 rounded-lg border-0 bg-darkblue text-center font-medium text-offwhite hover:bg-lightblue"
									type="number"
									placeholder="1"
									bind:value={column.groupBy.size}
								/>
							</div>
						{/if}
					</span>
				{/each}
			</div>
		</div>

		<div class="size-3 h-full rounded-lg bg-gray-200"></div>

		<div class="mx-20 flex w-full max-w-[100vh] flex-col items-center">
			<span class="text-xl font-bold"> SELECT </span>
			<div class="mt-5 flex w-fit flex-col">
				<label class="mb-2">
					<input
						class="mr-1 h-5 w-5 border-2 transition-all duration-200 ease-in-out"
						type="radio"
						bind:group={aggregateBy}
						value={-1}
					/>
					Frequency
				</label>
				<div class="mb-2 size-1 w-full rounded-lg bg-gray-300"></div>
				{#each aggregatableColumns as column, index}
					<label class="mb-2 flex items-center">
						<input
							class="mr-2 h-5 w-5 border-2 transition-all duration-200 ease-in-out"
							type="radio"
							bind:group={aggregateBy}
							value={index}
						/>
						<span class="w-64 truncate">
							{column.name}
						</span>
					</label>
				{/each}
			</div>
		</div>
	</div>
	<Button
		href="/view"
		class="w-48 rounded-lg bg-darkblue text-sm font-bold text-offwhite"
		data-testid="next-link"
	>
		<div class="flex items-center justify-center">
			Next
			<img src={nextImg} class=" ml-4 h-8 w-8 invert" alt="Next icon" />
		</div>
	</Button>
</div>
