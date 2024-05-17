<script lang="ts">
	import {
		ABSOLUTE_FREQUENCY,
		RELATIVE_FREQUENCY
	} from '$lib/graphs/histogram/HistogramController';

	export let columnNames: string[];
	export let numericColumnNames: string[];

	export let selectedParams: string[] = [];
	export let parameterType: string = ABSOLUTE_FREQUENCY;
	export let checkedMean: boolean = false;

	let binSizes: number[] = [];
	let size: number = 1;

	for (const column of numericColumnNames) {
		binSizes.push(1);
	}

	$: console.log(binSizes);
	
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

{#each selectedParams as column}
	{#if numericColumnNames.includes(column)}
		<br />
		<label>
			{column} Bin Size: 
			<input 
				type="number"
				data-testid="number-bin-{column}"
				value="1"
				min="1"
				max="1000"
				bind:value={size}
			/>
			<input 
				type="range"
				data-testid="range-bin-{column}"
				value="1"
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
