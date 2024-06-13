import type { GroupedDataFrame, Group, DataType, Column, GroupBy } from '$lib/Types';

/**
 * The type of the aggregate options.
 */
export type AggregateOption = {
	name: string;
	fn: (data: GroupedDataFrame, group: Group) => string;
	default: string;
};
/**
 * The aggregate options for when no aggregate column is selected.
 */
export const aggregateOptions_none: AggregateOption[] = [
	{
		name: 'Count',
		fn: (_: GroupedDataFrame, group: Group) => {
			return group.values.length.toString();
		},
		default: '0'
	},
	{
		name: 'Percentage',
		fn: (data: GroupedDataFrame, group: Group) => {
			const n = getSum(data.groups.map((g) => g.values.length));
			const groupCount = group.values.length;
			const p = groupCount / n;
			return `${to2Decimal(p * 100)}%`;
		},
		default: '0%'
	}
];
/**
 * The aggregate options for when a single aggregate column is selected.
 */
export const aggregateOptions_single: AggregateOption[] = [
	{
		name: 'Mean',
		fn: (_: GroupedDataFrame, group: Group) => {
			const filtered = group.values.filter((v) => typeof v === 'number') as number[];
			if (filtered.length === 0) return '-';

			const mean = getMean(filtered);
			return to2Decimal(mean);
		},
		default: '-'
	},
	{
		name: 'Mean (SD)',
		fn: (_: GroupedDataFrame, group: Group) => {
			const filtered = group.values.filter((v) => typeof v === 'number') as number[];
			if (filtered.length === 0) return '-';

			const mean = getMean(filtered);
			const sd = getSD(filtered);
			return `${to2Decimal(mean)} (${to2Decimal(sd)})`;
		},
		default: '-'
	},
	{
		name: 'Mean ± SE',
		fn: (_: GroupedDataFrame, group: Group) => {
			const filtered = group.values.filter((v) => typeof v === 'number') as number[];
			if (filtered.length === 0) return '-';

			const mean = getMean(filtered);
			const sd = getSD(filtered);
			const se = sd / Math.sqrt(filtered.length);

			return `${to2Decimal(mean)} ± ${to2Decimal(se)}`;
		},
		default: '-'
	},
	{
		name: 'Min-Max',
		fn: (_: GroupedDataFrame, group: Group) => {
			const filtered = group.values.filter((v) => typeof v === 'number') as number[];
			if (filtered.length === 0) return '-';

			const min = Math.min(...filtered);
			const max = Math.max(...filtered);
			return `${to2Decimal(min)}-${to2Decimal(max)}`;
		},
		default: '-'
	}
];

/**
 * Gets the sum of the given values.
 * @param values the values to sum
 * @returns the sum of the values
 */
function getSum(values: number[]): number {
	return values.reduce((acc, v) => acc + v, 0);
}

/**
 * Gets the mean of the given values.
 * @param values the values to get the mean from
 * @returns the mean of the values
 */
function getMean(values: number[]): number {
	return getSum(values) / values.length;
}

/**
 * Gets the standard deviation of the given values.
 * @param values the values to get the standard deviation from
 * @returns The standard deviation of the values
 */
function getSD(values: number[]): number {
	const mean = getMean(values);
	return Math.sqrt(values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length);
}

/**
 * Converts a number to a string with at most 2 decimal places.
 * @example
 * to2Decimal(1) => '1'
 * to2Decimal(1.1) => '1.1'
 * to2Decimal(1.11) => '1.11'
 * @param num the number to convert
 * @returns the number as a string with 2 decimal places
 */
function to2Decimal(num: number): string {
	return num.toFixed(2).replace(/\.?0+$/, '');
}

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
type TableMeta = {
	headerShape: [number, number];
	shape: [number, number];
	keySets: KeySet[];
	map: Map<string, string>;
	data: GroupedDataFrame;
	selectedOption: AggregateOption;
};

/**
 * Generates a table from the given data and selected option.
 * @param data the data to generate the table from
 * @param selectedOption the selected option to aggregate the data
 * @returns the table as a 2D array of cells
 */
export function createTable(data: GroupedDataFrame, selectedOption: AggregateOption): Cell[][] {
	// @ts-expect-error - you never know ts... you never know... (ts thinks they cannot be undefined)
	if ([data, selectedOption].includes(undefined)) return [];

	// get the table meta data
	const keySets = getKeySets(data);
	const meta: TableMeta = {
		headerShape: getHeaderShape(keySets),
		shape: getTableShape(keySets),
		map: getMap(data, selectedOption, keySets),
		keySets,
		data,
		selectedOption
	};

	const [rowCount, colCount] = meta.shape;

	// loop over the table to generate the cells
	const result = [];
	for (let row = 0; row < rowCount; row++) {
		const rowResult = [];
		for (let col = 0; col < colCount; col++) {
			const cell = getCell(row, col, meta);
			rowResult.push(cell);
		}
		result.push(rowResult);
	}
	return result;
}

/**
 * Gets the map of the data. Consisting of the signature and the aggregated value of the group.
 * @param data The data to get the map from
 * @param selectedOption The selected option to aggregate the data
 * @param keySets The key sets to group the data by
 * @returns The map of the data
 */
function getMap(
	data: GroupedDataFrame,
	selectedOption: AggregateOption,
	keySets: KeySet[]
): Map<string, string> {
	const map = new Map<string, string>();

	for (const group of data.groups) {
		// get key signature
		const signature = keySets.map((k) => group.keys[k.i]);
		const signatureJSON = JSON.stringify(signature);

		// get aggregated value
		const value = selectedOption.fn(data, group);

		map.set(signatureJSON, value);
	}

	return map;
}

/**
 * Gets the key sets of the data.
 * Key sets are the unique values of the grouped columns.
 * The sets are sorted asc and the array of sets is sorted desc.
 * @param data The data to get the key sets from
 * @returns The key sets of the data
 */
export function getKeySets(data: GroupedDataFrame): KeySet[] {
	const { groups, groupedColumns } = data;

	const keySets = [];
	for (const [i, col] of groupedColumns.entries()) {
		// get unique values of a grouped column
		const values = groups.map((g) => g.keys[i]);
		let unique = Array.from(new Set(values));

		// filter and order them
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

/**
 * Gets the shape of the table.
 * @param keys The key sets to get the shape from
 * @returns [rowCount, colCount]
 */
function getTableShape(keys: KeySet[]): [number, number] {
	let [rowCount, colCount] = getHeaderShape(keys);

	// calculate the amount of unique combinations keys to get width and height
	rowCount += keys.filter((_, i) => i % 2 === 1).reduce((acc, k) => acc * k.unique.length, 1);
	colCount += keys.filter((_, i) => i % 2 === 0).reduce((acc, k) => acc * k.unique.length, 1);

	return [rowCount, colCount];
}

/**
 * Gets the amount of rows and columns attributed to the header.
 * @param keys The key sets to get the header shape from
 * @returns [topSize, leftSize] or [rowCount, colCount]
 */
function getHeaderShape(keys: KeySet[]): [number, number] {
	// first key goes top, and then alternate
	const keysTop = Math.ceil(keys.length / 2);
	const keysLeft = keys.length - keysTop;

	return [keysTop, keysLeft];
}

/**
 * Gets the cell at the given row and column.
 * @param row the row index
 * @param col the column index
 * @param meta the table meta data
 * @returns the cell at the given row and column
 */
function getCell(row: number, col: number, meta: TableMeta): Cell {
	const [keysTop, keysLeft] = meta.headerShape;

	// cell is top left (not even a header cell)
	if (row < keysTop && col < keysLeft) {
		return {
			content: '',
			rowSpan: keysTop,
			colSpan: keysLeft,
			class: undefined,
			skip: !(row === 0 && col === 0)
		};
	}

	const signature = getKeySignature(row, col, meta);

	// cell is a header cell in the top bar
	if (row < keysTop) {
		const index = row * 2;
		const content = keyToString(signature[index], meta.keySets[index]);
		const prev = getCell(row, col - 1, meta);
		return {
			content,
			rowSpan: 1,
			colSpan: meta.keySets
				.filter((_, i) => i > index && i % 2 === 0)
				.reduce((arr, k) => arr * k.unique.length, 1),
			class: 'header',
			skip: content === prev.content && prev.colSpan > 1
		};
	}

	// cell is a header cell in the left bar
	if (col < keysLeft) {
		const index = col * 2 + 1;
		const content = keyToString(signature[index], meta.keySets[index]);
		const prev = getCell(row - 1, col, meta);
		return {
			content,
			rowSpan: meta.keySets
				.filter((_, i) => i > index && i % 2 === 1)
				.reduce((arr, k) => arr * k.unique.length, 1),
			colSpan: 1,
			class: 'header',
			skip: content === prev.content && prev.rowSpan > 1
		};
	}

	// cell is a data cell
	return {
		content: meta.map.get(JSON.stringify(signature)) ?? meta.selectedOption.default,
		rowSpan: 1,
		colSpan: 1,
		class: 'data',
		skip: false
	};
}

/**
 * Gets the key signature at the given row and column.
 * @example signature for x => [a, 1]
 * signature for a => [a, undefined]
 * signature for 1 => [undefined, 1]
 * _ | a | b |
 * 1 | x |   |
 * 2 |   |   |
 * @param row the row index
 * @param col the column index
 * @param meta the table meta data
 * @returns the key signature at the given row and column
 */
function getKeySignature(row: number, col: number, meta: TableMeta): DataType[] {
	const [keysTop, keysLeft] = meta.headerShape;
	const pos = [col - keysLeft, row - keysTop];
	const result = [];
	for (let i = meta.keySets.length - 1; i >= 0; i--) {
		const unique = meta.keySets[i].unique;
		const isEven = i % 2;
		const localPos = pos[isEven];
		if (localPos < 0) {
			result[i] = undefined;
			continue;
		}

		const index = localPos % unique.length;
		pos[isEven] = Math.floor(localPos / unique.length);
		result[i] = unique[index];
	}
	return result;
}

/**
 * Converts the key to a string.
 * @example
 * keyToString(2, { col: { groupBy: { type: 'binned', size: 10 } } }) => '[20-29)'
 * @param key The key to convert to a string
 * @param keySet The keyset the key belongs to
 * @returns The key as a string
 */
function keyToString(key: DataType, keySet: KeySet): string {
	const groupBy = keySet.col.groupBy as GroupBy;

	if (groupBy.type === 'binned' && groupBy.size > 1) {
		const size = groupBy.size;
		const index = key as number;

		const start = index * size;
		const end = start + size - 1;

		return `[${start}-${end})`;
	}
	return key!.toString();
}
