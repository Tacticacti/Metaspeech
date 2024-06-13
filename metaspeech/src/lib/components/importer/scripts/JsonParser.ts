import { fromObjects } from '$lib/dataframe/DataFrame';
import type { DataFrameLike } from '$lib/Types';

/**
 * Parses a JSON file into a DataFrame. It accepts both arrays and objects.
 * If the JSON is an object, it will be converted to an array of objects with an 'id' field.
 * @param file The file to parse.
 * @returns A Promise that resolves to a DataFrame.
 */
export function ParseJson(file: File): Promise<DataFrameLike> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e: ProgressEvent<FileReader>) => {
			try {
				const data = e.target?.result;
				if (!data) {
					throw new Error('Failed to load file');
				}

				let json = JSON.parse(data as string);

				if (!Array.isArray(json) && typeof json === 'object') {
					json = Object.keys(json).map((key) => {
						const obj = json[key];
						return { id: key, ...obj };
					});
				}

				if (!Array.isArray(json)) {
					throw new SyntaxError('JSON data is unrecognized format. Expected array or object.');
				}

				resolve(fromObjects(json));
			} catch (error) {
				reject(error);
			}
		};

		reader.onerror = () => {
			reject(new Error('Error reading file'));
		};

		reader.readAsText(file);
	});
}
