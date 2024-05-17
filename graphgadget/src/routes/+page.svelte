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

		goto('/modify');
	}
</script>

<svelte:head>
	<title>Graph Gadget</title>
</svelte:head>

<header>
	<h1>Graph Gadget</h1>
</header>
<nav>
	<ul>
		<li>
			<Importer on:input={handleInput} />
		</li>

		<li><a href="./previous">Previous Data</a></li>
	</ul>
</nav>
<input type="checkbox" id="store-data" bind:checked={storeData} />
<label for="store-data">Store data in client side?</label>
<main>
	<h3>How it works</h3>
	<h2>An intuitive way to visualize your speech metadata</h2>
	<div>
		<div>Upload your data as a TSV, JSON, XLS, or TXT in the correct format</div>
		<div>Select which parameters and graph you want us to create</div>
		<div>See the resulting graph on your browser or download it as a JPEG or PNG</div>
	</div>
	<footer>
		<p>Copyright Graph Gadget</p>
	</footer>
</main>
