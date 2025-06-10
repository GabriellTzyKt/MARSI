<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import BuktiLaporan from '$lib/popup/BuktiLaporan.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import TambahTugas from '$lib/popup/TambahTugas.svelte';
	import Pagination from '$lib/table/Pagination.svelte';

	import Search from '$lib/table/Search.svelte';
	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';

	let { data } = $props();
	console.log('data : ', data);
	let dataAmbil = $derived(data.data);
	let situsData = $state(data.situs);
	let isLaporan = $state(false);
	let laporanData = $state();
	console.log(dataAmbil);
	let open = $state(false);
	let success = $state(false);
	let errors = $state();
	let entries = $state(10);
	let keyword = $state('');
	let currPage = $state(1);
	let dataToDelete = $state();
	let deleteModal = $state(false);
	let editData = $state();
	let detailData = $state();
	let modalDetail = $state(false);
	let editModal = $state(false);
	let modalLaporan = $state(false);
	function setLaporan(data: any) {
		laporanData = data;
		modalLaporan = true;
		isLaporan = true;
	}
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_tugas?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.pemberi_tugas?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.anggota_yang_ditugaskan?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal_pemberian?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.deskripsi_tugas?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.status?.toLowerCase().includes(keyword.toLowerCase())
		);
	}

	function deleteID(id: any) {
		console.log('Anda Menghapus tugas : ', id);
		let datahapus = dataAmbil.find((item: any) => item.id_tugas === id).id_tugas;
		dataToDelete = datahapus;
		console.log('Data Yang Dihapus', dataToDelete);
		deleteModal = true;
	}
	function editID(data: any) {
		console.log('Data to edit : ', data);
		editData = data;
		editModal = true;
	}
	function detailID(data: any) {
		console.log(' Data to detail : ', data);
		detailData = data;
		modalDetail = true;
		isLaporan = false;
	}
	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	let resData = $derived(pagination(dataAmbil));

	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
		if (entries < 0) {
			entries = 0;
		}
	});

	$effect(() => {
		if (!open) {
			errors = '';
		}
	});
	let loading = $state(false);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="flex w-full flex-col">
	<div class="mx-4 flex flex-col justify-center gap-4 lg:flex-row lg:justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white"
			onclick={() => {
				open = true;
			}}>+Tambah Data</button
		>
		<div class="flex flex-col items-center justify-center gap-2 lg:flex-row lg:justify-start">
			<!-- select -->

			<!-- cari -->
			<div class="flex items-center rounded-lg border px-2">
				<input
					type="text"
					placeholder="Cari.."
					bind:value={keyword}
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
	<div class="me-4 ms-4 flex flex-col">
		<Table
			table_header={[
				['nama_tugas', 'Nama Tugas'],
				['pemberi_tugas', 'Pemberi Tugas'],
				['penerima_tugas', 'Anggota yang Ditugaskan'],
				['tanggal_mulai', 'Tanggal Pemberian'],
				['deskripsi_tugas', 'Deskripsi Tugas'],

				['children', 'Status'],
				['children', 'Aksi']
			]}
			table_data={resData}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDownNew
						text={`Apakah yakin ingin mengarsipkan ${data.nama_tugas}?`}
						items={[
							{
								label: 'Laporan',
								action: () => setLaporan(data)
							},
							{
								label: 'Detail',
								action: () => detailID(data)
							},
							{
								label: 'Edit',
								action: () => editID(data)
							},
							{
								label: 'Hapus',
								action: () => deleteID(data.id_tugas)
							}
						]}
						id={`id-${index}`}
						data={dataAmbil}
					></DropDownNew>
				{/if}
				{#if header === 'Status'}
					<Status status={data.status_tugas}></Status>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={dataAmbil.length}></Pagination>
	</div>
</div>

{#if open}
	<form
		action="?/tambahTugas"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				loading = false;
				if (result.type === 'success') {
					let timer: number;
					success = true;
					await invalidateAll().then(() => {
						setTimeout(() => {
							open = false;
							success = false;
							errors = null;
						}, 3000);
					});
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
				}
			};
		}}
	>
		<TambahTugas
			bind:value={open}
			text="Tambah Tugas"
			bind:data={situsData}
			{errors}
			userData={data?.userData}
			dataAcara={data?.acaraData}
			successText="Tugas Berhasil Ditambah"
		></TambahTugas>
	</form>
{/if}
{#if deleteModal}
	<form
		action="?/hapusTugas"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					deleteModal = false;
					await invalidateAll();
					setTimeout(() => {
						success = false;
					}, 3000);
				}
				if (result.type === 'failure') {
					console.log(result.data?.errors);
				}
			};
		}}
	>
		<DeleteModal
			bind:value={deleteModal}
			text="Apakah yakin ingin menghapus tugas ini?"
			successText="Tugas berhasil dihapus!"
			choose="delete"
		></DeleteModal>
		<input type="text" name="id_tugas" value={dataToDelete} hidden />
	</form>
{/if}
{#if success}
	<SuccessModal text="Berhasil"></SuccessModal>
{/if}
{#if modalDetail}
	<BuktiLaporan bind:value={modalDetail} data={detailData} bind:isLaporan text="Detail Tugas"
	></BuktiLaporan>
{/if}
{#if modalLaporan}
	<BuktiLaporan bind:value={modalLaporan} data={laporanData} bind:isLaporan text="Detail Tugas"
	></BuktiLaporan>
{/if}
{#if editModal}
	<form
		action="?/ubahTugas"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					editModal = false;
					await invalidateAll().then(() => {
						setTimeout(() => {
							editModal = false;
							success = false;
							errors = null;
						}, 3000);
					});
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
					console.log(result.data?.errors);
				}
			};
		}}
	>
		<TambahTugas
			bind:value={editModal}
			text="Edit Tugas"
			data={situsData}
			{errors}
			userData={data?.userData}
			dataAcara={data?.acaraData}
			editmode={true}
			dataEdit={editData}
			successText="Tugas Berhasil Ditambah"
		></TambahTugas>
		<input type="text" name="id_tugas" value={editData?.id_tugas} hidden />
	</form>
{/if}
