<script lang="ts">
	import {
		ABSOLUTE_FREQUENCY,
		RELATIVE_FREQUENCY,
		type BinDictionary
	} from '$lib/graphs/histogram/HistogramController';

	export let columnNames: string[];
	export let numericColumnNames: string[];

	export let selectedParams: string[] = [];
	export let parameterType: string = ABSOLUTE_FREQUENCY;
	export let checkedMean: boolean = false;
	export let binSizes: BinDictionary = {};

	for (const column of numericColumnNames) {
		binSizes[column] = 1;
	}
</script>

<p>Parameters on the x-axis</p>
{#each columnNames as column}
	<label>
		<input
			type="checkbox"
			data-testid="check-{column}"
			name="params"
			value={column}
			bind:group={selectedParams}
		/>
		{column}
	</label>
{/each}

{#each numericColumnNames as column}
	{#if selectedParams.includes(column)}
		<br />
		<label>
			{column} Bin Size:
			<input
				type="number"
				bind:value={binSizes[column]}
				data-testid="number-bin-{column}"
				min="1"
				max="1000"
			/>
			<input
				type="range"
				bind:value={binSizes[column]}
				data-testid="range-bin-{column}"
				min="1"
				max="1000"
			/>
		</label>
	{/if}
{/each}

<p>Parameter of the y-axis</p>

<select data-testid="select-y-axis-parameter" bind:value={parameterType}>
	<option value={ABSOLUTE_FREQUENCY}>{ABSOLUTE_FREQUENCY}</option>
	<option value={RELATIVE_FREQUENCY}>{RELATIVE_FREQUENCY}</option>
	{#each numericColumnNames as column}
		<option value={column}>{column}</option>
	{/each}
</select>

{#if parameterType != ABSOLUTE_FREQUENCY && parameterType != RELATIVE_FREQUENCY}
	<label>
		<input type="checkbox" data-testid="check-mean" name="mean" bind:checked={checkedMean} />
		Mean
	</label>
{/if}
