<script lang="ts">
	import type { GroupedDataFrame } from '$lib/Types';
	import { afterUpdate } from 'svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { sortGroups } from '$lib/dataframe/DataFrame';
	import { onDestroy } from 'svelte';
	import { scaleYAxisText } from '$lib/graphs/sharedFunctions';
	import { createConfig, createDatasets, handleData } from './helper';

	export let data: GroupedDataFrame;
	data.groups = sortGroups(data.groups);
	let aggregationHappens: boolean = data.aggregateColumn !== undefined;

	let selectedFunction: string = 'sum';
	let possibleFunctionsForAggregation: string[] = ['sum', 'mean'];
	let possibleFunctionsForNonAggregation: string[] = ['Absolute Frequency', 'Relative Frequency'];

	let chart: Chart;
	let canvas: HTMLCanvasElement;

	afterUpdate(() => {
		let labels: string[] = [];
		let values: number[] = [];
		[labels, values] = handleData(selectedFunction, data);

		let datasets = createDatasets(data, values, selectedFunction);

		const cfg: ChartConfiguration = createConfig(labels, datasets, data, selectedFunction);

		if (chart) {
			chart.data.labels = labels;
			chart.data.datasets = datasets;
			chart.options.scales = {
				y: {
					title: {
						display: true,
						text: scaleYAxisText(data, selectedFunction)
					}
				}
			};
			chart.update();
		} else {
			chart = new Chart(canvas, cfg);
		}
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});
</script>

<div class="flex flex-col">
	{#if aggregationHappens}
		{#each possibleFunctionsForAggregation as func}
			<label>
				{func}
				<input type="radio" bind:group={selectedFunction} value={func} />
			</label>
		{/each}
	{:else}
		{#each possibleFunctionsForNonAggregation as func}
			<label>
				{func}
				<input type="radio" bind:group={selectedFunction} value={func} />
			</label>
		{/each}
	{/if}
</div>
<div class="flex w-[60%] flex-col items-center">
	<canvas data-testid="canvas-element" bind:this={canvas} />
</div>
