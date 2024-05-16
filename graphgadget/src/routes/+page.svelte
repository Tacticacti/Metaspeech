<script lang="ts">
	import Importer from '$lib/importer/Importer.svelte';
	import { data } from '$lib/Store';
	import { goto } from '$app/navigation';
	import type { Bundle } from '$lib/types';

	function handleInput(event: CustomEvent<Bundle>) {
		const filename = event.detail.filename;
		data.set(event.detail.input);

		var datasets = localStorage.getItem('datasets');
		if (datasets === null) datasets = '[]';
		var storedDatasets: string[] = JSON.parse(datasets);

		if (!storedDatasets.includes(filename)) storedDatasets.push(filename);
		localStorage.setItem('datasets', JSON.stringify(storedDatasets));
		localStorage.setItem(filename, JSON.stringify($data));

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
