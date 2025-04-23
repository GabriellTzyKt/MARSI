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

	let keyword = $state('');
	let entries = $state(10);
	let currPage = $state(1);
	function pagination(data: any[]) {
		let start = (currPage - 1) * entries;
		let end = start + entries;
		return data.slice(start, end);
	}
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_acara?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.lokasi?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.penanggungjawab?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jenis_acara?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.kapasitas?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.status?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	let resdata = $derived(pagination(filterD(dummyAcara)));
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="flex w-full flex-col">
	<div class=" flex flex-col xl:flex-row xl:justify-between">
		<button
			class="bg-badran-bt cursor-pointer rounded-lg px-3 py-2 text-white"
			onclick={() => goto('acara/tambah')}>+Tambah Data</button
		>
		<div
			class="mt-4 flex flex-col items-center justify-center gap-2 md:flex-row xl:mt-0 xl:justify-start"
		>
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
					bind:value={keyword}
					placeholder="Cari.."
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
	<div class="flex w-full flex-col">
		<Table
			table_header={[
				['id_acara', 'Id Acara'],
				['nama_acara', 'Nama Acara'],
				['tanggal', 'Tanggal'],
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
						text={`Apakah yakin ingin mengarsipkan ${data.nama_acara}?`}
						successText={`Berhasil mengarsipkan ${data.nama_acara}!`}
						link="/abdi/dashboard/organisasi/detail/acara"
						items={[
							['Detail', `/abdi/dashboard/organisasi/detail/acara/detail/`],
							['Ubah', `/abdi/dashboard/organisasi/detail/acara/ubah/`],
							['Laporan', `/abdi/dashboard/organisasi/detail/acara/laporan/`],
							['children', 'Arsip', '']
						]}
						id={`id-${index}`}
						data={resdata}
					></DropDown>
				{:else if header === 'Status'}
					<Status status={data.status}></Status>
				{/if}
			{/snippet}
		</Table>
		<div>
			<Pagination bind:currPage bind:entries totalItems={filterD(dummyAcara).length} />
		</div>
	</div>
</div>
