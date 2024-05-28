<script lang="ts">
	import { selectedColumns } from '$lib/ColumnSelector/Store';
	import {
		ABSOLUTE_FREQUENCY,
		RELATIVE_FREQUENCY,
		type BinDictionary
	} from '$lib/graphs/histogram/HistogramController';

	//export let columnNames: string[];  						where is this used??
	export let numericColumns: [string, number][];

	let selectedParams: string[] = $selectedColumns;
	export let parameterType: string = ABSOLUTE_FREQUENCY;
	export let checkedMean: boolean = false;
	export let binSizes: BinDictionary = {};

	for (const column of numericColumns) {
		binSizes[column[0]] = 1;
	}
</script>

{#each numericColumns as column}
	{#if selectedParams.includes(column[0])}
		<br />
		<label>
			{column[0]} Bin Size:
			<input
				type="number"
				bind:value={binSizes[column[0]]}
				data-testid="number-bin-{column[0]}"
				name={column[0]}
				min="1"
				max={Math.abs(column[1]) + 1}
			/>
			<input
				type="range"
				bind:value={binSizes[column[0]]}
				data-testid="range-bin-{column[0]}"
				name={column[0]}
				min="1"
				max={Math.abs(column[1]) + 1}
			/>
		</label>
	{/if}
{/each}

<p>Parameter of the y-axis</p>

<select data-testid="select-y-axis-parameter" bind:value={parameterType}>
	<option value={ABSOLUTE_FREQUENCY}>{ABSOLUTE_FREQUENCY}</option>
	<option value={RELATIVE_FREQUENCY}>{RELATIVE_FREQUENCY}</option>
	{#each numericColumns as column}
		<option value={column[0]}>{column[0]}</option>
	{/each}
</select>

{#if parameterType != ABSOLUTE_FREQUENCY && parameterType != RELATIVE_FREQUENCY}
	<label>
		<input type="checkbox" data-testid="check-mean" name="mean" bind:checked={checkedMean} />
		Mean
	</label>
{/if}
