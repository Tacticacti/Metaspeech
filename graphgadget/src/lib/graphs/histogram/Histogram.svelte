<script lang="ts">
	import type { GroupedDataFrame, Group } from '$lib/Types';
	import { afterUpdate, onMount } from 'svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { sortGroups } from '$lib/dataframe/DataFrame';
	import { onDestroy } from 'svelte';
	import { titleText, scaleText } from '$lib/graphs/sharedFunctions';
	import { handleMean, handleSum } from '$lib/graphs/sharedFunctions';

	export let data: GroupedDataFrame;
	data.groups = sortGroups(data.groups);
	let aggregationHappens: boolean = data.aggregateColumn !== undefined;
	
	let selectedAggregationFunction:string = 'sum';
	let possibleFunctionsForAggregation: string[] = ['sum', 'mean'];


	let selectedNonAggregationFunction:string = 'Absolute Frequency';
	let possibleFunctionsForNonAggregation: string[] = ['Absolute Frequency', 'Relative Frequency'];
	

	let chart: Chart;
	let canvas: HTMLCanvasElement;

	function handleAggregation(): [string[], number[]]{
		console.log(selectedAggregationFunction);
		
		switch(selectedAggregationFunction){
			case 'sum': return handleSum(data);
			case 'mean': return handleMean(data);
		}
		return [[], []];
	}
	afterUpdate(() => {
		let labels: string[] = [];
		let values: number[] = [];
		if(aggregationHappens){
			[labels, values] = handleAggregation();
		}
		console.log(labels);
		console.log(values);
		
		let datasets = [
			{
				label: data.aggregateColumn ? data.aggregateColumn.name : "undefined",
				data: values,
				backgroundColor: 'rgba(51, 50, 200, 1)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}
		];
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: 'rgba(0, 0, 0, 1)'
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
						color: 'rgba(0, 0, 0, 1)'
					},
					title: {
						display: true,
						// Checks if there are colums selected, if not then this is just Absolute Frequency
						// Else the title is the values x group of columns
						text:
							titleText(data)
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text:
								scaleText(data)
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
			chart.data.labels = labels;
			chart.data.datasets = datasets;
			chart.update();
		}
		
		else {
			chart = new Chart(canvas, cfg);
		}
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});

</script>

<div class="flex flex-col">
	{#each possibleFunctionsForAggregation as func}
		<label>
			{func}
			<input type="radio" bind:group={selectedAggregationFunction} value={func} />
		</label>
	{/each}
</div>
<div class="flex flex-col items-center w-[60%]">
	<canvas data-testid="canvas-element" bind:this={canvas} />
</div>
