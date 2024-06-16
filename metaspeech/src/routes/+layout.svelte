<script lang="ts">
	import Footer from '$components/Footer.svelte';
	import NavBar from '$components/NavBar.svelte';
	import '../app.css';
	import { navigating } from '$app/stores';
	import { df } from '$lib/Store';
	import { onMount } from 'svelte';
	import ErrorModal from '$components/ErrorModal.svelte';

	let message = '';
	let errorIsVisible = false;

	onMount(() => {
		loadSession();
	});

	navigating.subscribe((value) => {
		if (typeof sessionStorage === 'undefined' || value === null) return;

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

	function handleError(e: unknown) {
		errorIsVisible = true;
		message = '';

		if (e instanceof Error) {
			message = e.message;
			return;
		}
		if (e instanceof PromiseRejectionEvent) {
			message = e.reason.message;
			return;
		}
		if (e instanceof ErrorEvent) {
			message = e.error.message;
			return;
		}
		return;
	}
</script>

<svelte:window on:error={handleError} on:unhandledrejection={handleError} />

<NavBar />
<div class="flex h-full min-h-full flex-col bg-offwhite font-Jost">
	<main class="flex flex-1 flex-col">
		<slot />
	</main>
</div>
<Footer />

<ErrorModal bind:message bind:visible={errorIsVisible} on:close={() => (errorIsVisible = false)} />
