<script lang="ts">
	import { data } from '$lib/Store';
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import JpgButton from '$lib/shared-components/JPGButton.svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { setColor } from '$lib/utils/CanvasUtils';
	import { afterUpdate, onMount } from 'svelte';
	import ParameterSelector from '$lib/graphs/histogram/ParameterSelector.svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const columnNames = $data.listColumns() as string[];
	const numericColumnNames = getNumericalColumns(columnNames);

	let selectedParams: string[] = [];
	let checkedMean = false;
	let parameterType = 'Absolute Frequency';

	export function getNumericalColumns(columnNames: string[]): string[] {
		// TODO: find a better way to get the type,
		// currently only looks at first element.
		// Remember there can be undefined elements if not cleared
		const columnTypes = new Map<string, string>(
			columnNames.map((name) => [name, typeof $data.toArray(name)[0]])
		);
		const numericColumnNames = columnNames.filter((name) => columnTypes.get(name) === 'number');

		return numericColumnNames;
	}

	export function calculateAxis(
		/* eslint-disable @typescript-eslint/no-explicit-any */
		dataRows: any[],
		selectedParams: string[],
		checkedMean: boolean,
		yAxisParam: string
	): [string[], number[]] {
		let mapFrequencies = new Map<string, number>();
		let mapValues = new Map<string, number>();

		// Iterate all rows
		for (const row of dataRows) {
			// Aggregate all selected columns of that row in a comma-separated string
			// Used as key for the maps, basically represents a bar in the chart
			const xValues: string = selectedParams
				.map((paramName) => (row[paramName] === undefined ? '<empty>' : row[paramName]))
				.join(', ');

			// Get the current frequency in the map with that string as key
			const currentFrequency: number | undefined = mapFrequencies.get(xValues);
			// Increment the frequency of that key
			mapFrequencies.set(xValues, currentFrequency === undefined ? 1 : currentFrequency + 1);

			if (yAxisParam != 'Absolute Frequency' && yAxisParam != 'Relative Frequency') {
				// Need to increment value of the selected y-axis parameter
				const valueIncrement = row[yAxisParam];

				if (valueIncrement === undefined) {
					// Skip this value entirely from the calculation
					// So decrement its frequency (which cannot be null, or undefined)
					mapFrequencies.set(xValues, mapFrequencies.get(xValues)! - 1);
				} else {
					const currentValue = mapValues.get(xValues);
					mapValues.set(
						xValues,
						currentValue === undefined ? valueIncrement : currentValue + valueIncrement
					);
				}
			}
		}

		// convert map to arrays
		const labels: string[] = [...mapFrequencies.keys()];
		let frequencies: number[] = [...mapFrequencies.values()];

		if (yAxisParam == 'Absolute Frequency') {
			return [labels, frequencies];
		}
		if (yAxisParam == 'Relative Frequency') {
			const totalFrequency = dataRows.length;
			return [labels, frequencies.map((f) => f / totalFrequency)];
		}

		const values: number[] = [...mapValues.values()];

		if (checkedMean) {
			// Calculate means of values
			for (let idx = 0; idx < values.length; ++idx) {
				values[idx] /= frequencies[idx];
			}
		}

		return [labels, values];
	}

	// Sorts two arrays based on the labels
	export function sortParallelArrays(labels: string[], values: number[]): [string[], number[]] {
		let combinedArray: [string, number][] = [];
		for (let idx = 0; idx < labels.length; ++idx) {
			combinedArray.push([labels[idx], values[idx]]);
		}

		combinedArray.sort((a, b) => {
			const paramsA = a[0].split(', ');
			const paramsB = b[0].split(', ');

			for (let idx = 0; idx < paramsA.length; ++idx) {
				let comparison = 0;

				const [la, lb] = [paramsA[idx], paramsB[idx]];

				if (!isNaN(+la) && !isNaN(+lb)) {
					// Numeric field
					comparison = +la - +lb;
				} else {
					// String field
					comparison = la.localeCompare(lb);
				}

				if (comparison != 0) {
					// If not equal, return number
					return comparison;
				}
			}

			// If all equal, they are equal
			return 0;
		});

		let newLabels: string[] = [];
		let newValues: number[] = [];

		for (const [lbl, val] of combinedArray) {
			newLabels.push(lbl);
			newValues.push(val);
		}

		return [newLabels, newValues];
	}

	// setup chart with empty config after canvas is mounted
	onMount(() => {
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		const cfg: ChartConfiguration = {
			type: 'bar',
			data: {
				labels: [],
				datasets: []
			},

			options: {
				plugins: {
					// @ts-expect-error Needs a specific type for plugin
					customCanvasBackgroundColor: {
						color: 'pink'
					}
				}
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});

	// update chart data
	afterUpdate(() => {
		let labels, values;

		[labels, values] = calculateAxis(
			$data.toCollection(),
			selectedParams,
			checkedMean,
			parameterType
		);
		[labels, values] = sortParallelArrays(labels, values);

		chart.data.labels = labels;
		chart.data.datasets = [
			{
				label: parameterType,
				data: values as number[],
				backgroundColor: 'rgba(51, 50, 200, 1)',
				borderColor: 'rgba(255, 99, 132, 1)',
				borderWidth: 1
			}
		];

		chart.update();
	});
</script>

<ParameterSelector
	{columnNames}
	{numericColumnNames}
	bind:selectedParams
	bind:checkedMean
	bind:parameterType
/>

<div>
	<canvas data-testid="canvas-element" bind:this={canvas} />
</div>

<PngButton {chart} />
<JpgButton {chart} />

<style>
	div > canvas {
		width: 800px;
	}
</style>
