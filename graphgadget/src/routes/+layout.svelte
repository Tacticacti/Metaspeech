<script lang="ts">
	import Footer from '$components/Footer.svelte';
	import NavBar from '$components/NavBar.svelte';
	import '../app.css';
	import { navigating } from '$app/stores';
	import { df } from '$lib/Store';
	import { onMount } from 'svelte';

	onMount(() => {
		loadSession();
	});

	navigating.subscribe(() => {
		if (typeof sessionStorage === 'undefined') return;

		sessionStorage.setItem('current-df', JSON.stringify(df.get()));
	});

	/**
	 * Loads the session from the session storage.
	 * @returns The loaded DataFrame.
	 */
	function loadSession() {
		if (typeof sessionStorage === 'undefined') return;
		const jsonData = sessionStorage.getItem('current-df');
		let parsed = jsonData ? JSON.parse(jsonData) : null;

		if (parsed === null) return;

		df.set(parsed);
	}
</script>

<svelte:window on:error={console.error} />

<NavBar />
<div class="flex flex-col min-h-screen bg-offwhite">
	<main class="flex-1">
		<slot />
	</main>
</div>
<Footer />
