<script lang="ts">
	import { data } from '$lib/Store';
	import { getNumericalColumnsAndMax } from './ColumnHelper';
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
	let numericColumns = getNumericalColumnsAndMax(columnNames, $data.toCollection(true));
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
			!currentlySelectedColumns.includes(columnName) &&
			numericColumns.map((n) => n[0]).includes(columnName)
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
	/**
	 *	removes the column from selectedValues if it is selected in groupby
	 * @param name: name of the column
	 * no return value
	 */
	function handleClickGroupBy(name: string) {
		currentlySelectedValues.filter((n) => n !== name);
	}
	/**
	 * removes the column from selectedColumns if it is selected in select
	 * @param name: name of the column
	 * no return value
	 */
	function handleClickSelect(name: string) {
		currentlySelectedValues.filter((n) => n !== name);
	}
</script>



<h3 class="mb-4 font-semibold text-gray-900 dark:text-white">Group by</h3>
<ul class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
	{#each availableForGroupby as column}
		<li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
			<div class="flex items-center ps-3">
				<input bind:group={currentlySelectedColumns} data-testid="groupby-{column}" value={column} id="vue-checkbox"  type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
				<label for="vue-checkbox" class="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{column}</label>
			</div>
		</li>
	{/each}
    
</ul>


<!-- <p>Group by</p>
{#each availableForGroupby as column}
	<label>
		<input
			on:click={() => {
				handleClickGroupBy(column);
			}}
			type="checkbox"
			data-testid="groupby-{column}"
			name="params"
			value={column}
			bind:group={currentlySelectedColumns}
		/>
		{column}
	</label>
{/each} -->
{#each numericColumns as column}
	{#if currentlySelectedColumns.includes(column[0])}
		<br />
		<label>
			{column[0]} Bin Size:
			<input
				type="number"
				bind:value={currentBinSizes[column[0]]}
				data-testid="number-bin-{column[0]}"
				name={column[0]}
				min="1"
				max={Math.abs(column[1]) + 1}
			/>
			<input
				type="range"
				bind:value={currentBinSizes[column[0]]}
				data-testid="range-bin-{column[0]}"
				name={column[0]}
				min="1"
				max={Math.abs(column[1]) + 1}
			/>
		</label>
	{/if}
{/each}
<p>Select</p>
{#each availableForSelect as column}
	<label>
		<input
			on:click={() => {
				handleClickSelect(column);
			}}
			type="checkbox"
			data-testid="select-{column}"
			name="params"
			value={column}
			bind:group={currentlySelectedValues}
		/>
		{column}
	</label>
{/each}
<label>
	<input
		type="checkbox"
		data-testid="select-{ABSOLUTE_FREQUENCY}"
		name="params"
		value={ABSOLUTE_FREQUENCY}
		bind:group={currentlySelectedValues}
	/>
	{ABSOLUTE_FREQUENCY}
</label>
<label>
	<input
		type="checkbox"
		data-testid="select-{RELATIVE_FREQUENCY}"
		name="params"
		value={RELATIVE_FREQUENCY}
		bind:group={currentlySelectedValues}
	/>
	{RELATIVE_FREQUENCY}
</label>

<div>
	<button data-testid="checked-mean-button" on:click={toggleMean}>
		{$checkedMean ? 'Disable mean' : 'Enable mean'}
	</button>
</div>
