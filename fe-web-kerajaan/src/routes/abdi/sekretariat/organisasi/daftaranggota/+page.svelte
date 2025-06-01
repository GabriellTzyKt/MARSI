<script lang="ts">
	import { enhance } from '$app/forms';
	import { navigating } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyAnggota } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import TambahAnggota from '$lib/popup/TambahAnggota.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Table from '$lib/table/Table.svelte';
	import { Item } from '@radix-ui/react-dropdown-menu';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import SimpleLoader from '$lib/loader/SimpleLoader.svelte';
	import { formatDate, formatDatetoUI } from '$lib';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	let { data } = $props();
	let keyword = $state('');
	let dataOrganisasi = data.data;
	let entries = $state(10);
	let open = $state(false);
	let valo = $state(false);
	let error = $state();
	let data2 = $state();
	let success = $state(false);
	let timer: any;
	// let deleteID = $state();
	let deleteModal = $state(false);
	let IdDelete = $state();
	let currPage = $state(1);
	let loading = $state(false);
	let loadUser = $state(false);
	// let jabatan = $state();
	let selectedOrganisasi = $state(dataOrganisasi[0]?.id_organisasi || '');
	let organizationMembers = $state([]);

	// Function to fetch organization members
	async function fetchOrganizationMembers(orgId) {
		if (!orgId) return;

		loadUser = true;
		organizationMembers = [];
		try {
			console.log('Fetching members for organization:', orgId);
			// Fetch members for the selected organization
			const aR = await fetch(`${env.PUBLIC_URL_KERAJAAN}/organisasi/anggota/${orgId}?limit=200`);
			if (aR.ok) {
				let anggotaList = await aR.json();

				// Process each member to add user information

				anggotaList = anggotaList
					.filter((item) => item.deleted_at === '0001-01-01T00:00:00Z')
					.map((item: any) => {
						return {
							...item,
							nama_anggota:
								data.allUser.find((user: any) => user.id_user === item.id_user)?.nama_lengkap ||
								item.nama_anggota,
							email:
								data.allUser.find((user: any) => user.id_user === item.id_user)?.email ||
								item.email,
							nomor_telepon:
								data.allUser.find((user: any) => user.id_user === item.id_user)?.no_telp ||
								item.nomor_telepon,
							tanggal_bergabung: formatDatetoUI(item.tanggal_bergabung)
						};
					});
				console.log('Fetched members:', anggotaList);
				// Fetch user information for each member
				// Process each member to add user information

				organizationMembers = anggotaList;
			} else {
				console.error('Failed to fetch organization members:', aR.statusText);
			}
		} catch (error) {
			console.error('Error fetching organization members:', error);
		} finally {
			loadUser = false;
		}
	}

	// Update resData to use real data instead of dummy data
	$effect(() => {
		resData = pagination(organizationMembers);
	});

	// Fetch members when organization selection changes
	$effect(() => {
		if (selectedOrganisasi) {
			fetchOrganizationMembers(selectedOrganisasi);
		}
	});

	// Update filterD function to handle potential undefined properties
	function filterD(data: any[]) {
		if (!data) return [];

		return data.filter((item) => {
			if (!item) return false;

			const namaAnggota = item.nama_anggota?.toLowerCase() || '';
			const tanggalBergabung = item.tanggal_bergabung?.toLowerCase() || '';
			const jabatanOrganisasi = item.jabatan_anggota?.toLowerCase() || '';
			const nomorTelepon = item.nomor_telepon?.toLowerCase() || '';
			const email = item.email?.toLowerCase() || '';

			const keywordLower = keyword.toLowerCase();

			return (
				namaAnggota.includes(keywordLower) ||
				tanggalBergabung.includes(keywordLower) ||
				jabatanOrganisasi.includes(keywordLower) ||
				nomorTelepon.includes(keywordLower) ||
				email.includes(keywordLower)
			);
		});
	}

	// Initialize data on mount
	onMount(() => {
		if (selectedOrganisasi) {
			fetchOrganizationMembers(selectedOrganisasi);
		}
	});

	function pagination(data: any[]) {
		let d = filterD(data);
		let start = (currPage - 1) * entries;
		let end = start + entries;
		console.log(d);
		return d.slice(start, end);
	}
	let resData = $derived(pagination(organizationMembers));
	$effect(() => {
		if (keyword || entries) {
			currPage = 1;
		}
		if (entries < 0) {
			entries = 0;
		}
	});
	function deleteID(id: string) {
		console.log('Anda Menghapus anggota : ', id);
		IdDelete = id;

		// jabatan = organizationMembers?.find((item) => item.id_anggota === id).jabatan_anggota;
		deleteModal = true;
	}

	let editData = $state();
	let modalEdit = $state(false);
	function editID(data: any) {
		console.log('Anda Mengedit anggota : ', data);
		editData = data;
		modalEdit = true;
		// goto(`/abdi/sekretariat/organisasi/daftaranggota/edit/${id}`);
	}
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
			class="bg-badran-bt cursor-pointer rounded-lg px-3 py-2 text-white"
			onclick={() => {
				open = true;
			}}>+Tambah Data</button
		>
		<div
			class="mt-4 flex flex-col items-center justify-center gap-2 lg:mt-0 lg:flex-row lg:justify-start"
		>
			<!-- select -->
			<select
				name="Organisasi"
				id=""
				bind:value={selectedOrganisasi}
				placeholder="cari organisasi"
				class="rounded-md border px-3 py-2 focus:outline-none"
			>
				{#each dataOrganisasi as item}
					<option value={item.id_organisasi}>{item.nama_organisasi}</option>
				{/each}
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
				// ['id_anggota', 'Id Anggota'],
				['nama_anggota', 'Nama Anggota'],
				['tanggal_bergabung', 'Tanggal Bergabung'],
				['jabatan_anggota', 'Jabatan Organisasi'],
				['nomor_telepon', 'Nomer Telpon'],
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
		<Pagination bind:currPage bind:entries totalItems={filterD(dummyAnggota).length}></Pagination>
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
					await fetchOrganizationMembers(selectedOrganisasi).then(() => {
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
			<input type="hidden" name="id_organisasi" value={selectedOrganisasi} />
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
				console.log(result);
				if (result.type === 'success') {
					valo = true;
					await fetchOrganizationMembers(selectedOrganisasi).then(() => {
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
			<input type="hidden" name="id_organisasi" value={selectedOrganisasi} />
			<TambahAnggota bind:value={open} errors={error} {data2} allanggota={data?.userData}
			></TambahAnggota>
		</div>
	</form>
{/if}
{#if valo}
	<SuccessModal text="Anggota berhasil Ditambah!"></SuccessModal>
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
					deleteModal = false;
					await fetchOrganizationMembers(selectedOrganisasi).then(() => {
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
			text="Apakah yakin ingin menghapus anggota ini?"
			successText="Anggota berhasil dihapus!"
			choose="delete"
		></DeleteModal>
		<input type="hidden" name="id_anggota" value={IdDelete} />
		<input type="hidden" name="id_organisasi" value={selectedOrganisasi} />
	</form>
{/if}
{#if success}
	<SuccessModal text="Berhasil"></SuccessModal>
{/if}
