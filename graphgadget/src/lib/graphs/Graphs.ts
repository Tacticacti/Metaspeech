import Histogram from './histogram/Histogram.svelte';
import Histogram2 from './histogram2/Histogram2.svelte';

export type GraphMeta = {
	title: string;
	description: string;
	img_src: string;
	component: ConstructorOfATypedSvelteComponent;
};

export const GraphMetas: GraphMeta[] = [
	{
		title: 'Histogram',
		description:
			'A histogram is an approximate representation of the distribution of numerical data.',
		img_src: 'histogram-img.png',
		component: Histogram
	},
	{
		title: 'Histogram2',
		description:
			'A histogram is an approximate representation of the distribution of numerical data.',
		img_src: 'histogram-img.png',
		component: Histogram2
	}
];
