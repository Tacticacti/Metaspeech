<script lang="ts">
	import { data } from '$lib/Store';
    import { Chart, type ChartConfiguration, LinearScale, CategoryScale } from 'chart.js';
    import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';

    Chart.register(BoxPlotController, BoxAndWiskers, LinearScale, CategoryScale);
	import { onMount, onDestroy } from 'svelte';
	import { setColor } from '$lib/utils/CanvasUtils';
	import PngButton from '$lib/shared-components/PNGButton.svelte';
	import JpgButton from '$lib/shared-components/JPGButton.svelte';
	import { isNumber } from 'chart.js/helpers';

	let canvas: HTMLCanvasElement;
	let chart: Chart;

	const column_names = $data.listColumns();

    let warnings: string[] = [];

	// setup chart after canvas is mounted
	onMount(() => {
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
						color: 'lightgreen'
					}
				}
			},

			// @ts-expect-error plugin needs a type same as above
			plugins: [plugin]
		};

		chart = new Chart(canvas, cfg);
	});

	onDestroy(() => {
		if (chart) chart.destroy();
	});
    export function getColumnNames(column_names: string[]){
        let ret: string[] = [];
        warnings = [];
        for(let i = 0; i < column_names.length; i++){
            if(isNumber($data.toArray(column_names[i])[0])){
                ret.push(column_names[i]);
            }
            else{
                warnings.push("Warning: Column "+ column_names[i] + " doesn't contain numbers!");
            }
        }
        return ret;
    }
    export function getColumnData(column_names: string[]){
        let ret: any[][] = [];
        for(let i = 0; i < column_names.length; i++){
            if(isNumber($data.toArray(column_names[i])[0])){
                ret.push($data.toArray(column_names[i]));
            }
        }
        return ret;
    }
</script>

<div>
    {#each warnings as warning}
        <div>{warning}</div>
    {/each}
</div>
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








