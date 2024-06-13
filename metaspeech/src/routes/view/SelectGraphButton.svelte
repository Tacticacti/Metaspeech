<script lang="ts">
	import type { GraphMeta } from '$lib/Types';

	/**
	 * Graph object
	 */
	export let graph: GraphMeta;
</script>

<button
	tabindex="0"
	data-testid={graph.title}
	class="box-content flex h-12 w-44 flex-row flex-wrap justify-between rounded-md border border-gray-400 p-1 px-3 hover:bg-gray-300"
	on:click
	on:mouseover
	on:focus
>
	<img src={graph.img} alt="graph img" class="self-center" width="30px" />
	<div class="self-center text-lg font-bold">{graph.title}</div>
</button>
