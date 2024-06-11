<script lang="ts">
	import type { GroupedDataFrame, Group } from '$lib/Types';
	import { afterUpdate, onMount } from 'svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { sortGroups } from '$lib/dataframe/DataFrame';
	import { onDestroy } from 'svelte';

	export let data: GroupedDataFrame;
	data.groups = sortGroups(data.groups);
	console.log(data.groups);
	
	let selectedAggregationFunction:string = 'sum';
	let possibleFunctions: string[] = ['sum', 'mean'];
	

	let chart: Chart;
	let canvas: HTMLCanvasElement;

	function handleAggregation(): [string[], number[]]{
		switch(selectedAggregationFunction){
			case 'sum': return handleSum();
			case 'mean': return handleMean();
		}
		return [[], []];
	}
	function handleMean(): [string[], number[]]{
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
	function handleSum(): [string[], number[]]{
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
	afterUpdate(() => {
		let labels: string[] = [];
		let values: number[] = [];
		if(data.aggregateColumn !== undefined){
			[labels, values] = handleAggregation();
		}
		console.log(labels);
		console.log(values);
		
		let datasets = [
			{
				label: labels,
				data: values,
				backgroundColor: 'rgba(51, 50, 200, 1)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}
		];
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: 'white'
		};

		const cfg: ChartConfiguration = {
			type: 'bar',
			data: {
				labels: labels,
				//@ts-ignore
				datasets: datasets
			},

			options: {
				plugins: {
					// @ts-expect-error Needs a specific type for plugin
					customCanvasBackgroundColor: {
						color: 'white'
					},
					title: {
						display: true,
						// Checks if there are colums selected, if not then this is just Absolute Frequency
						// Else the title is the values x group of columns
						text:
							'test1'
							// $selectedColumns.length === 0
							// 	? 'Absolute Frequency'
							// 	: $selectedValues[0] +
							// 		' x ' +
							// 		($selectedColumns.length > 1
							// 			? '(' + $selectedColumns.join(', ') + ')'
							// 			: $selectedColumns[0])
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text:
								'test2'
								// $selectedColumns.length > 1
								// 	? 'Group: (' + $selectedColumns.join(', ') + ')'
								// 	: $selectedColumns[0]
						}
					},
					y: {
						title: {
							display: true,
							text: data.aggregateColumn ? data.aggregateColumn.name : "undefined"
							//text: $selectedValues[0]
						}
					}
				}
			},

			plugins: [plugin]
		};

		if(chart) {
			chart.data = datasets;
		}
		else chart = new Chart(canvas, cfg);
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});

</script>

<div class="flex flex-col">
	{#each possibleFunctions as func}
		<label>
			{func}
			<input type="radio" bind:group={selectedAggregationFunction} value={func} />
		</label>
	{/each}
</div>
<div class="flex flex-col items-center">
	<canvas data-testid="canvas-element" bind:this={canvas} class = "w-full" />
</div>
