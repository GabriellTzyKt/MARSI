<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import { dummyAnggota, dummyOrganisasi } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	let { data } = $props();
	let keyword = $state('');
	let entries = $state(10);
	let currPage = $state(1);
	let idNonAktif = $state();
	let deleteModal = $state(false);
	let loading = $state(false);
	let success = $state(false);
	function nonAktifkan(id: number) {
		console.log('Non Aktifkan : ', id);
		idNonAktif = id;
		deleteModal = true;
	}
	function filterD(data: any[]) {
		return data?.filter(
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
	let resData = $derived(pagination(data?.finalwithuser || []));
	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
		if (entries < 0) {
			entries = 0;
		}
	});
</script>

{#if loading}
	<Loader></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="flex w-full flex-col">
	<div class=" flex flex-col lg:flex-row lg:justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white"
			onclick={() => {
				goto('/abdi/sekretariat/organisasi/daftarOrganisasi/buat');
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
				['nama_organisasi', 'Nama Organisasi'],
				['tanggal_berdiri', 'Tanggal Berdiri'],
				['alamat', 'Lokasi'],
				['penanggung_jawab_nama', 'Penanggung Jawab'],
				['pelindung_nama', 'Pelindung'],
				['pembina_nama', 'Pembina'],
				['children', 'Aksi']
			]}
			table_data={resData}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDownNew
						text={`apakah anda yakin ingin mengarsip anggota ${data.nama_organisasi}?`}
						items={[
							{
								label: 'Edit',
								action: () =>
									goto(`/abdi/sekretariat/organisasi/daftarOrganisasi/edit/${data.id_organisasi}`)
							},
							{
								label: 'Non Aktifkan',
								action: () => nonAktifkan(data.id_organisasi)
							}
						]}
						id={`id-${index}`}
						{data}
					></DropDownNew>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(dummyOrganisasi).length}
		></Pagination>
	</div>
</div>
{#if deleteModal}
	<form
		action="?/deleteOrganisasi"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					deleteModal = false;
					await invalidateAll().then(() => {
						setTimeout(() => {
							deleteModal = false;
							success = false;
						}, 3000);
					});
				}
				if (result.type === 'failure') {
					console.log(result.data?.errors);
				}
			};
		}}
	>
		<DeleteModal
			bind:value={deleteModal}
			text="Apakah yakin ingin menghapus organisasi ini?"
			successText="Organisasi berhasil dihapus!"
			choose="delete"
		></DeleteModal>
		<input type="text" name="id_organisasi" value={idNonAktif} hidden />
	</form>
{/if}
