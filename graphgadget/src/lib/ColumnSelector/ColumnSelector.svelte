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

	$: availableForSelect = columnNames.filter(columnName => (!$selectedColumns.includes(columnName) && numericColumns.map(n => n[0]).includes(columnName)));


	function toggleMean() {
		$checkedMean = !$checkedMean;
	}
	function handleClick(){
		console.log('happens');
		
		$selectedValues = [];
	}
</script>

<p>Group by</p>
{#each columnNames as column}
	<label>
		<input
			on:click={handleClick}
			type="checkbox"
			data-testid="groupby-{column}"
			name="params"
			value={column}
			bind:group={currentlySelectedColumns}
		/>
		{column}
	</label>
{/each}
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
	{#if !currentlySelectedColumns.includes(column)}
		<label>
			<input
				type="checkbox"
				data-testid="select-{column}"
				name="params"
				value={column[0]}
				bind:group={currentlySelectedValues}
			/>
			{column}
		</label>
	{/if}
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
