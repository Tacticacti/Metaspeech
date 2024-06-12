import type { GroupedDataFrame, Column } from '$lib/Types';

export type ScatterDataset = {
    data: [number, number][];
    label: string;
    backgroundColor: string;
    borderColor: string;
    pointStyle: string;
}

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

export function getScatterDatasets(groupedData: GroupedDataFrame, yAxisCol: Column, xAxisCol: Column, legendCol: Column | undefined): ScatterDataset[] {
    return [
		{
			data: [
				[19, 10],
				[20, 30],
				[42, 32],
				[50, 33]
			],
			label: 'Male',
			backgroundColor: 'rgba(51, 50, 200, 1)',
			borderColor: 'rgba(51, 50, 200, 1)',
			pointStyle: 'cross'
		},
		{
			data: [
				[19, 20],
				[19, 40],
				[40, 40],
				[52, 30],
				[60, 50]
			],
			label: 'Female',
			backgroundColor: 'rgba(255, 99, 132, 1)',
			borderColor: 'rgba(255, 99, 132, 1)',
			pointStyle: 'rect'
		}
	];
}