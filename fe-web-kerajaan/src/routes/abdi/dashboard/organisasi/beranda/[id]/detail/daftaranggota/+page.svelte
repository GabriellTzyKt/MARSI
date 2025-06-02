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
	import { use } from 'react';
	import { onMount, tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { string } from 'zod';

	let { data } = $props();
	// console.log(data);
	let allUser = data.userData;

	let idAktif = $state(page.params.id);

	let open = $state(false);
	let valo = $state(false);
	let error = $state();
	let data2 = $state();
	let keyword = $state('');
	let currPage = $state(1);
	let entries = $state(10);
	let clickedId = $state('');
	let editId = $state(false);
	let dataEdit = $state();
	let modaldelete = $state(false);
	let deleteId = $state();
	let loading = $state(false);
	let success = $state(false);
	let loadUser = $state(false);
	let organizationMembers = $state([]);

	async function fetchOrganizationMembers(organizationId) {
		if (!organizationId) return;

		loadUser = true;
		organizationMembers = [];
		try {
			console.log('Fetching members for organization:', organizationId);
			// Fetch members for the selected organization
			let anggotaResponse = await fetch(
				`${env.PUBLIC_URL_KERAJAAN}/organisasi/anggota/${organizationId}?limit=400`
			);
			if (anggotaResponse.ok) {
				let anggotaList = await anggotaResponse.json();

				anggotaList = anggotaList
					// .filter((item) => item.deleted_at == '0001-01-01T00:00:00Z' || !item.deleted_at)
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
			}
		} catch (error) {
			console.error('Error fetching organization members:', error);
		} finally {
			loadUser = false;
		}
	}
	onMount(async () => {
		try {
			loadUser = true;
			await fetchOrganizationMembers(data?.id_organisasi);
		} catch (error) {
			console.error('Error fetching members:', error);
		} finally {
			loadUser = false;
		}
	});

	function filterD(data: any[]) {
		// console.log(data);
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
	let resdata = $derived(pagination(organizationMembers));

	let timer: any;
	function handleEdit(userId: string) {
		console.log('USER EDIT : ', userId);
		// const userData = organizationMembers.find((item) => item.id_user.toString() == userId);
		// const datauser = data.allUsers.find((item) => item.id_user.toString() == userId);

		console.log('User data:', userId);
		// console.log('User data:', datauser);
		dataEdit = {
			organisasi_id: idAktif,
			id_user: userId?.id_user,
			nama_anggota: userId?.nama_anggota,
			deskripsi_tugas: userId?.deskripsi_tugas,
			tanggal_bergabung: userId?.tanggal_bergabung,
			jabatan_anggota: userId?.jabatan_anggota
		};
		console.log('Data Edit : ', dataEdit);
		editId = true;
	}

	async function handleDelete(userId: string) {
		console.log('Anda Menghapus user : ', userId);
		deleteId = userId;
		modaldelete = true;

		// try {
		// 	await fetch(`/abdi/api/anggota/${userId}`, {
		// 		method: 'DELETE'
		// 	});
		// 	invalidateAll(); // Refresh data
		// } catch (err) {
		// 	console.error('Gagal menghapus:', err);
		// }
	}

	// let toggle = () => {
	// 	if (!open) {
	// 		open = true;
	// 	} else open = false;
	// 	console.log(open);
	// };
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
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
				['nama_anggota', 'Nama Anggota'],
				['tanggal_bergabung', 'Tanggal Bergabung'],
				['jabatan_anggota', 'Jabatan Anggota'],
				['nomor_telepon', 'Nomer Telpon'],
				['email', 'Email'],
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
						data={resdata}
					></DropDownNew>
				{/if}
			{/snippet}
		</Table>
	</div>
	{#if loadUser}
		<div class="mt-2 flex justify-center">
			<SimpleLoader></SimpleLoader>
		</div>
	{/if}
	<Pagination bind:currPage bind:entries totalItems={filterD(resdata).length}></Pagination>
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
					try {
						success = true;
						await fetchOrganizationMembers(data?.id_organisasi).then(() => {
							setTimeout(() => {
								success = false;
								open = false;
							}, 3000);
						});
					} catch (error) {}
				} else if (result.type === 'failure') {
					error = result.data?.errors || '';
				}
			};
		}}
	>
		<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
			<TambahAnggota bind:value={open} errors={error} {data2} allanggota={data?.userData}
			></TambahAnggota>
		</div>
	</form>
{/if}
{#if editId}
	<form
		action="?/ubah"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				console.log(result);
				if (result.type === 'success') {
					try {
						// First close the modal
						success = true;

						// Force a complete data reload with the new approach

						await fetchOrganizationMembers(data?.id_organisasi).then(() => {
							setTimeout(() => {
								success = false;
								editId = false;
							}, 3000);
						});
					} catch (error) {
						console.error('Error refreshing data:', error);
					}
				} else if (result.type === 'failure') {
					error = result.data?.errors || '';
				}
			};
		}}
	>
		<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
			<TambahAnggota
				bind:value={editId}
				{dataEdit}
				errors={error}
				{data2}
				allanggota={data?.userData}
			></TambahAnggota>
			<input type="text" hidden name="id_organisasi" value={idAktif} id="" />
		</div>
	</form>
{/if}
{#if modaldelete}
	<form
		action="?/hapus"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					try {
						success = true;
						await fetchOrganizationMembers(data?.id_organisasi).then(() => {
							setTimeout(() => {
								success = false;
								modaldelete = false;
							}, 3000);
						});
					} catch (error) {
						console.error('Error refreshing data:', error);
					}
				} else if (result.type === 'failure') {
					error = result.data?.errors || '';
				}
			};
		}}
	>
		<DeleteModal
			bind:value={modaldelete}
			text="Apakah yakin ingin menghapus anggota ini?"
			successText="Anggota berhasil dihapus!"
			choose="delete"
		></DeleteModal>
		<input type="text" hidden name="id_organisasi" value={idAktif} id="" />
		<input type="text" hidden name="id_user" value={deleteId} id="" />
	</form>
{/if}
{#if valo}
	<SuccessModal text="Anggota berhasil Ditambah!"></SuccessModal>
{/if}
{#if success}
	<SuccessModal text="Aksi Berhasil Dilakukan!"></SuccessModal>
{/if}
