<script lang="ts">
	export let columnNames;
	export let numericColumnNames;

	export let selectedParams: string[] = [];
	export let parameterType: string = ABSOLUTE_FREQUENCY;
	export let checkedMean: boolean = false;

	import {
		ABSOLUTE_FREQUENCY,
		RELATIVE_FREQUENCY
	} from '$lib/graphs/histogram/HistogramController';
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
