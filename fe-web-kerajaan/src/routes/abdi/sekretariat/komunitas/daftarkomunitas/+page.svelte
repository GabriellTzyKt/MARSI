<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummySekreKom } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import { string } from 'zod';
	let { data } = $props();
	let tableData = $derived(data?.data || []);
	let entries = $state(10);
	let keyword = $state('');
	let currPage = $state(1);
	function filterD(data: any[]) {
		if (!data) return [];
		return data.filter(
			(item) =>
				(item?.nama_komunitas?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.tanggal_berdiri?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.alamat?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.penanggung_jawab.toString().toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.pelindung?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.pembina?.toLowerCase() || '').includes(keyword.toLowerCase())
		);
	}
	function pagination(data: any[]) {
		if (!data) return [];
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		return d.slice(start, end);
	}
	$effect(() => {
		if (keyword || entries) {
			console.log(resData);
			currPage = 1;
		}
		if (entries <= 1) {
			entries = 1;
		}
	});
	let resData = $derived(pagination(tableData || []));
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}

<div class="flex w-full flex-col">
	<div class=" flex flex-col lg:flex-row lg:justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white"
			onclick={() => goto('daftarkomunitas/buat')}>+Tambah Data</button
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
				['nama_komunitas', 'Nama Komunitas'],
				['tanggal_berdiri', 'Tanggal Berdiri'],
				['alamat', 'Lokasi Komunitas'],

				['penanggung_jawab', 'Penanggung Jawab'],

				['pelindung', 'Pelindung'],
				['pembina', 'Pembina'],

				['children', 'Aksi']
			]}
			table_data={resData}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text={`Apakah yakin ingin mengarsipkan abdi?`}
						items={[
							['Edit', '/abdi/sekretariat/komunitas/daftarkomunitas/edit'],
							[
								'children',
								'Non Aktifkan',
								`/abdi/komunitas/daftarkomunitas/?delete=${data.id_komunitas}`
							]
						]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(data.data).length}></Pagination>
	</div>
</div>
