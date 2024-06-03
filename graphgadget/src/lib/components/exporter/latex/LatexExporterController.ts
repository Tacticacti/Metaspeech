export function convertToLatex(dataMatrix: string[][]): string {
	if (dataMatrix.length === 0 || dataMatrix[0].length === 0) {
		return '';
	}
	const nColumns = dataMatrix[0].length;

	const tabularData = dataMatrix.map((row) => row.join(' & ')).join(' \\\\ \\hline\n\t');
	const headerFormat = '| l '.repeat(nColumns) + '|';

	return `\\begin{center}
\\begin{tabular} {${headerFormat}}
\\hline
    ${tabularData} \\\\
\\hline
\\end{tabular}
\\end{center}`;
}
