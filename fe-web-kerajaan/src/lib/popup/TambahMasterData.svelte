<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
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
	import { enhance } from '$app/forms';
	import { createEventDispatcher } from 'svelte';
	import { env } from '$env/dynamic/public';

	const dispatch = createEventDispatcher();

	let {
		open = $bindable(false),
		editMode = $bindable(false),
		currentItem = $bindable(null),
		type = $bindable(''),
		loading = $bindable(false),
		success = $bindable(false),
		error = $bindable()
	} = $props();

	let nama = $state('');
	let levelOptions = $state<number[]>([]);
	let singkatan = $state('');
	let level = $state<number>(1);
	console.log(type);
	async function fetchPenghargaanLevels() {
		try {
			const res = await fetch(`${env.PUBLIC_URL_KERAJAAN}/gelar?limit=1000`); // Ganti dengan endpoint yang benar
			let penghargaanList = await res.json();
			penghargaanList = penghargaanList.filter(
				(item) => item.deleted_at == null || !item.deleted_at
			);
			const count = penghargaanList.length;
			console.log('Gelar', penghargaanList);
			console.log('Count:', count);
			levelOptions = Array.from({ length: count + 1 }, (_, i) => i + 1);
			// console.log('Level Option', levelOptions);
			// console.log('Level', level);
			// Saat edit, isi level sesuai currentItem, jika tidak default ke count+1
			if (editMode && currentItem?.level) {
				level = currentItem.level;
			} else {
				level = count + 1;
			}
		} catch (e) {
			levelOptions = [1];
			level = 1;
		}
	}

	$effect(() => {
		if (open && editMode && currentItem) {
			// Set name based on item type
			if (type === 'Gelar') {
				fetchPenghargaanLevels();
				nama = currentItem.nama_gelar || '';
				singkatan = currentItem.singkatan || '';
			} else if (type === 'Jenis Situs') {
				nama = currentItem.jenis_situs || '';
			} else if (type === 'Jenis Aset') {
				nama = currentItem.nama_jenis || '';
			} else if (type === 'Kategori Situs') {
				nama = currentItem.nama_kategori || '';
			} else if (type === 'Wisata') {
				nama = currentItem.nama_wisata || '';
			} else if (type === 'Penghargaan') {
				nama = currentItem.nama_penghargaan;
			}
		} else if (open && !editMode) {
			if (type === 'Gelar') {
				fetchPenghargaanLevels();
			}
			// Reset form for new item
			nama = '';
		}
	});

	function getTypeValue() {
		switch (type) {
			case 'Gelar':
				return 'gelar';
			case 'Penghargaan':
				return 'penghargaan';
			case 'Jenis Situs':
				return 'jenisSitus';
			case 'Jenis Aset':
				return 'jenisAset';
			case 'Kategori Situs':
				return 'kategoriSitus';
			case 'Wisata':
				return 'wisata';
			case 'Gelar':
				return 'gelar';
			default:
				return '';
		}
	}

	function getIdField() {
		switch (type) {
			case 'Gelar':
				return 'id_gelar';
			case 'Penghargaan':
				return 'id_penghargaan';
			case 'Jenis Situs':
				return 'id_jenis_situs';
			case 'Jenis Aset':
				return 'id_jenis_aset';
			case 'Kategori Situs':
				return 'id_kategori_situs';
			case 'Wisata':
				return 'id_wisata';
			case 'Gelar':
				return 'id_gelar';
			default:
				return '';
		}
	}

	function close() {
		open = false;
		dispatch('close');
	}
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
		<div class="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-bold">
					{editMode ? `Edit ${type}` : `Tambah ${type}`}
				</h2>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button class="text-gray-500 hover:text-gray-700" onclick={close}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
					</svg>
				</button>
			</div>

			{#if success}
				<div class="mb-4 rounded-md bg-green-100 p-4 text-green-700">
					Data berhasil {editMode ? 'diperbarui' : 'ditambahkan'}!
				</div>
			{/if}

			{#if error}
				<div class="mb-4 rounded-md bg-red-100 p-4 text-red-700">
					{error}
				</div>
			{/if}

			<form
				method="POST"
				action={editMode ? '?/ubah' : '?/tambah'}
				use:enhance={() => {
					loading = true;
					return ({ result }) => {
						loading = false;
						if (result.type === 'success') {
							success = true;
							invalidateAll();
							setTimeout(() => {
								success = false;
								close();
							}, 3000);
							error = '';
						} else if (result.type === 'failure') {
							error = result?.data?.error || 'An error occurred';
						}
					};
				}}
			>
				<input type="hidden" name="type" value={getTypeValue()} />
				{#if editMode && currentItem}
					<input type="hidden" name="id" value={currentItem[getIdField()]} />
				{/if}

				<div class="mb-4">
					<label for="nama" class="mb-2 block font-medium">Nama {type}</label>
					<input
						type="text"
						id="nama"
						name="nama"
						bind:value={nama}
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#FFA600] focus:outline-none"
						required
					/>
				</div>
				{#if type === 'Gelar'}
					<label for="singkatan" class="mb-2 block font-medium">Singkatan {type}</label>
					<input
						type="text"
						id="singkatan"
						name="singkatan"
						bind:value={singkatan}
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#FFA600] focus:outline-none"
						required
					/>
					<label for="level" class="mb-2 block font-medium">Level</label>
					<select
						id="level"
						name="level"
						bind:value={level}
						class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#FFA600] focus:outline-none"
						required
					>
						{#each levelOptions as opt}
							<option value={opt}>{opt}</option>
						{/each}
					</select>
				{/if}

				<div class="flex justify-end gap-2">
					<button
						type="button"
						class="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
						onclick={close}
						disabled={loading}
					>
						Batal
					</button>
					<button
						type="submit"
						class="rounded-md bg-[#FFA600] px-4 py-2 font-medium text-white hover:bg-[#E69500]"
						disabled={loading}
					>
						{#if loading}
							<span class="flex items-center gap-2">
								<svg
									class="size-4 animate-spin"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										class="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										stroke-width="4"
									></circle>
									<path
										class="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Loading...
							</span>
						{:else}
							{editMode ? 'Simpan' : 'Tambah'}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}
{#if success}
	<SuccessModal text="Data berhasil {editMode ? 'diperbarui' : 'ditambahkan'}!"></SuccessModal>
{/if}
