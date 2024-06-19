<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	export let message: string = 'Default message';
	export let color: 'green' | undefined = 'green';
	export let duration: number = 3000; // 3 seconds of lifetime

	let showToast = true;
	const dispatch = createEventDispatcher();

	onMount(() => {
		setTimeout(() => {
			showToast = false;
			dispatch('close');
		}, duration);
	});
</script>

{#if showToast}
	<div class="fixed left-1/2 top-5 z-40 m-auto flex min-w-fit -translate-x-1/2 justify-center">
		<Toast {color}>
			<svelte:fragment slot="icon">
				<div class="rounded-md bg-green-400 px-2 pt-1 font-extrabold">&check;</div>
			</svelte:fragment>
			<div class="text-md whitespace-nowrap font-semibold">{message}</div>
		</Toast>
	</div>
{/if}
