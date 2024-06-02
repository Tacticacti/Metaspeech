<script lang="ts">
	import { data } from '$lib/Store';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { setColor } from '$lib/utils/CanvasUtils';
	import { onMount } from 'svelte';
	import { calculateAxis } from '$lib/subgroup-controller/SubgroupController';
	import {
		selectedColumns,
		checkedMean,
		selectedValues,
		binSizes,
		ABSOLUTE_FREQUENCY
	} from '$lib/Store';
	import WarningGenerator from '$lib/warning-generator/WarningGenerator.svelte';
	import Export from '$lib/graphs/GraphImageExport.svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	onMount(() => {
		if ($selectedValues.length === 0) {
			$selectedValues = [ABSOLUTE_FREQUENCY];
		}

		let labels, values;
		[labels, values] = calculateAxis(
			$data.toCollection(true),
			$selectedColumns,
			$checkedMean,
			$selectedValues[0],
			$binSizes
		);
		let datasets = [
			{
				label: $selectedValues[0],
				data: values as number[],
				backgroundColor: 'rgba(51, 50, 200, 1)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}
		];
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		const cfg: ChartConfiguration = {
			type: 'bar',
			data: {
				labels: labels,
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
						text:
							$selectedValues[0] +
							' x ' +
							($selectedColumns.length > 1
								? '(' + $selectedColumns.join(', ') + ')'
								: $selectedColumns[0])
					}
				},
				scales: {
					x: {
						title: {
							display: true,
							text:
								$selectedColumns.length > 1
									? 'Group: (' + $selectedColumns.join(', ') + ')'
									: $selectedColumns[0]
						}
					},
					y: {
						title: {
							display: true,
							text: $selectedValues[0]
						}
					}
				}
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});
</script>

<!-- <ParameterSelector
	{numericColumns}
	bind:checkedMean
	bind:parameterType
	bind:binSizes
/> -->
<WarningGenerator
	needNumbers={false}
	columnsAreLimited={false}
	maxColumns={100}
	valuesAreLimited={true}
	maxValues={1}
></WarningGenerator>

<div class="flex flex-col items-center">
	<canvas data-testid="canvas-element" bind:this={canvas} class="mb-4" />
	<Export {chart} />
</div>

<style>
	div > canvas {
		width: 800px;
	}
</style>
