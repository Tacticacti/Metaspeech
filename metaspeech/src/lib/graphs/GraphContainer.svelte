<div class="w-full">
	<div class="border-3 min-h-20 items-center border-gray-300">
		<div class="flex w-full justify-around">
			<slot name="option-slot">No option Available</slot>
		</div>
		<div class="flex w-full justify-around">
			<slot name="extra-option-slot"></slot>
		</div>
	</div>
	<div>
		<slot name="graph-slot"></slot>
	</div>
</div>
