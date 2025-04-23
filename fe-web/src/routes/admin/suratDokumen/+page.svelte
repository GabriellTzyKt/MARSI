<script lang="ts">
	import Modal from '$lib/popup/Modal.svelte';
	// import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import { dummyAcara, dummyDocs } from '$lib/dummy';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import Status from '$lib/table/Status.svelte';

	let { data } = $props();
	const d = data.dataArsip;
	console.log(data.dataArsip);

	let pop = $state(false);
	function setpop() {
		pop = true;
	}
	function dispop() {
		pop = false;
	}
</script>

<!-- <button class="ms-3 mt-3 bg-yellow-600 p-3 text-white" onclick={setpop}> Click me </button>
<Modal {pop} nama="Halo" on:close={dispop}></Modal> -->
<div class="mt-5 flex w-full flex-col xl:mt-0">
	<div class="flex flex-col justify-center xl:mt-0 xl:flex-row xl:justify-between">
		<div class=" col-start-1 mb-4 flex flex-row items-center justify-center xl:mb-0">
			<a href="/admin/suratDokumen/tambah"
				><button class=" custom-button bg-customKrem px-6 py-2"> +Tambah Data </button></a
			>
		</div>
		<div class="col-span-2 col-end-5 flex flex-row items-center justify-center">
			<div>
				<Search></Search>
			</div>
			<div class="me-4 ms-2">
				<p>Show</p>
			</div>
			<div class="text-center"></div>
			<div class="mx-2">
				<p>entries</p>
			</div>
		</div>
	</div>
	<Table
		table_header={[
			['nama_arsip', 'Nama Dokumen'],
			['asal_kerajaan', 'Asal Kerajaan'],

			['jenis_arsip', 'Jenis Dokumen'],
			['kategori_arsip', 'Kategori'],
			['sub_kategori_arsip', 'Sub Kategori'],
			['dokumentasi', 'Dokumentasi'],

			['children', 'Aksi']
		]}
		table_data={d}
	>
		{#snippet children({ header, data, index })}
			{#if header === 'Aksi'}
				<DropDown
					text="apakah yakin ingin mengarsip dokumen {data.nama_dokumen} ini?"
					successText={`Dokumen ${data.nama_dokumen} berhasil diarsipkan!`}
					link="/admin/suratDokumen"
					{index}
					items={[
						['Ubah', `/admin/suratDokumen/ubah`],
						['children', 'Arsipkan']
					]}
					tipe="acara"
					id={`id-acara-${index}`}
					{data}
				></DropDown>
			{/if}
			{#if header === 'Status'}
				<Status status={data.status}></Status>
			{/if}
		{/snippet}
	</Table>
</div>

<style>
	.custom-button {
		border: none;

		text-align: center;
		color: black;
		font-weight: bold;
		font-size: 16px;
		border-radius: 10px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	@media (max-width: 768px) {
		.test {
			margin-top: 90px;
		}
	}
</style>
