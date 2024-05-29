<script lang="ts">
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import Importer from '$lib/importer/Importer.svelte';
	import { data } from '$lib/Store';
	import { goto } from '$app/navigation';
	import type { Bundle } from '$lib/types';
	import { Footer, FooterBrand, FooterCopyright, Label, Checkbox, P, Span } from 'flowbite-svelte';

	let storeData = false;
	const APP_NAME = 'Graphgadget';
	const COPYRIGHT_YEAR = 2024;

	function storeFile(filename: string) {
		var datasets = localStorage.getItem('datasets');
		if (datasets === null) datasets = '[]';
		var storedDatasets: string[] = JSON.parse(datasets);

		if (!storedDatasets.includes(filename)) storedDatasets.push(filename);
		localStorage.setItem('datasets', JSON.stringify(storedDatasets));
		localStorage.setItem(filename, JSON.stringify($data));
	}

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

<header class="bg-white py-5 text-center">
	<img src="GraphGadgetHomeLogo.png" alt="Logo" class="w-72 mx-auto" />
</header>

<div class="flex justify-center gap-5 p-5 bg-darkblue">
	<Importer on:input={handleInput} />
	<button class="button" on:click={() => goto('/previous')}>Previous Data</button>
</div>

<div class="text-center mt-4 flex justify-center items-center">
	<Label class="flex items-center space-x-2">
		<Checkbox id="store-data" bind:checked={storeData} />
		<Span>Store data on client side?</Span>
	</Label>
</div>

<div class="p-5">
	<h2 class="text-xl font-bold text-darkblue">Your go-to tool for intuitive data visualization</h2>
	<h3 class="text-gray-500">How it works</h3>
	<div class="flex justify-around items-center flex-col md:flex-row">
		<div class="bg-gray-200 p-5 m-2 rounded-lg shadow-md max-w-xs text-center">
			<P>Upload your data as a TSV, JSON, XLS, or TXT in the correct format.</P>
		</div>
		<ArrowRightOutline class="text-4xl text-darkblue m-2 md:m-0 transform md:rotate-0 rotate-90"
		></ArrowRightOutline>
		<div class="bg-gray-200 p-5 m-2 rounded-lg shadow-md max-w-xs text-center">
			<P>Select which parameters and graph you want us to create.</P>
		</div>
		<ArrowRightOutline class="text-4xl text-darkblue m-2 md:m-0 transform md:rotate-0 rotate-90"
		></ArrowRightOutline>
		<div class="bg-gray-200 p-5 m-2 rounded-lg shadow-md max-w-xs text-center">
			<P>Either look at your graph in the browser or download it as a JPEG or PNG.</P>
		</div>
	</div>
</div>

<div class="flex flex-col">
	<Footer
		footerType="logo"
		class="bg-footer w-full bottom-0 left-0 right-0 border-none rounded-none"
	>
		<FooterBrand href="/" src="GraphGadgetHomeLogo.png" alt="Flowbite Logo" />
		<FooterCopyright href="/" by={APP_NAME} year={COPYRIGHT_YEAR} />
	</Footer>
</div>

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
