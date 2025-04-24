<script lang="ts">
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummySekreAnggotaOrg, dummyHistoryGelar } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	let keyword = $state('');
	let entries = $state(10);
	let currPage = $state(1);
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.asma_timur?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.asma_dalem?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tempat_lahir?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal_lahir?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jabatan_organisasi?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jaatan_komunitas?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.gelar?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.no_telepon?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function pagination(data: any[]) {
		let dataa = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		return dataa.slice(start, end);
	}
	let resdata = $derived(pagination(dummySekreAnggotaOrg));
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="flex w-full flex-col">
	<div class=" flex flex-col lg:flex-row lg:justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white"
			onclick={() => goto('daftaranggota/tambah')}>+Tambah Data</button
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
					placeholder="Cari.."
					class=" w-full bg-transparent px-2 py-2 focus:outline-none"
					bind:value={keyword}
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
				['id_anggota', 'Id Anggota'],
				['asma_timur', 'Asma Timur'],
				['asma_dalem', 'Asma Dalem'],
				['tempat_lahir', 'tempat_lahir'],
				['tanggal_lahir', 'tanggal_lahir'],
				['jabatan_organisasi', 'Jabatan Organisasi'],
				['jaatan_komunitas', 'Jabatan Komunitas'],
				['gelar', 'Gelar'],
				['no_telepon', 'Nomer Telepon'],
				['children', 'Aksi']
			]}
			table_data={resdata}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text={`Apakah yakin ingin mengarsipkan abdi?`}
						successText={`Berhasil mengarsipkan abdi!`}
						link="/abdi/sekretariat/anggota/daftaranggota"
						items={[
							['Ubah', '/abdi/sekretariat/anggota/daftaranggota/ubah'],
							['children', 'History Gelar', ''],
							['children', 'History Bintang Jasa', ''],
							['children', 'Non Aktifkan', '']
						]}
						id={`id-${index}`}
						data={resdata}
						dataG={resdata}
						header={[
							['nama_gelar', 'Nama Gelar'],
							['nama_pelantik', 'Nama Pelantik'],
							['tanggal_dilantik', 'Tanggal Dilantik'],
							['acara', 'Acara'],
							['children', 'Sertifikat']
						]}
					></DropDown>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(dummySekreAnggotaOrg).length}
		></Pagination>
	</div>
</div>
