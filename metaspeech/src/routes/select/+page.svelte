<script lang="ts">
	import { df } from '$lib/Store';
	import type { Column } from '$lib/Types';
	import { Button, Tooltip } from 'flowbite-svelte';
	import nextImg from '$assets/icons/next.png';
	import info from '$assets/icons/info.svg';

	const columns = df.columns;
	$: aggregatableColumns = $columns.filter((c) => c.type === 'number' && !c.groupBy);
	$: aggregateBy = $columns.find((c) => c.aggregate);

	/**
	 * Selects a column for grouping
	 * @param column Column to select
	 * @param select Whether to select or deselect the column
	 */
	function selectColumnForGrouping(column: Column, select: boolean) {
		column.groupBy = select
			? column.type === 'number'
				? { type: 'binned', size: 1 }
				: { type: 'specific' }
			: undefined;
		column.aggregate = false;
		df.forceStoreUpdate();
	}

	/**
	 * Selects a column for showing
	 * @param column Column to select
	 */
	function selectColumnForShowing(column: Column | undefined) {
		$columns.forEach((c) => (c.aggregate = c === column));
		df.forceStoreUpdate();
	}

	/**
	 * Determines if the column should show binning options
	 * @param column Column to check
	 * @returns Whether the column should show binning options
	 */
	function shouldShowBinning(
		column: Column
	): column is Column & { groupBy: { type: 'binned'; size: number } } {
		if (!column.groupBy || column.type !== 'number') return false;

		if (column.groupBy.type === 'binned') return true;

		column.groupBy = { type: 'binned', size: 1 };
		return true;
	}
</script>

<div class="flex h-[90vh] flex-col items-center justify-around">
	<div class="flex w-full justify-center border-4 py-5">
		<div class="mx-20 flex w-full max-w-[100vh] flex-col items-center">
			<span class="flex items-center text-xl font-bold">
				GROUP BY
				<button
					><img
						src={info}
						alt="info icon"
						class="ml-2 h-8"
						data-testid="info-icon-groupby"
					/></button
				>
				<Tooltip
					placement="top"
					class="z-20 w-48 bg-gray-600 text-sm font-light opacity-90"
					data-testid="info-bubble-groupby"
				>
					Select <span class="font-bold">any</span> columns that you want to group together.
				</Tooltip>
			</span>
			<div class="mt-5 flex w-fit flex-col">
				{#each $columns as column}
					<span class=" mb-2 flex w-full min-w-96 items-center justify-between">
						<label class="flex items-center">
							<input
								class="mr-2 h-5 w-5 rounded-sm border-2 transition-all duration-200 ease-in-out"
								type="checkbox"
								on:input={(e) => selectColumnForGrouping(column, e.currentTarget.checked)}
								checked={Boolean(column.groupBy)}
							/>
							<span class="w-36 truncate">
								{column.name}
							</span>
						</label>
						{#if shouldShowBinning(column)}
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
			<span class="flex items-center text-xl font-bold">
				SHOW
				<button
					><img src={info} alt="info icon" class="ml-2 h-8" data-testid="info-icon-show" /></button
				>
				<Tooltip
					placement="top"
					class="z-20 w-48 bg-gray-600 text-sm font-light opacity-90"
					data-testid="info-bubble-show"
				>
					Select <span class="font-bold">one</span> numeric column to show for each subgroup.
				</Tooltip>
			</span>
			<div class="mt-5 flex w-fit flex-col">
				<label class="mb-2">
					<input
						class="mr-1 h-5 w-5 border-2 transition-all duration-200 ease-in-out"
						type="radio"
						name="show"
						checked={!aggregateBy}
						on:input={() => selectColumnForShowing(undefined)}
					/>
					Count / Percentage
				</label>
				<div class="mb-2 size-1 w-full rounded-lg bg-gray-300"></div>
				{#each aggregatableColumns as column}
					<label class="mb-2 flex items-center">
						<input
							class="mr-2 h-5 w-5 border-2 transition-all duration-200 ease-in-out"
							type="radio"
							name="show"
							checked={column.aggregate}
							on:input={() => selectColumnForShowing(column)}
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
