<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import DropDownNew from '$lib/dropdown/DropDownNew.svelte';
	import { dummyAnggota } from '$lib/dummy';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import TambahAnggota from '$lib/popup/TambahAnggota.svelte';
	import Pagination from '$lib/table/Pagination.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { string } from 'zod';

	let { data } = $props();
	let dataambil = data.organisasiList;
	let dataanggota = $state(data.allAnggota);
	let allanggota = data.allUsers;
	console.log('Data ambil : ', dataambil);
	console.log('Data anggota : ', dataanggota);
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
	let loading = $state(false);
	let success = $state(false);

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
	let resdata = $derived(pagination(dataanggota));

	let timer: any;
	function handleEdit(userId: string) {
		console.log('USER EDIT : ', userId);
		goto(`/abdi/dashboard/organisasi/beranda/${idAktif}/detail/daftaranggota?edit=${userId}`);
		const userData = dataanggota.find((item) => item.id_user.toString() == userId);
		// const datauser = data.allUsers.find((item) => item.id_user.toString() == userId);

		console.log('User data:', userData);
		// console.log('User data:', datauser);
		dataEdit = {
			organisasi_id: idAktif,
			id_user: userData.id_user,
			nama_anggota: userData.user_name,
			deskripsi_tugas: userData.deskripsi_tugas,
			tanggal_bergabung: userData.tanggal_bergabung,
			jabatan_anggota: userData.jabatan_anggota
		};
		console.log('Data Edit : ', dataEdit);
		editId = true;
	}

	async function handleDelete(userId: string) {
		const confirmed = confirm('Yakin ingin menghapus anggota ini?');
		if (!confirmed) return;

		try {
			await fetch(`/abdi/api/anggota/${userId}`, {
				method: 'DELETE'
			});
			invalidateAll(); // Refresh data
		} catch (err) {
			console.error('Gagal menghapus:', err);
		}
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
					<DropDownNew
						text={`Apakah yakin ingin mengarsipkan ${data.nama_anggota}?`}
						items={[
							{
								label: 'Edit',
								action: () => handleEdit(data.id_user)
							},
							{
								label: 'Hapus',
								action: () => handleDelete(data.id_user),
								confirmText: `Yakin ingin menghapus ${data.nama_anggota}?`
							}
						]}
						id={`id-${index}`}
						data={resdata}
					></DropDownNew>
				{/if}
			{/snippet}
		</Table>
	</div>
	<Pagination bind:currPage bind:entries totalItems={filterD(dataanggota).length}></Pagination>
</div>
{#if open}
	<form
		action="?/tambah"
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				console.log(result);
				if (result.type === 'success') {
					valo = true;
					success = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						success = false;
						open = false;
						valo = false;
						invalidateAll();
					}, 3000);
				} else if (result.type === 'failure') {
					error = result.data?.errors || '';
				}
			};
		}}
	>
		<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
			<TambahAnggota bind:value={open} bind:open={valo} errors={error} {data2} {allanggota}
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

						// Force a complete data reload
						await invalidateAll();
						await tick();
						editId = true;
						success = true;
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;
							editId = false;
							// Force another refresh to ensure data is updated
							window.location.href = window.location.pathname;
						}, 3000);
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
				bind:open={editId}
				errors={error}
				{data2}
				{allanggota}
			></TambahAnggota>
			<input type="text" hidden name="id_organisasi" value={idAktif} id="" />
		</div>
	</form>
{/if}
{#if valo}
	<SuccessModal text="Anggota berhasil Ditambah!"></SuccessModal>
{/if}
{#if success}
	<SuccessModal text="Aksi Berhasil Dilakukan!"></SuccessModal>
{/if}
