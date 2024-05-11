// @ts-expect-error Not sure the type of chart (not Chart), ignored can be any type
export function setColor(chart, ignored: string, options: ChartOptions) {
	const { ctx } = chart;
	ctx.save();
	ctx.globalCompositeOperation = 'destination-over';
	ctx.fillStyle = options.color || '#99ffff';
	ctx.fillRect(0, 0, chart.width, chart.height);
	ctx.restore();
}
