<script lang="ts">
	import { data } from '$lib/Store';
	import { afterUpdate, onMount } from 'svelte';
	import ParameterSelector from '$lib/graphs/histogram/ParameterSelector.svelte';
	import {
		getNumericalColumns,
		calculateAxis,
		sortParallelArrays,
		type BinDictionary
	} from '$lib/graphs/histogram/HistogramController';
	import { Grid } from "gridjs";
	import "gridjs/dist/theme/mermaid.css";

	let tableWrapper: HTMLDivElement;

	const columnNames = $data.listColumns() as string[];

	const numericColumns = getNumericalColumns(columnNames, $data.toCollection(true));

	let selectedParams: string[];
	let checkedMean: boolean;
	let parameterType: string;
	let binSizes: BinDictionary;

	onMount(() => {
		new Grid({
			columns: ["Name", "Email", "Phone Number"],
			data: [
				["John", "john@example.com", "(353) 01 222 3333"],
				["Mark", "mark@gmail.com", "(01) 22 888 4444"],
				["Eoin", "eoin@gmail.com", "0097 22 654 00033"],
				["Sarah", "sarahcdd@gmail.com", "+322 876 1233"],
				["Afshin", "afshin@mail.com", "(353) 22 87 8356"]
			]
			}).render(tableWrapper);
	});
</script>

<ParameterSelector
	{columnNames}
	{numericColumns}
	bind:selectedParams
	bind:checkedMean
	bind:parameterType
	bind:binSizes
/>

<div bind:this={tableWrapper}></div>

<style>
</style>
