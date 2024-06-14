<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { CloseButton } from 'flowbite-svelte';

	/**
	 * The error message to display in the modal
	 */
	export let message: string | null;
	/**
	 * Whether the modal is visible
	 */
	export let visible = true;

	const dispatch = createEventDispatcher();

	/**
	 * Close the modal
	 */
	function closeModal() {
		dispatch('close');
	}
</script>

{#if visible}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
		data-testid="error-modal"
	>
		<div
			class="flex w-4/5 items-center justify-between rounded bg-white p-6 shadow-lg md:w-1/2 lg:w-1/3"
		>
			<p>{message}</p>
			<CloseButton on:click={closeModal} class="close" data-testid="close-button" />
		</div>
	</div>
{/if}
