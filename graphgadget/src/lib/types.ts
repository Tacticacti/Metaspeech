import type { DataFrameLike } from '$lib/dataframe/DataFrame';

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
