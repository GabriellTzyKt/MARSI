<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummySekreSitus, dummyAnggota } from '$lib/dummy';
	import Search from '$lib/table/Search.svelte';
	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	let { data } = $props();
	let keyword = $state('');
	let loading = $state(false);
	let success = $state(false);
	let entries = $state(10);
	let currPage = $state(1);
	let dataDelete = $state();
	let deleteModal = $state(false);
	// let id = $state();
	function filterD(data: any) {
		return data.filter(
			(item) =>
				item?.nama_situs?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.alamat?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.nama_pendiri?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.juru_kunci?.toLowerCase().includes(keyword.toLowerCase())
			// item?.wisata?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function deleteID(id: string) {
		console.log('Anda Menghapus situs : ', id);
		dataDelete = data.data.find((item) => item.id_situs === id).id_situs;
		deleteModal = true;
		console.log('Data Delete : ', dataDelete);
	}
	function pagination(data: any) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	let resData = $derived(pagination(data.data));
	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
		if (entries <= 1) {
			entries = 1;
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
	<div class="mx-4 flex flex-col justify-center gap-4 lg:flex-row lg:justify-between">
		<button class="bg-badran-bt rounded-lg px-3 py-2 text-white" onclick={() => goto('situs/buat')}
			>+Tambah Data</button
		>
		<div class="flex flex-col items-center justify-center gap-2 lg:flex-row lg:justify-start">
			<!-- select -->

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
	<div class="mx-4 flex flex-col">
		<Table
			table_header={[
				['nama_situs', 'Nama Situs'],
				['alamat', 'Alamat Situs'],
				['nama_pendiri', 'Dibangun Oleh'],
				['juru_kunci', 'Juru Kunci'],
				['nama_wisata', 'Wisata'],
				['children', 'Aksi']
			]}
			table_data={resData}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDownNew
						text={`Apakah yakin ingin mengarsipkan ${data.nama_situs}?`}
						items={[
							{
								label: 'Detail',
								action: () => goto(`/abdi/sekretariat/situs/detail/${data.id_situs}`)
							},
							{
								label: 'Edit',
								action: () => goto(`/abdi/sekretariat/situs/edit/${data.id_situs}`)
							},
							{
								label: 'Buku Tamu',
								action: () => goto(`/abdi/sekretariat/situs/bukutamu/${data.id_situs}`)
							},
							{
								label: 'Hapus',
								action: () => deleteID(data.id_situs)
							}
						]}
						id={`id-${index}`}
						{data}
					></DropDownNew>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(data.data).length}></Pagination>
	</div>
</div>
{#if deleteModal}
	<form
		action="?/hapus"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					dataDelete = false;
					invalidateAll();
					setTimeout(() => {
						success = false;
					}, 3000);
				}
				if (result.type === 'failure') {
					console.log(result.data?.errors);
				}
			};
		}}
	>
		<DeleteModal
			bind:value={dataDelete}
			text="Apakah yakin ingin menghapus situs ini?"
			successText="Situs berhasil dihapus!"
			choose="delete"
		></DeleteModal>

		<input type="hidden" name="id_situs" value={dataDelete} />
	</form>
{/if}
{#if success}
	<SuccessModal text="Situs berhasil dihapus!"></SuccessModal>
{/if}
