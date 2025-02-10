<script lang="ts">
	import Table from '$lib/table/Table.svelte';
	import { dummydata } from '$lib/dummy';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	// import {dropId} from './DropDown.svelte'

	// const {data} = $props()
	// console.log(data.tabel)
</script>

<div class="mx-6 mt-20 flex flex-col md:mx-20 md:mt-0">
	<div class="mx-6 flex justify-between md:mx-20 md:mt-0">
		<div class=" col-start-1 flex flex-row items-center justify-center">
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
			['nama', 'Nama Anggota'],
			['email', 'Email'],
			['telepon', 'Nomer Telepon'],
			['kerajaan', 'Nama Kerajaan'],
			['jenis_kerajaan', 'Jenis Kerajaan'],
			['gelar', 'Gelar'],
			['children', 'Aksi']
		]}
		table_data={dummydata}
	>
		{#snippet children({ header, data, index })}
			{#if header === 'Aksi'}
				<DropDown {index} tipe="anggota" id={`id-${index}`} {data}></DropDown>
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
		border-radius: 5px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
</style>
