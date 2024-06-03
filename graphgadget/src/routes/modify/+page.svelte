<script lang="ts">
	import { APP_NAME } from '$lib/Constants';
	import Table from './Table.svelte';
	import { Button } from 'flowbite-svelte';
	import nextImg from '$assets/next.png';
	import MissingValues from './MissingValues.svelte';
	import Filter from './Filter.svelte';
	import Importer from '$lib/components/importer/Importer.svelte';
	import Merge from './Merge.svelte';
	import { type DataFrameLike } from '$lib/dataframe/DataFrame';

	let second_data: DataFrameLike;
</script>

<svelte:head>
	<title>Data - {APP_NAME}</title>
</svelte:head>

<MissingValues />

<div class="flex justify-between items-center p-5">
	<Filter />
	<div
		class="flex items-center justify-center max-w-32 max-h-14 h-full w-full bg-darkblue rounded-lg hover:bg-blue-900"
	>
		<!-- Given that it was implemented with an a link, right now you need to click on the words to go to next page -->
		<Button
			href="/select"
			class=" text-offwhite font-bold rounded-lg text-sm w-full"
			data-testid="next-link"
		>
			<div class="flex justify-center items-center">
				Next
				<img src={nextImg} class=" invert w-8 h-8 ml-4" alt="Next icon" />
			</div>
		</Button>
	</div>
</div>

<Merge second_data={second_data} />

<div class="flex items-center justify-center content-between h-[60%] px-24">
	<div class="h-full w-full p-4">
		<Table />
	</div>
	<div class="ml-10">
		<Importer on:input={(e) => (second_data = e.detail.data)} />
	</div>
</div>
