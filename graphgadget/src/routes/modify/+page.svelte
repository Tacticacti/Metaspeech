<script lang="ts">
	import Importer from '$lib/importer/Importer.svelte';
	import { data as unmodified } from '$lib/Store';
	import { goto } from '$app/navigation';
	import { hasMissingValues, rowWiseMerge } from '$lib/utils/DataFrameUtils';
	import DataFrame from 'dataframe-js';
	import type { Bundle } from '$lib/types';

	function handleClick() {
		// write changes
		unmodified.set(data);
		goto('/view');
	}
	let data = $unmodified;
	data = data.replace('', undefined);

	$: column_names = data.listColumns() as string[];
	$: missing_values = hasMissingValues(data);
	$: columns_with_missing = [...new Set(missing_values.map((v) => v[1]))].map(
		(v) => column_names[v]
	);

	function columnValueChanged(event: Event, previousValue: string) {
		const input = event.target as HTMLInputElement;
		const value = input.value.trim();

		if (
			value === previousValue ||
			value === '' ||
			value === null ||
			value === undefined ||
			column_names.includes(value)
		) {
			//TODO: decide what to do in these cases
			input.value = previousValue;
			return;
		}

		data = data.rename(previousValue, value);
	}

	function removeMissingValues() {
		data = data.dropMissingValues(column_names);
	}

	function removeColumn(column: string) {
		data = data.drop(column);
	}

	let second_data: DataFrame;
	function handleInput(event: CustomEvent<Bundle>) {
		second_data = event.detail.input;
	}

	function handleRowWiseMerge() {
		data = rowWiseMerge(data, second_data);
	}

	function joinColumns() {
		let renamed = second_data;
		if (merge_col_1 !== merge_col_2) {
			renamed = second_data.rename(merge_col_2, merge_col_1);
		}
		data = data.join(renamed, merge_col_1);
	}

	let merge_col_1: string;
	let merge_col_2: string;
</script>

{#if missing_values.length !== 0}
	<span>
		<p>Warning: Missing values detected in: {columns_with_missing.join(', ')}</p>
		<button on:click={removeMissingValues}>Remove missing values</button>
	</span>
{/if}

<button on:click={handleClick}>Next</button>

<Importer on:input={handleInput} />

{#if second_data}
	<button on:click={handleRowWiseMerge}>row-wise merge</button>
	<select bind:value={merge_col_1}>
		{#each column_names as col}
			<option value={col}>{col}</option>
		{/each}
	</select>
	<select bind:value={merge_col_2}>
		{#each second_data.listColumns() as col}
			<option value={col}>{col}</option>
		{/each}
	</select>
	{#if merge_col_1 && merge_col_2}
		<button on:click={joinColumns}>join columns</button>
	{/if}
{/if}

<table>
	<thead>
		<tr>
			{#each column_names as header}
				<th>
					<input type="text" on:change={(e) => columnValueChanged(e, header)} value={header} />
					<button on:click={() => removeColumn(header)}>X</button>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each data.toArray() as row}
			<tr>
				{#each row as cell}
					<td>{cell}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
