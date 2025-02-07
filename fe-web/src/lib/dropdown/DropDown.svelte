<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import menu from '../../asset/icons/threedot.png';
	import { stopPropagation } from 'svelte/legacy';
	import { get, writable } from 'svelte/store';
	import { openDropdown } from '$lib/store';
	import Modal from '$lib/popup/Modal.svelte';
	// export const dropId = $state(writable<string | null>(null));
	let open = $state(false);
	const dispatcher = createEventDispatcher();
	let pop = $state(false);
	// Unique ID for this dropdown
	const { id, data, index, tipe } = $props();
	let isOpen = $state(false);
	let temp = $state('');

	const toggleDropdown = () => {
		// console.log(data);
		openDropdown.update((current) => {
			console.log(`Sebelum update: ${current}`); // Debugging
			const newValue = current === id ? null : id;
			console.log(`Setelah update: ${newValue}`); // Debugging
			return newValue;
		});
	};
	const toglemodal = () => {
		if (!pop) {
			pop = true;
		} else {
			pop = false;
		}
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="mx-4 me-4 flex items-center justify-center rounded-xl py-3 text-center hover:cursor-pointer hover:bg-slate-300"
		onclick={toggleDropdown}
	>
		<img src={menu} alt="" class="h-4" />
	</div>
	<!-- {console.log(openDropdown === id)} -->

	{#if $openDropdown === id}
		{console.log(data)}
		{console.log('Dropdown terbuka untuk: ' + id)}
		<div class="absolute -bottom-16 -right-16 z-50 flex flex-col rounded-xl bg-white">
			<div class="flex">
				{#if tipe === 'anggota'}
					<a
						href="acara/tambahacara/detail/{data.id}"
						class="w-full rounded-t-xl px-4 py-1 hover:cursor-pointer hover:bg-gray-400">Detail</a
					>
				{:else}
					<a
						href="detail/{data.id}"
						class="w-full rounded-t-xl px-4 py-1 hover:cursor-pointer hover:bg-gray-400">Detail</a
					>
				{/if}
			</div>
			<div class="flex">
				{#if tipe === 'anggota'}
					<a
						href="acara/tambahacara/detail/{data.id}"
						class="w-full px-4 py-1 hover:cursor-pointer hover:bg-gray-400">Ubah</a
					>
				{:else}
					<a href="detail/{data.id}" class="w-full px-4 py-1 hover:cursor-pointer hover:bg-gray-400"
						>Ubah</a
					>
				{/if}
			</div>
			<div class="flex" onclick={toglemodal} onclose={toglemodal}>
				<a href="" class="w-full rounded-b-xl px-4 py-1 hover:cursor-pointer hover:bg-gray-400"
					>Arsip</a
				>
			</div>
		</div>
	{/if}
</div>
<Modal {pop} nama={data.nama}></Modal>
<!-- onclick={() => {
    if (open) {
        dispatcher('close');
        open = false;
    } else {
        open = true;
    }
}} -->
