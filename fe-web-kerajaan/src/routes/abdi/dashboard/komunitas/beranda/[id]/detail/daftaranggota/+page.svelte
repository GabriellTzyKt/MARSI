<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyAnggota } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import TambahAnggota from '$lib/popup/TambahAnggota.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import { fade } from 'svelte/transition';
	let { data } = $props();
	let dataambil = data.data;
	let datakomunitas = data.komunitas_id;
	let dataTugas = data.komunitasList;
	let entries = $state(10);
	let keyword = $state('');
	let deleteD = $state(false);
	let success = $state(false);
	let selectedItemId = $state<string | null>(null);
	let currPage = $state(1);
	let loading = $state(false);
	let editModal = $state(false);
	let editModalId = $state<any>();
	let dataEdit = $state<any>();
	$effect(() => {
		const deleteId = page.url.searchParams.get('delete');
		const editId = page.url.searchParams.get('edit');
		if (deleteId) {
			console.log('Found delete ID in URL:', deleteId);
			deleteD = true;
			// Store the ID for the delete operation
			selectedItemId = deleteId;
		}
		if (editId) {
			console.log('Found edit ID in URL:', editId);
			const userData = data.komunitasList.find((item) => item.id_user.toString() === editId);
			const datakom = data.dataUser.find((item) => item.id_user.toString() === editId);

			console.log('User data:', userData);
			console.log('User data:', datakom);
			editModal = true;
			dataEdit = {
				komunitas_id: datakomunitas,
				id_user: userData.id_user,
				nama_anggota: datakom.nama_lengkap,
				jabatan: userData.jabatan_anggota,
				deskripsi_tugas: userData.deskripsi_tugas
			};
			// Store the ID for the delete operation
			editModalId = editId;
		}
	});
	console.log(data.allAnggota);
	console.log('komunitas : ', data.komunitas_id);
	// let dataanggota = data.allAnggota;
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_lengkap?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.email?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.notelp?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jabatan_komunitas?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	let resdata = $derived(pagination(data.data));

	let idAktif = $state('');
	$effect(() => {
		if (resdata) {
			console.log(resdata);
		}
		idAktif = page.params.id;
	});

	let open = $state(false);
	let valo = $state(false);
	let error = $state();
	let data2 = $state();

	let timer: any;

	let toggle = () => {
		if (!open) {
			open = true;
		} else open = false;
		console.log(open);
	};
</script>

{#if loading}
	<Loader></Loader>
{/if}

<div class="flex w-full flex-col">
	<div class="flex flex-col xl:flex-row xl:justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white hover:cursor-pointer"
			onclick={toggle}>+Tambah Data</button
		>
		<div class="mt-4 flex items-center justify-center gap-2 xl:mt-0 xl:justify-start">
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
				['nama_lengkap', 'Nama Anggota'], // blom
				['tanggal_bergabung', 'Tanggal Bergabung'],
				['jabatan_komunitas', 'Jabatan Organisasi'],
				['no_telp', 'Nomer Telpon'], // blom
				['email', 'Email'], // blom
				['children', 'Aksi']
			]}
			table_data={resdata}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text="Apakah yakin ingin di arsip?"
						id={`id-${index}`}
						{data}
						items={[
							[
								'Ubah',
								`/abdi/dashboard/komunitas/beranda/${datakomunitas}/detail/daftaranggota?edit=${data.id_user}`
							],
							[
								'children',
								'Arsipkan',
								`/abdi/dashboard/komunitas/beranda/${datakomunitas}/detail/daftaranggota?delete=${data.id_user}`
							]
						]}
					></DropDown>
				{/if}
			{/snippet}
		</Table>
		<Pagination bind:currPage bind:entries totalItems={filterD(data.data).length}></Pagination>
	</div>
</div>
{#if open}
	<form
		action="?/tambah"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				console.log(result);
				if (result.type === 'success') {
					valo = true;
					clearTimeout(timer);
					goto(`/abdi/dashboard/komunitas/beranda/${page.params.id}/detail/daftaranggota`, {
						replaceState: true
					});
					invalidateAll();
					timer = setTimeout(() => {
						valo = false;
					}, 3000);
					open = false;
				} else if (result.type === 'failure') {
					error = result.data?.errors || '';
				}
			};
		}}
	>
		<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
			<TambahAnggota bind:value={open} errors={error} {data2} allanggota={data.dataUser}
			></TambahAnggota>
			<input type="text" hidden name="id_komunitas" value={data.komunitas_id} />
		</div>
	</form>
{/if}
{#if deleteD && selectedItemId}
	<form
		action="?/hapus"
		method="post"
		use:enhance={() => {
			const idToDelete = selectedItemId;
			console.log('Form submitted with ID from URL:', idToDelete);
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					console.log('Success deleting ID:', idToDelete);
					success = true;
					deleteD = false;
					selectedItemId = null;
					goto(`/abdi/dashboard/komunitas/beranda/${datakomunitas}/detail/daftaranggota`, {
						replaceState: true
					});
					// Remove the delete parameter from URL
					setTimeout(() => {
						success = false;
						invalidateAll();
					}, 3000);
				}
				if (result.type === 'failure') {
					console.error('Failed to delete ID:', idToDelete, result);
				}
			};
		}}
	>
		<input type="hidden" name="id_user" value={selectedItemId} />
		<input type="hidden" name="id_komunitas" value={data.komunitas_id} />

		<DeleteModal
			text="Apakah yakin ingin menghapus anggota ini?"
			successText="Anggota berhasil dihapus!"
			choose="delete"
			bind:value={deleteD}
		/>
	</form>
{/if}

{#if editModal && editModalId}
	<form
		action="?/ubah"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				console.log(result);
				if (result.type === 'success') {
					valo = true;

					editModalId = null;
					clearTimeout(timer);
					goto(`/abdi/dashboard/komunitas/beranda/${datakomunitas}/detail/daftaranggota`, {
						replaceState: true
					});
					invalidateAll();
					timer = setTimeout(() => {
						valo = false;
						editModal = false;
						editModalId = null;
					}, 3000);
					editModal = false;
				} else if (result.type === 'failure') {
					error = result.data?.errors || '';
				}
			};
		}}
	>
		<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
			<TambahAnggota bind:value={editModal} errors={error} {dataEdit} allanggota={data.dataUser}
			></TambahAnggota>
			<input type="text" hidden name="id_komunitas" value={data.komunitas_id} />
			<input type="text" hidden name="id_user" value={editModalId} />
		</div>
	</form>
{/if}
{#if valo}
	<SuccessModal text="Anggota berhasil Ditambah!"></SuccessModal>
{/if}
{#if success}
	<SuccessModal text="Anggota berhasil Dihapus!"></SuccessModal>
{/if}
