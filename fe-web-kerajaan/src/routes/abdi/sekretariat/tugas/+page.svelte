<script lang="ts">
	import { enhance } from '$app/forms';
	import { navigating } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import TambahTugas from '$lib/popup/TambahTugas.svelte';
	import Pagination from '$lib/table/Pagination.svelte';

	import Search from '$lib/table/Search.svelte';
	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';

	let { data } = $props();
	console.log('data : ', data);
	const dataAmbil = data.data;

	let open = $state(false);
	let success = $state(false);
	let errors = $state();
	let entries = $state(10);
	let keyword = $state('');
	let currPage = $state(1);
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
	<div class="mx-4 flex flex-col">
		<Table
			table_header={[
				['id_tugas', 'Id Tugas'],
				['nama_tugas', 'Nama Tugas'],
				['id_pemberi_tugas', 'Pemberi Tugas'],
				['id_penerima_tugas', 'Anggota yang Ditugaskan'],
				['tanggal_mulai', 'Tanggal Pemberian'],
				['deskripsi_tugas', 'Deskripsi Tugas'],

				['children', 'Status'],
				['children', 'Aksi']
			]}
			table_data={dataAmbil}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text=" apa yakin mau menghapus acara ini?"
						successText="berhasil diarsip"
						link="/abdi/sekretariat/tugas"
						items={[
							['children', 'Bukti', 'Bukti Laporan'],
							['children', 'Ubah Tugas', 'Ubah Tugas'],

							['children', 'Arsip', '']
						]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{/if}
				{#if header === 'Status'}
					<Status status={data.status_tugas}></Status>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(dataAmbil).length}></Pagination>
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

					timer = setTimeout(() => {
						open = false;
						success = false;
						errors = null;
					}, 3000);
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
			{errors}
			successText="Tugas Berhasil Ditambah"
		></TambahTugas>
	</form>
{/if}
{#if success}
	<SuccessModal text="Tugas BErhasil Ditambah"></SuccessModal>
{/if}
