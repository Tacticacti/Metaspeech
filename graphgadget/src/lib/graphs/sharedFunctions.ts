import type { GroupedDataFrame } from '$lib/Types';
/**
 * generates title for graph from current dataframe
 * @param data current dataframe
 * @returns title string
 */
export function titleText(data: GroupedDataFrame): string{
    if(data.groupedColumns.length === 0){
        return 'Absolute Frequency';
    }
    let title: string = (data.aggregateColumn ? data.aggregateColumn.name ? 'undefined') + ' x ';
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