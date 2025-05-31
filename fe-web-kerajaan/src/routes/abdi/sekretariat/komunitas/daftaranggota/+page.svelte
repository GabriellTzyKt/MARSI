<script lang="ts">
	import { navigating } from '$app/state';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import SimpleLoader from '$lib/loader/SimpleLoader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	// import TambahAnggota from '$lib/modal/TambahAnggota.svelte';
	import TambahAnggota from '$lib/popup/TambahAnggota.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Table from '$lib/table/Table.svelte';
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { invalidateAll } from '$app/navigation';
	import { env } from '$env/dynamic/public';
	import { formatDatetoUI } from '$lib';
	import { onMount } from 'svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';

	let keyword = $state('');
	let entries = $state(10);
	let { data } = $props();
	let dataListKomunitas = data?.data;
	let dataAnggota = data?.userData;
	let selectedKomunitas = $state(dataListKomunitas[0].id_komunitas || '');
	let currPage = $state(1);
	let loading = $state(false);
	let open = $state(false);
	let modalEdit = $state(false);
	let valo = $state(false);
	let success = $state(false);
	let deleteModal = $state(false);
	let IdDelete = $state('');
	let error = $state('');
	let editData = $state(null);
	let data2 = $state({});
	let timer;
	let loadUser = $state(false);
	let komunitasMembers = $state([]);

	// Function to fetch organization members
	async function fetchKomunitasMember(komId) {
		if (!komId) return;

		loadUser = true;
		komunitasMembers = [];
		try {
			console.log('Fetching members for organization:', komId);
			// Fetch members for the selected organization
			const aR = await fetch(`${env.PUBLIC_URL_KERAJAAN}/komunitas/anggota/${komId}?limit=200`);
			if (aR.ok) {
				let anggotaList = await aR.json();

				// Process each member to add user information

				anggotaList = anggotaList.map((item: any) => {
					return {
						...item,
						nama_anggota:
							data.fullUser.find((user: any) => user.id_user === item.id_user)?.nama_lengkap ||
							item.nama_anggota,
						email:
							data.fullUser.find((user: any) => user.id_user === item.id_user)?.email || item.email,
						nomor_telepon:
							data.fullUser.find((user: any) => user.id_user === item.id_user)?.no_telp ||
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
	// Function to filter data based on keyword and selected komunitas
	onMount(() => {
		if (selectedKomunitas) {
			fetchKomunitasMember(selectedKomunitas);
		}
	});
	function filterD(data: any[]) {
		// Filter berdasarkan komunitas yang dipilih terlebih dahulu
		let filteredByKomunitas = data;
		if (selectedKomunitas) {
			filteredByKomunitas = data.filter((item) => item.id_komunitas === selectedKomunitas);
		}

		// Kemudian filter berdasarkan keyword
		return filteredByKomunitas.filter(
			(item) =>
				item?.nama_anggota?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.tanggal_bergabung?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.jabatan_komunitas?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.nomor_telepon?.toLowerCase().includes(keyword.toLowerCase()) ||
				item?.email?.toLowerCase().includes(keyword.toLowerCase())
		);
	}

	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		return d.slice(start, end);
	}

	let resData = $derived(pagination(komunitasMembers || []));

	$effect(() => {
		if (keyword || entries || selectedKomunitas) {
			currPage = 1;
		}
	});
	$effect(() => {
		if (selectedKomunitas) {
			fetchKomunitasMember(selectedKomunitas);
		}
	});
	$effect(() => {
		if (entries <= 1) {
			entries = 1;
		}
	});
	function editID(data: any) {
		editData = data;
		modalEdit = true;
	}

	function deleteID(id: string) {
		IdDelete = id;
		deleteModal = true;
	}
</script>

{#if loading}
	<Loader></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}

<div class="flex w-full flex-col">
	<div class="flex flex-col lg:flex-row lg:justify-between">
		<button class="bg-badran-bt rounded-lg px-3 py-2 text-white" onclick={() => (open = true)}
			>+Tambah Data</button
		>
		<div
			class="mt-4 flex flex-col items-center justify-center gap-2 lg:mt-0 lg:flex-row lg:justify-start"
		>
			<!-- select -->
			<select
				name="Komunitas"
				id="komunitas"
				bind:value={selectedKomunitas}
				class="rounded-md border px-3 py-2 focus:outline-none"
			>
				<option value="">Semua Komunitas</option>
				{#each dataListKomunitas as komunitas}
					<option value={komunitas.id_komunitas}>{komunitas.nama_komunitas}</option>
				{/each}
			</select>
			<!-- cari -->
			<div class="flex items-center rounded-lg border px-2">
				<input
					type="text"
					placeholder="Cari Anggota..."
					bind:value={keyword}
					class="w-full py-2 focus:outline-none"
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
					/>
				</svg>
			</div>
			<!-- entries -->
			<div class="flex items-center gap-2">
				<span>Show</span>
				<input
					type="number"
					bind:value={entries}
					class="w-16 rounded-lg border px-2 py-2 focus:outline-none"
				/>
				<span>entries</span>
			</div>
		</div>
	</div>
	<div class="mt-4 overflow-x-auto">
		<Table
			table_header={[
				['nama_anggota', 'Nama Anggota'],
				['tanggal_bergabung', 'Tanggal Bergabung'],
				['jabatan_anggota', 'Jabatan Anggota'],
				['nomor_telepon', 'Nomer Telepon'],
				['email', 'Email'],
				['children', 'Aksi']
			]}
			table_data={resData}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDownNew
						text={`Apakah yakin ingin mengarsipkan ${data.nama_anggota}?`}
						items={[
							{
								label: 'Edit',
								action: () => editID(data)
							},
							{
								label: 'Non Aktifkan',
								action: () => deleteID(data.id_user)
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
		<Pagination bind:currPage bind:entries totalItems={filterD(dataAnggota || []).length}
		></Pagination>
	</div>
</div>

{#if modalEdit}
	<form
		action="?/editAnggota"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					valo = true;
					await fetchKomunitasMember(selectedKomunitas).then(() => {
						setTimeout(() => {
							valo = false;
						}, 3000);
					});

					modalEdit = false;
				} else if (result.type === 'failure') {
					error = result.data?.errors || '';
				}
			};
		}}
	>
		<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
			<input type="hidden" name="id_komunitas" value={editData?.id_komunitas} />
			<TambahAnggota
				bind:value={modalEdit}
				errors={error}
				dataEdit={editData}
				allanggota={data?.userData}
			></TambahAnggota>
		</div>
	</form>
{/if}

{#if open}
	<form
		action="?/tambah"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					valo = true;
					await fetchKomunitasMember(selectedKomunitas).then(() => {
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
			<input type="hidden" name="id_komunitas" value={selectedKomunitas} />
			<TambahAnggota bind:value={open} errors={error} {data2} allanggota={data?.userData}
			></TambahAnggota>
		</div>
	</form>
{/if}

{#if valo}
	<SuccessModal text="Anggota berhasil diproses!"></SuccessModal>
{/if}

{#if deleteModal}
	<form
		action="?/hapusAnggota"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					await fetchKomunitasMember(selectedKomunitas).then(() => {
						setTimeout(() => {
							success = false;
							deleteModal = false;
						}, 3000);
					});
				}
				if (result.type === 'failure') {
					console.log(result.data?.errors);
				}
			};
		}}
	>
		<input type="hidden" name="id_anggota" value={IdDelete} />
		<input type="hidden" name="id_komunitas" value={selectedKomunitas} />
		<DeleteModal
			bind:value={deleteModal}
			text="Apakah yakin ingin menghapus anggota ini?"
			successText="Anggota berhasil dihapus!"
			choose="delete"
		></DeleteModal>
	</form>
{/if}

{#if success}
	<SuccessModal text="Anggota berhasil diarsipkan!"></SuccessModal>
{/if}
