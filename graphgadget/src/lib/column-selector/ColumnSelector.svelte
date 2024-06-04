<script lang="ts">
	import { data } from '$lib/Store';
	import { getNumericalColumns } from './ColumnHelper';
	import {
		selectedColumns,
		selectedValues,
		type BinDictionary,
		binSizes,
		checkedMean,
		ABSOLUTE_FREQUENCY,
		RELATIVE_FREQUENCY
	} from '$lib/Store';

	let columnNames = $data.listColumns();
	let numericColumns = getNumericalColumns(columnNames, $data.toCollection(true));
	let currentlySelectedColumns: string[] = [];
	let currentlySelectedValues: string[] = [];
	let currentBinSizes: BinDictionary = {};
	$: selectedColumns.set(currentlySelectedColumns);
	$: selectedValues.set(currentlySelectedValues);
	$: binSizes.set(currentBinSizes);

	/**
	 * column names available for select: if not in selected columns and is a numeric column
	 */
	$: availableForSelect = columnNames.filter(
		(columnName) =>
			!currentlySelectedColumns.includes(columnName) && numericColumns.includes(columnName)
	);
	/**
	 * column names available for groupby: if not in selected values
	 */
	$: availableForGroupby = columnNames.filter(
		(columnName) => !currentlySelectedValues.includes(columnName)
	);

	/**
	 * Toggle the usage of mean
	 */
	function toggleMean() {
		$checkedMean = !$checkedMean;
	}
</script>

<div class="flex justify-center">
	<div class="pr-5">
		<h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Group by</h3>
		<ul
			class="w-72 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
		>
			{#each availableForGroupby as column}
				<li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
					<div class="flex items-center ps-3">
						<input
							bind:group={currentlySelectedColumns}
							data-testid="groupby-{column}"
							value={column}
							id="groupby-checkbox-{column}"
							type="checkbox"
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
						/>
						<label
							for="groupby-checkbox-{column}"
							class="w-1/2 py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>{column}</label
						>
						{#if currentlySelectedColumns.includes(column) && numericColumns.includes(column)}
							<label class="w-full pr-1 py-3 ms-2 text-sm font-medium">
								<input
									type="number"
									placeholder="Bin size"
									bind:value={currentBinSizes[column]}
									data-testid="number-bin-{column}"
									name={column}
									class="w-full border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-300 text-sm"
								/>
							</label>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	</div>
	<div>
		<h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Select</h3>
		<ul
			class="w-72 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
		>
			{#each availableForSelect as column}
				<li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
					<div class="flex items-center ps-3">
						<input
							bind:group={currentlySelectedValues}
							data-testid="select-{column}"
							value={column}
							id="select-checkbox-{column}"
							type="checkbox"
							class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
						/>
						<label
							for="select-checkbox-{column}"
							class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
							>{column}</label
						>
					</div>
				</li>
			{/each}
			<li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
				<div class="flex items-center ps-3">
					<input
						bind:group={currentlySelectedValues}
						data-testid="select-{ABSOLUTE_FREQUENCY}"
						value={ABSOLUTE_FREQUENCY}
						id="select-checkbox-{ABSOLUTE_FREQUENCY}"
						type="checkbox"
						class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
					/>
					<label
						for="select-checkbox-{ABSOLUTE_FREQUENCY}"
						class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
						>{ABSOLUTE_FREQUENCY}</label
					>
				</div>
			</li>
			<li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
				<div class="flex items-center ps-3">
					<input
						bind:group={currentlySelectedValues}
						data-testid="select-{RELATIVE_FREQUENCY}"
						value={RELATIVE_FREQUENCY}
						id="select-checkbox-{RELATIVE_FREQUENCY}"
						type="checkbox"
						class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
					/>
					<label
						for="select-checkbox-{RELATIVE_FREQUENCY}"
						class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
						>{RELATIVE_FREQUENCY}</label
					>
				</div>
			</li>
		</ul>
	</div>
	<div>
		<button
			class=" max-h-14 py-4 px-2 w-40 bg-darkblue rounded-lg hover:bg-blue-900 text-offwhite font-bold rounded-lg text-sm"
			data-testid="checked-mean-button"
			on:click={toggleMean}
		>
			{$checkedMean ? 'Disable mean' : 'Enable mean'}
		</button>
	</div>
</div>
