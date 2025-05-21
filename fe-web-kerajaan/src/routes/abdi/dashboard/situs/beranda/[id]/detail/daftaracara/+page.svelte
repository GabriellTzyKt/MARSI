<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import { dummyAcara, dummyAnggota } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';
	let { data } = $props();
	let dataevent = data.events;
	let loading = $state(false);
	let dataID = data.locationIds;
	let datatotal = data.situsCount;
	console.log('Data event : ', dataevent);
	console.log('Data ID : ', dataID);
	console.log('Data Length : ', datatotal);

	let idAktif = $state(page.params.id);
	$effect(() => {
		idAktif = page.params.id;
		console.log('ID Aktif : ', idAktif);
	});
	let Dmodal = $state(false);
	function openModal() {
		Dmodal = true;
	}
	let keyword = $state('');
	let entries = $state(10);
	let currPage = $state(1);
	let success = $state(false);
	let dataDelete = $state('');
	function deleteID(id: string) {
		console.log('Anda Menghapus acara : ', id);
		dataDelete = dataevent.find((item) => item.id_acara === id).id_acara;
		console.log('Data Delete : ', dataDelete);
		Dmodal = true;
	}
	function reloadPage() {
		const thisPage = window.location.pathname;

		console.log('goto ' + thisPage);

		goto('/').then(() => goto(thisPage));
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
	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	let dataambil = $derived(pagination(dataevent || []));
	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
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
	<div class=" flex flex-col xl:flex-row xl:justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white"
			onclick={() => {
				goto(`/abdi/dashboard/situs/beranda/${idAktif}/detail/daftaracara/buat`);
			}}>+Tambah Data</button
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
				['nama_acara', 'Nama Acara'],
				['tanggal_mulai', 'Tanggal'],
				['situs_alamat', 'Lokasi'],
				['penanggung_jawab_nama', 'Penanggung Jawab'],
				['jenis_acara', 'Jenis Acara'],
				['kapasitas_acara', 'Kapasitas'],
				['children', 'Status'],
				['children', 'Aksi']
			]}
			table_data={dataevent}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDownNew
						text={`Apakah yakin ingin mengarsipkan ${data.nama_anggota}?`}
						items={[
							{
								label: 'Edit',
								action: () =>
									goto(
										`/abdi/dashboard/situs/beranda/${idAktif}/detail/daftaracara/edit/${data.id_acara}`
									)
							},
							{
								label: 'Hapus',
								action: () => deleteID(data.id_acara)
							}
						]}
						id={`id-${index}`}
						data={dataambil}
					></DropDownNew>
				{:else if header === 'Status'}
					<Status status={data.status}></Status>
				{/if}
			{/snippet}
		</Table>
		{#if dataevent.length === 0}
			<p class="flex items-center justify-center text-center">No data available</p>
		{/if}
		<Pagination bind:currPage bind:entries totalItems={filterD(dummyAcara).length}></Pagination>
	</div>
</div>
{#if Dmodal}
	<form
		action="?/delete"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					console.log('Success deleting ID:', dataDelete);
					try {
						success = true;
						// goto(`/abdi/dashboard/situs/beranda/${idAktif}/detail/daftaracara`, {
						// 	replaceState: true
						// });
						setTimeout(() => {
							Dmodal = false;
							success = false;
							reloadPage();
						}, 3000);
					} catch (error) {}
				}
				if (result.type === 'failure') {
					console.log(result.data?.errors);
				}
			};
		}}
	>
		<DeleteModal
			bind:value={Dmodal}
			text="Apakah yakin ingin menghapus acara ini?"
			successText="Acara berhasil dihapus!"
			choose="delete"
		></DeleteModal>
		<input hidden name="id_acara" value={dataDelete} />
	</form>
{/if}
{#if success}
	<SuccessModal text="Acara berhasil dihapus!"></SuccessModal>
{/if}
