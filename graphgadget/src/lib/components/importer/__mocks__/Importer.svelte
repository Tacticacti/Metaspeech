<script lang='ts'>
	import type { DataFile } from "$lib/Types";
	import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher<{
		input: DataFile;
	}>();

    function dispatchInputEvent(data: DataFile) {
        dispatch('input', data);
    }
</script>

<button on:click={e => dispatchInputEvent()} data-testid="fire-import"></button>