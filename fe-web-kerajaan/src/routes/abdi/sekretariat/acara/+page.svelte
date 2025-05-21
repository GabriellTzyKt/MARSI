<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';

	let { data } = $props();
	let entries = $state(10);
	let keyword = $state('');
	let currPage = $state(1);
	let success = $state(false);
	let errors = $state();
	let loading = $state(false);
	let deleteD = $state(false);
	let selectedItem = $state(null);

	// Check for delete parameter in URL
	$effect(() => {
		const deleteId = page.url.searchParams.get('delete');
		if (deleteId) {
			// Find the item with this ID
			const itemToDelete = data.data.find((item) => item.id_acara.toString() === deleteId);
			if (itemToDelete) {
				selectedItem = itemToDelete;
				deleteD = true;
				// console.log('Found item to delete from URL:', selectedItem);
			}
		} else {
			// console.error('Item with ID', deleteId, 'not found');
		}
	});

	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_acara?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.lokasi?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.penanggungjawab?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jenis_acara?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.kapasitas?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.status?.toLowerCase().includes(keyword.toLowerCase())
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
		if (entries < 0) {
			entries = 0;
		}
	});

	let resData = $derived(pagination(data.data));
	// Add this derived value to track the total filtered items
	let filteredTotal = $derived(filterD(data.data).length);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="flex w-full flex-col">
	<div class=" mx-4 flex flex-col justify-center gap-4 lg:flex-row lg:justify-between">
		<button class="bg-badran-bt rounded-lg px-3 py-2 text-white" onclick={() => goto('acara/buat')}
			>+Tambah Data</button
		>
		<div class="flex flex-col items-center justify-center gap-2 lg:flex-row lg:justify-start">
			<!-- select -->
			<select
				name="Organisasi"
				id=""
				value="Organisasi"
				placeholder="cari organisasi"
				class="rounded-md border px-3 py-2 focus:outline-none"
			>
				<option value="organisasi">Organisasi</option>
				<option value="Komunitas">Komunitas</option>
				<option value="Abdi">Abdi</option>
				<option value="organisasi">Organisasi</option>
			</select>
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
	<div class="mx-4 flex flex-col">
		<Table
			table_header={[
				['nama_acara', 'Nama Acara'],
				['waktu_mulai', 'Tanggal Acara'],
				['alamat_acara', 'Lokasi'],
				['nama_penanggung_jawab', 'Penanggung Jawab'],
				['jenis_acara', 'Jenis Acara'],
				['kapasitas_acara', 'Kapasitas'],
				['children', 'Status'],
				['children', 'Aksi']
			]}
			table_data={resData}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDownNew
						text={`Apakah yakin ingin mengarsipkan ${data.nama_acara}?`}
						items={[
							{
								label: 'Detail',
								action: () => goto(`/abdi/sekretariat/acara/detail/${data.id_acara}`)
							},
							{
								label: 'Edit',
								action: () => goto(`/abdi/sekretariat/acara/edit/${data.id_acara}`)
							},
							{
								label: 'Laporan',
								action: () => goto(`/abdi/sekretariat/acara/laporan/${data.id_acara}`)
							},
							{
								label: 'Non Aktifkan',
								action: () => goto(`/abdi/sekretariat/acara?delete=${data.id_acara}`)
							}
						]}
						id={`id-${index}`}
						{data}
					></DropDownNew>
				{/if}
				{#if header === 'Status'}
					<Status status={data.status}></Status>
				{/if}
			{/snippet}
		</Table>
		{#if resData.length === 0}
			<p class="flex items-center justify-center text-center">No data available</p>
		{/if}
		<Pagination bind:currPage bind:entries totalItems={filteredTotal}></Pagination>
	</div>
	{#if errors}
		<div class="flex">
			<p class="text-red-500">{errors}</p>
		</div>
	{/if}
</div>
{#if deleteD && selectedItem}
	<form
		action="?/delete"
		method="post"
		use:enhance={() => {
			loading = true;

			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					deleteD = false;
					// Clear the URL parameter after successful deletion
					goto('/abdi/sekretariat/acara', { replaceState: true });
					setTimeout(() => {
						success = false;
						invalidateAll();
					}, 3000);
				}
				if (result.type === 'failure') {
					console.log(result.data?.errors);
					errors = result.data?.errors;
				}
			};
		}}
	>
		<input type="hidden" name="id_acara" value={selectedItem.id_acara} />

		<DeleteModal
			bind:value={deleteD}
			text="apa yakin ingin menghapus acara ini?"
			successText="berhasil dihapus"
			choose="delete"
		></DeleteModal>
	</form>
	<!-- <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white p-6 rounded-lg max-w-md w-full">
			<h3 class="text-lg font-bold mb-4">Konfirmasi Hapus</h3>
			<p>Apa yakin ingin menghapus acara "{selectedItem.nama_acara}" (ID: {selectedItem.id_acara})?</p>
			
			<form
				action="?/delete"
				method="post"
				use:enhance={() => {
					loading = true;
					console.log('Attempting to delete item with ID:', selectedItem.id_acara);

					return async ({ result }) => {
						loading = false;
						if (result.type === 'success') {
							success = true;
							deleteD = false;
							// Clear the URL parameter after successful deletion
							goto('/abdi/sekretariat/acara', { replaceState: true });
							setTimeout(() => {
								success = false;
								invalidateAll();
							}, 3000);
						}
						if (result.type === 'failure') {
							console.log(result.data?.errors);
							errors = result.data?.errors;
						}
					};
				}}
			>
				<input type="hidden" name="id_acara" value={selectedItem.id_acara} />
				
				<div class="flex justify-end gap-2 mt-4">
					<button 
						type="button" 
						class="px-4 py-2 bg-gray-200 rounded"
						on:click={() => {
						dataI	deleteD = false;
							selectedItem = null;
							// Clear the URL parameter when canceling
							goto('/abdi/sekretariat/acara', { replaceState: true });
						}}
					>
						Batal
					</button>
					<button type="submit" class="px-4 py-2 bg-red-500 text-white rounded">
						Hapus
					</button>
				</div>
			</form>
		</div>
	</div> -->
{/if}

{#if success}
	<SuccessModal text="berhasil dihapus"></SuccessModal>
{/if}
