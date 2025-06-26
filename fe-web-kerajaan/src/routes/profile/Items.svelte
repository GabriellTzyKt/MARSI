<script lang="ts">
	import { slide } from 'svelte/transition';
	let { title, location, date, organizer } = $props();
	let isOpen = $state(false);

	const toggle = () => {
		if (!isOpen) {
			isOpen = true;
		} else isOpen = false;
	};
</script>

<!-- Items -->
<div class=" mt-4 flex w-full flex-col">
	<button
		class="bg-badran relative w-full py-2 ps-2 text-start text-white {isOpen
			? 'rounded-t-md'
			: 'rounded-md'}"
		onclick={toggle}
		>{title}
		{#if isOpen}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="absolute right-3 top-2 size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="absolute right-3 top-2 size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
			</svg>
		{/if}
	</button>
	{#if isOpen}
		<div class="flex flex-col rounded-b-lg border p-2" transition:slide={{ duration: 100 }}>
			<div>
				<p>Diadakan di : {location}</p>
			</div>
			<div>
				<p>Tanggal : <span class="text-badran">{date}</span></p>
			</div>
			<div>
				<p>Oleh: {organizer}</p>
			</div>
		</div>
	{:else}{/if}
</div>
