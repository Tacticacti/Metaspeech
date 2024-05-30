<script lang="ts">
	import { APP_NAME } from '$lib/Store';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';

	// current page is route
	export let currentPage: string = '';
</script>

<!-- This is the nav bar, it can be placed on any page and the current page has to be sent through the export -->
<div class="relative px-8 nav-m0">
	<Navbar
		class="bg-darkblue grid grid-cols-1 text-blue-200 py-2.5 fixed w-full max-w-full z-20 top-0 start-0 border-b"
	>
		<NavBrand href="/">
			<img src="GraphGadgetNavLogo.svg" class="me-3 h-6 sm:h-9 pl-0" alt="GG logo" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				{APP_NAME}
			</span>
		</NavBrand>
		<NavHamburger />
		<div>
			<NavUl
				ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-20 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium"
			>
				<NavLi
					class={currentPage === '' || currentPage === '/'
						? 'text-blue-200 hover:text-darkblue md:text-offwhite md:hover:text-offwhite font-bold'
						: 'text-blue-200 hover:text-darkblue md:text-blue-400 md:hover:text-blue-50'}
					href="/">HOME</NavLi
				>
				<NavLi
					class={currentPage === 'modify'
						? 'text-blue-200 hover:text-darkblue md:text-offwhite md:hover:text-offwhite font-bold'
						: 'text-blue-200 hover:text-darkblue md:text-blue-400 md:hover:text-blue-50'}
					href="/modify">DATA</NavLi
				>
				<NavLi
					class={currentPage === 'select'
						? 'text-blue-200 hover:text-darkblue md:text-offwhite md:hover:text-offwhite font-bold'
						: 'text-blue-200 hover:text-darkblue md:text-blue-400 md:hover:text-blue-50'}
					href="/select">PARAMETERS</NavLi
				>
				<NavLi
					class={currentPage === 'view'
						? 'text-blue-200 hover:text-darkblue md:text-offwhite md:hover:text-offwhite font-bold'
						: 'text-blue-200 hover:text-darkblue md:text-blue-400 md:hover:text-blue-50'}
					href="/view">VISUALIZATIONS</NavLi
				>
			</NavUl>
			<!-- progress bar below the nav bar options -->
			<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
				{#if currentPage === '' || currentPage === '/'}
					<div class="bg-blue-400 h-2.5 rounded-full" style="width: 8%"></div>
				{:else if currentPage === 'modify'}
					<div class="bg-blue-400 h-2.5 rounded-full" style="width: 29%"></div>
				{:else if currentPage === 'select'}
					<div class="bg-blue-400 h-2.5 rounded-full" style="width: 55%"></div>
				{:else if currentPage === 'view'}
					<div class="bg-blue-400 h-2.5 rounded-full" style="width: 88%"></div>
				{/if}
			</div>
		</div>
		<div class="ml-44"></div>
	</Navbar>
</div>
