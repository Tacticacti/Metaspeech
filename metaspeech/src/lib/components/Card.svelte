<script lang="ts">
	export let text: string = 'input text here';
</script>

<div
	class="card perspective-1000 relative min-h-32 max-w-xs transform-gpu overflow-hidden rounded-lg bg-gradient-to-br from-[#3D4F75] to-[#637290] text-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
>
	<div
		class="card-content relative z-10 flex h-full flex-col items-center justify-center gap-2.5 p-5 pt-8 text-center"
	>
		<p class="card-title font-bold">
			{text}
		</p>
	</div>
	<div
		class="card-before absolute left-0 top-0 z-0 h-full w-full bg-gradient-to-b from-transparent to-black/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
	></div>
	<div
		class="card-after absolute right-0 top-0 z-0 h-full w-full bg-gradient-to-b from-transparent to-black/10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
	></div>
</div>
