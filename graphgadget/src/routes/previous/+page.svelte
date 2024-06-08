<script lang="ts">
	import { df } from '$lib/Store';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button, Tooltip } from 'flowbite-svelte';
	import nextImg from '$assets/icons/next.png';
	import info from '$assets/icons/info.svg';

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
		datasets = datasets; // svelte moment
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

<div class="absolute left-0 top-0">
	<Button href="/" class="ml-4 mt-4 rounded-xl bg-darkblue hover:bg-blue-800">
		<img src={nextImg} alt="go back arrow" class="w-8 rotate-180 invert" />
	</Button>
</div>

<div class="absolute right-0 top-0 flex">
	<div id="ext-ref" class="mr-24 mt-12 size-0"></div>
	<Button id="ref-left"
		><img src={info} alt="info icon" class="h-12" data-testid="info-icon" /></Button
	>
	<Tooltip
		reference="#ext-ref"
		triggeredBy="[id^='ref-']"
		placement="bottom"
		class="w-64 bg-gray-600 text-sm font-light opacity-90"
		data-testid="info-bubble"
	>
		We respect your privacy. All saved data is stored on the client side <span class="font-bold"
			>only</span
		> and can be removed at any point.
	</Tooltip>
</div>

<div class="flex w-[80%] flex-col items-center pt-8 align-top">
	<div class="flex min-w-full flex-col items-center">
		<h1 class="mb-4 text-2xl font-semibold text-darkblue">Previous Data</h1>
		<h2 class="mb-8 text-lg font-semibold text-darkblue">Click on a file to use it.</h2>
		<div class="mb-8 h-[4px] min-w-[80%] rounded-full bg-darkblue"></div>
	</div>

	{#if datasets.length > 0}
		<ul
			data-testid="prev-data-list"
			class="max-h-[60vh] w-full max-w-xl divide-y divide-blue-200 overflow-y-auto rounded-md border-blue-200 bg-darkblue text-lg font-medium leading-none hover:cursor-pointer"
		>
			{#each datasets as dataset}
				<li
					class="mx-0 flex min-w-full max-w-full items-center justify-between text-offwhite hover:bg-blue-300 hover:text-blue-600"
				>
					<span class="ml-6 mr-2.5 h-7 w-1 rounded-r-md bg-blue-500"></span>
					<button class="h-16 w-full" on:click={() => loadDataset(dataset)}>{dataset}</button>
					<button
						data-testid="btn-delete-file"
						class="mr-2 h-10 rounded-full px-4 font-sans text-2xl font-bold text-offwhite hover:bg-red-400"
						on:click={() => deleteDataset(dataset)}>X</button
					>
				</li>
			{/each}
		</ul>
	{:else}
		<p class=" text-xl font-semibold text-red-400">No previous data available.</p>
	{/if}

	<Button
		class="my-12 rounded-lg bg-red-400 px-12 py-2 text-base font-bold text-offwhite hover:bg-red-500"
		on:click={clearCache}>Clear Data</Button
	>
</div>
