<script lang="ts">
	import { beforeUpdate } from 'svelte';
	import { loadSession } from '$lib/utils/SessionLoad';
	import ColumnSelector from '$lib/column-selector/ColumnSelector.svelte';
	import NavBar from '$lib/shared-components/NavBar.svelte';
	import Footer from '$lib/shared-components/Footer.svelte';
	import { Button } from 'flowbite-svelte';
	import nextImg from '$lib/static/next.png';
	import { APP_NAME } from '$lib/Store';

	/**
	 * Will check if there is a dataframe in session storage and load it
	 */
	beforeUpdate(() => {
		loadSession();
	});
</script>

<svelte:head>
	<title>Parameters - {APP_NAME}</title>
</svelte:head>

<main class="bg-offwhite max-w-full h-screen m-0 flex flex-col scrollbar-hide overflow-auto">
	<NavBar currentPage={'select'} />
	<div class="flex flex-col pt-16 m-5 max-w-full h-full">
		<div
			class="flex items-center justify-center self-end max-w-32 max-h-14 h-full w-full bg-darkblue rounded-lg hover:bg-blue-900"
		>
			<!-- Given that it was implemented with an a link, right now you need to click on the words to go to next page -->
			<Button
				href="/view"
				class=" text-offwhite font-bold rounded-lg text-sm w-full"
				data-testid="next-link"
			>
				<div class="flex justify-center items-center">
					Next
					<img src={nextImg} class=" invert w-8 h-8 ml-4" alt="Next icon" />
				</div>
			</Button>
		</div>
		<ColumnSelector></ColumnSelector>
	</div>
	<Footer></Footer>
</main>
