<script lang="ts">
    export let currency: number = 0

    function formatCurrency(currency: number) {
        return `$${currency}`
    }
</script>

<h1>Only meant to be used as example for testing purposes</h1>
<h3>Either run "npm test" or "npm run test:unit" to unit test</h3>
<input type="text" placeholder="input number" bind:value={currency}>
<div data-testid="formatted-currency">{formatCurrency(currency)}</div>