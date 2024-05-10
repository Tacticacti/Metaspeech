import Histogram from './histogram/Histogram.svelte';
import Stem from './Stem/Stem.svelte';

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
		title: 'Stem',
		description: 'A stem description.',
		img_src: 'histogram-img.png',
		component: Stem
	}
];
