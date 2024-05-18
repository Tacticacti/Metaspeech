<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let message: string;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
</script>

<div class="modal" data-testid="error-modal">
	<div class="modal-content">
		<button class="close" on:click={closeModal} aria-label="Close" data-testid="close-button"
			>&times;</button
		>
		<p>{message}</p>
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
	}

	.close {
		color: #aaa;
		float: right;
		font-size: 28px;
		font-weight: bold;
		background: none;
		border: none;
		cursor: pointer;
	}

	.close:hover,
	.close:focus {
		color: black;
		text-decoration: none;
	}
</style>
