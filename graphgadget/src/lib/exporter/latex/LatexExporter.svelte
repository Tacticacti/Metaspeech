<script lang="ts">
	import { type TableInfo } from '$lib/Store';
	import { convertToLatex } from '$lib/exporter/latex/LatexExporterController';

	export let tableInfo: TableInfo;

	// for testing purposes
	let isDownloadCalled = false;

	$: dataMatrix = [tableInfo[0], ...tableInfo[1]];
	$: latexData = convertToLatex(dataMatrix);

	function copyTableLatex() {
		navigator.clipboard.writeText(latexData).then(() => (isDownloadCalled = true));
	}
</script>

<div>
	<button data-testid="btn-copy-latex" on:click={copyTableLatex}>Copy Latex to Clipboard</button>
</div>

{#if isDownloadCalled}
	<div data-testid="latex-copy-function-called">Copied!</div>
{/if}
