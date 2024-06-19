<script lang="ts">
	import type { GroupedDataFrame } from '$lib/Types';
	import GraphContainer from '../GraphContainer.svelte';
	import {
		aggregateOptions_none,
		aggregateOptions_single,
		type AggregateOption,
		createTable
	} from './Table';
	import { copyTableToClipboardAsLaTeX, copyAsText } from './Export';
	import { Tooltip } from 'flowbite-svelte';
	import Toast from '$components/Toast.svelte';

	export let data: GroupedDataFrame;
	const aggregateOptions = data?.aggregateColumn ? aggregateOptions_single : aggregateOptions_none;
	let selectedOption: AggregateOption;

	$: table = createTable(data, selectedOption);

	let showToast: boolean = false;
	let message: string = 'Copied to LaTeX';

	function showCustomToast() {
		showToast = true;
	}

	function handleClose() {
		showToast = false;
	}
</script>

<GraphContainer>
	<div slot="option-slot" class="flex w-full items-center justify-around">
		<div>
			<select
				bind:value={selectedOption}
				data-testid="aggregate"
				class="my-2 inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out"
			>
				{#each aggregateOptions as option}
					<option value={option} data-testid={option.name}>{option.name}</option>
				{/each}
			</select>
		</div>
		<div class="flex justify-center space-x-4">
			<button
				class="inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
				on:click={() => {
					copyTableToClipboardAsLaTeX(table);
					message = 'Copied to LaTeX';
					showCustomToast();
				}}
				data-testid="copy-as-latex"
				id="copy-as-latex"
			>
				Copy as LaTeX
			</button>
			<button
				class="inline-block cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-800 shadow-md transition-colors duration-300 ease-in-out hover:bg-gray-200 hover:text-blue-500"
				on:click={() => {
					copyAsText(table);
					message = 'Copied as TSV';
					showCustomToast();
				}}
				data-testid="download-as-tsv"
				id="copy-as-tsv"
			>
				Copy as text (.tsv)
			</button>
			<Tooltip
				triggeredBy="[id^='copy-as-']"
				trigger="click"
				placement="bottom"
				class="z-50 w-48 bg-gray-600 text-sm font-light opacity-90"
			>
				Copied!
			</Tooltip>
		</div>
	</div>
	<div slot="graph-slot" class="mb-10 overflow-x-auto">
		<table class="">
			{#each table as row}
				<tr>
					{#each row as cell}
						{#if !cell.skip}
							<td
								colspan={cell.colSpan}
								rowspan={cell.rowSpan}
								class={cell.class}
								data-testid="cell-{cell.content}"
							>
								{cell.content}
							</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</table>
	</div>
</GraphContainer>

{#if showToast}
	<Toast {message} color="green" duration={3000} on:close={handleClose} />
{/if}

<style>
	table {
		border-collapse: collapse;
		table-layout: auto;
		width: 100%;
	}

	td {
		border: 1px solid black;
		padding: 5px;
		overflow: hidden;
		white-space: nowrap;
	}

	td.header {
		background-color: #d1d1d1;
	}

	td.data {
		background-color: #f8f8f8;
	}
</style>
