import { copyTableToClipboardAsLaTeX, downloadAsTSV } from './Export';
import { vi, it, expect } from 'vitest';
import { aggregateOptions_none, aggregateOptions_single, type Cell } from './Table';
import type { GroupedDataFrame } from '$lib/Types';

function header(
	content: string,
	skip: boolean = false,
	colSpan: number = 1,
	rowSpan: number = 1
): Cell {
	return { content, skip, colSpan, rowSpan, class: 'header' };
}
function data(content: string): Cell {
	return { content, skip: false, colSpan: 1, rowSpan: 1, class: 'data' };
}
function corner(skip: boolean, rows: number, cols: number): Cell {
	return { content: '', skip, colSpan: cols, rowSpan: rows, class: undefined };
}

const spy = vi.fn();
let old: unknown;
beforeEach(() => {
	old = navigator.clipboard;
	Object.defineProperty(navigator, 'clipboard', {
		value: {
			writeText: spy
		}
	});
});
afterEach(() => {
	Object.defineProperty(navigator, 'clipboard', {
		value: old
	});
});

describe('copyTableToClipboardAsLaTeX', () => {
	it('should copy to clipboard', () => {
		const table: Cell[][] = [[header('a')], [data('b')]];

		copyTableToClipboardAsLaTeX(table);
		expect(spy).toHaveBeenCalledOnce();
	});

	it('should copy simple table to clipboard', () => {
		const table: Cell[][] = [
			[header('a'), header('b')],
			[data('1'), data('2')]
		];

		copyTableToClipboardAsLaTeX(table);
		expect(spy).toHaveBeenCalledWith(
			[
				'\\begin{tabular}{|c|c|}',
				'\\hline',
				'a & b \\\\',
				'\\hline',
				'1 & 2 \\\\',
				'\\hline',
				'\\end{tabular}'
			].join('\n')
		);
	});

	it('should copy complex table to clipboard', () => {
		// prettier-ignore
		const table: Cell[][] = [
			[corner(false, 2, 2),      corner(true, 2, 2), header('a', false, 2), header('a', true, 2), header('b', false, 2), header('b', true, 2)],
			[corner(true, 2, 2),       corner(true, 2, 2), header('a1'),          header('a2'),         header('b1'),          header('b2')],
			[header('x', false, 1, 2), header('x1'),       data('1'),             data('2'),            data('3'),             data('4')],
			[header('x', true, 1, 2),  header('x2'),       data('5'),             data('6'),            data('7'),             data('8')],
			[header('y', false, 1, 2), header('y1'),       data('9'),             data('10'),           data('11'),            data('12')],
			[header('y', true, 1, 2),  header('y2'),       data('13'),            data('14'),           data('15'),            data('16')],
		];

		copyTableToClipboardAsLaTeX(table);
		expect(spy).toHaveBeenCalledWith(
			[
				'\\begin{tabular}{|c|c|c|c|c|c|}',
				'\\hline',
				'\\multicolumn{2}{|c|}{} & \\multicolumn{2}{c|}{a} & \\multicolumn{2}{c|}{b} \\\\',
				'\\cline{3-6}',
				'\\multicolumn{2}{|c|}{} & a1 & a2 & b1 & b2 \\\\',
				'\\hline',
				'x & x1 & 1 & 2 & 3 & 4 \\\\',
				'\\cline{2-6}',
				' & x2 & 5 & 6 & 7 & 8 \\\\',
				'\\hline',
				'y & y1 & 9 & 10 & 11 & 12 \\\\',
				'\\cline{2-6}',
				' & y2 & 13 & 14 & 15 & 16 \\\\',
				'\\hline',
				'\\end{tabular}'
			].join('\n')
		);
	});

	it('should replace special characters', () => {
		const table: Cell[][] = [[header('a_1')], [data('\\ & _ % $ # { } ~ ^')]];

		copyTableToClipboardAsLaTeX(table);
		expect(spy).toHaveBeenCalledWith(
			[
				'\\begin{tabular}{|c|}',
				'\\hline',
				'a\\_1 \\\\',
				'\\hline',
				'\\\\ \\& \\_ \\% \\$ \\# \\{ \\} \\~ \\^ \\\\',
				'\\hline',
				'\\end{tabular}'
			].join('\n')
		);
	});
});

describe('downloadAsTsv', () => {
	it('should download as tsv', () => {
		const element = {
			click: vi.fn(),
			href: '',
			download: ''
		};
		const createElement = vi
			.spyOn(document, 'createElement')
			.mockReturnValueOnce(element as unknown as HTMLAnchorElement);
		const data: GroupedDataFrame = {
			groups: [
				{
					keys: ['a'],
					values: Array(5)
				},
				{
					keys: ['b'],
					values: Array(20)
				}
			],
			groupedColumns: [
				{
					name: 'x',
					groupBy: {
						type: 'specific'
					},
					hasMissing: false,
					type: 'number'
				}
			]
		};

		global.URL.createObjectURL = vi.fn().mockReturnValueOnce('dummy');

		downloadAsTSV(data, aggregateOptions_none[0]);

		expect(createElement).toHaveBeenCalledWith('a');
		expect(element.href).toBe('dummy');
		expect(global.URL.createObjectURL).toHaveBeenCalledWith(
			new Blob(['x\tCount\na\t5\na\t20\n'], { type: 'text/tsv' })
		);
		expect(element.download).toBe('data.tsv');
		expect(element.click).toHaveBeenCalledOnce();

		// @ts-expect-error clear the mock
		global.URL.createObjectURL = undefined;
	});
	it('should download as tsv', () => {
		const element = {
			click: vi.fn(),
			href: '',
			download: ''
		};
		const createElement = vi
			.spyOn(document, 'createElement')
			.mockReturnValueOnce(element as unknown as HTMLAnchorElement);
		const data: GroupedDataFrame = {
			groups: [
				{
					keys: ['a'],
					values: [2, 4]
				},
				{
					keys: ['b'],
					values: [3, 5]
				}
			],
			groupedColumns: [
				{
					name: 'x',
					groupBy: {
						type: 'specific'
					},
					hasMissing: false,
					type: 'number'
				}
			],
			aggregateColumn: {
				name: 'y',
				aggregate: true,
				hasMissing: false,
				type: 'number'
			}
		};

		global.URL.createObjectURL = vi.fn().mockReturnValueOnce('dummy');

		downloadAsTSV(data, aggregateOptions_single[0]);

		expect(createElement).toHaveBeenCalledWith('a');
		expect(element.href).toBe('dummy');
		expect(global.URL.createObjectURL).toHaveBeenCalledWith(
			new Blob(['x\ty Mean\na\t3\na\t5\n'], { type: 'text/tsv' })
		);
		expect(element.download).toBe('data.tsv');
		expect(element.click).toHaveBeenCalledOnce();

		// @ts-expect-error clear the mock
		global.URL.createObjectURL = undefined;
	});
});
