<script>
	export let items;
	export const start = 0;
	export const end = items.length;
</script>

<div class="relative block h-[36vw] max-h-[2000px] overflow-auto border-4">
	<slot name="header-slot">No Columns Available</slot>
	<div class="block">
		{#each items as row, i}
			<div>
				{#if i % 2 === 0}
					<slot name="row-type1" item={row}>No rows available</slot>
				{:else}
					<slot name="row-type2" item={row}>Try refreshing</slot>
				{/if}
			</div>
		{/each}
	</div>
</div>
