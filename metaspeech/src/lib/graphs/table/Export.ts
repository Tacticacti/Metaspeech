import { type Cell } from './Table';

/**
 * Copy a table to the clipboard as LaTeX
 * @param table the table to copy
 */
export function copyTableToClipboardAsLaTeX(table: Cell[][]): void {
	// start the table
	let text = '\\begin{tabular}{|' + table[0].map(() => 'c').join('|') + '|}\n';

	// write rows
	for (const row of table) {
		text += writeRow(row);
	}

	// add the bottom line and end the table
	text += '\\hline\n';
	text += '\\end{tabular}';

	navigator.clipboard.writeText(text);
}

/**
 * Write a row of a table to LaTeX
 * It writes the line above the row, then the row itself
 * @param row the row to write
 * @returns the LaTeX string for the row
 */
function writeRow(row: Cell[]): string {
	let text = '';
	// write the line above the row
	const firstWrite = row.findIndex((c) => !c.skip);
	text += firstWrite === 0 ? '\\hline' : `\\cline{${firstWrite + 1}-${row.length}}`;
	text += '\n';

	// write the row itself
	for (let i = 0; i < row.length; i++) {
		const cell = row[i];
		const prevCell = row[i - 1];

		if (cell.skip && cell.content === prevCell?.content && cell.colSpan !== 1) {
			continue;
		}

		let content = cell.skip ? '' : cell.content;
		content = replaceLaTeXSpecialChars(content);

		const format = i === 0 ? '|c|' : 'c|';
		text += cell.colSpan > 1 ? `\\multicolumn{${cell.colSpan}}{${format}}{${content}}` : content;
		text += ' & ';
	}

	text = text.slice(0, -3);
	text += ' \\\\\n';
	return text;
}

/**
 * Replace LaTeX special characters with their escaped versions
 * @param text the text to replace the special characters in
 * @returns the text with the special characters replaced
 */
function replaceLaTeXSpecialChars(text: string): string {
	const specialChars = ['\\', '&', '_', '%', '$', '#', '{', '}', '~', '^'];
	return specialChars.reduce((result, char) => result.replaceAll(char, '\\' + char), text);
}
