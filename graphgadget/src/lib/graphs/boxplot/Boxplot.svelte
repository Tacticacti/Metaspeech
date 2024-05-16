<script lang="ts">
	import { data } from '$lib/Store';
    import { Chart, type ChartConfiguration, LinearScale, CategoryScale } from 'chart.js';
    import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';

    Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);
	import { afterUpdate, onMount, onDestroy } from 'svelte';
	import { setColor } from '$lib/utils/CanvasUtils';
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import JpgButton from '$lib/shared-components/JPGButton.svelte';
	import { isNumber } from 'dataframe-js/reusables';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const column_names = $data.listColumns();

    let warnings = [];

	// setup chart after canvas is mounted
	onMount(() => {
		const plugin = {
			id: 'customCanvasBackgroundColor',
			beforeDraw: setColor
		};

		const cfg: ChartConfiguration = {
			type: 'boxplot',
			data: {
				labels: [],
				datasets: []
			},

			options: {
				plugins: {
					// @ts-expect-error Needs a specific type for plugin
					customCanvasBackgroundColor: {
						color: 'lightgreen'
					}
				}
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});

	// called when x_axis or y_axis changes
	afterUpdate(() => {
        const boxplotData = {
        // define label tree
        labels: getColumnNames(column_names),
        datasets: [{
            label: 'Dataset 1',
            backgroundColor: 'rgba(255,0,0,0.5)',
            borderColor: 'red',
            borderWidth: 1,
            outlierColor: '#999999',
            padding: 0,
            itemRadius: 5,
            data: getColumnData(column_names)
        }]};
		chart.data = boxplotData;

		chart.update();
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});
    function getColumnNames(column_names: string[]){
        let ret: string[] = [];
        for(let i = 0; i < column_names.length; i++){
            if(isNumber($data.toArray(column_names[i])[0])){
                ret.push(column_names[i]);
            }
        }
        return ret;
    }
    function getColumnData(column_names: string[]){
        let ret: any[][] = [];
        for(let i = 0; i < column_names.length; i++){
            if(isNumber($data.toArray(column_names[i])[0])){
                ret.push($data.toArray(column_names[i]));
            }
        }
        return ret;
    }
</script>

<!-- <select data-testid="first-select" bind:value={x_axis}>
	{#each column_names as column}
		<option value={column}>{column}</option>
	{/each}
</select> -->

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








