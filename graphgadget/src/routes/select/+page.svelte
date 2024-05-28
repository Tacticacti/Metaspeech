<script lang="ts">
	import { beforeUpdate } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
    import { data } from '$lib/Store';
    import ColumnSelector from '$lib/ColumnSelector/ColumnSelector.svelte';

	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	beforeUpdate(() => {
		loadSession();
	});
    // function handleClick() {
	// 	// set the storage to the updated data
	// 	sessionStorage.setItem('current-df', JSON.stringify($data));
	// }


</script>
<a href="/view" data-testid="next-link">Next</a>

 <ColumnSelector></ColumnSelector>
