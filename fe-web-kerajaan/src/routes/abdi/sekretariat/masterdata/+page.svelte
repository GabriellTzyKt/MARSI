<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import TambahMasterData from '$lib/popup/TambahMasterData.svelte';
	import Table from '$lib/table/Table.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import { page } from '$app/stores';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';

	let { data } = $props();
	let openModal = $state(false);
	let selected = $state('Gelar');
	let button = ['Gelar', 'Jenis Situs', 'Kategori Situs', 'Penghargaan', 'Wisata', 'Jenis Aset'];
	let loading = $state(false);
	let success = $state(false);
	let error = $state();
	let editMode = $state(false);
	let currentItem = $state(null);
	let keyword = $state('');
	let entries = $state(8);
	let currPage = $state(1);
	let timer: number;

	function select(item) {
		selected = item;
		currPage = 1;
		keyword = '';
	}
	function handleEdit(id) {
		let item = getData();
		item = item.find((x) => x[getIdField()] === id);
		console.log(item);
		if (item) {
			openEdit(item);
		}
	}

	let showDeleteModal = $state(false);
	let itemToDelete = $state(null);

	function handleDelete(id) {
		let item = getData();
		itemToDelete = item.find((x) => x[getIdField()] === id);
		if (itemToDelete) {
			showDeleteModal = true;
		}
	}

	// async function confirmDelete() {
	// 	if (!itemToDelete) return;

	// 	loading = true;
	// 	try {
	// 		const res = await fetch(`/master-data/delete`, {
	// 			method: 'POST',
	// 			headers: { 'Content-Type': 'application/json' },
	// 			body: JSON.stringify({
	// 				id: itemToDelete[getIdField()],
	// 				type: getTypeValue()
	// 			})
	// 		});
	// 		const result = await res.json();
	// 		handleSubmit(result);
	// 	} catch (err) {
	// 		error = 'Gagal menghapus data';
	// 		loading = false;
	// 	}
	// 	showDeleteModal = false;
	// 	itemToDelete = null;
	// }
	// Get data based on selected category
	function getData() {
		switch (selected) {
			case 'Penghargaan':
				return data.penghargaan || [];
			case 'Jenis Situs':
				return data.jenisSitus || [];
			case 'Jenis Aset':
				return data.jenisAset || [];
			case 'Kategori Situs':
				return data.kategoriSitus || [];
			case 'Wisata':
				return data.wisata || [];
			case 'Gelar':
				// Mock data for Gelar since API isn't ready
				return data.gelar || [];
			case 'Bintang Jasa':
				return [];
			case 'Jabatan Acara':
				return [];
			case 'Jabatan Organisasi':
				return [];
			default:
				return [];
		}
	}

	// Filter data based on keyword
	function filterData(items) {
		if (!keyword) return items;

		return items.filter((item) => {
			const searchField = getSearchField();
			const fieldValue = item[searchField] || '';
			return fieldValue.toLowerCase().includes(keyword.toLowerCase());
		});
	}

	// Get the field to search based on selected category
	function getSearchField() {
		switch (selected) {
			case 'Penghargaan':
				return 'nama_penghargaan';
			case 'Jenis Situs':
				return 'jenis_situs';
			case 'Jenis Aset':
				return 'nama_jenis';
			case 'Kategori Situs':
				return 'nama_kategori';
			case 'Wisata':
				return 'nama_wisata';
			case 'Gelar':
				return 'nama_gelar';
			case 'Bintang Jasa':
				return 'nama_bintang_jasa';
			case 'Jabatan Acara':
				return 'nama_jabatan_acara';
			case 'Jabatan Organisasi':
				return 'nama_jabatan_organisasi';
			default:
				return '';
		}
	}

	// Get ID field name based on selected category
	function getIdField() {
		switch (selected) {
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
			case 'Bintang Jasa':
				return 'id_bintang_jasa';
			case 'Jabatan Acara':
				return 'id_jabatan_acara';
			case 'Jabatan Organisasi':
				return 'id_jabatan_organisasi';
			default:
				return '';
		}
	}

	// Get type value for form submission
	function getTypeValue() {
		switch (selected) {
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
			case 'Bintang Jasa':
				return 'bintangJasa';
			case 'Jabatan Acara':
				return 'jabatanAcara';
			case 'Jabatan Organisasi':
				return 'jabatanOrganisasi';
			default:
				return '';
		}
	}

	// Get name field for the current item type
	function getNameField() {
		switch (selected) {
			case 'Penghargaan':
				return 'nama_penghargaan';
			case 'Jenis Situs':
				return 'jenis_situs';
			case 'Jenis Aset':
				return 'nama_jenis';
			case 'Kategori Situs':
				return 'nama_kategori';
			case 'Wisata':
				return 'nama_wisata';
			case 'Gelar':
				return 'nama_gelar';
			case 'Bintang Jasa':
				return 'nama_bintang_jasa';
			case 'Jabatan Acara':
				return 'nama_jabatan_acara';
			case 'Jabatan Organisasi':
				return 'nama_jabatan_organisasi';
			default:
				return '';
		}
	}

	// Paginate data
	function paginateData(items) {
		const filtered = filterData(items);
		const start = (currPage - 1) * entries;
		const end = start + entries;
		return filtered.slice(start, end);
	}

	// Calculate total pages
	let totalPages = $derived(Math.ceil(filterData(getData()).length / entries));
	let totalItems = $derived(filterData(getData()).length);

	// Get display data
	let displayData = $derived(paginateData(getData()));

	// Get table headers based on selected category
	function getTableHeaders() {
		switch (selected) {
			case 'Penghargaan':
				return [
					['nama_penghargaan', 'Penghargaan'],
					['children', 'Aksi']
				];
			case 'Jenis Situs':
				return [
					['jenis_situs', 'Jenis Situs'],
					['children', 'Aksi']
				];
			case 'Jenis Aset':
				return [
					['nama_jenis', 'Jenis Aset'],
					['children', 'Aksi']
				];
			case 'Kategori Situs':
				return [
					['nama_kategori', 'Kategori Situs'],
					['children', 'Aksi']
				];
			case 'Wisata':
				return [
					['nama_wisata', 'Wisata'],
					['children', 'Aksi']
				];
			case 'Gelar':
				return [
					['nama_gelar', 'Nama Gelar'],
					['level', 'Level'],
					['children', 'Aksi']
				];
			case 'Bintang Jasa':
				return [
					['nama_bintang_jasa', 'Bintang Jasa'],
					['children', 'Aksi']
				];
			case 'Jabatan Acara':
				return [
					['nama_jabatan_acara', 'Jabatan Acara'],
					['children', 'Aksi']
				];
			case 'Jabatan Organisasi':
				return [
					['nama_jabatan_organisasi', 'Jabatan Organisasi'],
					['children', 'Aksi']
				];
			default:
				return [];
		}
	}

	// Open edit modal
	function openEdit(item) {
		currentItem = item;
		editMode = true;
		openModal = true;
	}

	// Open add modal
	function openAdd() {
		currentItem = null;
		editMode = false;
		openModal = true;
	}

	// Handle form submission
	function handleSubmit(result) {
		loading = false;
		if (result.type === 'success') {
			success = true;
			error = '';
			clearTimeout(timer);
			invalidateAll();
			timer = setTimeout(() => {
				success = false;
				openModal = false;
			}, 3000);
		} else if (result.type === 'failure') {
			error = result?.data?.error || 'An error occurred';
		}
	}
</script>

<div class="container mx-auto p-4">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Master Data</h1>
		<div class="flex items-center gap-2">
			<span>Sri Apriliani</span>
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
				<span>SA</span>
			</div>
		</div>
	</div>

	<div class="mb-6 flex flex-wrap gap-2">
		{#each button as btn}
			<button
				class="rounded-full px-4 py-2 font-medium transition-colors"
				class:bg-[#00A3FF]={selected === btn}
				class:text-white={selected === btn}
				class:bg-gray-200={selected !== btn}
				onclick={() => select(btn)}
			>
				{btn}
			</button>
		{/each}
	</div>

	<div class="mb-6 flex flex-col justify-between gap-4 md:flex-row">
		<button
			class="flex items-center gap-2 rounded-md bg-[#00A3FF] px-4 py-2 font-medium text-white hover:bg-blue-600"
			onclick={openAdd}
		>
			<span>+</span> Tambah Data
		</button>

		<div class="flex items-center gap-4">
			<div class="relative">
				<input
					type="text"
					class="rounded-md border border-gray-300 px-4 py-2 pr-10 focus:border-blue-500 focus:outline-none"
					placeholder={`Cari ${selected}...`}
					bind:value={keyword}
				/>
				<div class="absolute inset-y-0 right-0 flex items-center pr-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-5 text-gray-400"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<span>Show</span>
				<select
					bind:value={entries}
					class="rounded-md border border-gray-300 px-2 py-2 focus:border-blue-500 focus:outline-none"
				>
					<option value="8">8</option>
					<option value="10">10</option>
					<option value="25">25</option>
					<option value="50">50</option>
					<option value="100">100</option>
				</select>
				<span>entries</span>
			</div>
		</div>
	</div>

	{#if loading}
		<div class="flex justify-center py-8">
			<Loader />
		</div>
	{:else}
		<div class="overflow-x-auto rounded-lg border border-gray-200 bg-white">
			<Table table_header={getTableHeaders()} table_data={displayData}>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<DropDownNew
							text={`Apakah yakin ingin mengarsipkan ${data.nama_anggota}?`}
							items={[
								{
									label: 'Edit',
									action: () => handleEdit(data[getIdField()])
								},
								{
									label: 'Hapus',
									action: () => handleDelete(data[getIdField()])
								}
							]}
							id={`id-${index}`}
						></DropDownNew>
					{/if}
				{/snippet}
			</Table>
		</div>

		<Pagination bind:currPage bind:entries {totalItems}></Pagination>
	{/if}

	{#if openModal}
		<TambahMasterData bind:open={openModal} {editMode} type={selected} {currentItem} />
	{/if}
</div>
{#if showDeleteModal}
	<form
		action="?/hapus"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					invalidateAll();
					clearTimeout(timer);
					timer = setTimeout(() => {
						success = false;
						showDeleteModal = false;
					}, 3000);
				} else if (result.type === 'failure') {
					error = result.data?.errors;
				}
			};
		}}
	>
		<input type="hidden" name="id" value={itemToDelete?.[getIdField()]} />
		<input type="hidden" name="type" value={getTypeValue()} />

		<DeleteModal
			bind:value={showDeleteModal}
			text="Apakah yakin ingin menghapus data ini?"
			successText="Data berhasil dihapus!"
			choose="delete"
		/>
	</form>
{/if}
{#if success}
	<SuccessModal text="Data berhasil dihapus!"></SuccessModal>
{/if}
