<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyAcara, dummyAnggota } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';

	let currPage = $state(1);
	let entries = $state(10);
	let keyword = $state('');
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_acara?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.lokasi?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.penanggungjawab?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jenis_acara?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.kapasitas?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	let resdata = $derived(pagination(dummyAcara));
	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
	});
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="flex w-full flex-col">
	<div class="flex flex-col justify-center gap-y-2 md:flex-row md:justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white"
			onclick={() => goto('/abdi/dashboard/komunitas/detail/acara/buat')}>+Tambah Data</button
		>
		<div class="flex flex-col items-center gap-2 md:flex-row">
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
	<div class=" flex flex-col">
		<Table
			table_header={[
				['id_acara', 'Id Acara'],
				['nama_acara', 'Nama Acara'],
				['tanggal', 'Tanggal Acara'],
				['lokasi', 'Lokasi'],
				['penanggungjawab', 'Penanggung Jawab'],
				['jenis_acara', 'Jenis Acara'],
				['kapasitas', 'Kapasitas'],
				['children', 'Status'],
				['children', 'Aksi']
			]}
			table_data={resdata}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text=" apa yakin mau menghapus acara ini?"
						successText="berhasil diarsip"
						link="/abdi/dashboard/komunitas/detail/acara"
						items={[
							['Detail', '/abdi/dashboard/komunitas/detail/acara/detail'],
							['Ubah', '/abdi/dashboard/komunitas/detail/acara/edit'],
							['Laporan', '/abdi/dashboard/komunitas/detail/acara/laporan'],
							['children', 'Arsip', '']
						]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{/if}
				{#if header === 'Status'}
					<Status status={data.status}></Status>
				{/if}
			{/snippet}
		</Table>
		<div>
			<Pagination bind:currPage bind:entries totalItems={filterD(dummyAcara).length} />
		</div>
	</div>
</div>
