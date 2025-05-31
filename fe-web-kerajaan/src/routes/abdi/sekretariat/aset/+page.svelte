<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyAsetKerajaan } from '$lib/dummy';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Picture from '$lib/table/Picture.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import { string } from 'zod';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	let { data } = $props();
	let kategoriAsetOptions = $derived(
		Array.from(new Set((data.data || []).map((item) => item.kategori_aset))).filter(Boolean)
	);
	let selectedKategoriAset = $state('');
	let keyword = $state('');
	let entries = $state(10);
	// console.log(dummyAsetKerajaan);
	let currPage = $state(1);
	let loading = $state(false);
	let deleteD = $state(false);
	let selectedItem = $state();
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				(item?.nama_aset.toLowerCase().includes(keyword.toLowerCase()) ||
					item?.kategori_aset.toLowerCase().includes(keyword.toLowerCase()) ||
					item?.deskripsi.toLowerCase().includes(keyword.toLowerCase())) &&
				(selectedKategoriAset === '' || item.kategori_aset === selectedKategoriAset)
		);
	}
	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
		if (entries <= 1) {
			entries = 1;
		}
	});
	let resData = $derived(pagination(data.data || []));
	let tableData = $derived(data.data || []);
	let success = $state(false);
	// Check for delete parameter in URL
	$effect(() => {
		const deleteId = page.url.searchParams.get('delete');
		if (deleteId) {
			// Find the item with this ID
			const itemToDelete = data.data.find((item) => item.id_aset.toString() === deleteId);
			if (itemToDelete) {
				selectedItem = itemToDelete;
				deleteD = true;
				// console.log('Found item to delete from URL:', selectedItem);
			}
		} else {
			// console.error('Item with ID', deleteId, 'not found');
		}
	});
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="flex w-full flex-col">
	<div class=" flex flex-col lg:flex-row lg:justify-between">
		<button class="bg-badran-bt rounded-lg px-3 py-2 text-white" onclick={() => goto('aset/buat')}
			>+Tambah Aset</button
		>
		<div
			class="mt-4 flex flex-col items-center justify-center gap-2 lg:mt-0 lg:flex-row lg:justify-start"
		>
			<!-- select -->
			<!-- Dropdown filter for jenis_aset -->
			<div class="relative">
				<input
					type="text"
					placeholder="Cari jenis aset..."
					class="rounded-md border px-3 py-2 focus:outline-none"
					bind:value={selectedKategoriAset}
					list="kategoriAsetList"
				/>
				<datalist id="kategoriAsetList">
					<option value="">Semua Kategori</option>
					{#each kategoriAsetOptions as kategori}
						<option value={kategori}>{kategori}</option>
					{/each}
				</datalist>
			</div>
			<!-- cari -->
			<div class="flex items-center rounded-lg border px-2">
				<input
					type="text"
					bind:value={keyword}
					placeholder="Cari.."
					class=" w-full bg-transparent px-2 py-2 focus:outline-none"
				/>

				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button class="text-gray-600 hover:text-gray-800">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
						/>
					</svg>
				</button>
			</div>
			<div><p>Show</p></div>
			<div>
				<input
					type="number"
					class="w-12 rounded-md border py-2 text-center focus:outline-none"
					bind:value={entries}
					name=""
					id=""
				/>
			</div>
			<div>
				<p>entries</p>
			</div>
		</div>
	</div>
	<div class="flex w-full flex-col">
		<Table
			table_header={[
				['nama_aset', 'Nama Aset'],
				['deskripsi', 'Deskripsi'],
				['kategori_aset', 'Jenis Aset'],

				['picture', 'Dokumentasi'],
				['children', 'Aksi']
			]}
			table_data={resData}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text={`Apakah yakin ingin mengarsipkan aset ini?`}
						items={[
							['Ubah', `/abdi/sekretariat/aset/ubah/${data.id_aset}`],
							['children', 'Arsipkan', `/abdi/sekretariat/aset/?delete=${data.id_aset}`]
						]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{/if}
			{/snippet}
			{#snippet picture({ header, data, index })}
				{#if header === 'Dokumentasi'}
					<Picture {data}></Picture>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(data.data).length}></Pagination>
	</div>
</div>
{#if deleteD && selectedItem}
	<form
		action="?/delete"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				if (result.type === 'success') {
					loading = false;
					deleteD = false;
					success = true;

					// Clear URL parameter
					goto('/abdi/sekretariat/aset', { replaceState: true });

					// Show success message for 3 seconds
					setTimeout(() => {
						success = false;
						invalidateAll(); // Refresh data
					}, 3000);
				} else if (result.type === 'failure') {
					loading = false;
					// Handle error - you could add an error state here
					console.error('Delete failed:', result.data?.error);
					alert(result.data?.error || 'Gagal mengarsipkan aset');
				}
			};
		}}
	>
		<input type="hidden" name="id_aset" value={selectedItem.id_aset} />

		<DeleteModal
			bind:value={deleteD}
			text="Apakah Anda yakin ingin mengarsipkan aset ini?"
			successText="Aset berhasil diarsipkan"
			choose="delete"
		></DeleteModal>
	</form>
{/if}
{#if success}
	<SuccessModal text="berhasil dihapus"></SuccessModal>
{/if}
