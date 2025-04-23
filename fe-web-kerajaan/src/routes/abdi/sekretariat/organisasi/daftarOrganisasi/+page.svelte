<script lang="ts">
	import { goto } from '$app/navigation';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyAnggota, dummyOrganisasi } from '$lib/dummy';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	let keyword = $state('');
	let entries = $state(10);
	let currPage = $state(1);
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_organisasi?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal_berdiri?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.lokasi_organisasi?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.penanggungjawab?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.pelindung?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.pembina?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	let resData = $derived(pagination(dummyOrganisasi));
	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
		if (entries < 0) {
			entries = 0;
		}
	});
</script>

<div class="flex w-full flex-col">
	<div class=" flex flex-col lg:flex-row lg:justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white"
			onclick={() => {
				goto('/abdi/sekretariat/organisasi/daftarorganisasi/buat');
			}}>+Tambah Data</button
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
				['id_organisasi', 'Id Organisasi'],
				['nama_organisasi', 'Nama Organisasi'],
				['tanggal_berdiri', 'Tanggal Berdiri'],
				['lokasi', 'Lokasi'],
				['penanggungjawab', 'Penanggung Jawab'],
				['pelindung', 'Pelindung'],
				['pembina', 'Pembina'],
				['children', 'Aksi']
			]}
			table_data={resData}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text={`apakah anda yakin ingin mengarsip anggota ${data.nama_organisasi}?`}
						link="/abdi/sekretariat/organisasi/daftarorganisasi"
						successText={`berhasil mengarship organisai ${data.nama_organisasi}`}
						items={[
							['Ubah', '/abdi/sekretariat/organisasi/daftarOrganisasi/edit    '],
							['children', 'non-aktifkan']
						]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(dummyOrganisasi).length}
		></Pagination>
	</div>
</div>
