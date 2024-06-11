<script lang="ts">
	import type { GroupedDataFrame } from '$lib/Types';

	export let data: GroupedDataFrame;
</script>

{data?.groups.length}
<canvas data-testid="canvas-element" class="mb-4"></canvas>
