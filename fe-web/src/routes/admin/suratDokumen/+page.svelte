<script lang="ts">
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import DropDown from '$lib/dropdown/DropDown.svelte';

	let currPage = $state(1);
	let entries = $state(10);
	let keyword = $state('');

	let { data } = $props();
	const dataArsip = data.dataArsip;
	console.log(dataArsip);

	function filterData(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_arsip?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.asal_kerajaan?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jenis_arsip?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.kategori_arsip?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.sub_kategori_arsip?.toLowerCase().includes(keyword.toLowerCase())
		);
	}

	function pagination(data: any[]) {
		const filter = filterData(data);
		const start = (currPage - 1) * entries;
		const end = start + entries;
		return filter.slice(start, end);
	}

	// Memastikan datanya dalam bentuk array
    const arsipArray = Array.isArray(data.dataArsip) ? data.dataArsip : [];
    let resData = $derived(pagination(arsipArray));
    let total_pages = $derived(Math.ceil(filterData(arsipArray).length / entries));

	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
	});
</script>

<div class="mt-5 flex w-full flex-col xl:mt-0">
	<div class="test flex flex-col justify-center xl:mt-0 xl:flex-row xl:justify-between">
		<div class="col-start-1 mb-4 flex flex-row items-center justify-center xl:mb-0">
			<a href="/admin/suratDokumen/tambah"
				><button class=" custom-button bg-customKrem px-6 py-2"> +Tambah Data </button></a
			>
		</div>
		<div class="col-span-2 col-end-5 flex flex-row items-center justify-center">
			<div>
				<Search bind:keyword></Search>
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
			['nama_arsip', 'Nama Dokumen'],
			['asal_kerajaan', 'Asal Kerajaan'],
			['jenis_arsip_detail', 'Jenis Dokumen'],
			['kategori_arsip', 'Kategori'],
			['sub_kategori_arsip', 'Sub Kategori'],
			['files', 'Dokumentasi', 'custom'],  // ada gambar, jadi perlu khusus
			['children', 'Aksi']
		]}
		table_data={resData}
	>
		{#snippet children({ header, data, index })}
			{#if header === 'Aksi'}
				<DropDown
					text="apakah yakin ingin mengarsip dokumen {data.nama_arsip} ini?"
					successText={`Dokumen ${data.nama_arsip} berhasil diarsipkan!`}
					link="/admin/suratDokumen"
					{index}
					items={[
						['Ubah', `/admin/suratDokumen/ubah/${data.id_arsip}`],
						['children', 'Arsipkan']
					]}
					tipe="acara"
					id={`id-acara-${index}`}
					{data}
				></DropDown>
			{/if}
		{/snippet}
		
		{#snippet custom({ header, data})}
			{#if header === 'Dokumentasi'}
				{#if data.files && Array.isArray(data.files) && data.files.length > 0}
					<div class="flex flex-row gap-2">
						{#each data.files as file}
							{#if file && typeof file === 'object' && file.url}
								<a href={file.url} target="_blank" class="text-blue-500 hover:underline">
									<img src={file.url} alt={file.name || 'Document'} class="h-10 w-10 object-cover rounded" />
								</a>
							{/if}
						{/each}
					</div>
				{:else}
					<span>No files</span>
				{/if}
			{/if}
		{/snippet}
	</Table>

	<div class="mt-4 flex flex-col lg:flex-row lg:justify-between">
		<div>
			<p>
				Showing {(currPage - 1) * entries + 1}
				to {Math.min(currPage * entries, filterData(arsipArray).length)}
				of {filterData(arsipArray).length}
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
			{#each Array(total_pages) as _, i}
				<button
					class="rounded-lg p-4"
					class:bg-[#F9D48B]={currPage === i + 1}
					class:text-white={currPage === i + 1}
					onclick={() => (currPage = i + 1)}>{i + 1}</button
				>
			{/each}
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

	@media (max-width: 768px) {
		.test {
			margin-top: 90px;
		}
	}
</style>
