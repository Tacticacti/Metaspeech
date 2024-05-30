<script lang="ts">
    import {Footer, FooterBrand, FooterCopyright} from 'flowbite-svelte'
    const APP_NAME = 'Graphgadget';
	const COPYRIGHT_YEAR = 2024;
</script>
<div class="flex flex-col">
    <Footer
    footerType="logo"
    class="bg-darkblue w-full bottom-0 left-0 right-0 border-none rounded-none"
    >
    <FooterBrand href="/" src="GraphGadgetNavLogo.svg" alt="Flowbite Logo" />
    <FooterCopyright href="/" by={APP_NAME} year={COPYRIGHT_YEAR} />
    </Footer>
</div>