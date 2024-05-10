import ExcelJS from 'exceljs';
import { DataFrame } from 'dataframe-js';

/**
 * @param file: The file input
 * @returns {Promise<DataFrame>}: Returns a DataFrame promise
 **/
export function ParseXlsx(file: File): Promise<DataFrame> {
	const workbook = new ExcelJS.Workbook();
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = async (e: ProgressEvent<FileReader>) => {
			const buffer = e.target?.result as ArrayBuffer;
			try {
				await workbook.xlsx.load(buffer);
				console.log(`Loaded workbook with ${workbook.worksheets.length} worksheet(s)`);
				// Assuming we want the first sheet if there is at least one sheet
				if (workbook.worksheets.length > 0) {
					const worksheet = workbook.getWorksheet(1); // Get the first worksheet

					if (worksheet == undefined || worksheet == null) {
						reject('Invalid file');
						return;
					}

					console.log(`Working with worksheet: ${worksheet.name}`);
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const rowsData: any[][] = [];
					let headers: string[] = [];

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					worksheet.eachRow((row: any, rowNumber) => {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const values = row.values as any[];
						if (rowNumber === 1) {
							headers = values.slice(1);
						} else {
							rowsData.push(values.slice(1));
						}
					});

					resolve(new DataFrame(rowsData, headers));
				} else {
					reject('No worksheets found in the workbook');
				}
			} catch (error) {
				console.error('Error processing Excel data:', error);
				reject(error);
			}
		};

		reader.onerror = (error) => {
			console.error('Error reading file:', error);
			reject(error);
		};

		reader.readAsArrayBuffer(file);
	});
}
