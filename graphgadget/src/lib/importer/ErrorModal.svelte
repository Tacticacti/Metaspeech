<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { CloseButton } from 'flowbite-svelte';

	export let message: string;
	export let visible = true;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
</script>

<div class="modal" data-testid="error-modal" style:display={visible ? 'block' : 'none'}>
	<div class="modal-content flex justify-between items-center">
		<p>{message}</p>
		<CloseButton on:click={closeModal} class="close" data-testid='close-button'/>
	</div>
</div>

<style>
	.modal {
		display: block;
		position: fixed;
		z-index: 1;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow: auto;
		background-color: rgb(0, 0, 0);
		background-color: rgba(0, 0, 0, 0.4);
	}

	.modal-content {
		background-color: #fefefe;
		margin: 15% auto;
		padding: 20px;
		border: 1px solid #888;
		width: 80%;
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
