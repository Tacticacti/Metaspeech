<script lang="ts">
	import { data } from '$lib/Store';

	let isOpen: boolean = false;
	let selectedColumn: string = $data.listColumns()[0];
	let filterValue: string = '';
	let useRangeChecked: boolean = true;
	let min: number = 0;
	let max: number = 0;

	$: isNumberColumn = $data.toArray(selectedColumn).every((v) => !isNaN(v));
	$: useRange = isNumberColumn && useRangeChecked;

	function filter(invert: boolean = false) {
		if (useRange) {
			// range filter

			console.log(min, max);

			$data = $data.filter(
				// @ts-expect-error dataframe bad typing
				(row) => (row.get(selectedColumn) >= min && row.get(selectedColumn) <= max) == invert
			);
			return;
		}

		// @ts-expect-error dataframe bad typing
		$data = $data.filter((row) => (row.get(selectedColumn) === filterValue) === invert);
	}
</script>

<button on:click={() => (isOpen = !isOpen)}>Filter</button>

{#if isOpen}
	<select bind:value={selectedColumn}>
		{#each $data.listColumns() as col}
			<option value={col}>{col}</option>
		{/each}
	</select>
	<div>
		{#if isNumberColumn}
			<label>
				Select Range
				<input type="checkbox" bind:checked={useRangeChecked} />
			</label>
		{/if}

		{#if useRange}
			<input type="number" placeholder="min" bind:value={min} />
			<input type="number" placeholder="max" bind:value={max} />
		{:else}
			<input type="text" placeholder="value to filter" bind:value={filterValue} />
		{/if}

		<button on:click={() => filter(false)}>Remove matching</button>
		<button on:click={() => filter(true)}>Remove non-matching</button>
	</div>
{/if}
