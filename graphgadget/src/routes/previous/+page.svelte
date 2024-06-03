<script lang="ts">
	import { df } from '$lib/Store';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button, Tooltip } from 'flowbite-svelte';
	import nextImg from '$assets/next.png';
	import info from '$assets/info.svg';
	import type { DataFrameLike } from '$lib/dataframe/DataFrame';

	/**
	 * List of stored datasets
	 */
	let datasets: string[] = [];

	/**
	 * When page is opened the names of current stored datasets are retrieved
	 * and if no dataseta are available we are left with an empty list
	 */
	onMount(() => {
		loadDatasets();
	});

	/**
	 * When the page is opened the names of current stored datasets are retrieved
	 * and if no datasets are available we are left with an empty list
	 */
	function loadDatasets() {
		const datasetsJSON = localStorage.getItem('datasets') ?? '[]';
		datasets = JSON.parse(datasetsJSON);
	}

	/**
	 * Send the user to the modify page after clicking on an available dataset
	 * stored in local storage
	 *
	 * @param key Used to identify the dataset to load
	 */
	function loadDataset(key: string) {
		var jsonData = localStorage.getItem(key);
		var parsed = jsonData ? JSON.parse(jsonData) : null;
		// In the case decides to delete a dataset from console
		if (!parsed) {
			loadDatasets();
			deleteDataset(key);

			alert('this dataset no longer exists');
			return;
		}
		// Parse again because first time it returns a string
		parsed = JSON.parse(parsed) as DataFrameLike;
		df.set(parsed);
		sessionStorage.setItem('current-df', JSON.stringify(parsed));

		goto('/modify');
	}

	/**
	 * Deletes the clicked dataset from the cache and updates current stored datasets
	 * and the list on screen
	 *
	 * @param key Used to identify the dataset to delete
	 */
	function deleteDataset(key: string) {
		const index = datasets.indexOf(key);
		if (index === -1) return;

		localStorage.removeItem(key);
		datasets.splice(index, 1);
		localStorage.setItem('datasets', JSON.stringify(datasets));
	}

	/**
	 * Deletes everythng from the cache and updates the stored datasets to
	 * and empty list
	 */
	function clearCache() {
		if (confirm('Are you sure you want to delete all stored files?') === false) return;
		datasets = [];
		localStorage.clear();
		localStorage.setItem('datasets', JSON.stringify(datasets));
	}
</script>

<div class="absolute top-0 left-0">
	<Button href="/" class="bg-darkblue rounded-xl ml-4 mt-4 hover:bg-blue-800">
		<img src={nextImg} alt="go back arrow" class="rotate-180 w-8 invert" />
	</Button>
</div>

<div class="absolute top-0 right-0 flex">
	<div id="ext-ref" class="mr-24 mt-12 size-0"></div>
	<Button id="ref-left"
		><img src={info} alt="info icon" class="h-12" data-testid="info-icon" /></Button
	>
	<Tooltip
		reference="#ext-ref"
		triggeredBy="[id^='ref-']"
		placement="bottom"
		class="w-64 text-sm font-light bg-gray-600 opacity-90"
		data-testid="info-bubble"
	>
		We respect your privacy. All saved data is stored on the client side <span class="font-bold"
			>only</span
		> and can be removed at any point.
	</Tooltip>
</div>

<div class="flex flex-col align-top items-center w-[80%] pt-8">
	<div class="min-w-full flex flex-col items-center">
		<h1 class="text-darkblue text-2xl font-semibold mb-4">Previous Data</h1>
		<h2 class="text-darkblue text-lg font-semibold mb-8">Click on a file to use it.</h2>
		<div class="bg-darkblue min-w-[80%] h-[4px] mb-8 rounded-full"></div>
	</div>

	{#if datasets.length > 0}
		<ul
			class="max-w-xl max-h-[60vh] overflow-y-auto font-medium w-full text-lg leading-none bg-darkblue border-blue-200 divide-y divide-blue-200 rounded-md hover:cursor-pointer"
		>
			{#each datasets as dataset}
				<li
					class="min-w-full max-w-full flex items-center justify-between mx-0 text-offwhite hover:text-blue-600 hover:bg-blue-300"
				>
					<span class="ml-6 mr-2.5 w-1 h-7 bg-blue-500 rounded-r-md"></span>
					<button class="w-full h-16" on:click={() => loadDataset(dataset)}>{dataset}</button>
					<button
						class="px-4 mr-2 text-offwhite hover:bg-red-400 h-10 font-bold font-sans text-2xl rounded-full"
						on:click={() => deleteDataset(dataset)}>X</button
					>
				</li>
			{/each}
		</ul>
	{:else}
		<p class=" text-xl font-semibold text-red-400">No previous data available.</p>
	{/if}

	<Button
		class="my-12 text-offwhite bg-red-400 px-12 py-2 text-base font-bold rounded-lg hover:bg-red-500"
		on:click={clearCache}>Clear Data</Button
	>
</div>
