<script lang="ts">
	export let currency: number = 0;
	let counter = 0;
	$: doubled = counter * 2;
	let todo = '';
	let todos: string[] = [];

	function formatCurrency(currency: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(currency);
	}

	function incrememt() {
		counter += 1;
	}

	function addTodo() {
		todos = [...todos, todo];
		todo = '';
	}
</script>

<h1>Only meant to be used as example for testing purposes</h1>
<h3>Either run "npm test" or "npm run test:unit" to unit test</h3>
<div class="horizontal-container">
	<div>
		<input type="text" placeholder="input number" bind:value={currency} />
		<div data-testid="formatted-currency">{formatCurrency(currency)}</div>
	</div>
	<div>
		<button data-testid="inc-counter" on:click={incrememt}>Increase counter</button>
		<div data-testid="counter">Counter is: {counter}</div>
		<div data-testid="doubled">Double is: {doubled}</div>
	</div>
</div>
<div class="horizontal-container">
	<div>
		<div>
			<input type="text" data-testid="todo-input" placeholder="input todo" bind:value={todo} />
			<button on:click={addTodo} data-testid="todo-button">Add</button>
		</div>
		<div>
			<ul data-testid="todo-ul">
				{#each todos as todo}
					<li>{todo}</li>
				{/each}
			</ul>
		</div>
	</div>
</div>

<style>
	* {
		margin: 0;
		padding: 0;
	}

	h1,
	h3 {
		width: 100%;
		text-align: center;
		margin-bottom: 20px;
	}

	.horizontal-container {
		padding: 20px 20px;
		margin: 40px 20px;
		display: flex;
		justify-content: space-around;
	}

	input,
	button {
		padding: 10px;
		margin-bottom: 20px;
	}
</style>
