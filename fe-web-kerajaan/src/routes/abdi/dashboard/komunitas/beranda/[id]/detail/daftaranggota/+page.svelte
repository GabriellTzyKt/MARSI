<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import { formatDatetoUI } from '$lib';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import { dummyAnggota } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import SimpleLoader from '$lib/loader/SimpleLoader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import TambahAnggota from '$lib/popup/TambahAnggota.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	let dataambil = data.data;
	console.log(data);
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
	let editData = $state<any>();
	let dataEdit = $state<any>();
	let deleteModal = $state(false);
	let deleteId = $state<any>();
	let loadUser = $state(false);
	let komunitasMembers = $state([]);
	onMount(async () => {
		console.log('data', data);
		try {
			loadUser = true;
			await fetchKomunitasMember(data?.komunitas_id);
		} catch (error) {
			console.error('Error fetching members:', error);
		} finally {
			loadUser = false;
		}
	});
	async function fetchKomunitasMember(komId) {
		if (!komId) return;

		loadUser = true;
		komunitasMembers = [];
		try {
			console.log('Fetching members for organization:', komId);
			// Fetch members for the selected organization
			let anggotaResponse = await fetch(
				`${env.PUBLIC_URL_KERAJAAN}/komunitas/anggota/${komId}?limit=200`
			);
			if (anggotaResponse.ok) {
				let anggotaList = await anggotaResponse.json();

				anggotaList = anggotaList

					.filter((item) => item.deleted_at == '0001-01-01T00:00:00Z')
					.map((item: any) => {
						return {
							...item,
							nama_anggota:
								data.dataUser.find((user: any) => user.id_user === item.id_user)?.nama_lengkap ||
								item.nama_anggota,
							email:
								data.dataUser.find((user: any) => user.id_user === item.id_user)?.email ||
								item.email,
							nomor_telepon:
								data.dataUser.find((user: any) => user.id_user === item.id_user)?.no_telp ||
								item.nomor_telepon,
							tanggal_bergabung: formatDatetoUI(item.tanggal_bergabung)
						};
					});
				console.log('Fetched members:', anggotaList);
				// Fetch user information for each member
				// Process each member to add user information

				komunitasMembers = anggotaList;
			}
		} catch (error) {
			console.error('Error fetching organization members:', error);
		} finally {
			loadUser = false;
		}
	}
	function handleEdit(data: any) {
		editModal = true;
		editData = data;

		console.log('User data:', editData);
		console.log(
			'Data Kom:',
			komunitasMembers.find((item: any) => item.id_user == editData.id_user)
		);
		let dataT = komunitasMembers.find((item: any) => item.id_user == editData.id_user);
		console.log('dataT', dataT);
		dataEdit = {
			komunitas_id: dataT?.id_komunitas,
			id_user: dataT?.id_user,
			nama_anggota: dataT?.nama_anggota,
			deskripsi_tugas: dataT?.deskripsi_tugas,
			// tanggal_bergabung: dataT.tanggal_bergabung,
			jabatan_anggota: dataT?.jabatan_anggota
		};
		console.log('datakirim', dataEdit);
	}
	function handleDelete(id: string) {
		console.log('Anda Menghapus user : ', id);
		deleteModal = true;
		deleteId = id;
	}

	// console.log(data.allAnggota);
	console.log('komunitas : ', data.komunitas_id);
	// let dataanggota = data.allAnggota;
	function filterD(data: any[]) {
		return data.filter(
			(item) =>
				item?.nama_anggota?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.email?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.nomor_telepon?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jabatan_anggota?.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	let resdata = $derived(pagination(komunitasMembers || []));

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
	let totalFiltered = $derived(() => filterD(komunitasMembers).length);
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
				['nama_anggota', 'Nama Anggota'], // blom
				['tanggal_bergabung', 'Tanggal Bergabung'],
				['jabatan_anggota', 'Jabatan Organisasi'],
				['nomor_telepon', 'Nomer Telpon'], // blom
				['email', 'Email'], // blom
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
								action: () => handleEdit(data)
							},
							{
								label: 'Hapus',
								action: () => handleDelete(data.id_user)
							}
						]}
						id={`id-${index}`}
					></DropDownNew>
				{/if}
			{/snippet}
		</Table>
		{#if loadUser}
			<div class="flex justify-center">
				<SimpleLoader></SimpleLoader>
			</div>
		{/if}
		<Pagination bind:currPage bind:entries totalItems={totalFiltered()}></Pagination>
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
					await fetchKomunitasMember(data?.komunitas_id).then(() => {
						setTimeout(() => {
							valo = false;
						}, 3000);
					});

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
{#if deleteModal}
	<form
		action="?/hapus"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					// console.log('Success deleting ID:', idToDelete);
					success = true;
					deleteModal = false;
					// selectedItemId = null;
					await fetchKomunitasMember(data?.komunitas_id).then(() => {
						setTimeout(() => {
							success = false;
						}, 3000);
					});
				}
				if (result.type === 'failure') {
					// console.error('Failed to delete ID:', idToDelete, result);
				}
			};
		}}
	>
		<input type="hidden" name="id_user" value={deleteId} />
		<input type="hidden" name="id_komunitas" value={data.komunitas_id} />

		<DeleteModal
			text="Apakah yakin ingin menghapus anggota ini?"
			successText="Anggota berhasil dihapus!"
			choose="delete"
			bind:value={deleteModal}
		/>
	</form>
{/if}

{#if editModal}
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

					editData = null;
					clearTimeout(timer);

					editModal = false;
					editData = null;
					await fetchKomunitasMember(data?.komunitas_id).then(() => {
						setTimeout(() => {
							valo = false;
						}, 3000);
					});
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
			<input type="text" hidden name="id_user" value={editData.id_user} />
		</div>
	</form>
{/if}
{#if valo}
	<SuccessModal text=" berhasil!"></SuccessModal>
{/if}
{#if success}
	<SuccessModal text="Anggota berhasil Dihapus!"></SuccessModal>
{/if}
