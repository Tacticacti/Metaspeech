<script lang="ts">
	import { APP_NAME, COPYRIGHT_YEAR } from '$lib/Constants';
	import { Footer, FooterBrand, FooterCopyright } from 'flowbite-svelte';
	import logo from '$assets/MetaSpeechNavLogo.svg';
</script>

<Footer footerType="logo" class="w-full rounded-none border-none bg-darkblue font-Jost">
	<FooterBrand href="/" src={logo} alt="Flowbite Logo" />
	<FooterCopyright href="/" by={APP_NAME} year={COPYRIGHT_YEAR} />
</Footer>
