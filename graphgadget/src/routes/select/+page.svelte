<script lang="ts">
	import { beforeUpdate } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
	import ColumnSelector from '$lib/ColumnSelector/ColumnSelector.svelte';
	import NavBar from '$lib/shared-components/NavBar.svelte';

	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	beforeUpdate(() => {
		loadSession();
	});
</script>

<main class="bg-offwhite max-w-full min-h-screen m-0">
	<NavBar currentPage={'select'} />
	<div class="flex flex-col pt-16 m-5 max-w-full">
		<div
			class="flex items-center justify-center self-end max-w-32 max-h-14 py-4 px-12 bg-darkblue rounded-lg hover:bg-blue-900"
		>
			<!-- Given that it was implemented with an a link, right now you need to click on the words to go to next page -->
			<a
				href="/view"
				class=" text-offwhite font-bold rounded-lg text-sm mr-4"
				data-testid="next-link">Next</a
			>
			<img src="next.png" class=" invert w-8 h-8" alt="Next icon" />
		</div>
		<ColumnSelector></ColumnSelector>
	</div>
</main>
