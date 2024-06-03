<script lang="ts">
	import { APP_NAME } from '$lib/Constants';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import logo from '$assets/GraphGadgetNavLogo.svg';
	import { page } from '$app/stores';

	/**
	 * Current page (route)
	 */
	$: currentPage = $page.route.id ?? '/';

	const pages = [
		{
			name: 'Home',
			path: '/'
		},
		{
			name: 'Data',
			path: '/modify'
		},
		{
			name: 'Parameters',
			path: '/select'
		},
		{
			name: 'Visualizations',
			path: '/view'
		}
	];
	
	function getProgress(route: string): string {	
		if (route === '/') {
			return '8%';
		} else if (route === '/modify') {
			return '29%';
		} else if (route === '/select') {
			return '55%';
		} else if (route === '/view') {
			return '88%';
		}
		
		return '0%';
	}
</script>

{#if pages.map(p => p.path).includes(currentPage)}
	<div class="relative nav-m0 w-full">
		<Navbar
			class="bg-darkblue grid grid-cols-1 text-blue-200 py-2.5 z-20 border-b"
		>
			<NavBrand href="/">
				<img src={logo} class="me-3 h-6 sm:h-9 pl-0" alt="GG logo" />
				<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
					{APP_NAME}
				</span>
			</NavBrand>
			<NavHamburger />
			<div>
				<NavUl
					ulClass="flex flex-col p-4 mt-4 md:flex-row md:space-x-20 rtl:space-x-reverse md:mt-0 md:text-sm md:font-medium"
				>
					{#each pages as page}
						<NavLi
							class={currentPage === page.path
								? 'text-blue-200 hover:text-darkblue md:text-offwhite md:hover:text-offwhite font-bold'
								: 'text-blue-200 hover:text-darkblue md:text-blue-400 md:hover:text-blue-50'}
							href={page.path}>
							{page.name.toUpperCase()}
						</NavLi>
					{/each}
				</NavUl>
				<!-- progress bar below the nav bar options -->
				<div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
					<div class="bg-blue-400 h-2.5 rounded-full" style="width: {getProgress(currentPage)}" />
				</div>
			</div>
			<div class="ml-44" />
		</Navbar>
	</div>
{/if}
