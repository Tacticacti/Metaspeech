import type { DataFrameLike } from '$lib/dataframe/DataFrame';
import { read, utils } from '@e965/xlsx';

/**
 * Parses an XLS file and returns a promise that resolves to a DataFrame containing the parsed data.
 * This function reads an XLS file using a FileReader, processes it into a workbook using SheetJS,
 * then extracts the first worksheet to convert into JSON format which is then transformed into a DataFrame.
 *
 * @param file The File object representing the Excel file.
 * @returns {Promise<DataFrame>} A promise that resolves to a DataFrame with the Excel data.
 */
export function parseXlS(file: File): Promise<DataFrameLike> {
	// Return a new promise that will resolve with the DataFrame or reject with an error
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		// Event handler for file load event
		reader.onload = (e: ProgressEvent<FileReader>) => {
			try {
				// Access the file's contents
				const data = e.target?.result;
				if (!data) {
					reject(new Error('Failed to load file'));
				}

				// Parse the binary string to a workbook using SheetJS
				const workbook = read(data, { type: 'binary' });

				// Assume the first sheet in the workbook is the target sheet
				const firstSheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[firstSheetName];

				// Convert the worksheet to JSON format
				const json = utils.sheet_to_json(worksheet, { header: 1 });

				// Validate the format of the first row as headers
				if (Array.isArray(json[0]) && json[0].every((cell) => typeof cell === 'string')) {
					// Create a DataFrame from the JSON, slicing from the second element onward and using the first row as headers
					console.log(json);
					resolve({
						columns: json.slice(1) as string[], 
						rows: json[0]
					});
				} else {
					reject(new SyntaxError('Header row format is incorrect or missing'));
				}
			} catch (error) {
				// Handle any parsing errors
				reject(error);
			}
		};

		// Error handler for file reading errors
		reader.onerror = () => {
			reject(new Error('Error reading file'));
		};

		// Initiate reading the file as a binary string
		reader.readAsArrayBuffer(file); // Ensure this matches the expected type in XLSX.read
	});
}
