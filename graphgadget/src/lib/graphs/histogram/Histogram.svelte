<script lang="ts">
	import { data } from '$lib/Store';
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import JpgButton from '$lib/shared-components/JPGButton.svelte';
	import { Chart, type ChartConfiguration } from 'chart.js/auto';
	import { setColor } from '$lib/utils/CanvasUtils';
	import { afterUpdate, onMount } from 'svelte';
	import ParameterSelector from '$lib/shared-components/ParameterSelector.svelte';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const columnNames = $data.listColumns() as string[];

	const columnTypes = columnNames.map(name => {name: typeof($data.toArray(name)[0])});

	$: xAxisData = combinationOfParams(selectedParams);

	let selectedParams: string[] = [];
	let checkedMean: boolean;
	let parameterType: string;

	export function crossJoin(array1: any[], array2: any[]): string[] {
		//The cartesian product of two arrays
		let result: any[] = [];

		for (const e1 of array1) {
			for (const e2 of array2) {
				result.push(`${e1}, ${e2}`);
			}
		}

		return result;
	}

	export function combinationOfParams(params: string[]): string[] {
		// Get an array of columns, where each column has the possible values for that parameter
		// Set is used to eliminate duplicates
		const arrayOfColumns: any[][] = selectedParams.map((columnName) => [...new Set($data.toArray(columnName))].sort());

		if (arrayOfColumns.length == 0) {
			return [];
		}

		// Calculate the cross join of each column with all others
		const initialValue = arrayOfColumns[0];

		return arrayOfColumns.slice(1)
			.reduce((column1, column2) => crossJoin(column1, column2), initialValue);
	}

	export function calculateAxis(xAxis: string[], checkedMean: boolean, yAxisParam: string): [string[], number[]] {
		// calculate the y-axis parameter of each unique x-axis value
		let mapFrequencies = new Map<string, number>();
		let mapValues = new Map<string, number>();
		const arr: string[] = xAxis as string[];
		const dataRows = $data.toCollection();

		// Iterate all rows
		for (const row of dataRows) {
			// Aggregate all selected columns of that row in a comma-separated string
			// Used as key for the maps, basically represents a bar in the chart
			const xValues: string = selectedParams.map(paramName => row[paramName]).join(", ");
			
			// Get the current frequency in the map with that string as key
			const currentFrequency: number | undefined = mapFrequencies.get(xValues);
			// Increment the frequency of that key
			mapFrequencies.set(xValues, currentFrequency === undefined ? 1 : currentFrequency + 1);

			if (yAxisParam != "Absolute Frequency" && yAxisParam != "Relative Frequency") {
				// Need to increment value of the selected y-axis parameter
				const valueIncrement = row[yAxisParam];
				const currentValue = mapValues.get(xValues);
				mapValues.set(xValues, currentValue === undefined ? valueIncrement : currentValue + valueIncrement);
			}
		}

		// convert map to arrays
		const labels: string[] = [...mapFrequencies.keys()];
		let frequencies: number[] = [...mapFrequencies.values()];

		if (yAxisParam == "Absolute Frequency") {
			return [labels, frequencies];
		}
		if (yAxisParam == "Relative Frequency") {
			const totalFrequency = dataRows.length;
			return [labels, frequencies.map(f => f / totalFrequency)];
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


	export function calculateNumberAxis(x_axis_data: string[]) {
		// calculate the frequency of each unique value
		let map = new Map<number, number>();
		const arr: number[] = x_axis_data.map(Number) as number[];

		for (let i = 0; i < arr.length; i++) {
			let val = map.get(arr[i]);

			map.set(arr[i], val === undefined ? 1 : val + 1);
		}

		const labels: number[] = [...map.keys()];
		const min_val = Math.min(...labels);
		const max_val = Math.max(...labels);

		let sorted_labels: number[] = [];
		let sorted_counts: number[] = [];
		// fills the gaps with 0 and makes sure it is sorted
		for (let i = min_val; i <= max_val; i++) {
			let val = map.get(i);

			sorted_counts.push(val === undefined ? 0 : val);
			sorted_labels.push(i);
		}

		return [sorted_labels, sorted_counts];
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
		//checks if the first entry is a number

		if (xAxisData == undefined) {
			// chart.clear(); 
			return;
		}

		[labels, values] = calculateAxis(xAxisData, checkedMean, parameterType);
		// if (!isNaN(+xAxisData[0]) && typeof +xAxisData[0] == 'number') {
		// 	[labels, counts] = calculateNumberAxis(xAxisData);
		// } else {
		// 	[labels, counts] = calculateAxis(xAxisData);
		// }
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

<ParameterSelector bind:selectedParams bind:checkedMean bind:parameterType/>

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
