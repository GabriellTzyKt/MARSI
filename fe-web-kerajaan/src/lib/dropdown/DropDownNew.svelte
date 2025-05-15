<script lang="ts">
	import { fade } from 'svelte/transition';
	import { openDropdown } from '$lib/store';
	// opsional: klik di luar tutup dropdown

	interface DropdownItem {
		label: string;
		url?: string;
		action?: () => void;
		confirmText?: string;
	}

	let { items = $bindable<DropdownItem[]>([]), text = '', id = '', data = null } = $props();

	let isOpen = $state(false);

	function toggle() {
		isOpen = !isOpen;
		openDropdown.set(isOpen ? id : null);
	}

	function close() {
		isOpen = false;
		openDropdown.set(null);
	}
</script>

<div class="relative">
	<button onclick={toggle} class="rounded bg-gray-200 px-2 py-1 text-sm">⋮</button>

	{#if isOpen}
		<ul
			class="absolute right-0 z-10 mt-2 w-48 rounded-md border bg-white shadow-lg"
			in:fade={{ duration: 100 }}
			out:fade={{ duration: 100 }}
		>
			{#each items as item}
				<li>
					{#if item.url}
						<a
							href={item.url}
							class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
							onclick={close}
						>
							{item.label}
						</a>
					{:else if item.action}
						<button
							onclick={() => {
								close();
								if (item.confirmText) {
									if (confirm(item.confirmText)) {
										item.action();
									}
								} else {
									item.action();
								}
							}}
							class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
						>
							{item.label}
						</button>
					{/if}
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	/* Tambahan opsional kalau belum ada */
	button:focus {
		outline: none;
	}
</style>
