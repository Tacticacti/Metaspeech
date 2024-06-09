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

	function getPageName(route: string): string {
		const page = pages.find((p) => p.path === route);
		return page ? page.name + ' - ' + APP_NAME : APP_NAME;
	}
</script>

<svelte:head>
	<title>{getPageName(currentPage)}</title>
</svelte:head>

{#if pages.map((p) => p.path).includes(currentPage)}
	<div class="nav-m0 relative h-20 w-full">
		<Navbar class="fixed z-20 grid grid-cols-1 border-b bg-darkblue py-2.5 text-blue-200 ">
			<NavBrand href="/">
				<img src={logo} class="me-3 h-6 pl-0 sm:h-9" alt="GG logo" />
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
								? 'font-bold text-blue-200 hover:text-darkblue md:text-offwhite md:hover:text-offwhite'
								: 'text-blue-200 hover:text-darkblue md:text-blue-400 md:hover:text-blue-50'}
							href={page.path}
						>
							{page.name.toUpperCase()}
						</NavLi>
					{/each}
				</NavUl>
				<!-- progress bar below the nav bar options -->
				<div class="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
					<div class="h-2.5 rounded-full bg-blue-400" style="width: {getProgress(currentPage)}" />
				</div>
			</div>
			<div class="ml-44" />
		</Navbar>
	</div>
{/if}
