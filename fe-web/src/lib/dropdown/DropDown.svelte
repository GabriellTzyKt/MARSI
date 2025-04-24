<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import menu from '../../asset/icons/threedot.png';
	import { stopPropagation } from 'svelte/legacy';
	import { get, writable } from 'svelte/store';
	import { openDropdown } from '$lib/store';
	import Modal from '$lib/popup/Modal.svelte';
	// import Modal from '$lib/popup/Modal.svelte';
	// export const dropId = $state(writable<string | null>(null));
	let open = $state(false);
	const dispatcher = createEventDispatcher();
	let pop = $state(false);
	// Unique ID for this dropdown
	const {
		id = null,
		id_arsip = null,
		data = null,
		index = '',
		tipe = '',
		items = null,
		text = '',
		link = '',
		successText = ''
	} = $props();
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
			openDropdown === null;
			toggleDropdown();
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
		class=" mx-4 me-4 flex h-6 w-6 items-center justify-center rounded-xl py-3 text-center hover:cursor-pointer hover:bg-slate-300 md:w-auto"
		onclick={toggleDropdown}
	>
		<img src={menu} alt="" class="h-6 w-auto rotate-90" />
	</div>

	<!-- {console.log(openDropdown === id)} -->
	<!-- urutan = 1. judul/nama
	 			2. link kalau ada -->
	{#if $openDropdown === id}
		{console.log(data)}
		<!-- {console.log(id_arsip)} -->
		{console.log('Dropdown terbuka untuk: ' + id)}
		<div class="absolute -bottom-24 right-12 z-50 flex flex-col rounded-xl bg-white">
			{#each items as i, p}
				<div class="flex">
					{#if i[0] === 'children'}
						<a
							href={i[2]}
							class="w-full px-4 py-1 {p === 0 ? 'rounded-t-lg' : ''} {p === items.length - 1
								? 'rounded-b-lg'
								: ''} hover:cursor-pointer hover:bg-gray-400"
							onclick={toglemodal}>{i[1]}</a
						>
					{:else}
						<a
							href={i[1]}
							class="w-full px-4 py-1 {p === 0 ? 'rounded-t-lg' : ''} {p === items.length - 1
								? 'rounded-b-lg'
								: ''} hover:cursor-pointer hover:bg-gray-400">{i[0]}</a
						>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
<Modal {id_arsip} {pop} {successText} {data} {text} {link}></Modal>

<!-- onclick={() => {
    if (open) {
        dispatcher('close');
        open = false;
    } else {
        open = true;
    }
}} -->
