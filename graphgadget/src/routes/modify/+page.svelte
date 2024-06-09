<script lang="ts">
	import { APP_NAME } from '$lib/Constants';
	import Table from './Table.svelte';
	import { Button } from 'flowbite-svelte';
	import nextImg from '$assets/icons/next.png';
	import MissingValues from './MissingValues.svelte';
	import Filter from './Filter.svelte';
	import Importer from '$lib/components/importer/Importer.svelte';
	import Merge from './Merge.svelte';
	import { type DataFrameLike } from '$lib/Types';

	let second_data: DataFrameLike;
</script>

<svelte:head>
	<title>Data - {APP_NAME}</title>
</svelte:head>

<div class="bg-blue-600 h-full">
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

	<div class="flex w-full h-[60%] content-between bg-red-600 items-center justify-center px-24">
		<div class="max-h-4 w-full p-4 bg-green-400">
			<Table />
		</div>
		<div class="ml-10">
			<Importer on:input={(e) => (second_data = e.detail.data)} data-testid="file-input" />
			<label
				class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-lg font-bold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
				for="import-data"
			>
				Append File
			</label>
		</div>
	</div>
</div>
