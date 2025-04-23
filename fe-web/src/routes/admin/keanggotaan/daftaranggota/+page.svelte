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
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { easeBack } from 'd3';

	let { data } = $props();
	console.log(data.dataKerajaan);
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

	$effect(() => {
		if (!edit || !tambah) {
			errors = null;
		}
	});

	// const {data} = $props()
	// console.log(data.tabel)
	function filterData(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_kerajaan?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.alamat_kerajaan?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal_berdiri?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.era?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal_berdiri?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.raja_sekarang?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function pagination(data: any[]) {
		const filter = filterData(data);
		const start = (currPage - 1) * entries;
		const end = start + entries;
		return filter.slice(start, end);
	}
	let resData = $derived(pagination(data.dataKerajaan));
	let total_pages = $derived(Math.ceil(filterData(data.dataKerajaan).length / entries));

	// Reset to first page when entries or keyword changes
	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
	});
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
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
				<Search bind:keyword bind:data></Search>
			</div>
			<div class="me-4 ms-2">
				<p>Show</p>
			</div>
			<div class="text-center">
				<!-- <Pagination bind:value={entries}></Pagination> -->
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
			['era', 'Era'],
			['jenis_kerajaan', 'Jenis Kerajaan'],
			['raja_sekarang', 'Nama Raja'],
			['bendera_kerajaan', 'Bendera & Lambang Kerajaan'],

			['children', 'Aksi']
		]}
		table_data={resData}
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
						['Detail', `/admin/keanggotaan/daftaranggota/ubahanggota/${data.id_kerajaan}`],
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
						<button
							class="rounded-xl bg-orange-500 px-6 py-2 text-white"
							onclick={() => (tambah = true)}
						>
							+Tambah data
						</button>
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
							<CustomBtn bind:del bind:edit></CustomBtn>
						{/if}
					{/snippet}
				</Table>
			</div>
		{/snippet}
	</Table>

	<div class="mt-4 flex flex-col lg:flex-row lg:justify-between">
		<div>
			<p>
				Showing {(currPage - 1) * entries + 1}
				to {Math.min(currPage * entries, filterData(data.dataKerajaan).length)}
				of {filterData(data.dataKerajaan).length}
			</p>
		</div>
		<div class="flex flex-row gap-3">
			<button
				class="rounded-lg bg-white px-3 py-2 hover:bg-[#F9D48B]"
				disabled={currPage === 1}
				onclick={() => {
					currPage--;
				}}>Previous</button
			>
			{#if total_pages <= 5}
				{#each Array(total_pages) as _, i}
					<button
						class="rounded-lg p-4"
						class:bg-[#F9D48B]={currPage === i + 1}
						class:text-white={currPage === i + 1}
						onclick={() => (currPage = i + 1)}>{i + 1}</button
					>
				{/each}
			{:else}
				<button
					class="rounded-lg p-4"
					class:bg-[#F9D48B]={currPage === 1}
					class:text-white={currPage === 1}
					onclick={() => (currPage = 1)}>1</button
				>

				<!-- Ellipsis after first page if current page is far enough -->
				{#if currPage > 3}
					<span class="flex items-center px-2">...</span>
				{/if}

				<!-- Pages around current page -->
				{#each Array(Math.min(3, total_pages - 2)) as _, i}
					{#if currPage > 2 && currPage < total_pages - 1}
						<!-- Show pages around current page -->
						{#if currPage - 1 + i > 1 && currPage - 1 + i < total_pages}
							<button
								class="rounded-lg p-4"
								class:bg-[#F9D48B]={currPage === currPage - 1 + i}
								class:text-white={currPage === currPage - 1 + i}
								onclick={() => (currPage = currPage - 1 + i)}>{currPage - 1 + i}</button
							>
						{/if}
					{:else if currPage <= 2}
						<!-- Show first few pages -->
						{#if i + 2 < total_pages}
							<button
								class="rounded-lg p-4"
								class:bg-[#F9D48B]={currPage === i + 2}
								class:text-white={currPage === i + 2}
								onclick={() => (currPage = i + 2)}>{i + 2}</button
							>
						{/if}
					{:else}
						<!-- Show last few pages -->
						{#if total_pages - 3 + i > 1}
							<button
								class="rounded-lg p-4"
								class:bg-[#F9D48B]={currPage === total_pages - 3 + i}
								class:text-white={currPage === total_pages - 3 + i}
								onclick={() => (currPage = total_pages - 3 + i)}>{total_pages - 3 + i}</button
							>
						{/if}
					{/if}
				{/each}

				<!-- Ellipsis before last page if current page is far enough -->
				{#if currPage < total_pages - 2}
					<span class="flex items-center px-2">...</span>
				{/if}

				<!-- Last page -->
				<button
					class="rounded-lg p-4"
					class:bg-[#F9D48B]={currPage === total_pages}
					class:text-white={currPage === total_pages}
					onclick={() => (currPage = total_pages)}>{total_pages}</button
				>
			{/if}
			<button
				class="rounded-lg bg-white px-3 py-2 hover:bg-[#F9D48B]"
				disabled={currPage === total_pages}
				onclick={() => {
					currPage++;
				}}>Next</button
			>
		</div>
	</div>
</div>
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
					let timer: number;
					timer = setTimeout(() => {
						edit = false;
						success = false;
						goto('/admin/keanggotaan/daftaranggota');
					}, 3000);
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
			return async ({ result }) => {
				if (result.type === 'success') {
					success = true;
					let timer: number;
					timer = setTimeout(() => {
						tambah = false;
						success = false;
						goto('/admin/keanggotaan/daftaranggota');
					}, 3000);
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
				}
			};
		}}
	>
		<KerajaanPopup bind:value={tambah} bind:errors type="Tambah"></KerajaanPopup>
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
