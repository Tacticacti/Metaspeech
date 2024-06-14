/**
 * Sets the background color of the chart
 * @param chart the chart to set the color to
 * @param ignored not used, but required for the function signature
 * @param options the options to set the color to
 */
// @ts-expect-error Not sure the type of chart (not Chart), ignored can be any type
export function setColor(chart, ignored: string, options: ChartOptions) {
	const { ctx } = chart;
	ctx.save();
	ctx.globalCompositeOperation = 'destination-over';
	ctx.fillStyle = options.color || '#99ffff';
	ctx.fillRect(0, 0, chart.width, chart.height);
	ctx.restore();
}
