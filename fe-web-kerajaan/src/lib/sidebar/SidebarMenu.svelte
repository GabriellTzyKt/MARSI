<script lang="ts">
	import { writable } from 'svelte/store';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import Icon from '@iconify/svelte';

	const dispatch = createEventDispatcher();

	let { children = null, anchor, hasChildren = false, href, icon, active = false } = $props();

	let elapsed = writable(0);
	let duration = 1000;
	let timer: number | null = null;
	let isOpen = writable(false);
	let display = writable('hidden');

	const startTimer = () => {
		elapsed.set(0);

		if (timer) clearInterval(timer);

		timer = setInterval(() => {
			elapsed.update((n) => {
				if (n >= duration) {
					elapsed.set(0); 
					hide();
					return 0;
				}
				return n + 1000; 
			});
		}, 1000);
	};

	function handleClick() {
		reveal();
		dispatch('menuClick', anchor);
	}

	function reveal() {
		isOpen.set(true);
		display.set(' '); // Show submenu
		startTimer(); // Start timer when submenu is revealed
	}

	function hide() {
		display.set('hidden');
		isOpen.set(false);
	}
</script>

<!-- SidebarMenu Layout -->
<div class="group relative">
	<div
		transition:fly={{ y: 20, duration: 300 }}
		class="ml-7 mr-5 mt-2 flex items-center justify-between rounded-md p-3 transition-all duration-300 hover:cursor-pointer hover:bg-gray-100 hover:bg-gray-200 
		{active	? 'active-class': 'active-class2'}"
		onclick={handleClick}
	>
		<a {href} class="flex items-center space-x-2">
			<Icon
				{icon}
				class="text-lg text-gray-700 transition-colors duration-300 hover:text-blue-600"
			/>
			<span class="font-semibold text-gray-800">{anchor}</span>
		</a>
		{#if hasChildren}
			<span class="mr-2 text-gray-600 transition-all hover:text-blue-600">
				{#if $isOpen}⬆️{/if}
				{#if !$isOpen}⬇️{/if}
			</span>
		{/if}
	</div>

	<!-- Child elements -->
	{#if hasChildren && $display === ' '}
		<div
			transition:fly={{ x: -20, duration: 300 }}
			class="ml-7 mt-2 flex-col p-2 text-black {active? 'active-class': ' border-l-gray-400'}"
			onclick={reveal}
			onmouseleave={hide}
		>
			<div class="space-y-2">
				{@render children()}
			</div>
		</div>
	{/if}
</div>

<style>
	.transition-all {
		transition: all 0.3s ease;
	}
	.active-class {
		background: #eee4e4;
		border-left: 5px solid blue;
		font-weight: bold;
	}

	.active-class2 {
		border-left: 5px solid gainsboro;
		font-weight: bold;
	}
</style>
