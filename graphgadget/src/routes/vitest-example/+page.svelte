<script lang="ts">
    export let currency: number = 0
    let counter = 0
    $: doubled = counter * 2

    function formatCurrency(currency: number) {
        return `$${currency}`
    }

    function incrememt() {
        counter += 1
    }

</script>

<h1>Only meant to be used as example for testing purposes</h1>
<h3>Either run "npm test" or "npm run test:unit" to unit test</h3>
<input type="text" placeholder="input number" bind:value={currency}>
<div data-testid="formatted-currency">{formatCurrency(currency)}</div>
<button on:click={incrememt}>Increase counter</button>
<div data-testid="counter">Counter is: {counter}</div>
<div data-testid="doubled">Double is: {doubled}</div>