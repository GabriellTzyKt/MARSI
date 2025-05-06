<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Qr from './QR.svelte';
	// import { fade } from 'svelte/transition';

	// import { onMount } from 'svelte';
	let { value = $bindable(), data = $bindable() } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/80"
	transition:fade={{ duration: 100 }}
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="relative flex flex-col items-center justify-center rounded-xl border bg-white p-4"
		onclick={() => {
			value = false;
		}}
	>
		<div class="absolute right-0 top-0 me-4 mt-4 cursor-pointer">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="2"
				stroke="gray"
				class="size-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</div>
		<div class="mb-4">
			<h2 class="text-xl font-bold">Scan QR Code</h2>
		</div>

		<!-- QR Code -->
		{#if value && data}
			<div class="flex bg-white p-4">
				<Qr codeValue={data} squareSize={500}></Qr>
			</div>
		{:else}
			<p>No data</p>
		{/if}

		{#if data}
			<div class="mt-2 text-center">
				<p class="text-sm">{data}</p>
			</div>
		{/if}
	</div>
</div>
