<script lang="ts">
	import type { GroupedDataFrame } from '$lib/Types';

	export let data: GroupedDataFrame;
</script>

{data?.groups.length}
