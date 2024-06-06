<script lang="ts">
	/**
	 * Graph object
	 */
	export let graph;
</script>

<button
	tabindex="0"
	data-testid={graph.title}
	class="flex h-12 w-52 flex-row flex-wrap justify-around rounded-md border border-gray-400 p-1 hover:bg-gray-300"
	on:click
	on:mouseover
	on:focus
>
	<img src={graph.img_src} alt="graph img" class="self-center" />
	<div class="self-center text-lg font-bold">{graph.title}</div>
</button>
