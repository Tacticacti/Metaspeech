import type { DataFrameLike } from '$lib/dataframe/DataFrame';
import type { ComponentType, SvelteComponent } from 'svelte';

/**
 * A bundle is a DataFrame with a filename.
 */
export type Bundle = {
	data: DataFrameLike;
	filename: string;
};

/**
 * Error class for when a file is not supported by the application.
 */
export class UnsupportedFileError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UnsupportedFileError';
	}
}

export type Graph = ComponentType<SvelteComponent<{
	title: string;
	description: string;
	img_src: string;
}>>