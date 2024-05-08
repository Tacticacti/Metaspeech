<script lang="ts">
	import { data, state, StateEnum } from '$lib/store';

	function onInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			const text = reader.result as string;
			// it is tab separated values split it
			const lines = text.split('\n');
			data.set(lines.map((line) => line.split('\t')));
			state.set(StateEnum.modify);
		};
		reader.readAsText(file);
	}
</script>

<input type="file" accept=".tsv" on:input={onInput} />
