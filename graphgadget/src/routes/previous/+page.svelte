<script lang="ts">
	import { data } from '$lib/Store';
	import DataFrame from 'dataframe-js';
	import { onMount } from 'svelte';
	// @ts-expect-error Ill curse daily ts until this is fixed
	import { goto } from '$app/navigation';

	var storedDatasets: string[] = [];

	/**
	 * When page is opened the names of current stored datasets are retrieved
	 * and if no dataseta are available we are left with an empty list
	 */
	onMount(() => {
		var datasets = localStorage.getItem('datasets');
		if (datasets === null) datasets = '[]';
		storedDatasets = JSON.parse(datasets);
		console.log('Current saved datasets are:', storedDatasets);
	});

	/**
	 * Send the user to the modify page after clicking on an available dataset
	 * stored in local storage
	 *
	 * @param key Used to identify the dataset to load
	 */
	function loadDataset(key: string) {
		var jsonData = localStorage.getItem(key);
		var parsed = jsonData ? JSON.parse(jsonData) : null;
		// Parse again because first time it returns a string
		parsed = JSON.parse(parsed);

		const df = new DataFrame(parsed);

		data.set(df);
		goto('/modify');
	}

	/**
	 * Deletes the clicked dataset from the cache and updates current stored datasets
	 * and the list on screen
	 *
	 * @param key Used to identify the dataset to delete
	 */
	function deleteDataset(key: string) {
		const index = storedDatasets.indexOf(key);
		if (index === -1) {
			console.log('Dataset not found in array');
			return;
		}
		localStorage.removeItem(key);
		storedDatasets.splice(index, 1);
		localStorage.setItem('datasets', JSON.stringify(storedDatasets));
		storedDatasets = storedDatasets;
	}

	/**
	 * Deletes everythng from the cache and updates the stored datasets to
	 * and empty list
	 */
	function clearCache() {
		storedDatasets = [];
		localStorage.clear();
		localStorage.setItem('datasets', JSON.stringify(storedDatasets));
	}
</script>

<h1>Previous Data</h1>

{#if storedDatasets.length > 0}
	<ul>
		{#each storedDatasets as dataset}
			<li>
				<button on:click={() => loadDataset(dataset)}>{dataset}</button>
				<button on:click={() => deleteDataset(dataset)}>X</button>
			</li>
		{/each}
	</ul>
{:else}
	<p>No previous data available.</p>
{/if}

<button on:click={clearCache}>Clear Cache</button>
