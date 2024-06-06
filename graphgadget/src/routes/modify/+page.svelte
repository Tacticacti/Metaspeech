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

<div class="flex items-center justify-between p-5">
	<Filter />
	<div
		class="flex h-full max-h-14 w-full max-w-32 items-center justify-center rounded-lg bg-darkblue hover:bg-blue-900"
	>
		<!-- Given that it was implemented with an a link, right now you need to click on the words to go to next page -->
		<Button
			href="/select"
			class=" w-full rounded-lg text-sm font-bold text-offwhite"
			data-testid="next-link"
		>
			<div class="flex items-center justify-center">
				Next
				<img src={nextImg} class=" ml-4 h-8 w-8 invert" alt="Next icon" />
			</div>
		</Button>
	</div>
</div>

<Merge {second_data} />

<div class="flex h-[60%] content-between items-center justify-center px-24">
	<div class="h-full w-full p-4">
		<Table />
	</div>
	<div class="ml-10">
		<Importer on:input={(e) => (second_data = e.detail.data)} />
	</div>
</div>
