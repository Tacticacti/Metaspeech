<script lang="ts">
	import type { GroupedDataFrame } from '$lib/Types';
	import { afterUpdate } from 'svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { sortGroups } from '$lib/dataframe/DataFrame';
	import { onDestroy } from 'svelte';
	import { getScaleYAxisText } from '$lib/graphs/sharedFunctions';
	import { createConfig, createDatasets, handleData } from './helper';

	export let data: GroupedDataFrame;
	$: sortGroups(data.groups);
	let aggregationHappens: boolean = data.aggregateColumn !== undefined;

	let selectedFunction: string = aggregationHappens ? 'Mean' : 'Count';
	let possibleFunctionsForAggregation: string[] = ['Mean', 'Sum'];
	let possibleFunctionsForNonAggregation: string[] = ['Count', 'Percentage'];

	let chart: Chart;
	let canvas: HTMLCanvasElement;

	afterUpdate(() => {
		const [labels, values] = handleData(selectedFunction, data);

		let datasets = createDatasets(data, values, selectedFunction);

		const cfg: ChartConfiguration = createConfig(labels, datasets, data, selectedFunction);

		chart ??= new Chart(canvas, cfg);
		chart.data.labels = labels;
		chart.data.datasets = datasets;
		chart.options.scales = {
			y: {
				title: {
					display: true,
					text: getScaleYAxisText(data, selectedFunction)
				}
			}
		};

		chart.update();
	});

	onDestroy(() => {
		chart?.destroy();
	});
</script>

<div class="flex flex-col">
	{#if aggregationHappens}
		{#each possibleFunctionsForAggregation as func}
			<label>
				{func}
				<input
					data-testid="aggregation-{func}"
					type="radio"
					bind:group={selectedFunction}
					value={func}
				/>
			</label>
		{/each}
	{:else}
		{#each possibleFunctionsForNonAggregation as func}
			<label>
				{func}
				<input
					data-testid="nonaggregation-{func}"
					type="radio"
					bind:group={selectedFunction}
					value={func}
				/>
			</label>
		{/each}
	{/if}
</div>
<div class="flex w-[60%] flex-col items-center">
	<canvas data-testid="canvas-element" bind:this={canvas} />
</div>
