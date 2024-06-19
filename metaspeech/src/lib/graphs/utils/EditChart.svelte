<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	import { Chart } from 'chart.js/auto';
	import { onMount } from 'svelte';

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
	let fontColor: string = '#000000';

	let titlePlaceholder: string = chart?.options?.plugins?.title?.text?.toString() ?? 'Enter title'
	// @ts-expect-error type error
	let xAxisPlaceholder: string = chart?.options?.scales?.x?.title?.text?.toString() ?? 'Enter x axis label'
	// @ts-expect-error type error
	let yAxisPlaceholder: string = chart?.options?.scales?.y?.title?.text?.toString() ?? 'Enter y axis label'
	

	/**
	 * Checks to remove values from chart
	 */

	let hasTitle: boolean = true;
	let hasXLabel: boolean = ['histogram', 'scatter', 'boxplot'].includes(chartType) ? true : false;
	let hasYLabel: boolean = ['histogram', 'scatter', 'boxplot'].includes(chartType) ? true : false;

	/**
	 * Updates new values for all graphs
	 * Has checks for some graphs as not all have same edit options
	 */
	function updateChart() {
		if (title) updateTitle(title);
		if (xAxis || yAxis) updateAxis(xAxis, yAxis);
		if (chartType === 'scatter') updatePointRadius();
		updateColor();
		updateFontSize();

		chart.update();
	}

	/**
	 * Updates background color of graphs and font color
	 * If the graphs is a histogram it also updates bar and border color
	 */
	function updateColor() {
		Chart.defaults.color = fontColor;
		if (!chart.options.plugins) return;
		// @ts-expect-error the customBackground is assumed
		chart.options.plugins.customCanvasBackgroundColor.color = backgroundColor;
		if (!(chartType === 'histogram')) return;
		chart.data.datasets.forEach((d) => {
			d.backgroundColor = barColor;
			d.borderColor = borderColor;
		});
	}

	/**
	 * Updates the title for all graphs
	 * @param title the string which contains the user input
	 */
	function updateTitle(title: string) {
		if (!chart.options.plugins?.title) return;
		chart.options.plugins.title.display = hasTitle;
		chart.options.plugins.title.text = title;
	}

	/**
	 * Updates both axis for graphs that support them
	 * @param xLabel user input for x axis
	 * @param yLabel user input for y axis
	 */
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
	

	/**
	 * If the graph is a scatter plot the point radius is updated
	 */
	function updatePointRadius() {
		pointRadius < 1 ? (pointRadius = 1) : pointRadius;
		chart.data.datasets.forEach((d) => {
			// @ts-expect-error we assume there is a radius since scatter
			d.radius = pointRadius;
		});
	}

	/**
	 * The font size is updated for all graphs
	 */
	function updateFontSize() {
		fontSize < 1 ? (fontSize = 1) : fontSize;
		Chart.defaults.font.size = fontSize;
	}

	onMount(() => {
		title = chart?.options?.plugins?.title?.text?.toString() ?? '';
		// @ts-expect-error type error
		xAxis = chart?.options?.scales?.x?.title?.text?.toString() ?? '';
		// @ts-expect-error type error
		yAxis = chart?.options?.scales?.y?.title?.text?.toString() ?? '';		
	});
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
				<p class="w-[25%] text-gray-800">Title:</p>
				<input
					type="text"
					placeholder={titlePlaceholder}
					bind:value={title}
					data-testid="title-input"
					class="w-[50%] rounded-md border-darkblue"
				/>
				<div class="flex w-[25%] justify-end">
					<input
						type="checkbox"
						bind:checked={hasTitle}
						class="mr-2 h-5 rounded-sm border-2 transition-all duration-200 ease-in-out"
					/>
				</div>
			</div>
			{#if ['histogram', 'scatter', 'boxplot'].includes(chartType)}
				<div class="flex items-center justify-between">
					<p class="w-[25%] text-gray-800">X Axis:</p>
					<input
						type="text"
						placeholder={xAxisPlaceholder}
						bind:value={xAxis}
						data-testid="xaxis-input"
						class="w-[50%] rounded-md border-darkblue"
					/>
					<div class="flex w-[25%] justify-end">
						<input
							type="checkbox"
							bind:checked={hasXLabel}
							class="mr-2 h-5 rounded-sm border-2 transition-all duration-200 ease-in-out"
						/>
					</div>
				</div>
				<div class="flex items-center justify-between">
					<p class="w-[25%] text-gray-800">Y Axis:</p>
					<input
						type="text"
						placeholder={yAxisPlaceholder}
						bind:value={yAxis}
						data-testid="yaxis-input"
						class="w-[50%] rounded-md border-darkblue"
					/>
					<div class="flex w-[25%] justify-end">
						<input
							type="checkbox"
							bind:checked={hasYLabel}
							class="mr-2 h-5 rounded-sm border-2 transition-all duration-200 ease-in-out"
						/>
					</div>
				</div>
			{/if}
			<div class="justify-left flex items-center">
				<p class="w-[25%] text-gray-800">Text size:</p>
				<input
					type="number"
					placeholder={'Enter text size'}
					bind:value={fontSize}
					data-testid="font-size-input"
					class="w-[20%] rounded-md border-darkblue"
				/>
				<div class="w-[25%]" />
			</div>
			{#if chartType === 'scatter'}
				<div class="flex items-center justify-between">
					<p class="w-[25%] text-gray-800">Point radius:</p>
					<input
						type="number"
						placeholder={'Enter point radius'}
						bind:value={pointRadius}
						data-testid="point-radius-input"
						class="w-[50%] rounded-md border-darkblue"
					/>
					<div class="w-[25%]" />
				</div>
			{/if}
			<div class="flex items-center justify-between">
				<p class="w-[25%] text-gray-800">Text color:</p>
				<input type="color" bind:value={fontColor} class="h-10 w-10 rounded-md" />
			</div>
			<div class="flex items-center justify-between">
				<p class="w-[25%] text-gray-800">Background color:</p>
				<input type="color" bind:value={backgroundColor} class="h-10 w-10 rounded-md" />
			</div>
			{#if chartType === 'histogram'}
				<div class="flex items-center justify-between">
					<p class="w-[25%] text-gray-800">Bar color:</p>
					<input type="color" bind:value={barColor} class="h-10 w-10 rounded-md" />
				</div>
				<div class="flex items-center justify-between">
					<p class="w-[25%] text-gray-800">Border color:</p>
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
