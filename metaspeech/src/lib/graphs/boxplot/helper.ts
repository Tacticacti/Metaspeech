import type { DataType, Group, GroupedDataFrame } from "$lib/Types";



export function createDatasets(data: GroupedDataFrame){
    if(data.groupedColumns.length < 1 || data.groupedColumns.length> 2) return undefined;
    if(data.groupedColumns.length === 1){
        return {
                    label: '',
                    backgroundColor: 'rgba(255,0,0,0.5)',
                    borderColor: 'red',
                    borderWidth: 1,
                    outlierColor: '#999999',
                    padding: 0,
                    itemRadius: 5,
                    data: [data.groups.map(group => group.values)]
                }
    }
    let keyToIndex1 = new Map<DataType, number>();
    
    // {
    //     label: 'Dataset 1',
    //     backgroundColor: 'rgba(255,0,0,0.5)',
    //     borderColor: 'red',
    //     borderWidth: 1,
    //     outlierColor: '#999999',
    //     padding: 0,
    //     itemRadius: 5,
    //     data: [[1, 2, 3, 2, 1], [2, 3, 4, 5, 6, 5, 6]]
    // }
}