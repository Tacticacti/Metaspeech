<script lang="ts">
	import type { DataType } from '$lib/Types';

	//
	import { onMount, tick } from 'svelte';

	// props
	export let items;
	export let itemHeight: number | undefined = undefined;
	// export let columns;

	// read-only, but visible to consumers via bind:start
	export let start = 0;
	export let end = 0;

	// local state
	let height_map: number[] = [];
	let rows: string | any[] | HTMLCollectionOf<Element>;
	let viewport: { scrollTo?: any; scrollLeft?: any; scrollTop?: any; };
	let contents: HTMLElement;
	let viewport_height = 0;
	let visible;
	let mounted:boolean;

	let top = 0;
	let bottom = 0;
	let left = 0;
	let right = 0;
	let average_height: number;

	$: visible = items.slice(start, end).map((data: any, i: number) => {
		return { index: i + start, data };
	});

	// whenever `items` changes, invalidate the current heightmap
	$: if (mounted) refresh(items, viewport_height, itemHeight);

	// typically only happen at the beginning
	async function refresh(items: string | any[], viewport_height: number, itemHeight: number | undefined) {
		const { scrollTop } = viewport;

		await tick(); // wait until the DOM is up to date

		let content_height = top - scrollTop;
		let i = start;

		while (content_height < viewport_height && i < items.length) {
			let row = rows[i - start];

			if (!row) {
				end = i + 1;
				await tick(); // render the newly visible row
				row = rows[i - start];
			}

			const row_height = (height_map[i] = itemHeight || row.offsetHeight);
			content_height += row_height;
			i += 1;
		}

		end = i;

		const remaining = items.length - end;
		average_height = (top + content_height) / end;

		bottom = remaining * average_height;
		height_map.length = items.length;
	}

	async function handle_scroll() {
		const { scrollTop } = viewport;

		const old_start = start;

		for (let v = 0; v < rows.length; v += 1) {
			height_map[start + v] = itemHeight || rows[v].offsetHeight;
		}

		let i = 0;
		let y = 0;

		while (i < items.length) {
			const row_height = height_map[i] || average_height;
			if (y + row_height > scrollTop) {
				start = i;
				top = y;

				break;
			}

			y += row_height;
			i += 1;
		}

		while (i < items.length) {
			y += height_map[i] || average_height;
			i += 1;

			if (y > scrollTop + viewport_height) break;
		}

		end = i;

		const remaining = items.length - end;
		average_height = y / end;

		while (i < items.length) height_map[i++] = average_height;
		bottom = remaining * average_height;

		// prevent jumping if we scrolled up into unknown territory
		if (start < old_start) {
			await tick();

			let expected_height = 0;
			let actual_height = 0;

			for (let i = start; i < old_start; i += 1) {
				if (rows[i - start]) {
					expected_height += height_map[i];
					actual_height += itemHeight || rows[i - start].offsetHeight;
				}
			}

			const d = actual_height - expected_height;
			viewport.scrollTo(viewport.scrollLeft, scrollTop + d);
		}
	}

	// trigger initial refresh
	onMount(() => {
		rows = contents.getElementsByTagName('svelte-virtual-list-row');
		mounted = true;
	});
</script>

<svelte-virtual-list-viewport
	class="relative block h-[36vw] max-h-[2000px] overflow-auto border-4"
	bind:this={viewport}
	bind:offsetHeight={viewport_height}
	on:scroll={handle_scroll}
>
	<slot name="header-slot">No Columns Available</slot>
	<svelte-virtual-list-contents
		class="block"
		bind:this={contents}
		style="padding-top: {top}px; padding-bottom: {bottom}px; padding-left: {left}px; padding-right: {right}px;"
	>
		{#each visible as row (row.index)}
			<svelte-virtual-list-row>
				{#if row.index % 2 === 0}
					<slot name="row-type1" item={row.data}>No rows available</slot>
				{:else}
					<slot name="row-type2" item={row.data}>Try refreshing</slot>
				{/if}
			</svelte-virtual-list-row>
		{/each}
	</svelte-virtual-list-contents>
</svelte-virtual-list-viewport>
