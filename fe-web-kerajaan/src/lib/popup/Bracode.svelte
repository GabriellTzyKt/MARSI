<script lang="ts">
	import { fade } from 'svelte/transition';
	import img from '$lib/asset/barcode.png';
	let { value = $bindable() } = $props();
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/80"
	transition:fade={{ duration: 100 }}
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="relative flex items-center justify-center rounded-xl border bg-white p-4"
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
		<div class="">
			<img src={img} alt="" />
		</div>
	</div>
</div>
