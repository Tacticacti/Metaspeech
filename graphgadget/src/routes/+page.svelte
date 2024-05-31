<script lang="ts">
	import NavBar from '$lib/shared-components/NavBar.svelte';
	import Footer from '$lib/shared-components/Footer.svelte';
	import Importer from '$lib/importer/Importer.svelte';
	import { data } from '$lib/Store';
	import { goto } from '$app/navigation';
	import type { Bundle } from '$lib/types';
	import { Label, Checkbox } from 'flowbite-svelte';

	let storeData = false;
	const APP_NAME = 'Graphgadget';

	/**
	 * Stores the data in the local storage
	 * @param filename the name of the file to store
	 */
	function storeFile(filename: string) {
		var datasets = localStorage.getItem('datasets');
		if (datasets === null) datasets = '[]';
		var storedDatasets: string[] = JSON.parse(datasets);

		if (!storedDatasets.includes(filename)) storedDatasets.push(filename);
		localStorage.setItem('datasets', JSON.stringify(storedDatasets));
		localStorage.setItem(filename, JSON.stringify($data));
	}

	/**
	 * Handles the input event from the Importer component
	 * Stores the data in the store and redirects to the modify page
	 * @param event the event containing the data
	 */
	function handleInput(event: CustomEvent<Bundle>) {
		const filename = event.detail.filename;
		data.set(event.detail.input);

		if (storeData) storeFile(filename);
		sessionStorage.setItem('current-df', JSON.stringify($data));

		goto('/modify');
	}
</script>

<svelte:head>
	<title>{APP_NAME}</title>
</svelte:head>

<main class="bg-offwhite">
	<NavBar currentPage={''} />
	<header class="flex justify-center pt-16 m-5 max-w-full">
		<img src="GraphGadgetHomeLogo.png" alt="Logo" class="w-[12.5rem] mx-auto" />
	</header>

	<div class="flex justify-center gap-5 p-5 bg-darkblue">
		<Importer on:input={handleInput} />
		<button class="button" on:click={() => goto('/previous')}>Previous Data</button>
	</div>

	<div class="text-center mt-4 flex justify-center items-center">
		<Label class="flex items-center space-x-2">
			<Checkbox id="store-data" bind:checked={storeData} />
			<span>Keep session saved (client only)</span>
		</Label>
	</div>

	<div class="p-5">
		<h2 class="text-xl font-bold text-darkblue">
			Your go-to tool for intuitive data visualization
		</h2>
		<h3 class="text-gray-500">How it works</h3>
		<div class="flex justify-around items-center flex-col md:flex-row">
			<div class="bg-gray-200 p-5 m-2 rounded-lg shadow-md max-w-xs text-center">
				<p>Upload your data as a TSV, JSON, XLS, or TXT in the correct format.</p>
			</div>
			<p class="text-4xl text-darkblue m-2 md:m-0 transform md:rotate-0 rotate-90">&rarr;</p>
			<div class="bg-gray-200 p-5 m-2 rounded-lg shadow-md max-w-xs text-center">
				<p>Select which parameters and graph you want us to create.</p>
			</div>
			<p class="text-4xl text-darkblue m-2 md:m-0 transform md:rotate-0 rotate-90">&rarr;</p>
			<div class="bg-gray-200 p-5 m-2 rounded-lg shadow-md max-w-xs text-center">
				<p>Either look at your graph in the browser or download it as a JPEG or PNG.</p>
			</div>
		</div>
	</div>
	<Footer />
</main>

<style>
	.button {
		font-size: 16px;
		font-weight: bold;
		color: #333;
		margin: 10px 0;
		padding: 10px 20px;
		display: inline-block;
		background-color: #f9f9f9;
		border-radius: 4px;
		cursor: pointer;
		transition:
			color 0.3s ease,
			background-color 0.3s ease;
		text-align: center;
		border: 1px solid #ccc;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
	}

	.button:hover {
		color: #007bff;
		background-color: #e0e0e0;
	}
</style>
