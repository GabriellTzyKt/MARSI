<script lang="ts">
	import Modal from '$lib/popup/Modal.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import { dummyAcara } from '$lib/dummy';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import Status from '$lib/table/Status.svelte';
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
<div class="flex flex-col md:mx-20 mx-6 mt-20 md:mt-0">
	<div class="mx-6  flex justify-between md:mx-20 md:mt-0">
		<div class=" col-start-1 flex items-center justify-center">
			<a href="/admin/keanggotaan/daftaranggota/tambahanggota"
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
			<div class="text-center">
				<Pagination></Pagination>
			</div>
			<div class="mx-2">
				<p>entries</p>
			</div>
		</div>
	</div>
	<Table
		table_header={[
			['id_acara', 'ID Acara'],
			['nama_acara', 'Nama Acara'],
			['tanggal', 'Tanggal'],
			['lokasi', 'Lokasi'],
			['jenis_acara', 'Jenis Acara'],
			['kapasitas', 'Kapasitas'],
			['children', 'Status'],
			['children', 'Aksi']
		]}
		table_data={dummyAcara}
	>
		{#snippet children({ header, data, index })}
			{#if header === 'Aksi'}
				<DropDown id={`id-acara-${index}`} {data}></DropDown>
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
</style>
