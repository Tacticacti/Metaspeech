import { it, expect } from 'vitest';
import { convertToLatex } from '$lib/components/exporter/latex/LatexExporterController';

describe('test convert to latex function', () => {
	it('empty', () => {
		expect(convertToLatex([])).toEqual('');
		expect(convertToLatex([[]])).toEqual('');
	});
	it('simple', () => {
		const matrix: string[][] = [
			['Subgroup ls', 'col 1', 'col 2'],
			['M', '10', '20'],
			['F', '20', '10']
		];

		const latex = convertToLatex(matrix);

		expect(latex).toContain('Subgroup ls & col 1 & col 2 \\\\');
		expect(latex).toContain('M & 10 & 20 \\\\');
		expect(latex).toContain('F & 20 & 10 \\\\');
	});
});
