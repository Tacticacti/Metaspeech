<script lang="ts">
	import type { Column, DataType, GroupedDataFrame } from '$lib/Types';
	import { aggregateOptions_none, aggregateOptions_single, type AggregateOption } from './Table';

	type Cell = {
		content: string;
		rowSpan: number;
		colSpan: number;
		class: 'header' | 'data' | undefined;
		skip: boolean;
	};
	type KeySet = {
		unique: DataType[];
		col: Column;
		i: number;
	};

	export let data: GroupedDataFrame;
	const aggregateOptions =
		data.aggregateColumn === undefined ? aggregateOptions_none : aggregateOptions_single;
	let selectedOption: AggregateOption;
	$: keysTop = Math.ceil(data.groupedColumns.length / 2);
	$: keysLeft = data.groupedColumns.length - keysTop;
	$: keys = getKeys(data);
	$: result = createTable(data, selectedOption);

	function getMap(data: GroupedDataFrame, selectedOption: AggregateOption): Map<string, string> {
		if (selectedOption === undefined) return new Map();

		const map = new Map<string, string>();
		
		for (let group of data.groups) {
			const key = JSON.stringify(group.keys);
			const value = selectedOption.fn(data, group);
			map.set(key, value);
		}

		return map;
	}

	function getKeys(data: GroupedDataFrame): KeySet[] {
		const keySets = [];
		for (let i = 0; i < data.groupedColumns.length; i++) {
			const col = data.groupedColumns[i];
			const values = data.groups.map((g) => g.keys[i]);
			let unique = Array.from(new Set(values));
			
			if (col.type === 'number') {
				const temp = unique.filter((k) => typeof k === 'number') as number[];
				unique = temp.sort((a, b) => a - b);
				
			} else {
				unique = unique.filter((k) => typeof k !== 'undefined').sort();
			}
			
			keySets.push({ unique, col, i });
		}

		return keySets.sort((a, b) => b.unique.length - a.unique.length);
	}

	function getShape(keys: DataType[][], keysTop: number, keysLeft: number) {
		let rowCount = keysTop;
		rowCount += keys.filter((_, i) => i % 2 === 1).reduce((acc, k) => acc * k.length, 1);
		let colCount = keysLeft;
		colCount += keys.filter((_, i) => i % 2 === 0).reduce((acc, k) => acc * k.length, 1);

		return [rowCount, colCount];
	}

	function createTable(data: GroupedDataFrame, selectedOption: AggregateOption) {
		const map = getMap(data, selectedOption);
		const shape = getShape(
			keys.map((k) => k.unique),
			keysTop,
			keysLeft
		);
		const result = [];
		for (let row = 0; row < shape[0]; row++) {
			const rowResult = [];
			for (let col = 0; col < shape[1]; col++) {
				rowResult.push(getCell(row, col, map));
			}
			result.push(rowResult);
		}
		return result;
	}

	function getCell(row: number, col: number, map: Map<string, string>): Cell {
		if (row < keysTop && col < keysLeft) {
			return {
				content: '',
				rowSpan: keysTop,
				colSpan: keysLeft,
				class: undefined,
				skip: !(row === 0 && col === 0)
			};
		}

		const cellKeys = getKeySignature(row, col);

		if (row < keysTop) {
			const index = row * 2;
			const content = keyToString(cellKeys[index], keys[index]);
			const prev = getCell(row, col - 1, map);
			return {
				content,
				rowSpan: 1,
				colSpan: keys
					.filter((_, i) => i > index && i % 2 === 0)
					.reduce((arr, k) => arr * k.unique.length, 1),
				class: 'header',
				skip: content === prev.content && prev.colSpan > 1
			};
		}
		if (col < keysLeft) {
			const index = col * 2 + 1;
			const content = keyToString(cellKeys[index], keys[index]);
			const prev = getCell(row - 1, col, map);
			return {
				content,
				rowSpan: keys
					.filter((_, i) => i > index && i % 2 === 1)
					.reduce((arr, k) => arr * k.unique.length, 1),
				colSpan: 1,
				class: 'header',
				skip: content === prev.content && prev.rowSpan > 1
			};
		}

		const realKey = [];
		const keyPositions = keys.map((k) => data.groupedColumns.indexOf(k.col));

		for (let i = 0; i < keyPositions.length; i++) {
			realKey[keyPositions[i]] = cellKeys[i];
		}

		return {
			content: map.get(JSON.stringify(realKey)) ?? selectedOption?.default ?? '-',
			rowSpan: 1,
			colSpan: 1,
			class: 'data',
			skip: false
		};
	}

	function getKeySignature(row: number, col: number): DataType[] {
		const pos = [col - keysLeft, row - keysTop];
		const result = [];
		for (let i = keys.length - 1; i >= 0; i--) {
			const isEven = i % 2;
			let localPos = pos[isEven];
			if (localPos < 0) {
				result[i] = '';
				continue;
			}

			let index = localPos % keys[i].unique.length;
			pos[isEven] = Math.floor(localPos / keys[i].unique.length);
			result[i] = keys[i].unique[index];
		}
		return result;
	}
	function keyToString(key: DataType, keySet: KeySet): string {
		if (key === undefined) return '';
		if (keySet.col.groupBy!.type === 'binned' && keySet.col.groupBy!.size > 1){
			const size = keySet.col.groupBy!.size;
			const index = key as number;

			const start = index * size;
			const end = start + size -1;
			
			return `[${start}-${end})`;
		}
		return key.toString();
	}
</script>
<div class="w-screen">
	<select bind:value={selectedOption}>
		{#each aggregateOptions as option}
			<option value={option}>{option.name}</option>
		{/each}
	</select>
	
	<table class="max-w-screen overflow-auto">
		{#each result as row}
			<tr>
				{#each row as cell}
					{#if !cell.skip}
						<td colspan={cell.colSpan} rowspan={cell.rowSpan} class={cell.class}>
							{cell.content}
						</td>
					{/if}
				{/each}
			</tr>
		{/each}
	</table>
</div>


<style>
	table {
		border-collapse: collapse;
	}

	td {
		border: 1px solid black;
		padding: 5px;
	}

	td.header {
		background-color: #f0f0f0;
	}

	td.data {
		background-color: #f8f8f8;
	}
</style>