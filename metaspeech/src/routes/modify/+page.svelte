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

<div class="flex flex-1 flex-col">
	<MissingValues />

	<div class="flex items-center justify-between p-5">
		<Filter />
		<div
			class="flex h-full max-h-14 w-full max-w-32 items-center justify-center rounded-lg bg-darkblue hover:bg-blue-900"
		>
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

	<div class="flex w-full flex-1 content-between items-center justify-center px-24">
		<div class="scrollbar-hide w-full self-baseline overflow-scroll p-4">
			<Table />
		</div>
		<div class="ml-10">
			<Importer
				id="append-data"
				on:input={(e) => (second_data = e.detail.data)}
				data-testid="file-input"
			/>
			<label
				class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-darkblue px-4 py-2 text-lg font-bold text-gray-100 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-900"
				for="append-data"
			>
				Merge with another file
			</label>
		</div>
	</div>
</div>
