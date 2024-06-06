<script lang="ts">
	import { type TableInfo } from '$lib/Store';
	import { stringify } from 'csv-stringify/browser/esm/sync';
	export let tableInfo: TableInfo;

	$: dataMatrix = [tableInfo[0], ...tableInfo[1]];
	$: tsvData = stringify(dataMatrix, {
		delimiter: '\t'
	});
	$: tsvBlob = new Blob([tsvData], { type: 'text/tsv' });

	function downloadTableTSV() {
		const link = document.createElement('a');
		const tsvFile = URL.createObjectURL(tsvBlob);

		link.href = tsvFile;
		link.download = 'table_data.tsv';
		link.click();
	}
</script>

<div>
	<button data-testid="btn-download-tsv" on:click={downloadTableTSV}>TSV</button>
</div>
