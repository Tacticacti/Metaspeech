<script lang="ts">
	import { type TableInfo } from '$lib/Store';
	export let tableInfo: TableInfo;

	// for testing purposes
	let isDownloadCalled = false;

	$: dataMatrix = [tableInfo[0], ...tableInfo[1]];
	$: latexData = convertToLatex(dataMatrix);

	function copyTableLatex() {
		navigator.clipboard.writeText(latexData).then(() => (isDownloadCalled = true));
	}

	function convertToLatex(dataMatrix: string[][]): string {
		if (dataMatrix === undefined || dataMatrix.length === 0 || dataMatrix[0].length === 0) {
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
</script>

<div>
	<button data-testid="btn-copy-latex" on:click={copyTableLatex}>Copy Latex to Clipboard</button>
</div>

{#if isDownloadCalled}
	<div data-testid="latex-copy-function-called">Copied!</div>
{/if}
