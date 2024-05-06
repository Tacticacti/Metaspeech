<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
	let inputFiles: FileList;

	$: dispatch('inputFilesChanged', inputFiles);
</script>

<input 
    bind:files={inputFiles} 
    type="file" 
    accept="text/tsv, application/vnd.ms-excel, text/csv, application/json, text/plain"
    id="upload-data"
    hidden />
<label for="upload-data">Upload Data</label>