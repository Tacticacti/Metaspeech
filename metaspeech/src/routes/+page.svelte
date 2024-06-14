<script lang="ts">
	import Importer from '$lib/components/importer/Importer.svelte';
	import { df } from '$lib/Store';
	import { APP_NAME } from '$lib/Constants';
	import { goto } from '$app/navigation';
	import type { DataFile } from '$lib/Types';
	import { Label, Checkbox } from 'flowbite-svelte';
	import logo from '$assets/MetaSpeechHomeLogo.svg';

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
		class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-lg font-bold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
		for="import-data"
	>
		Select Data
	</label>
	<button
		class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-lg font-bold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
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
	<div class="flex flex-col items-center justify-around md:flex-row mt-5">
		<div class="card max-w-xs min-h-32 bg-gradient-to-br from-[#3D4F75]  to-[#637290] rounded-lg text-white overflow-hidden relative transform-gpu perspective-1000 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:rotate-y-10 hover:rotate-x-10 hover:scale-105 hover:shadow-lg">
			<div class="card-content p-5 pt-8 relative z-10 flex flex-col gap-2.5 items-center justify-center text-center h-full">
			  <p class="card-title font-bold">Upload your data as a TSV, JSON, XLS, or TXT in the correct format.</p>
			</div>
			<div class="card-before absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"></div>
			<div class="card-after absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-black/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"></div>
		</div>
		<p class="mx-10 rotate-90 transform text-4xl text-darkblue md:m-0 md:rotate-0">&rarr;</p>
		<div class="card max-w-xs min-h-32 bg-gradient-to-br from-[#3D4F75]  to-[#637290] rounded-lg text-white overflow-hidden relative transform-gpu perspective-1000 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:rotate-y-10 hover:rotate-x-10 hover:scale-105 hover:shadow-lg">
			<div class="card-content p-5 pt-8 relative z-10 flex flex-col gap-2.5 items-center justify-center text-center h-full">
			  <p class="card-title font-bold">Select which parameters and graph you want us to create.</p>
			</div>
			<div class="card-before absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"></div>
			<div class="card-after absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-black/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"></div>
		</div>
		<p class="mx-10 rotate-90 transform text-4xl text-darkblue md:m-0 md:rotate-0">&rarr;</p>
		<div class="card max-w-xs min-h-32 bg-gradient-to-br from-[#3D4F75]  to-[#637290] rounded-lg text-white overflow-hidden relative transform-gpu perspective-1000 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:rotate-y-10 hover:rotate-x-10 hover:scale-105 hover:shadow-lg">
			<div class="card-content p-5 pt-8 relative z-10 flex flex-col gap-2.5 items-center justify-center text-center h-full">
			  <p class="card-title font-bold">Either look at your graph in the browser or download it as a JPEG or PNG.</p>
			</div>
			<div class="card-before absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"></div>
			<div class="card-after absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-black/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0"></div>
		</div>
	</div>
</div>

<style>
	.card:hover {
	  transform: rotateY(10deg) rotateX(10deg) scale(1.05);
	}
	.card:hover .card-before {
	  transform: translateX(-100%);
	}
	
	.card:hover .card-after {
	  transform: translateX(100%);
	}
</style>
