import { DataFrame } from 'dataframe-js';

/**
 * A bundle is a DataFrame with a filename.
 */
export type Bundle = {
	input: DataFrame;
	filename: string;
};
