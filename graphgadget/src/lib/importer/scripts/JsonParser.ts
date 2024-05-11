import { DataFrame } from 'dataframe-js';

export function ParseJson(file: File): Promise<DataFrame> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = (e: ProgressEvent<FileReader>) => {
			try {
				const data = e.target?.result;
				if (!data) {
					reject(new Error('Failed to load file'));
				}

				const json = JSON.parse(data as string);

				if (Array.isArray(json)) {
					resolve(new DataFrame(json));
				} else if (typeof json === 'object') {
					const arr = Object.keys(json).map((key) => {
						const obj = json[key];
						return { id: key, ...obj };
					});

					resolve(new DataFrame(arr));
				} else {
					reject(new SyntaxError('JSON data is not an array'));
				}
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
