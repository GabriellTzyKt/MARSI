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

<div class="mt-20 flex w-full flex-col xl:mt-0">
	<div class=" flex flex-col justify-center xl:mt-0 xl:flex-row xl:justify-between">
		<div class=" col-start-1 mb-4 flex flex-row items-center justify-center xl:mb-0">
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
				<DropDown
					text="apakah yakin ingin mengarsip anggota {data.nama} ini?"
					successText={`Anggota ${data.nama} berhasil diarsipkan!`}
					link="/admin/keanggotaan/daftaranggota"
					{index}
					items={[
						['Ubah', `/admin/keanggotaan/daftaranggota/ubahanggota/${data.id}`],
						['children', 'Arsipkan']
					]}
					tipe="anggota"
					id={`id-anggota-${index}`}
					{data}
				></DropDown>
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
