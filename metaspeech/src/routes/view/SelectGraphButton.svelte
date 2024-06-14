<script lang="ts">
	import type { GraphMeta, GroupedDataFrame } from '$lib/Types';
	import { Tooltip } from 'flowbite-svelte';

	/**
	 * Graph object
	 */
	export let graph: GraphMeta;
	export let data: GroupedDataFrame;

	let disable = false;
	const noRenderReasons: Record<string, string> = {
		Table: 'Unknown reason for not rendering.',
		Histogram: 'Unknown reason for not rendering.',
		'Pie Chart': "Cannot be shown if the 'show' is not count/percentage.",
		Scatter: 'Cannot be shown if the group has no numeric columns in the group.',
		'Box Plot': 'Can only be shown if one numeric column in group.'
	};

	function canRender(): boolean {
		disable = !graph.canRender(data);
		return disable;
	}
</script>

<button
	tabindex="0"
	data-testid={graph.title}
	class="box-content flex h-12 w-44 flex-row flex-wrap justify-between rounded-md border border-gray-400 p-1 px-3 hover:bg-gray-300 disabled:bg-gray-300"
	on:click
	on:mouseover
	on:focus
	disabled={canRender()}
>
	<img src={graph.img} alt="graph img" class="self-center" width="30px" />
	<div class="self-center text-lg font-bold">{graph.title}</div>
</button>
{#if disable}
	<Tooltip
		placement="top"
		class="z-0 w-48 bg-gray-600 text-sm font-light opacity-90"
		data-testid={graph.title + '-tooltip'}
	>
		{noRenderReasons[graph.title] || 'unknown reason why disabled'}
	</Tooltip>
{/if}
