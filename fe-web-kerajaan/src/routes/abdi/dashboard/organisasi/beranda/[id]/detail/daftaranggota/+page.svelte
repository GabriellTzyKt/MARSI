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
	// let dataambil = $state(data.organisasiList);
	let id_organisasi = $state(data.organisasi_id);
	let dataanggota = $state(data.allAnggota);
	let allanggota = $state(data.allUsers);
	// console.log('Data ambil : ', dataambil);
	// console.log('Data anggota : ', dataanggota);
	// console.log('All anggota : ', allanggota);

	let idAktif = $state(page.params.id);

	let open = $state(false);
	let valo = $state(false);
	let error = $state();
	let data2 = $state();
	let keyword = $state('');
	let currPage = $state(1);
	let entries = $state(10);
	let loading = $state(false);
	let editD = $state(false);
	let editUserId = $state<any>(null);
	let success = $state(false);
	let dataEdit = $state<any>();
	function filterD(data: any[]) {
		return data.filter((item) => {
			// Check if item exists
			if (!item) return false;

			// Safely access properties with optional chaining and default to empty string if undefined
			const namaAnggota = item.nama_anggota?.toLowerCase() || '';
			const tanggalBergabung = item.tanggal_bergabung?.toLowerCase() || '';
			const jabatanOrganisasi = item.jabatan_organisasi?.toLowerCase() || '';
			const nomorTelepon = item.nomor_telepon?.toLowerCase() || '';
			const email = item.email?.toLowerCase() || '';

			// Convert keyword to lowercase once
			const keywordLower = keyword.toLowerCase();

			// Check if any property includes the keyword
			return (
				namaAnggota.includes(keywordLower) ||
				tanggalBergabung.includes(keywordLower) ||
				jabatanOrganisasi.includes(keywordLower) ||
				nomorTelepon.includes(keywordLower) ||
				email.includes(keywordLower)
			);
		});
	}
	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	let resdata = $derived(pagination(data.allAnggota));

	let timer: any;

	let deleteD = $state(false);
	let selectedItemId = $state<string | null>(null);
	let selectedOrgId = $state<string | null>(null);

	$effect(() => {
		let deleteId = page.url.searchParams.get('delete');
		let editId = page.url.searchParams.get('edit');
		if (deleteId) {
			deleteD = true;
			selectedItemId = deleteId;
			console.log('Selected Item:', selectedItemId);
			// Find the corresponding organization ID for this user
			const selectedAnggota = data.allAnggota.find((anggota: any) => anggota.id_user == deleteId);
			console.log('Anggota with id Found:', selectedAnggota);
			if (selectedAnggota) {
				console.log('selectedAnggota Founded!: ', selectedAnggota);
				console.log('Found organization ID for user:', selectedAnggota.id_organisasi);
			}
		}
		if (editId && !editD) {
			editD = true;
			editUserId = editId;
			// Find the corresponding organization ID for this user
			const selectedAnggota = data.allAnggota.find((anggota: any) => anggota.id_user == editId);
			const selectedOrg = data.organisasiList.find((anggota: any) => anggota.id_user == editId);
			console.log('Anggota with id Found:', selectedAnggota);
			if (selectedAnggota) {
				console.log('selectedAnggota Founded!: ', selectedOrg);
				selectedOrgId = selectedAnggota.id_organisasi;
				dataEdit = {
					id_user: selectedAnggota.id_user,
					nama_anggota: selectedAnggota.user_name,
					jabatan_anggota: selectedAnggota.jabatan_anggota,
					deskripsi_tugas: selectedAnggota.deskripsi_tugas
				};
				editUserId = selectedAnggota.id_user;
				selectedOrgId = selectedAnggota.id_organisasi;
				console.log('Data Edit: ', dataEdit);
			}
		}
	});

	// let toggle = () => {
	// 	if (!open) {
	// 		open = true;
	// 	} else open = false;
	// 	console.log(open);
	// };
</script>

{#if navigating.to}
	<Loader></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="flex w-full flex-col">
	<div class="flex flex-col justify-center gap-y-2 md:flex-row md:justify-between">
		<button
			class="bg-badran-bt cursor-pointer rounded-lg px-3 py-2 text-white"
			onclick={() => {
				open = true;
			}}>+Tambah Data</button
		>
		<div
			class=" flex flex-col items-center justify-center gap-x-2 gap-y-2 md:flex-row xl:mt-0 xl:justify-start"
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
	<div class="flex w-full">
		<Table
			table_header={[
				['user_name', 'Nama Anggota'],
				['tanggal_bergabung', 'Tanggal Bergabung'],
				['jabatan_anggota', 'Jabatan Anggota'],
				['user_notelp', 'Nomer Telpon'],
				['user_email', 'Email'],
				['children', 'Aksi']
			]}
			table_data={resdata}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text={`Apakah yakin ingin mengarsipkan ${data.nama_anggota}?`}
						items={[
							[
								'Edit',
								`/abdi/dashboard/organisasi/beranda/${id_organisasi}/detail/daftaranggota?edit=${data.id_user}`
							],
							[
								'children',
								'Arsipkan',
								`/abdi/dashboard/organisasi/beranda/${id_organisasi}/detail/daftaranggota?delete=${data.id_user}`
							]
						]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{/if}
			{/snippet}
		</Table>
	</div>
	<Pagination bind:currPage bind:entries totalItems={filterD(data.allAnggota).length}></Pagination>
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
					// Close the modal first
					open = false;

					// Then invalidate all data
					await invalidateAll();

					// Then show success message
					valo = true;

					clearTimeout(timer);
					timer = setTimeout(() => {
						valo = false;
					}, 3000);
				} else if (result.type === 'failure') {
					error = result.data?.errors || '';
				}
			};
		}}
	>
		<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
			<TambahAnggota bind:value={open} errors={error} {data2} {allanggota}></TambahAnggota>
		</div>
	</form>
{/if}

{#if valo}
	<SuccessModal text="Anggota berhasil Ditambah!"></SuccessModal>
{/if}

{#if deleteD && selectedItemId}
	<form
		action="?/hapus"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				try {
					console.log('Delete result:', result);
					if (result.type === 'success') {
						// First clear the URL parameter
						await goto(`/abdi/dashboard/organisasi/beranda/${idAktif}/detail/daftaranggota`, {
							replaceState: true
						});

						// Then invalidate all data
						await invalidateAll();

						// Then show success message and reset state
						deleteD = false;
						selectedItemId = null;
						selectedOrgId = null;
						valo = true;

						clearTimeout(timer);
						timer = setTimeout(() => {
							valo = false;
						}, 3000);
					} else if (result.type === 'failure') {
						error = result.data?.errors || '';
					}
				} catch (err) {
					console.error('Error during delete process:', err);
				} finally {
					// Always turn off loading state, even if there's an error
					loading = false;
				}
			};
		}}
	>
		<input type="hidden" name="id_user" value={selectedItemId} />
		<input type="hidden" name="id_organisasi" value={id_organisasi} />

		<DeleteModal
			bind:value={deleteD}
			text="Apakah yakin ingin menghapus anggota ini?"
			successText="Berhasil menghapus anggota!"
			choose="arsip"
		></DeleteModal>
	</form>
{/if}
{#if editD && editUserId}
	<form
		action="?/ubah"
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					try {
						goto(`/abdi/dashboard/organisasi/beranda/${id_organisasi}/detail/daftaranggota`, {
							replaceState: true
						});
						editD = false;
						editUserId = null;
						success = true;
						await invalidateAll();

						setTimeout(() => {
							success = false;
						}, 3000);
					} catch (err) {
						console.error('Error during edit process:', err);
					} finally {
						// Always turn off loading state, even if there's an error
						loading = false;
					}
				} else if (result.type === 'failure') {
					error = result.data?.errors || '';
				}
			};
		}}
	>
		<TambahAnggota bind:value={editD} errors={error} {data2} {dataEdit} {allanggota}
		></TambahAnggota>
		<input type="hidden" name="id_user" value={selectedItemId} />
		<input type="hidden" name="id_organisasi" value={id_organisasi} />
	</form>
{/if}
