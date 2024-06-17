import type { DataType, Group, GroupedDataFrame } from "$lib/Types";
import type { ChartConfiguration } from "chart.js";
import { setColor } from "../utils/CanvasUtils";
import { getTitleText } from "../sharedFunctions";
import { possibleBoxplotColours } from "$lib/Constants";


/**
 * generates datasets for the boxplot. when 1 column is selected: trivial. when 2 columns are selected: tricky.
 * @param data current grouped dataframe    
 * @returns datasets
 */
export function getBoxPlotData(data: GroupedDataFrame){
    if(data.groupedColumns.length < 1 || data.groupedColumns.length> 2) return undefined;
    if(data.groupedColumns.length === 1){
        return {
			// define label tree
			labels: data.groups.map(group => group.keys),
			datasets: [
				{
                    label: '',
                    backgroundColor: 'rgba(255,0,0,0.5)',
                    borderColor: 'red',
                    borderWidth: 1,
                    outlierColor: '#999999',
                    padding: 0,
                    itemRadius: 5,
                    data: data.groups.map(group => group.values)
                }
			]
		}
    
    }
    // need 3d array for values 
    let arr: number[][][] = getArrayForDatasets(data);
    const[keyToIndex1, keyToIndex2] = keyToIndexMap(data);

    let datasets = [];
    
    
    for(let i = 0; i < arr.length; i++){
        datasets.push({
            label: [...keyToIndex1.keys()][i],
            backgroundColor: possibleBoxplotColours[i % possibleBoxplotColours.length],
            borderColor: possibleBoxplotColours[i % possibleBoxplotColours.length],
            borderWidth: 1,
            outlierColor: '#999999',
            padding: 0,
            itemRadius: 5,
            data: arr[i]
        });
    }
    return {
        labels: [...keyToIndex2.keys()],
        datasets: datasets
    }
}

/**
 * maps keys from groups to a index, which will be used in a array
 * @param data current grouped dataframe
 * @returns returns 2 maps, because there are only supposed to be 2 dataTypes in 1 key, because otherwise this function wouldn't be called
 */
export function keyToIndexMap(data: GroupedDataFrame){
    let keyToIndex1 = new Map<DataType, number>();
    let keyToIndex2 = new Map<DataType, number>();
    for(let i = 0; i < data.groups.length; i++){
        let group: Group = data.groups[i];
        if(!keyToIndex1.has(group.keys[0])){
            keyToIndex1.set(group.keys[0], keyToIndex1.size);
        }
        if(!keyToIndex2.has(group.keys[1])){
            keyToIndex2.set(group.keys[1], keyToIndex2.size);
        }
    }
    return [keyToIndex1, keyToIndex2];
}

/**
 * maps all values to 3d array so that it is easier to create datasets  
 * @param data current grouped data frame   
 * @returns 3d array
 */
export function getArrayForDatasets(data: GroupedDataFrame){

    const[keyToIndex1, keyToIndex2] = keyToIndexMap(data);
    
    let arr: number[][][] = [];
    for(let i = 0; i < keyToIndex1.size; i++){
        let temp: number[][] = [];
        for(let j = 0; j < keyToIndex2.size; j++){
            temp.push([]);
        }
        arr.push(temp);
    }
    for(let i = 0; i < data.groups.length; i++){
        let group: Group = data.groups[i];
        arr[keyToIndex1.get(group.keys[0]) as number][keyToIndex2.get(group.keys[1]) as number] = group.values as number[];
    }
    return arr;
}

/**
 * flips all keys in groups. ['a', 2] => [2, 'a'].
 * @param data current grouped data frame   
 * @returns new grouped data frame
 */
export function flipKeys(data: GroupedDataFrame){
    
    let groups = data.groups;

    if(groups[0].keys.length !== 2){
        return data;
    }
    for(let i = 0; i < groups.length; i++){
        let group = groups[i];
        
        //@ts-ignore
        let temp = group.keys[0];
        //@ts-ignore
        group.keys[0] = group.keys[1];
        //@ts-ignore
        group.keys[1] = temp;
    }
    return data;
}

/**
 * exports config for chart
 * @param boxplotData current box plot data, which includes labels and datasets 
 * @param data current grouped data frame
 * @returns config
 */
export function getChartConfig(boxplotData: any, data: GroupedDataFrame): ChartConfiguration{
    const plugin = {
        id: 'customCanvasBackgroundColor',
        beforeDraw: setColor
    };
    const cfg: ChartConfiguration = {
        type: 'boxplot',
        data: boxplotData,

        options: {
            plugins: {
                // @ts-expect-error Needs a specific type for plugin
                customCanvasBackgroundColor: {
                    color: 'white'
                },
                title: {
                    display: true,
                    text: getTitleText(data)
                        //'Boxplot of (' + $selectedColumns.join(', ') + ')'
                }
            },
            scales: {
				y: {
					title: {
						display: true,
						text: data.aggregateColumn?.name
					}
				}
			}
        },

        // @ts-expect-error plugin needs a type same as above
        plugins: [plugin]
    };
    return cfg;
}