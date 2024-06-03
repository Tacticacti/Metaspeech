<script lang="ts">
	import { APP_NAME, COPYRIGHT_YEAR } from '$lib/Constants';
	import { Footer, FooterBrand, FooterCopyright } from 'flowbite-svelte';
	import logo from '$assets/GraphGadgetNavLogo.svg';
</script>

<Footer
	footerType="logo"
	class="bg-darkblue w-full border-none rounded-none "
>
	<FooterBrand href="/" src={logo} alt="Flowbite Logo" />
	<FooterCopyright href="/" by={APP_NAME} year={COPYRIGHT_YEAR} />
</Footer>
