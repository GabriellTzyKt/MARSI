<script lang="ts">
	import { createEventDispatcher, type Snippet } from 'svelte';
	import menu from '$lib/icons/threedot.png';
	import { stopPropagation } from 'svelte/legacy';
	import { get, writable } from 'svelte/store';
	import { openDropdown } from '$lib/store';
	import Modal from '$lib/popup/Modal.svelte';
	import HistoryPopUp from '$lib/popup/HistoryPopUp.svelte';
	import { fade } from 'svelte/transition';
	import TambahTugas from '$lib/popup/TambahTugas.svelte';
	import BuktiLaporan from '$lib/popup/BuktiLaporan.svelte';
	import TambahMasterData from '$lib/popup/TambahMasterData.svelte';
	import { enhance } from '$app/forms';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	// import Modal from '$lib/popup/Modal.svelte';
	// export const dropId = $state(writable<string | null>(null));
	let open = $state(false);
	const dispatcher = createEventDispatcher();
	let pop = $state(false);

	// Unique ID for this dropdown
	let {
		id,
		data,
		clickedId = $bindable(),
		items,
		ubahm = null,
		text,
		deleteD = $bindable(),
		popup,
		dataG = null,
		header = null
	} = $props<{
		id?: string | null;
		data?: any;
		clickedId?: string;
		items?: any[] | null;
		ubahm?: string | null;
		text?: string;

		deleteD?: boolean;
		popup?: Snippet<[any]>;

		dataG?: any;
		header?: any;
	}>();
	let UT_errors = $state();
	let isOpen = $state(false);
	let temp = $state('');
	let openm = $state(false);
	let openGelar = $state(false);
	let openBintang = $state(false);
	let openUT = $state(false);
	let openBL = $state(false);
	let success = $state(false);
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
	$effect(() => {
		if (!openUT) UT_errors = '';
	});
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
		{console.log(items.length)}
		<div
			class="absolute {items.length <= 3
				? '-bottom-10'
				: '-bottom-38'} z-9999 right-32 flex flex-col rounded-xl bg-white md:right-16"
		>
			{#each items as i, p}
				<div class="flex">
					{#if i[0] === 'children'}
						{#if i[1] === 'History Gelar'}
							<a
								href={i[3]}
								class="w-full px-4 py-1 {p === 0 ? 'rounded-t-lg' : ''}  {p === items.length - 1
									? 'rounded-b-lg'
									: ''} hover:cursor-pointer hover:bg-gray-400"
								onclick={() => {
									openGelar = true;
								}}>{i[1]}</a
							>
						{:else if i[1] === 'History Bintang Jasa'}
							<a
								href={i[3]}
								class="w-full px-4 py-1 {p === 0 ? 'rounded-t-lg' : ''}  {p === items.length - 1
									? 'rounded-b-lg'
									: ''} hover:cursor-pointer hover:bg-gray-400"
								onclick={() => {
									openBintang = true;
								}}>{i[1]}</a
							>
						{:else if i[1] === 'Ubah'}
							<a
								href={''}
								class="w-full px-4 py-1 {p === 0 ? 'rounded-t-lg' : ''}  {p === items.length - 1
									? 'rounded-b-lg'
									: ''} hover:cursor-pointer hover:bg-gray-400"
								onclick={() => {
									openm = true;
								}}>{i[1]}</a
							>
						{:else if i[1] === 'Arsipkan'}
							<a
								href={i[2]}
								class="w-full px-4 py-1 {p === 0 ? 'rounded-t-lg' : ''}  {p === items.length - 1
									? 'rounded-b-lg'
									: ''} hover:cursor-pointer hover:bg-gray-400"
								onclick={() => {
									deleteD = true;
								}}>{i[1]}</a
							>
						{:else if i[1] === 'Ubah Tugas'}
							<a
								href={i[3]}
								class="w-full px-4 py-1 {p === 0 ? 'rounded-t-lg' : ''}  {p === items.length - 1
									? 'rounded-b-lg'
									: ''} hover:cursor-pointer hover:bg-gray-400"
								onclick={() => {
									openUT = true;
								}}>{i[1]}</a
							>
						{:else if i[2] === 'Bukti Laporan'}
							<a
								href={i[3]}
								class="w-full px-4 py-1 {p === 0 ? 'rounded-t-lg' : ''}  {p === items.length - 1
									? 'rounded-b-lg'
									: ''} hover:cursor-pointer hover:bg-gray-400"
								onclick={() => {
									openBL = true;
								}}>{i[1]}</a
							>
						{:else}
							<a
								href={i[4]}
								class="w-full px-4 py-1 {p === 0 ? 'rounded-t-lg' : ''}  {p === items.length - 1
									? 'rounded-b-lg'
									: ''} hover:cursor-pointer hover:bg-gray-400"
								onclick={toglemodal}>{i[1]}</a
							>
						{/if}
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
{@render popup?.()}

<!-- <Modal {pop} {successText} {data} {text} {link}></Modal> -->
{#if openGelar}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
		<HistoryPopUp title="History Gelar" bind:value={openGelar} data={dataG} {header}></HistoryPopUp>
	</div>
{/if}
{#if openBintang}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
		<HistoryPopUp title="History Bintang Jasa" bind:value={openBintang} data={dataG} {header}
		></HistoryPopUp>
	</div>
{/if}
{#if openUT}
	<form
		action="?/ubahTugas"
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					success = true;

					let timer: number;
					timer = setTimeout(() => {
						openUT = false;
						success = false;
					}, 3000);
				}
				if (result.type === 'failure') {
					UT_errors = result.data?.errors;
				}
			};
		}}
	>
		<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
			<TambahTugas
				errors={UT_errors}
				bind:value={openUT}
				text="Ubah Tugas"
				successText="Tugas Berhasil Diubah"
			></TambahTugas>
		</div>
	</form>
{/if}
{#if openBL}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
		<BuktiLaporan bind:value={openBL} text="Bukti Laporan"></BuktiLaporan>
	</div>
{/if}
{#if openm}
	<TambahMasterData selectm={ubahm} bind:value={openm} text="Ubah {ubahm}" {data}
	></TambahMasterData>
{/if}
<!-- onclick={() => {
    if (open) {
        dispatcher('close');
        open = false;
    } else {
        open = true;
    }
}} -->
<!-- {#if success}
	<SuccessModal text="Berhasil Diubah"></SuccessModal>
{/if} -->
