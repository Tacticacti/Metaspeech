<script lang="ts">
	import type { Column, DataType, GroupedDataFrame } from '$lib/Types';

	export let data: GroupedDataFrame;

	$: keysTop = Math.ceil(data.groupedColumns.length / 2);
	$: keysLeft = data.groupedColumns.length - keysTop;
	$: keys = getKeys(data);
	$: result = createTable(data, selectedOption)

	type AggregateOption = {
		name: string;
		fn: (data: GroupedDataFrame) => { keys: DataType[]; value: string }[];
		default: string;
	};

	type Cell = {
		content: string;
		rowSpan: number;
		colSpan: number;
		class: 'header' | 'data' | undefined;
		skip: boolean;
	}
	type KeySet = {
		unique: DataType[]
		col: Column
	}

	const aggregateOptions_none: AggregateOption[] = [
		{
			name: 'Count',
			fn: (data: GroupedDataFrame) =>{				
				return data.groups.map((g) => ({ keys: g.keys, value: `${g.values.length}` }))
			},
			default: '0'
		},
		{
			name: 'xxx.xx%',
			fn: (data: GroupedDataFrame) => {
				const n = total(data, true);
				return data.groups.map((g) => {
					const p = g.values.length / n;
					const percentage = (p * 100).toFixed(2);
					return { 
						keys: g.keys, 
						value: `${percentage}%` 
					}
				});
			},
			default: '0.00%'
		}
	];
	const aggregateOptions_single: AggregateOption[] = [
		{
			name: 'Mean',
			fn: (data: GroupedDataFrame) => {
				return data.groups.map((g) => ({ keys: g.keys, value: `${sum(g.values) / g.values.length}` }));
			},
			default: '-'
		},
		{
			name: 'Mean (SD)',
			fn: (data: GroupedDataFrame) => {
				const n = total(data, false);
				const result = [];
				for (const g of data.groups) {				
					const mean = sum(g.values) / n;
					const filteredValues = g.values.filter((v) => typeof v === 'number') as number[];
					const sd = Math.sqrt(
						filteredValues.reduce((acc, v) => acc + (v - mean) ** 2, 0) / filteredValues.length
					);
					result.push({ keys: g.keys, value: `${mean} (${sd})` });
				}
				return result;
			},
			default: '-'
		}
	];

	const aggregateOptions =
		data.aggregateColumn === undefined ? aggregateOptions_none : aggregateOptions_single;
	let selectedOption: AggregateOption;

	function sum(values: DataType[]): number {
		// @ts-expect-error - ts doesn't know that we're filtering out non-numbers
		return values.filter((v) => typeof v === 'number').reduce((acc, v) => acc + v, 0);
	}
	function total(data: GroupedDataFrame, expectUndefined: boolean): number {
		if (expectUndefined) {
			return data.groups.reduce((acc, g) => acc + g.values.length, 0);
		}
		return data.groups.reduce((acc, g) => acc + g.values.filter((v) => v !== undefined).length, 0);
	}

	function getMap(data: GroupedDataFrame, selectedOption: AggregateOption): Map<string, string> {
		if (selectedOption === undefined) return new Map();

		const calculatedValues = selectedOption.fn(data);

		return new Map(calculatedValues.map((v) => [JSON.stringify(v.keys), v.value]));
	}

	function getKeys(data: GroupedDataFrame): KeySet[] {
		const keySets = [];
		for (let i = 0; i < data.groupedColumns.length; i++) {
			const col = data.groupedColumns[i];
			const values = data.groups.map((g) => g.keys[i]);
			let unique = Array.from(new Set(values));
			if (col.type === 'number'){
				const temp = unique.filter(k => typeof k === 'number') as number[];
				unique = temp.sort((a, b) => a - b);
			} else {
				unique = unique.filter(k => typeof k !== 'undefined').sort();
			}
			unique.sort();
			keySets.push({ unique, col });
		}

		return keySets.sort((a, b) => b.unique.length - a.unique.length);
	}

	function getShape(keys: DataType[][], keysTop: number, keysLeft: number) {
		let rowCount = keysTop
		rowCount += keys.filter((_, i) => i % 2 === 1).reduce((acc, k) => acc + k.length, 0) || 1
		let colCount = keysLeft
		colCount += keys.filter((_, i) => i % 2 === 0).reduce((acc, k) => acc + k.length, 0) || 1

		return [rowCount, colCount];
	}

	function createTable(data: GroupedDataFrame, selectedOption: AggregateOption) {
		const map = getMap(data, selectedOption)
		const shape = getShape(keys.map(k => k.unique), keysTop, keysLeft)
		const result = []
		for (let row = 0; row < shape[0]; row++) {
			const rowResult = []
			for (let col = 0; col < shape[1]; col++) {
				rowResult.push(getCell(row, col, map))
			}
			result.push(rowResult)
		}
		return result
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

		const cellKeys = getKeySignature(row, col)

		if (row < keysTop) {
			const index = row * 2
			const content = cellKeys[index]?.toString() ?? ''
			return {
				content,
				rowSpan: 1,
				colSpan: keys.filter((_, i) => i > index && i % 2 === 0).reduce((arr, k) => arr * k.unique.length, 1),
				class: 'header',
				skip: content === getCell(row, col - 1, map).content
			}
		}
		if (col < keysLeft) {
			const index = col * 2 + 1
			const content = cellKeys[index]?.toString() ?? ''
			return {
				content,
				rowSpan: keys.filter((_, i) => i > index && i % 2 === 1).reduce((arr, k) => arr * k.unique.length, 1),
				colSpan: 1,
				class: 'header',
				skip: content === getCell(row - 1, col, map).content
			}
		}

		const realKey = []
		const keyPositions = keys.map(k => data.groupedColumns.indexOf(k.col))

		for (let i = 0; i < keyPositions.length; i++) {
			realKey[keyPositions[i]] = cellKeys[i]
		}

		return {
			content: map.get(JSON.stringify(realKey)) ?? selectedOption?.default ?? '-',
			rowSpan: 1,
			colSpan: 1,
			class: 'data',
			skip: false
		}
	}

	function getKeySignature(row: number, col: number): DataType[] {
		const pos = [col - keysLeft, row - keysTop]
		const result = []
		for (let i = keys.length -1; i >= 0; i--) {
			const isEven = i % 2
			let localPos = pos[isEven]
			if (localPos < 0) {
				result[i] = ''
				continue
			}

			let index = localPos % keys[i].unique.length
			pos[isEven] = Math.floor(localPos / keys[i].unique.length)
			result[i] = keys[i].unique[index]
		}
		return result
	}
</script>

<select bind:value={selectedOption}>
	{#each aggregateOptions as option}
		<option value={option}>{option.name}</option>
	{/each}
</select>

<table>
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
