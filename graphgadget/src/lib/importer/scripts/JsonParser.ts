import { DataFrame } from 'dataframe-js';

/**
 * Parses a JSON file into a DataFrame. It accepts both arrays and objects.
 * If the JSON is an object, it will be converted to an array of objects with an 'id' field.
 * @param file The file to parse.
 * @returns A Promise that resolves to a DataFrame.
 */
export function ParseJson(file: File): Promise<DataFrame> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e: ProgressEvent<FileReader>) => {
			try {
				const data = e.target?.result;
				if (!data) {
					throw new Error('Failed to load file');
				}

				const json = JSON.parse(data as string);

				if (Array.isArray(json)) {
					resolve(new DataFrame(json));
				} else if (typeof json === 'object') {
					// convert object key-values to array of objects
					// by adding the key as an 'id' field to value
					const arr = Object.keys(json).map((key) => {
						const obj = json[key];
						return { id: key, ...obj };
					});

					resolve(new DataFrame(arr));
				}

				throw new SyntaxError('JSON data is not an array');
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
