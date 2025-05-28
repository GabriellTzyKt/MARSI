<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Table from '$lib/table/Table.svelte';

	let { data } = $props();
	let keyword = $state('');
	let entries = $state(10);
	let currPage = $state(1);
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_komunitas?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal_berdiri?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.no_telp?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.penanggungjawab?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.pelingung?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.pembina?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function pagination(data: any[]) {
		let dataa = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		return dataa.slice(start, end);
	}
	let resdata = $derived(pagination(data?.komunitas || []));
	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
		if (entries <= 1) {
			entries = 1;
		}
	});
	console.log(data);
	let dataKom = data?.komunitas || [];
	let deleteID = $state();
	let deleteModal = $state(false);

	function nonAktifkan(id: any) {
		console.log('Non Aktifkan : ', id);
		deleteID = id;
		deleteModal = true;
	}
</script>

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
				['nama_komunitas', 'Nama Komunitas'],
				['tanggal_berdiri', 'Tanggal Berdiri'],
				['no_telp', 'No Telepon'],
				['penanggungjawab', 'Penanggung Jawab'],
				['pelindung', 'Pelindung'],
				['pembina', 'Pembina'],

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
								label: 'Detail',
								action: () =>
									goto(
										`/abdi/situs/beranda/${data?.id_situs}/detail/daftarkomunitas/${data.id_anggota}`
									)
							},
							{
								label: 'Non Aktifkan',
								action: () => nonAktifkan(data.id_komunitas)
							}
						]}
						id={`id-${index}`}
						{data}
					></DropDownNew>
				{/if}
			{/snippet}
		</Table>
		{#if resdata.length === 0}
			<p class="flex items-center justify-center text-center">No data available</p>
		{/if}
		<Pagination bind:currPage bind:entries totalItems={filterD(resdata).length}></Pagination>
	</div>
</div>
{#if deleteModal}
	<form
		action="?/deleteAbdi"
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					// Handle success, e.g., show a notification or redirect
					console.log('Delete successful');
					goto('/abdi/situs/beranda');
				} else if (result.type === 'failure') {
					// Handle failure, e.g., show an error message
					console.error('Delete failed', result.data?.errors);
				}
			};
		}}
	>
		<DeleteModal
			text="Apakah yakin ingin menghapus anggota ini?"
			successText="Anggota berhasil dihapus!"
			choose="delete"
			bind:value={deleteModal}
		/>
		<input type="hidden" name="id_komunitas" value={deleteID} />
	</form>
{/if}
