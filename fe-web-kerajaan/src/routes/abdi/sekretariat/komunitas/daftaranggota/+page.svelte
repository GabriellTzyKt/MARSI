<script lang="ts">
	import { navigating } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummySekreAnggotaKom } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Table from '$lib/table/Table.svelte';
	
	let keyword = $state('');
	let entries = $state(10);
	let { data } = $props();
	let dataListKomunitas = data.komunitasList;
	let dataAnggota = data.allAnggota;
	let selectedKomunitas = $state('');
	let currPage = $state(1);
	
	function filterD(data: any[]) {
		// Filter berdasarkan komunitas yang dipilih terlebih dahulu
		let filteredByKomunitas = data;
		console.log("id komunitas : " , selectedKomunitas)
		if (selectedKomunitas) {
			filteredByKomunitas = data.filter(item => item.id_komunitas === selectedKomunitas);
		}
		
		// Kemudian filter berdasarkan keyword
		return filteredByKomunitas.filter(
			(item) =>
				item?.nama_anggota?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal_bergabung?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jabatan_komunitas?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.nomer_telepon?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.email?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	
	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		return d.slice(start, end);
	}
	
	// Gunakan dataAnggota dari server, bukan dummy data
	let resData = $derived(pagination(dataAnggota || []));
	
	$effect(() => {
		// Reset halaman saat filter berubah
		if (keyword || entries || selectedKomunitas) {
			currPage = 1;
		}
		if (entries < 0) {
			entries = 0;
		}
	});
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}

<div class="flex w-full flex-col">
	<div class=" flex flex-col lg:flex-row lg:justify-between">
		<button class="bg-badran-bt rounded-lg px-3 py-2 text-white">+Tambah Data</button>
		<div
			class="mt-4 flex flex-col items-center justify-center gap-2 lg:mt-0 lg:flex-row lg:justify-start"
		>
			<!-- select -->
			<select
				name="Komunitas"
				id="komunitas"
				bind:value={selectedKomunitas}
				class="rounded-md border px-3 py-2 focus:outline-none"
			>
				<option value="">Semua Komunitas</option>
				{#each dataListKomunitas as komunitas}
					<option value={komunitas.id_komunitas}>{komunitas.nama_komunitas}</option>
				{/each}
			</select>
			<!-- cari -->
			<div class="flex items-center rounded-lg border px-2">
				<input
					type="text"
					placeholder="Cari Anggota..."
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
	<div class="flex w-full flex-col">
		<Table
			table_header={[
				['id_user', 'Id Anggota'],
				['nama_anggota', 'Nama Anggota'], // blom
				['tanggal_bergabung', 'Tanggal Bergabung'],

				['jabatan_anggota', 'Jabatan Anggota'],
				['nomer_telepon', 'Nomer Telepon'], //blom
				['email', 'Email'], //blom
				['children', 'Aksi']
			]}
			table_data={resData}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text={`Apakah yakin ingin mengarsipkan abdi?`}
						successText={`Berhasil mengarsipkan abdi!`}
						link="/abdi/dashboard/organisasi/daftaranggota"
						items={[
							['Edit', '/abdi/sekretariat/komunitas/daftaranggota/ubah'],

							['children', 'Non Aktifkan', '']
						]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(dataAnggota || []).length}></Pagination>
	</div>
</div>
