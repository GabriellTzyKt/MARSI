<script lang="ts">
	import { goto } from '$app/navigation';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyAsetKerajaan } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Picture from '$lib/table/Picture.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import { string } from 'zod';
	let { data } = $props();

	let keyword = $state('');
	let entries = $state(10);
	let currPage = $state(1);
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.deskripsi?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.nama_aset?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jenis_aset?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	let resData = $derived(pagination(dummyAsetKerajaan || []));
	let tableData = $derived(dummyAsetKerajaan || []);
</script>

<div class="flex w-full flex-col">
	<div class=" flex flex-col lg:flex-row lg:justify-between">
		<button class="bg-badran-bt rounded-lg px-3 py-2 text-white" onclick={() => goto('aset/buat')}
			>+Tambah Kunjungan</button
		>
		<div
			class="mt-4 flex flex-col items-center justify-center gap-2 lg:mt-0 lg:flex-row lg:justify-start"
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
				['nama_aset', 'Nama Aset'],
				['deskripsi', 'Deskripsi'],
				['jenis_aset', 'Jenis Aset'],

				['picture', 'Dokumentasi'],
				['children', 'Aksi']
			]}
			table_data={resData}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text={`Apakah yakin ingin mengarsipkan abdi?`}
						items={[
							['Ubah', `/abdi/sekretariat/aset/ubah/edit/${data.id_aset}`],
							['children', 'Non Aktifkan', `/abdi/sekretariat/aset/?delete=${data.id_komunitas}`]
						]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{/if}
			{/snippet}
			{#snippet picture({ header, data, index })}
				{#if header === 'Dokumentasi'}
					<Picture {data}></Picture>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(data.data).length}></Pagination>
	</div>
</div>
