<script lang="ts">
	import Table from '$lib/table/Table.svelte';
	import { dummydata, dummyDokumen } from '$lib/dummy';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import CustomBtn from '../../masterData/CustomBtn.svelte';
	import { slide } from 'svelte/transition';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import KerajaanPopup from '$lib/popup/KerajaanPopup.svelte';
	import { enhance } from '$app/forms';
	import SModal from '$lib/popup/SModal.svelte';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { easeBack } from 'd3';

	let { data } = $props();
	console.log(data.dataKerajaan);
	console.log('GELAR : ', data.gelar);
	let dataanggota = $state(data.anggotaKerajaan);
	let datagelar = $state(data.gelar);

	console.log('Anggota : ', data.anggotaKerajaan);
	// import {dropId} from './DropDown.svelte'
	let success = $state(false);

	let currPage = $state(1);
	let keyword = $state('');
	let entries = $state(10);
	let errors = $state();
	let del = $state(false);
	let edit = $state(false);
	let dt = $state(data.dataKerajaan);
	let tambah = $state(false);
	let selectedKerajaanId = $state(null);
	let loading = $state(false);
	let selectedID = $state();
	let deleteModal = $state(false);

	$effect(() => {
		if (!edit || !tambah) {
			errors = null;
		}

		const urlParams = new URLSearchParams(page.url.search);
		const deletedId = urlParams.get('delete');

		if (deletedId) {
			deleteModal = true;
			console.log('deletedId', deletedId);
			selectedID = deletedId;
		}
	});

	// const {data} = $props()
	// console.log(data.tabel)
	function filterData(data: any[]) {
		return data?.sort((a, b) => a.id_kerajaan - b.id_kerajaan).filter(
			(item) =>
				item?.nama_kerajaan?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.alamat_kerajaan?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal_berdiri?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.nama_era?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal_berdiri?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.raja_sekarang?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function pagination(data: any[]) {
		const filter = filterData(data);
		const start = (currPage - 1) * entries;
		const end = start + entries;
		return filter?.slice(start, end);
	}
	let resData = $derived(pagination(data.dataKerajaan));
	let sortedKerajaan = resData.sort((a, b) => a.id_kerajaan - b.id_kerajaan);
	let total_pages = $derived(Math.ceil(filterData(data.dataKerajaan).length / entries));
	$inspect(resData	)
	// Reset to first page when entries or keyword changes
	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
		if (entries <= 1) {
			entries = 1;
		}
	});

	// Function to reset form state
	function resetFormState() {
		tambah = false;
		selectedKerajaanId = null;
		errors = null;
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader text="Processing..."></Loader>
{/if}
<div class="mt-20 flex w-full flex-col xl:mt-0">
	<div class=" flex flex-col justify-center xl:mt-0 xl:flex-row xl:justify-between">
		<div class=" col-start-1 mb-4 flex flex-row items-center justify-center xl:mb-0">
			<a href="/admin/keanggotaan/daftaranggota/tambahanggota"
				><button class=" custom-button bg-customKrem px-6 py-2"> +Tambah Kerajaan </button></a
			>
		</div>
		<div class="col-span-2 col-end-5 flex flex-row items-center justify-center">
			<div>
				<input
					type="text"
					name=""
					id=""
					placeholder="search.."
					bind:value={keyword}
					class="rounded-md shadow-inner"
				/>
			</div>
			<div class="me-4 ms-2">
				<p>Show</p>
			</div>
			<div class="text-center">
				<input type="number" name="" id="" bind:value={entries} class="rounded-md shadow-inner" />
			</div>
			<div class="mx-2">
				<p>entries</p>
			</div>
		</div>
	</div>
	{#if !data.dataKerajaan}
		Memuat...
	{/if}
	<Table
		table_header={[
			['nama_kerajaan', 'Nama Kerajaan'],
			['alamat_kerajaan', 'Alamat Kerajaan'],
			['tanggal_berdiri', 'Tanggal Berdiri'],
			['nama_era', 'Era'],
			['deskripsi_kerajaan', 'Detail'],
			['jenis_kerajaan_nama', 'Jenis Kerajaan'],
			['raja_sekarang', 'Nama Raja'],
			// ['bendera_kerajaan', 'Bendera & Lambang Kerajaan', 'custom'],
			['children', 'Aksi']
		]}
		table_data={resData}
		isdrop={true}
	>
		{#snippet children({ header, data, index })}
			{console.log(data)}
			{#if header === 'Aksi'}
				<DropDown
					text="apakah yakin ingin mengarsip anggota {data.nama} ini?"
					successText={`Anggota ${data.nama} berhasil diarsipkan!`}
					link="/admin/keanggotaan/daftaranggota"
					{index}
					items={[['Arsipkan', `/admin/keanggotaan/daftaranggota?delete=${data.id_kerajaan}`]]}
					tipe="anggota"
					id={`id-anggota-${index}`}
					{data}
				></DropDown>
			{/if}
		{/snippet}

		{#snippet custom({ header, data })}
			{#if header === 'Bendera & Lambang Kerajaan'}
				<div class="flex items-center gap-2">
					{#if data.url_bendera_kerajaan}
						<img
							src={data.url_bendera_kerajaan}
							alt="Bendera"
							class="h-12 w-12 rounded border object-cover"
						/>
					{/if}
					{#if data.url_lambang_kerajaan}
						<img
							src={data.url_lambang_kerajaan}
							alt="Lambang"
							class="h-12 w-12 rounded border object-cover"
						/>
					{/if}
				</div>
			{/if}
		{/snippet}

		{#snippet details({ data })}
			<div class=" me-4 ms-4 mt-4 flex flex-col" transition:slide={{ duration: 300 }}>
				<div class="flex justify-between">
					<div>
						<p class="text-xl font-[600]">Data Kerajaan</p>
					</div>
					<div>
						<button
							class="rounded-xl bg-orange-500 px-6 py-2 text-white"
							onclick={() => {
								selectedKerajaanId = data.id_kerajaan;
								tambah = true;
							}}
						>
							+Tambah data
						</button>
					</div>
				</div>
				<Table
					table_header={[
						['nama_anggota', 'Nama Anggota', 'justify-start flex grow'],
						['children', 'Aksi', 'text-right pe-48']
					]}
					table_data={dataanggota?.find((item: any) => item.id_kerajaan === data.id_kerajaan)
						?.anggota || []}
				>
					{#snippet children({ header, data, index })}
						{#if header === 'Aksi'}
							<CustomBtn dataGelar={datagelar} {data} tipe="anggota" id={data.id_kerajaan}
							></CustomBtn>
						{/if}
					{/snippet}
				</Table>
			</div>
		{/snippet}
	</Table>

	<Pagination bind:currPage bind:entries totalItems={filterData(data.dataKerajaan).length}
	></Pagination>
</div>

{#if deleteModal}
	<form
		action="?/hapusKerajaan"
		method="post"
		use:enhance={() => {
			const idToDelete = selectedID;
			console.log('Form submitted with ID from URL:', idToDelete);
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					console.log('Success deleting ID:', idToDelete);
					success = true;
					// Remove the delete parameter from URL
					goto('/admin/keanggotaan/daftaranggota', { replaceState: true });
					setTimeout(() => {
						success = false;
						deleteModal = false;
					}, 3000);
				} else {
					console.error('Failed to delete ID:', idToDelete, result);
				}
			};
		}}
	>
		<input type="hidden" name="id_kerajaan" value={selectedID} />

		<DeleteModal
			bind:value={selectedID}
			successText="Berhasil Diarsip"
			text="Apakah yakin ingin diarsip?"
			choose="arsip"
		></DeleteModal>
	</form>
{/if}

{#if del}
	<DeleteModal
		bind:value={del}
		successText="Berhasil Diarsip"
		text="Apakah yakin ingin diarsip?"
		choose="arsip"
	></DeleteModal>
{/if}
{#if edit}
	<form
		action="?/ubahKerajaan"
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					success = true;
					await invalidateAll().then(() => {
						setTimeout(() => {
							edit = false;
							success = false;
						}, 3000);
					});
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
				}
			};
		}}
	>
		<KerajaanPopup bind:value={edit} bind:errors type="Ubah"></KerajaanPopup>
	</form>
{/if}
{#if tambah}
	<form
		action="?/tambahKerajaan"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					await invalidateAll().then(() => {
						setTimeout(() => {
							resetFormState();
							success = false;
						}, 3000);
					});
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
				}
			};
		}}
	>
		<input type="hidden" name="id_kerajaan" value={selectedKerajaanId} />
		<KerajaanPopup
			bind:value={tambah}
			bind:errors
			type="Tambah"
			dataGelar={data.gelar}
			on:close={() => resetFormState()}
		></KerajaanPopup>
	</form>
{/if}
{#if success}
	<SModal text="Sukses!"></SModal>
{/if}

<style>
	.custom-button {
		border: none;

		text-align: center;
		color: black;
		font-weight: bold;
		font-size: 16px;
		border-radius: 5px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
</style>
