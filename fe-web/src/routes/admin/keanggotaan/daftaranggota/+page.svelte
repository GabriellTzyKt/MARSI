<script lang="ts">
	import Table from '$lib/table/Table.svelte';
	import { dummydata, dummyDokumen } from '$lib/dummy';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import CustomBtn from '../../masterData/CustomBtn.svelte';
	import { slide } from 'svelte/transition';

	// import {dropId} from './DropDown.svelte'

	let keyword = $state('');
	let data = $state(dummydata);
	let entries = $state(10);
	let currPage = $state(1);
	$effect(() => {
		data = keyword.trim()
			? dummydata.filter(
					(d) =>
						d.nama.toLowerCase().includes(keyword.toLowerCase().trim()) ||
						d.email.toLowerCase().includes(keyword.toLowerCase().trim()) ||
						d.telepon.toLowerCase().includes(keyword.toLowerCase().trim())
				)
			: dummydata;
	});
	let paginatedData = $derived(data.slice((currPage - 1) * entries, currPage * entries));
	let ttlPage = $derived(Math.ceil(data.length / entries));
	// const {data} = $props()
	// console.log(data.tabel)
</script>

<div class="mt-20 flex w-full flex-col xl:mt-0">
	<div class=" flex flex-col justify-center xl:mt-0 xl:flex-row xl:justify-between">
		<div class=" col-start-1 mb-4 flex flex-row items-center justify-center xl:mb-0">
			<a href="/admin/keanggotaan/daftaranggota/tambahanggota"
				><button class=" custom-button bg-customKrem px-6 py-2"> +Tambah Kerajaan </button></a
			>
		</div>
		<div class="col-span-2 col-end-5 flex flex-row items-center justify-center">
			<div>
				<Search bind:keyword bind:data></Search>
			</div>
			<div class="me-4 ms-2">
				<p>Show</p>
			</div>
			<div class="text-center">
				<Pagination bind:value={entries}></Pagination>
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
		table_data={paginatedData}
		isdrop={true}
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
		{#snippet details({})}
			<div class=" me-4 ms-4 mt-4 flex flex-col" transition:slide={{ duration: 300 }}>
				<div class="flex justify-between">
					<div>
						<p class="text-xl font-[600]">Data Kerajaan</p>
					</div>
					<div>
						<button class="rounded-xl bg-orange-500 px-6 py-2 text-white"> +Tambah data </button>
					</div>
				</div>
				<Table
					table_header={[
						['nama', 'Nama Dokumen', 'justify-start flex grow'],
						['children', 'Aksi', 'text-right pe-48']
					]}
					table_data={dummyDokumen}
				>
					{#snippet children({ header, data, index })}
						{#if header === 'Aksi'}
							<CustomBtn></CustomBtn>
						{/if}
					{/snippet}
				</Table>
			</div>
		{/snippet}
	</Table>
	<div class="mt-4 flex justify-between">
		<div class="">
			<p>Showing 1 to {entries} of 10 entries</p>
		</div>
		<div class="flex flex-row gap-2">
			<button
				class="rounded-lg border px-6 py-2 {currPage === 1 ? '' : 'hover:bg-[#F9D48B]'}"
				onclick={() => {
					currPage = Math.max(1, currPage - 1);
				}}
				disabled={currPage === 1}>Previous</button
			>
			<button
				class="rounded-lg border px-6 py-2 {currPage === ttlPage ? '' : 'hover:bg-[#F9D48B]'}"
				onclick={() => {
					currPage = Math.min(ttlPage, currPage + 1);
				}}
				disabled={currPage === ttlPage}>Next</button
			>
		</div>
	</div>
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
