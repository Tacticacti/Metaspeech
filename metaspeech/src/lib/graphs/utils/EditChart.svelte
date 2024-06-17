<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	import { Chart } from 'chart.js/auto';

	export let chart: Chart;
	export let chartType: string;
	let clickOutsideModal = false;

	/**
	 * Values to bind to the new chart
	 */
	let title: string | undefined = undefined;
	let xAxis: string | undefined = undefined;
	let yAxis: string | undefined = undefined;
	let pointRadius: number = 7;
	let fontSize: number = Chart.defaults.font.size || 12;
	let backgroundColor: string = '#ffffff';
	let barColor: string = '#3232c8';
	let borderColor: string = '#000000';

	/**
	 * Checks to remove values from chart
	 */

	let hasTitle: boolean = true;
	let hasXLabel: boolean = ['histogram', 'scatter', 'boxplot'].includes(chartType) ? true : false;
	let hasYLabel: boolean = ['histogram', 'scatter', 'boxplot'].includes(chartType) ? true : false;

	function updateChart() {
		if (title) updateTitle(title);
		if (xAxis || yAxis) updateAxis(xAxis, yAxis);
		if (chartType === 'scatter') updatePointRadius();
		updateColor();
		updateFontSize();

		chart.update();
	}

	function updateColor() {
		if (!chart.options.plugins) return;
		// @ts-expect-error the customBackground is assumed
		chart.options.plugins.customCanvasBackgroundColor.color = backgroundColor;
		if (!(chartType === 'histogram')) return;
		chart.data.datasets.forEach((d) => {
			d.backgroundColor = barColor;
			d.borderColor = borderColor;
		});
	}

	function updateTitle(title: string) {
		if (!chart.options.plugins || !chart.options.plugins.title) return;
		chart.options.plugins.title.display = hasTitle;
		chart.options.plugins.title.text = title;
	}

	function updateAxis(xLabel: string | undefined, yLabel: string | undefined) {
		if (!chart.options.scales) return;
		chart.options.scales = {
			x: {
				title: {
					display: hasXLabel,
					text: xLabel ? xLabel : ''
				}
			},
			y: {
				title: {
					display: hasYLabel,
					text: yLabel ? yLabel : ''
				}
			}
		};
	}

	function updatePointRadius() {
		pointRadius < 1 ? (pointRadius = 1) : pointRadius;
		chart.data.datasets.forEach((d) => {
			// @ts-expect-error we assume there is a radius since scatter
			d.radius = pointRadius;
		});
	}

	function updateFontSize() {
		fontSize < 1 ? (fontSize = 1) : fontSize;
		Chart.defaults.font.size = fontSize;
	}
</script>

<div class="flex items-center">
	<button
		class="inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
		on:click={() => {
			clickOutsideModal = true;
		}}
	>
		Edit
	</button>
	<Modal title="Edit Chart" bind:open={clickOutsideModal} autoclose outsideclose>
		{#if ['histogram', 'scatter', 'pie', 'boxplot'].includes(chartType)}
			<div class="flex items-center justify-between">
				<p>Title:</p>
				<input
					type="text"
					placeholder={'Enter title'}
					bind:value={title}
					data-testid="title-input"
				/>
				<input type="checkbox" bind:checked={hasTitle} />
			</div>
			{#if chartType === 'histogram' || chartType === 'scatter'}
				<div class="flex items-center justify-between">
					<p>X Axis:</p>
					<input
						type="text"
						placeholder={'Enter x axis label'}
						bind:value={xAxis}
						data-testid="xaxis-input"
					/>
					<input type="checkbox" bind:checked={hasXLabel} />
				</div>
				<div class="flex items-center justify-between">
					<p>Y Axis:</p>
					<input
						type="text"
						placeholder={'Enter y axis label'}
						bind:value={yAxis}
						data-testid="yaxis-input"
					/>
					<input type="checkbox" bind:checked={hasYLabel} />
				</div>
			{/if}
			<div class="flex items-center justify-between">
				<p>Text size:</p>
				<input
					type="number"
					placeholder={'Enter text size'}
					bind:value={fontSize}
					data-testid="font-size-input"
				/>
				<div></div>
			</div>
			{#if chartType === 'scatter'}
				<div class="flex items-center justify-between">
					<p>Point radius:</p>
					<input
						type="number"
						placeholder={'Enter point radius'}
						bind:value={pointRadius}
						data-testid="point-radius-input"
					/>
					<div></div>
				</div>
			{/if}
			<div class="flex items-center justify-between">
				<p>Background color:</p>
				<input type="color" bind:value={backgroundColor} class="h-10 w-10 rounded-md" />
			</div>
			{#if chartType === 'histogram'}
				<div class="flex items-center justify-between">
					<p>Bar color:</p>
					<input type="color" bind:value={barColor} class="h-10 w-10 rounded-md" />
				</div>
				<div class="flex items-center justify-between">
					<p>Border color:</p>
					<input type="color" bind:value={borderColor} class="h-10 w-10 rounded-md" />
				</div>
			{/if}
		{/if}
		<svelte:fragment slot="footer">
			{#if ['histogram', 'scatter', 'pie', 'boxplot'].includes(chartType)}
				<button
					class="cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
					on:click={updateChart}
				>
					Save
				</button>
			{/if}
		</svelte:fragment>
	</Modal>
</div>
