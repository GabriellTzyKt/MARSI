<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyAcara, dummyAnggota } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let dataambil = data.acaraList;
	let dataacara = dataambil.map((item : any) => ({
		...item.Acara,
		id_organisasi: item.id_organisasi,
		organisasi_nama: item.organisasi_nama,
		nama_penanggung_jawab : item.nama_penanggung_jawab
	}));
	console.log('DATA AMBIL : ', dataambil);

	// // Check if allEvents exists and process it
	// if (data.allEvents && Array.isArray(data.allEvents)) {
	// 	dataacara = data.allEvents.map((item: any) => {
	// 		// If data has a nested Acara structure
	// 		if (item.Acara) {
	// 			return {
	// 				...item.Acara,
	// 				organisasi_id: item.id_organisasi,
	// 				organisasi_nama: item.nama_organisasi || 'Unknown Organization'
	// 			};
	// 		}
	// 		// If data is already in the expected format
	// 		return item;
	// 	});
	// }

	let keyword = $state('');
	let entries = $state(10);
	let currPage = $state(1);

	function pagination(data: any[]) {
		if (!data || !Array.isArray(data)) return [];
		let start = (currPage - 1) * entries;
		let end = start + entries;
		return data.slice(start, end);
	}

	function filterD(data: any[]) {
		if (!data || !Array.isArray(data)) return [];
		return data.filter(
			(item) =>
				(item?.nama_acara?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.waktu_mulai?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.alamat_acara?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.nama_penanggung_jawab?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.jenis_acara?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.kapasitas_acara?.toString()?.toLowerCase() || '').includes(keyword.toLowerCase()) ||
				(item?.status?.toLowerCase() || '').includes(keyword.toLowerCase())
		);
	}

	// Use the processed data for pagination and filtering
	let filteredData = $derived(filterD(dataacara));
	let resdata = $derived(pagination(filteredData));

	// Function to refresh data
	async function refreshData() {
		try {
			await invalidateAll();
			console.log('Data invalidated, refreshing...');
		} catch (error) {
			console.error('Error refreshing data:', error);
		}
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="flex w-full flex-col">
	<div class=" flex flex-col xl:flex-row xl:justify-between">
		<button
			class="bg-badran-bt cursor-pointer rounded-lg px-3 py-2 text-white"
			onclick={() =>
				goto(
					`/abdi/dashboard/organisasi/beranda/${dataambil[0].id_organisasi}/detail/acara/tambah`
				)}>+Tambah Data</button
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
				['nama_acara', 'Nama Acara'],
				['waktu_mulai', 'Tanggal'],
				['alamat_acara', 'Lokasi'],
				['nama_penanggung_jawab', 'Penanggung Jawab'],
				['jenis_acara', 'Jenis Acara'],
				['kapasitas_acara', 'Kapasitas'],
				['children', 'Status'],
				['children', 'Aksi']
			]}
			table_data={resdata}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text={`Apakah yakin ingin mengarsipkan ${data.nama_acara || 'acara ini'}?`}
						successText={`Berhasil mengarsipkan ${data.nama_acara || 'acara ini'}!`}
						link={`/abdi/dashboard/organisasi/beranda/${dataambil[0].id_organisasi}/detail/acara`}
						items={[
							[
								'Detail',
								`/abdi/dashboard/organisasi/beranda/${dataambil[0].id_organisasi}/detail/acara/detail/${data.id_acara}`
							],
							[
								'Ubah',
								`/abdi/dashboard/organisasi/beranda/${dataambil[0].id_organisasi}/detail/acara/ubah/${data.id_acara}`
							],
							[
								'Laporan',
								`/abdi/dashboard/organisasi/beranda/${dataambil[0].id_organisasi}/detail/acara/laporan/${data.id_acara}`
							],
							['children', 'Arsip', '']
						]}
						id={`id-${index}`}
						{data}
						onSuccess={refreshData}
					></DropDown>
				{:else if header === 'Status'}
					<Status status={data.status || 'unknown'}></Status>
				{/if}
			{/snippet}
		</Table>
		{#if dataacara.length === 0}
			<p class="flex items-center justify-center text-center">No data available</p>
		{/if}
		<div>
			<Pagination bind:currPage bind:entries totalItems={filteredData.length} />
		</div>
	</div>
</div>
