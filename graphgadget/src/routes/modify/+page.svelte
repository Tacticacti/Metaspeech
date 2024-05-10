<script lang="ts">
	import { data as unmodified } from '$lib/Store';
	import { goto } from '$app/navigation';
	import { DataFrame } from 'dataframe-js';

	function handleClick() {
		// write changes
		unmodified.set(data);
		goto('/view');
	}
	let data = $unmodified;
	data = data.replace('', undefined);

	$: column_names = data.listColumns() as string[];
	$: missing_values = hasMissingValues(data);

	function columnValueChanged(event:Event, previousValue: string) {
		const input = event.target as HTMLInputElement;
		const value = input.value.trim();

		if (value === previousValue || value === '' || value === null || value === undefined || column_names.includes(value)) {
			//TODO: decide what to do in these cases
			input.value = previousValue;
			return;
		}

		data = data.rename(previousValue, value)
	}

	function hasMissingValues(df: DataFrame): number[][] {
		const result: number[][] = []
		const arr = df.toArray() as any[][];
		for (let i = 0; i < arr.length; i++) {
			for (let j = 0; j < arr[i].length; j++) {
				if (arr[i][j] === null || arr[i][j] === undefined || isNaN(arr[i][j])) {
					result.push([i, j]);
				}
			}
		}
		return result;
	}

	function removeMissingValues() {
		data = data.dropMissingValues(column_names);
	}

	function removeColumn(column: string) {
		data = data.drop(column);
	}

</script>

{#if missing_values.length !== 0}
	<span>
		<p>Warning: Missing values detected</p> 
		<button on:click={removeMissingValues} >Remove missing values</button>
	</span>
{/if}

<button on:click={handleClick}>Next</button>

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