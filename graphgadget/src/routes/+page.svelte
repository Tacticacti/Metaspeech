<script lang="ts">
	import Importer from '$lib/importer/Importer.svelte';
	import { data } from '$lib/Store';
	import { goto } from '$app/navigation';
	import type { Bundle } from '$lib/types';

	let storeData = false;

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
	<title>Graph Gadget</title>
</svelte:head>

<header class="header">
	<h1 class="text-4xl font-bold">Graph Gadget</h1>
</header>

<div class="buttons-container">
	<Importer on:input={handleInput} />
	<button class="button" on:click={() => goto('/previous')}>Previous Data</button>
</div>

<div class="info-section">
	<h3 class="text-gray-500">How it works</h3>
	<h2 class="text-xl font-bold">An intuitive way to visualize your data</h2>
	<div class="flex justify-around">
		<div class="info-box">
			<p>Upload your data as a TSV, JSON, XLS, or TXT in the correct format.</p>
		</div>
		<div class="info-box">
			<p>Select which parameters and graph you want us to create.</p>
		</div>
		<div class="info-box">
			<p>Either look at your graph in the browser or download it as a JPEG or PNG.</p>
		</div>
	</div>
</div>

<div class="text-center mt-4">
	<input type="checkbox" id="store-data" bind:checked={storeData} class="mr-2" />
	<label for="store-data">Store data in client side?</label>
</div>

<footer class="text-center mt-8">
	<p>&copy; Graph Gadget 2024</p>
</footer>

<style>
	/* Custom styles to match the provided design */
	.header {
		background-color: #3d4f75;
		padding: 20px;
		text-align: center;
		color: black;
		background-color: white;
	}

	.buttons-container {
		display: flex;
		justify-content: center;
		gap: 20px;
		padding: 20px;
		background-color: #3d4f75;
	}

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
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.button:hover {
		color: #007bff;
		background-color: #e0e0e0;
	}

	.info-section {
		padding: 20px;
	}

	.info-box {
		background-color: #e0e0e0;
		padding: 20px;
		margin: 10px;
		border-radius: 10px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		max-width: 300px;
	}
	h2 {
		color: #3d4f75;
	}
</style>
