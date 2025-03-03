<script lang="ts">
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';
	import {
		dummyGelar,
		dummyBintangJasa,
		dummyJenisSitus,
		dummyPenghargaan,
		dummyKategoriSitus
	} from '$lib/store';
	import { get } from 'svelte/store';

	let { value = $bindable(), text = '', selectm = 'Gelar', data = null } = $props();
	let open = $state(false);
	let nama = $state(data ? getNamaDariData(data, selectm) : '');
	let isEditMode = data !== null;
	let timer: number;

	function getNamaDariData(data, selectm) {
		if (!data) return '';
		if (selectm === 'Gelar') return data.gelar;
		if (selectm === 'Bintang Jasa') return data.nama;
		if (selectm === 'Jenis Situs') return data.jenis;
		if (selectm === 'Penghargaan') return data.penghargaan;
		if (selectm === 'Kategori Situs') return data.kategori;
		return '';
	}

	function updateData(store) {
		store.update((list) =>
			list.map((item) => {
				if (item.id === data.id) {
					return { ...item, nama }; // Perbarui nama di objek
				}
				return item;
			})
		);
	}

	function addOrUpdateData() {
		if (nama.trim() === '') return;

		if (isEditMode) {
			// Mode Edit
			if (selectm === 'Gelar') updateData(dummyGelar);
			else if (selectm === 'Bintang Jasa') updateData(dummyBintangJasa);
			else if (selectm === 'Jenis Situs') updateData(dummyJenisSitus);
			else if (selectm === 'Penghargaan') updateData(dummyPenghargaan);
			else if (selectm === 'Kategori Situs') updateData(dummyKategoriSitus);

			// Pastikan data diperbarui
			data = { ...data, nama };
		} else {
			// Mode Tambah
			if (selectm === 'Gelar') {
				dummyGelar.update((list) => [...list, { id: list.length + 1, gelar: nama }]);
			} else if (selectm === 'Bintang Jasa') {
				dummyBintangJasa.update((list) => [...list, { id: list.length + 1, nama }]);
			} else if (selectm === 'Jenis Situs') {
				dummyJenisSitus.update((list) => [...list, { id: list.length + 1, jenis: nama }]);
			} else if (selectm === 'Penghargaan') {
				dummyPenghargaan.update((list) => [...list, { id: list.length + 1, penghargaan: nama }]);
			} else if (selectm === 'Kategori Situs') {
				dummyKategoriSitus.update((list) => [...list, { id: list.length + 1, kategori: nama }]);
			}
		}

		console.log('Data berhasil diproses:', data);
	}

	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			addOrUpdateData();
			open = false;
			value = false;
			goto('/abdi/sekretariat/masterdata');
		}, 3000);
	}
</script>

<div
	class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/75"
	transition:fade={{ duration: 100 }}
>
	<div
		class="relative m-8 flex max-h-full w-full max-w-[600px] flex-col overflow-y-auto rounded-lg border bg-white p-6"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute right-0 top-0 me-4 mt-7 cursor-pointer p-2"
			onclick={() => {
				value = false;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-8"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</div>
		<div class="my-4 flex justify-self-start">
			<p class=" text-xl font-[500]">{isEditMode ? 'Edit ' + selectm : 'Tambah ' + selectm}</p>
		</div>
		<div class="flex w-full flex-col">
			<div>
				<p class="text-sm">Nama {selectm}</p>
			</div>
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="text"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="Nama {selectm}"
						bind:value={nama}
					/>
				</div>
			</div>
		</div>
		<div class="mt-4 flex w-full lg:justify-end">
			<button
				class="w-full cursor-pointer rounded-lg bg-green-500 px-4 py-2 text-white lg:w-auto"
				type="submit"
				onclick={setTimer}>{isEditMode ? 'Update' : 'Tambah'}</button
			>
		</div>
	</div>
</div>
{#if open}
	<SuccessModal text={isEditMode ? 'Berhasil Diperbarui' : 'Berhasil Ditambah'}></SuccessModal>
{/if}
