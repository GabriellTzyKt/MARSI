<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import check from '$lib/asset/icon/check.png';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	let { text } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore event_directive_deprecated -->
<div
	class="fixed left-0 top-0 z-[70] flex min-h-full min-w-full items-center justify-center bg-black/75"
	in:fade={{ duration: 100 }}
	out:fade={{ duration: 100 }}
	onclick={(e) => {
		e.stopPropagation();
	}}
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore event_directive_deprecated -->
	<div
		class=" relative flex flex-col items-center justify-center rounded-xl border bg-white"
		in:fade={{ duration: 100 }}
		out:fade={{ duration: 100 }}
		onclick={(e) => {
			e.stopPropagation();
		}}
	>
		<div class="mt-8 p-2">
			<img src={check} class="h-auto w-24" alt="" />
		</div>
		<div class="mx-28 mb-8 mt-8">
			<p class="text-xl">{text}</p>
		</div>
	</div>
</div>
