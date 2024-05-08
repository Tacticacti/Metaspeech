<script lang="ts">
	import { data, state, StateEnum } from '$lib/store';

	function onClick() {
		state.set(StateEnum.graph);
	}
</script>

<button on:click={onClick}>To Graph</button>

<table>
	<thead>
		<tr>
			{#each $data[0] as header}
				<th>{header}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each $data.slice(1) as row}
			<tr>
				{#each row as cell}
					<td>{cell}</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
