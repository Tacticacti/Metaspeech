import type { GroupedDataFrame, Column, ScatterStyle, ScatterDataset } from '$lib/Types';

/**
 * Gets the column that should be in the x-axis
 * @param groupedColumns the array with all grouped columns
 * @returns the column to be in the x-axis
 */
export function getXAxisCol(groupedColumns: Column[]): Column {
	const xCol = groupedColumns.find((col) => col.type === 'number');

	if (xCol === undefined) {
		throw new Error('Scatterplot required one numerical group-by column!');
	}

	return xCol;
}

/**
 * Gets the column that should be in the legend
 * @param groupedColumns the array with all grouped columns
 * @returns the column to be in the legend
 */
export function getLegendCol(groupedColumns: Column[], xCol: Column): Column | undefined {
	return groupedColumns.find((col) => col !== xCol);
}

/**
 * Gets the indices of the x-axis column and the legend column
 * @param groupedColumns the array with all grouped columns
 * @param xAxisCol the x-axis column
 * @param legendCol the legend column
 * @returns the two indices of the columns
 */
function getIndicesOfColumns(
	groupedColumns: Column[],
	xAxisCol: Column,
	legendCol: Column | undefined
): [number, number] {
	const indexX = groupedColumns.indexOf(xAxisCol);
	const indexLegend = legendCol === undefined ? -1 : groupedColumns.indexOf(legendCol!);

	return [indexX, indexLegend];
}

/**
 * Calculates a map that stores the data points for each value of the legend
 * @param groupedColumns the array with all grouped columns
 * @param xAxisCol the x-axis column
 * @param legendCol the legend column
 * @returns the map with data points for each legend value
 */
function getScatterMap(
	groupedData: GroupedDataFrame,
	xAxisCol: Column,
	legendCol: Column | undefined
): Map<string, [number, number][]> {
	const [indexX, indexLegend] = getIndicesOfColumns(
		groupedData.groupedColumns,
		xAxisCol,
		legendCol
	);
	const map = new Map<string, [number, number][]>();

	for (const group of groupedData.groups) {
		// Use a default label for the dataset, if no legend
		let key = 'Dataset';

		if (legendCol !== undefined) {
			// Use legend value as key, if defined
			key = group.keys[indexLegend]?.toString() ?? '';
		}

		for (const val of group.values) {
			// We know that val is of a numeric type since it is the y-axis
			const yVal = val as number;
			// We also know that the x-axis column is of numeric type
			const xVal = group.keys[indexX] as number;
			const dataPoint: [number, number] = [xVal, yVal];

			if (map.has(key)) {
				map.get(key)!.push(dataPoint);
			} else {
				map.set(key, [dataPoint]);
			}
		}
	}

	return map;
}

/**
 * Calculates a dataset for the scatter plot
 * @param groupedColumns the array with all grouped columns
 * @param xAxisCol the x-axis column
 * @param legendCol the legend column
 * @param styles an array with the available styles to be used for each value of the legend
 * @returns the scatter dataset with the relevant information
 */
export function getScatterDatasets(
	groupedData: GroupedDataFrame,
	xAxisCol: Column,
	legendCol: Column | undefined,
	styles: ScatterStyle[]
): ScatterDataset[] {
	const scatterMap = getScatterMap(groupedData, xAxisCol, legendCol);
	const legendValues = [...scatterMap.keys()];

	const scatterDataset: ScatterDataset[] = [];

	for (let i = 0; i < legendValues.length; ++i) {
		const style = styles[i % styles.length];
		const label = legendValues[i];
		const data = scatterMap.get(legendValues[i])!;

		scatterDataset.push({ data, label, style });
	}

	return scatterDataset;
}
