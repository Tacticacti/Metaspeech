<script lang="ts">
	import { APP_NAME, COPYRIGHT_YEAR } from '$lib/Store';
	import { Footer, FooterBrand, FooterCopyright } from 'flowbite-svelte';
	import logo from '$lib/static/GraphGadgetNavLogo.svg'
</script>

<div class="flex flex-col">
	<Footer
		footerType="logo"
		class="bg-darkblue w-full bottom-0 left-0 right-0 border-none rounded-none"
	>
		<FooterBrand href="/" src={logo} alt="Flowbite Logo" />
		<FooterCopyright href="/" by={APP_NAME} year={COPYRIGHT_YEAR} />
	</Footer>
</div>
