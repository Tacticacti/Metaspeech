import Histogram from '$lib/graphs/histogram/Histogram.svelte';

export type GraphMeta = {
	title: string;
	description: string;
	component: ConstructorOfATypedSvelteComponent;
};

export const GraphMetas: GraphMeta[] = [
	{
		title: 'Histogram',
		description:
			'A histogram is an approximate representation of the distribution of numerical data.',
		component: Histogram
	}
];
