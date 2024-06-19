<script lang="ts">
	import Importer from '$lib/components/importer/Importer.svelte';
	import { df } from '$lib/Store';
	import { APP_NAME } from '$lib/Constants';
	import { goto } from '$app/navigation';
	import type { DataFile } from '$lib/Types';
	import { Label, Checkbox } from 'flowbite-svelte';
	import logo from '$assets/MetaSpeechHomeLogo.svg';
	import Card from '$components/Card.svelte';

	let shouldStoreData = false;

	/**
	 * Stores the data in the local storage
	 * @param filename the name of the file to store
	 */
	function storeFile(bundle: DataFile) {
		const json = JSON.stringify(bundle.data);
		sessionStorage.setItem('current-df', json);

		if (!shouldStoreData) return;

		var datasets = localStorage.getItem('datasets');
		if (datasets === null) datasets = '[]';
		var storedDatasets: string[] = JSON.parse(datasets);

		if (!storedDatasets.includes(bundle.name)) storedDatasets.push(bundle.name);

		localStorage.setItem('datasets', JSON.stringify(storedDatasets));

		localStorage.setItem(bundle.name, json);
	}

	/**
	 * Handles the input event from the Importer component
	 * Stores the data in the store and redirects to the modify page
	 * @param event the event containing the data
	 */
	function handleInput(event: CustomEvent<DataFile>) {
		df.set(event.detail.data);
		storeFile(event.detail);

		goto('/modify');
	}
</script>

<svelte:head>
	<title>Home - {APP_NAME}</title>
</svelte:head>

<header class="flex max-w-full justify-center align-middle">
	<img src={logo} alt="Logo" class="mx-auto h-[15vw] w-[30%] p-3" />
</header>

<div class="flex justify-center gap-5 p-5">
	<Importer on:input={handleInput} id="import-data" data-testid="import" />
	<label
		class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-darkblue px-4 py-2 text-lg font-bold text-gray-50 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-900"
		for="import-data"
	>
		Select Data
	</label>
	<button
		class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-darkblue px-4 py-2 text-lg font-bold text-gray-50 shadow-md transition-colors duration-300 ease-in-out hover:bg-blue-900"
		on:click={() => goto('/previous')}
		data-testid="previous-btn"
	>
		Previous Data
	</button>
</div>

<div class="mt-4 flex items-center justify-center text-center">
	<Label class="flex items-center space-x-2">
		<Checkbox id="store-data" bind:checked={shouldStoreData} data-testid="store-data-cb" />
		<span>Keep session saved (client only)</span>
	</Label>
</div>

<div class="p-5">
	<h2 class="text-xl font-bold text-darkblue">Your go-to tool for intuitive data visualization</h2>
	<h3 class="text-gray-500">How it works</h3>
	<div class="mt-5 flex flex-col items-center justify-around md:flex-row">
		<Card text={'Upload your data as a TSV, JSON, XLS, or TXT in the correct format.'} />
		<p class="mx-10 rotate-90 transform text-4xl text-darkblue md:m-0 md:rotate-0">&rarr;</p>
		<Card text={'Modify data by filtering and merging extra data.'} />
		<p class="mx-10 rotate-90 transform text-4xl text-darkblue md:m-0 md:rotate-0">&rarr;</p>
		<Card text={'Select which parameters and graph you want us to create.'} />
		<p class="mx-10 rotate-90 transform text-4xl text-darkblue md:m-0 md:rotate-0">&rarr;</p>
		<Card text={'Either look at your graph in the browser or download it as a JPEG or PNG.'} />
	</div>
</div>
