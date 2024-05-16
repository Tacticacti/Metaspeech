<script lang="ts">
	import { data } from '$lib/Store';
	import DataFrame from 'dataframe-js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	var storedDatasets: string[] = [];

	onMount(() => {
		var datasets = localStorage.getItem('datasets');
		if (datasets === null) datasets = '[]';
		storedDatasets = JSON.parse(datasets);
		console.log('Current saved datasets are:', storedDatasets);
	});

	function loadDataset(key: string) {
		var jsonData = localStorage.getItem(key);
		var parsed = jsonData ? JSON.parse(jsonData) : null; // throw error if null
		parsed = JSON.parse(parsed); // parse again because first return a string

		const df = new DataFrame(parsed);

		data.set(df);
		goto('/modify');
	}

	//TODO should save the dataset after its modified
</script>

<h1>Previous Data</h1>

{#if storedDatasets.length > 0}
	<ul>
		{#each storedDatasets as dataset}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<li on:click={() => loadDataset(dataset)}>{dataset}</li>
		{/each}
	</ul>
{:else}
	<p>No previous data available.</p>
{/if}
