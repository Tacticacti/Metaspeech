import type { GroupedDataFrame, Column, ScatterStyle, ScatterDataset } from '$lib/Types';

export function getXAxisCol(groupedColumns: Column[]) : Column {
    for (const col of groupedColumns) {
        if (col.type === 'number') {
            return col;
        }
    }
    throw new Error('Scatterplot required one numerical group-by column!');
}

export function getLegendCol(groupedColumns: Column[], xCol: Column) : Column | undefined {
    for (const col of groupedColumns) {
        if (col !== xCol) {
            return col;
        }
    }
    return undefined;
}

function getIndicesOfColumns(groupedData: GroupedDataFrame, xAxisCol: Column, legendCol: Column | undefined): [number, number] {
    let i = 0, indexX = -1, indexLegend = -1;

    for (const col of groupedData.groupedColumns) {
        if (col === xAxisCol) {
            indexX = i;
        } else if (col === legendCol) {
            indexLegend = i;
        }  
        ++i;
    }    

    return [indexX, indexLegend];
}

function getScatterMap(groupedData: GroupedDataFrame, yAxisCol: Column, xAxisCol: Column, legendCol: Column | undefined): Map<string, [number, number][]> {
    const [indexX, indexLegend] = getIndicesOfColumns(groupedData, xAxisCol, legendCol);
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

export function getScatterDatasets(groupedData: GroupedDataFrame, yAxisCol: Column, xAxisCol: Column, legendCol: Column | undefined, styles: ScatterStyle[]): ScatterDataset[] {

    const scatterMap = getScatterMap(groupedData, yAxisCol, xAxisCol, legendCol);
    const legendValues = [...scatterMap.keys()];

    const scatterDataset: ScatterDataset[] = [];

    for (let i = 0; i < legendValues.length; ++i) {
        const style = styles[i % styles.length];
        const label = legendValues[i];
        const data = scatterMap.get(legendValues[i])!;

        scatterDataset.push({data, label, style});
    }

    return scatterDataset;
}

// return [
	// 	{
	// 		data: [
	// 			[19, 10],
	// 			[20, 30],
	// 			[42, 32],
	// 			[50, 33]
	// 		],
	// 		label: 'Male',
	// 		backgroundColor: 'rgba(51, 50, 200, 1)',
	// 		borderColor: 'rgba(51, 50, 200, 1)',
	// 		pointStyle: 'cross'
	// 	},
	// 	{
	// 		data: [
	// 			[19, 20],
	// 			[19, 40],
	// 			[40, 40],
	// 			[52, 30],
	// 			[60, 50]
	// 		],
	// 		label: 'Female',
	// 		backgroundColor: 'rgba(255, 99, 132, 1)',
	// 		borderColor: 'rgba(255, 99, 132, 1)',
	// 		pointStyle: 'rect'
	// 	}
	// ];