<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import { dummySekreAnggotaOrg, dummyHistoryGelar } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import HistoryPopUp from '$lib/popup/HistoryPopUp.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	let { data } = $props();

	let dataAmbil = data.data;
	let keyword = $state('');
	let entries = $state(10);
	let currPage = $state(1);
	let modalDelete = $state(false);
	let dataDelete = $state();
	let success = $state(false);
	let loading = $state(false);
	let deleteID = $state();
	let gelarModal = $state(false);
	let gelarDataID = $state();
	let BJModal = $state(false);
	let BJID = $state();
	function openGelar(id: any) {
		console.log('Open Gelar : ', id);
		gelarDataID = id;
		gelarModal = true;
	}
	function nonAktifkan(id: any) {
		console.log('Non Aktifkan : ', id);
		deleteID = id;
		modalDelete = true;
	}

	function openBJ(id: any) {
		console.log('Open BJ : ', id);
		BJModal = true;
		BJID = id;
	}
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_lengkap?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.panggilan?.toLowerCase().includes(keyword.toLowerCase()) ||
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
	let resdata = $derived(pagination(data.data || []));
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
			onclick={() => goto('daftaranggota/tambah')}>+Tambah Data</button
		>
		<div
			class="mt-4 flex flex-col items-center justify-center gap-2 lg:mt-0 lg:flex-row lg:justify-start"
		>
			<!-- select -->
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
				['nama_lengkap', 'Nama Lengkap'],
				// ['panggilan', 'Asma Dalem'],
				['tempat_lahir', 'Tempat Lahir'],
				['tanggal_lahir', 'Tanggal Lahir'],
				['jabatan', 'Jabatan'],
				// ['nama_gelar', 'Gelar'],
				['no_telp', 'Nomer Telepon'],
				['children', 'Aksi']
			]}
			table_data={resdata}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDownNew
						text={`Apakah yakin ingin mengarsipkan ${data.nama_anggota}?`}
						items={[
							{
								label: 'Edit',
								action: () =>
									goto(`/abdi/sekretariat/anggota/daftaranggota/ubah/${data.id_anggota}`)
							},
							{
								label: 'History Gelar',
								action: () => openGelar(data.id_anggota)
							},
							{
								label: 'History Bintang Jasa',
								action: () => openBJ(data.id_anggota)
							},
							{
								label: 'Non Aktifkan',
								action: () => nonAktifkan(data.id_anggota)
							}
						]}
						id={`id-${index}`}
						{data}
					></DropDownNew>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(dataAmbil).length}></Pagination>
	</div>
</div>
{#if modalDelete}
	<form
		action="?/hapusAnggota"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					console.log('Success deleting ID:', dataDelete);
					try {
						success = true;
						// goto(`/abdi/sekretariat/anggota/daftaranggota`, {
						// 	replaceState: true
						await invalidateAll().then(() => {
							setTimeout(() => {
								modalDelete = false;
								success = false;
							}, 1000);
						});
						// });
					} catch (error) {}
				}
				if (result.type === 'failure') {
					console.log(result.data?.errors);
				}
			};
		}}
	>
		<DeleteModal
			bind:value={modalDelete}
			text="Apakah yakin ingin menghapus anggota ini?"
			successText="Anggota berhasil dihapus!"
			choose="delete"
		></DeleteModal>
		<input type="hidden" name="id_anggota" value={deleteID} />
	</form>
{/if}
{#if success}
	<SuccessModal text="Anggota berhasil dihapus!"></SuccessModal>
{/if}
{#if gelarModal}
	<HistoryPopUp
		userId={gelarDataID}
		bind:value={gelarModal}
		title="History Gelar"
		header={[
			['nama_gelar', 'Nama Gelar'],
			['nama_pemberi', 'Nama Pelantik'],
			['tanggal_penerimaan', 'Tanggal Dilantik'],
			['nama_acara', 'Acara'],
			['picture', 'Sertifikat']
		]}
	></HistoryPopUp>
{/if}
{#if BJModal}
	<HistoryPopUp
		userId={BJID}
		bind:value={BJModal}
		title="History Bintang Jasa"
		header={[
			['nama_penghargaan', 'Nama Bintang Jasa'],
			['nama_pemberi', 'Pemberi Bintang Jasa'],
			['tanggal_penerimaan', 'Tanggal Bintang Jasa'],
			['nama_acara', 'Acara'],
			['keterangan', 'Keterangan'],
			['picture', 'Sertifikat']
		]}
	></HistoryPopUp>
{/if}
