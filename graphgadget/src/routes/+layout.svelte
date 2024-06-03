<script>
	import Footer from '$components/Footer.svelte';
	import NavBar from '$components/NavBar.svelte';
	import '../app.css';

	/**
	 * Whether to prerender the application or not.
	 * Since we are creating a static site, we want to prerender the application.
	 */
	export const prerender = true;
</script>

<svelte:window on:error={console.error} />

<main class="bg-offwhite min-h-screen max-h-screen scrollbar-hide overflow-auto">
	<div class="bg-offwhite min-h-screen max-h-screen flex flex-col justify-around">
		<NavBar />
		<slot />
	</div>
	<Footer />
</main>
