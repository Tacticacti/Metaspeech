import type { GroupedDataFrame, Group } from '$lib/Types';
/**
 * generates title for graph from current dataframe
 * @param data current dataframe
 * @returns title string
 */
export function titleText(data: GroupedDataFrame): string{
    if(data.groupedColumns.length === 0){
        return 'Absolute Frequency';
    }
    let title: string = (data.aggregateColumn ? data.aggregateColumn.name : 'undefined') + ' x ';
    if(data.groupedColumns.length > 1){
        title += '(' + data.groupedColumns.map(column => column.name).join(', ') + ')';
    }
    else {
        title += data.groupedColumns[0].name
    }
    return title;
    // original:
    // data.groupedColumns.length === 0
    // ? 'Absolute Frequency'
    // : data.aggregateColumn.name +
    //     ' x ' +
    //     (data.groupedColumns.length > 1
    //         ? '(' + data.groupedColumns.map(column => column.name).join(', ') + ')'
    //         : data.groupedColumns[0].name)
}
/**
 * generates scale text for graph from current dataframe
 * @param data current dataframe
 * @returns scale string
 */
export function scaleText(data: GroupedDataFrame): string{
    if(data.groupedColumns.length > 1){
        return 'Group: (' + data.groupedColumns.map(column => column.name).join(', ') + ')'
    }
    return data.groupedColumns[0].name;
    // original:
    // data.groupedColumns.length > 1
	// ? 'Group: (' + data.groupedColumns.map(column => column.name).join(', ') + ')'
	// : data.groupedColumns[0].name
}
/**
 * calculates mean values for each of the bins
 * @param data current dataframe for which we want to calculate mean
 * @returns returns bin strings + mean values for each of the bins
 */
export function handleMean(data: GroupedDataFrame): [string[], number[]]{
    let bins: string[] = [];
    let values: number[] = [];
    for(let i = 0; i < data.groups.length; i++){
        let group: Group = data.groups[i];
        let name: string = "";
        for(let j = 0; j < group.keys.length; j++){
            name += group.keys[j];
        }
        bins.push(name);
        let sum: number = 0;
        for(let j = 0; j < group.values.length; j++){
            sum += group.values[j] as number;			//this will always be number, because it is not possible
                                                        //to select a non numeric column in parameter page
                                                        //Make sure to pass only numeric columns!
        }
        values.push(sum/group.values.length);
    }
    return [bins, values];
}
/**
 * calculates sum values for each of the bins
 * @param data current dataframe for which we want to calculate sum
 * @returns returns bin strings + sum values for each of the bins
 */
export function handleSum(data: GroupedDataFrame): [string[], number[]]{
    let bins: string[] = [];
    let values: number[] = [];
    for(let i = 0; i < data.groups.length; i++){
        let group: Group = data.groups[i];
        let name: string = "";
        for(let j = 0; j < group.keys.length; j++){
            name += group.keys[j];
        }
        bins.push(name);
        let sum: number = 0;
        for(let j = 0; j < group.values.length; j++){
            sum += group.values[j] as number;			//this will always be number, because it is not possible
                                                        //to select a non numeric column in parameter page
                                                        //Make sure to pass only numeric columns!
        }
        values.push(sum);
    }
    return [bins, values];
}