<script lang='ts'>
	import Footer from '$components/Footer.svelte';
	import NavBar from '$components/NavBar.svelte';
	import '../app.css';
	import { navigating } from '$app/stores';
	import { df } from '$lib/Store';
	import { onMount } from 'svelte';

	navigating.subscribe((value) => {
		if (typeof sessionStorage === 'undefined') return;

		sessionStorage.setItem('current-df', JSON.stringify(df.get()));
	});

	onMount(() => {
		loadSession();
	});

	/**
	 * Loads the session from the session storage.
	 * @returns The loaded DataFrame.
	 */
	function loadSession() {
		if (typeof window === 'undefined' || typeof window.sessionStorage === 'undefined') return;
		const jsonData = sessionStorage.getItem('current-df');
		let parsed = jsonData ? JSON.parse(jsonData) : null;

		if (parsed === null) return;

		df.set(parsed);
	}
</script>

<svelte:window on:error={console.error} />

<div class="bg-offwhite min-h-screen max-h-screen scrollbar-hide overflow-auto flex flex-col">
	<NavBar />
	<main class="flex-grow overflow-auto">
		<slot />
	</main>
	<Footer />
</div>

