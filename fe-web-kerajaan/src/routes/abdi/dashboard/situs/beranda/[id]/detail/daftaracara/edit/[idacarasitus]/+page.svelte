<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import TambahArray from '$lib/tambah/TambahArray.svelte';
	import { fade } from 'svelte/transition';
	import { number } from 'zod';
	import { writable } from 'svelte/store';
	import { formatDate, formatTime } from '$lib';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { env } from '$env/dynamic/public';
	let { form, data } = $props();

	let input_radio = $state(data?.acara?.jenis_acara || '');
	let namaacara = $state('');
	let lokasiacara: any = $state('');
	let tujuanacara = $state<Number>(data?.acara.tujuan_acara || '');
	let deskripsiacara = $state('');
	let kapasitasacara = $state('');
	let penanggungjawab: any = $state('');
	let penyelenggaraacara = $state('');
	let tanggalmulai = $state('');
	let alamatacara = $state('');
	let tanggalselesai = $state('');
	let waktumulai = $state('');
	let waktuselesai = $state('');
	let buttonselect = $state('baru');
	let error: any = $state('');
	let lokasi = $state(Number(data.acara.id_lokasi));
	console.log('id lokasi', lokasi);

	let panggilan: any = $state([]);
	let namabawah: any = $state([]);
	let namalengkapbawah = $state([]);
	let namajabatan = $state([]);
	let notelpbawah: any = $state([]);

	let dataacara = data.acara;
	console.log('Data : ', data);
	console.log('Data acara : ', dataacara);
	console.log('form data', form);

	let selectedAcara = null;

	// $effect(() => {
	// 	if (activeTab === 'completed' && namaacara) {
	// 		selectedAcara = data.acara.find((a: any) => a.nama_acara === namaacara) ?? null;
	// 		lokasiacara = Number(selectedAcara.id_lokasi);
	// 		penanggungjawab = Number(selectedAcara.id_penanggung_jawab);
	// 		alamatacara = selectedAcara.alamat_acara;
	// 		kapasitasacara = selectedAcara.kapasitas_acara;
	// 		deskripsiacara = selectedAcara.deskripsi_acara;
	// 		tujuanacara = selectedAcara.tujuan_acara;
	// 		input_radio = selectedAcara.jenis_acara;
	// 		console.log('Selected : ', selectedAcara);
	// 	} else {
	// 		selectedAcara = null;
	// 		namaacara = '';
	// 		lokasiacara = '';
	// 		penanggungjawab = '';
	// 		alamatacara = '';
	// 		kapasitasacara = '';
	// 		deskripsiacara = '';
	// 		tujuanacara = '';
	// 		input_radio = '';
	// 	}
	// });

	// if (form?.formData) {
	// 	buttonselect = form.formData.buttonselect;
	// 	input_radio = form.formData.inputradio;
	// 	namaacara = form.formData.namaacara;
	// 	lokasiacara = form.formData.lokasiacara;
	// 	tujuanacara = form.formData.tujuanacara;
	// 	kapasitasacara = form.formData.kapasitascara;
	// 	deskripsiacara = form.formData.deskripsiacara;
	// 	penanggungjawab = form.formData.penanggungjawab;
	// 	tanggalmulai = form.formData.tanggalmulai;
	// 	tanggalselesai = form.formData.tanggalselesai;
	// 	waktumulai = form.formData.waktumulai;
	// 	waktuselesai = form.formData.waktuselesai;
	// }
	let dataUndangan = $state();
	let dataPanit = $state();
	let activeTab = $state('completed');

	$effect(() => {
		if (data?.dataUndangan && data.dataUndangan.length > 0) {
			dataUndangan = data.dataUndangan.map((und) => {
				const user = data.users.find((u) => u.id_user == und.id_penerima);
				return {
					id: und.id_undangan,
					jenis_kelamin: user.jenis_kelamin || '', // jika ada field panggilan di dataUndangan
					nama: user ? user.nama_lengkap : '',
					notelepon: user ? user.no_telp : '',
					id_penerima: und.id_penerima
				};
			});
		}
		if (data?.dataPanit && data.dataPanit.length > 0) {
			dataPanit = data.dataPanit.map((und) => {
				const user = data.users.find((u) => u.id_user == und.id_user);
				return {
					id: und.id_panitia,
					nama: user ? user.nama_lengkap : '',
					jabatan: und.jabatan_panitia
				};
			});
		}
	});

	let open = $state(false);
	let timer: number;

	let invitations: { id: number; panggilan: string; nama: string; notelepon: string }[] = $state(
		[]
	);
	let invitationIds: number[] = $state([]); // Array that stores only the invitation ids

	let invitations2: { id: number; namalengkap: string; namajabatan: string }[] = $state([]);
	let invitationIds2: number[] = $state([]); // Array that stores only the invitation ids
	let selectedLokasi = data?.acara.id_lokasi;
	function tambah() {
		// id nya dipakei date.now itu supaya pasti beda
		const newId = Date.now();

		invitations = [
			...invitations,
			{
				id: newId,
				panggilan: 'Tn',
				nama: '',
				notelepon: ''
			}
		];
		console.log('invitations: ', invitations);

		invitationIds = [...invitationIds, newId];
		console.log('invitations id: ', invitationIds);
	}

	function tambah2() {
		// id nya dipakei date.now itu supaya pasti beda
		const newId = Date.now();

		invitations2 = [
			...invitations2,
			{
				id: newId,
				namalengkap: '',
				namajabatan: ''
			}
		];
		console.log('invitations: ', invitations2);

		invitationIds2 = [...invitationIds2, newId];
		console.log('invitations id: ', invitationIds2);
	}

	function hapus(index: number) {
		console.log('Sebelum hapus:', invitations);
		console.log('Menghapus indeks:', index);

		invitations = invitations.filter((_, i) => i !== index);
		invitationIds = invitationIds.filter((_, i) => i !== index);

		console.log('Sesudah hapus:', invitations);
		console.log('Sesudah hapus:', invitationIds);
	}

	function hapus2(index: number) {
		console.log('Sebelum hapus:', invitations2);
		console.log('Menghapus indeks:', index);

		invitations2 = invitations2.filter((_, i) => i !== index);
		invitationIds2 = invitationIds2.filter((_, i) => i !== index);

		console.log('Sesudah hapus:', invitations);
		console.log('Sesudah hapus:', invitationIds);
	}

	let success = $state(false);

	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};
	let loading = $state(false);

	let lokasiDropdown = writable<string[]>([]);
	let showLokasiDropdown = writable(false);

	const API_KEY = 'pk.def50126ee21d7c7b667386e05fc8bcb';

	async function fetchLocations(query: string) {
		if (!query) {
			lokasiDropdown.set([]);
			showLokasiDropdown.set(false);
			return;
		}
		const res = await fetch(
			`https://api.locationiq.com/v1/autocomplete?key=${API_KEY}&q=${encodeURIComponent(query)}&limit=100`
		);
		const data = await res.json();
		lokasiDropdown.set(data.map((item: any) => item.display_name));
		showLokasiDropdown.set(true);
	}

	function handleLokasiKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			fetchLocations(alamatacara); // gunakan alamatacara
		}
	}

	function selectLokasi(name: string) {
		alamatacara = name; // set alamatacara,
		showLokasiDropdown.set(false);
	}

	function handleNamaChange(invitationId: number) {
		const user = data.users.find((u: any) => u.id_user == namabawah[invitationId]);
		if (user) {
			// Set panggilan otomatis berdasarkan jenis_kelamin
			panggilan[invitationId] =
				user.jenis_kelamin.toLowerCase() === 'laki-laki' ? 'laki-laki' : 'perempuan';
			// Set nomor telepon otomatis
			notelpbawah[invitationId] = user.no_telp ?? '';
		}
	}

	function isKetuaDipilih(currentId: number) {
		return invitations2.some((inv) => inv.id !== currentId && namajabatan[inv.id] === 'ketua');
	}
	let deleteModal = $state(false);
	async function deleteUndangan(undangan: any) {
		console.log('delete Undangan', undangan);
		deleteModal = true;
		try {
			loading = true;
			let res = await fetch(`${env.PUBLIC_URL_KERAJAAN}/undangan/${undangan.id}`, {
				method: 'DELETE'
			});
			let msg = await res.json();
			if (!res.ok) {
				console.error(msg.message);
			}

			console.log(msg);
			success = true;
		} catch (error) {
		} finally {
			loading = false;
			await invalidateAll().then(() => {
				setTimeout(() => {
					success = false;
				}, 1000);
			});
		}
	}
	async function deletePanit(panit) {
		console.log('deleting panit : ', panit);
		try {
			loading = true;
			let res = await fetch(`${env.PUBLIC_URL_KERAJAAN}/acara/panitia/${panit.id}`, {
				method: 'DELETE'
			});
			let msg = await res.json();
			if (!res.ok) {
				console.error(msg.message);
			}

			console.log(msg);
			success = true;
		} catch (error) {
		} finally {
			loading = false;
			await invalidateAll().then(() => {
				setTimeout(() => {
					success = false;
				}, 1000);
			});
		}
	}

	// Edit jabatan panitia (langsung dari select)
	async function editPanit(panit) {
		// console.log('Editing panit : ', panit);
		let panitNow = panit;
		console.log('Editing panit : ', panitNow);
		try {
			loading = true;
			let payload = {
				id_panitia: Number(panitNow.id),
				jabatan_panitia: panitNow.jabatan
			};
			console.log(payload);
			let res = await fetch(`${env.PUBLIC_URL_KERAJAAN}/acara/panitia`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			let msg = await res.json();
			if (!res.ok) {
				console.error(msg.message);
			}
		} catch (error) {
		} finally {
			loading = false;
			success = true;
			await invalidateAll().then(() => {
				setTimeout(() => {
					success = false;
				}, 1000);
			});
		}
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="min-h-screen w-full">
	<form
		method="post"
		action="?/edit"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				console.log(result);
				console.log(input_radio);
				loading = false;
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
						goto(`/abdi/dashboard/situs/beranda`);
					}, 3000);
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
					console.log('Error for namabawah:', error.namabawah);
					console.log('Error for notelpbawah:', error.notelpbawah);
				}
			};
		}}
	>
		<div class="min-h-screen rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<input type="hidden" name="id_user" bind:value={data.id} />

			<div class="mt-5 grid grid-cols-1 gap-12 lg:grid-cols-4">
				<div class="col-span-2">
					<div class="mt-2 w-full">
						<p>Nama Acara<span class="text-red-500">*</span></p>
						<input
							name="namaacara"
							value={dataacara.nama_acara}
							class="w-full rounded-lg border px-2 py-1"
						/>

						{#if error}
							{#each error.namaacara as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<div class="col-span-2 mt-2 w-full">
						<p class="mt-2">Penanggung Jawab<span class="text-red-500">*</span></p>
						<select
							name="penanggungjawab"
							bind:value={dataacara.id_penanggung_jawab}
							class="w-full rounded-lg border px-2 py-1"
						>
							<option value="" disabled selected>Pilih Penanggung Jawab</option>
							{#each data.users as user}
								<option value={user.id_user}>{user.nama_lengkap}</option>
							{/each}
						</select>
						{#if error}
							{#each error.penanggungjawab as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<div class="mt-2 w-full">
						<p>Lokasi Acara<span class="text-red-500">*</span></p>
						<select name="lokasiacara" value={lokasi} class="w-full rounded-lg border px-2 py-1">
							<option value={data?.acara.id_lokasi} disabled>{data?.acara.nama_situs}</option>
							{#each data.situs as s}
								<option value={s.id_situs}>{s.nama_situs}</option>
							{/each}
						</select>

						{#if error}
							{#each error.lokasiacara as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<div class="mt-2 w-full">
						<p>Tujuan Acara<span class="text-red-500">*</span></p>
						<input
							type="text"
							name="tujuanacara"
							value={data?.acara?.tujuan_acara || '-'}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
						/>
						{#if error}
							{#each error.tujuanacara as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="col-span-2">
					<div class="flexcoba mt-2 flex w-full">
						<div class="flex-1">
							<p>Kapasitas Acara<span class="text-red-500">*</span></p>
							<input
								type="text"
								value={data?.acara?.kapasitas_acara || '0'}
								name="kapasitasacara"
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
							/>
							{#if error}
								{#each error.kapasitasacara as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
						<div class="ml-10 flex">
							<div class="mr-10 w-full items-center text-center">
								<p class="mb-3 mt-3 lg:mb-0 lg:mt-0">
									Jenis Acara<span class="text-red-500">*</span>
								</p>
								<div class="mt-2 flex items-center justify-center self-center">
									<div class="mx-2 flex items-center justify-center">
										<input
											id="default-radio-1"
											type="radio"
											value="private"
											bind:group={input_radio}
											name="default-radio"
											class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
										/>
										<label for="default-radio-1" class="mx-5 ms-2 text-sm font-medium text-gray-900"
											>Private</label
										>
									</div>
									<div class="mx-2 flex items-center justify-center">
										<input
											id="default-radio-2"
											type="radio"
											value="public"
											bind:group={input_radio}
											name="default-radio"
											class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
										/>
										<label for="default-radio-2" class="mx-5 ms-2 text-sm font-medium text-black"
											>Public</label
										>
									</div>
								</div>
								{#if error}
									{#each error.inputradio as a}
										<p class="text-center text-red-500">{a}</p>
									{/each}
								{/if}
							</div>
						</div>
					</div>

					<div class="flexcoba mt-2 flex w-full">
						<div class="lg:flex-1">
							<p>Tanggal Mulai<span class="text-red-500">*</span></p>
							<input
								type="date"
								name="tanggalmulai"
								placeholder="Masukkan Nama"
								value={formatDate(data?.acara.waktu_mulai)}
								class="w-full rounded-lg border px-2 py-1"
							/>
							{#if error}
								{#each error.tanggalmulai as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
						<div class="flex-1 lg:ml-10">
							<div class="w-full">
								<p>Tanggal Selesai<span class="text-red-500">*</span></p>
								<input
									type="date"
									name="tanggalselesai"
									placeholder="Masukkan Nama"
									value={formatDate(data?.acara.waktu_selesai)}
									class="w-full rounded-lg border px-2 py-1"
								/>
								{#if error}
									{#each error.tanggalselesai as a}
										<p class="text-left text-red-500">{a}</p>
									{/each}
								{/if}
							</div>
						</div>
					</div>
					<div class="flexcoba mt-2 flex w-full">
						<div class="lg:flex-1">
							<p>Waktu Mulai<span class="text-red-500">*</span></p>
							<input
								type="time"
								name="waktumulai"
								value={formatTime(data?.acara?.waktu_mulai)}
								class="w-full rounded-lg border px-2 py-1"
							/>
							{#if error}
								{#each error.waktumulai as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
						<div class="flex-1 lg:ml-10">
							<div class="w-full">
								<p>Waktu Selesai<span class="text-red-500">*</span></p>
								<input
									type="time"
									name="waktuselesai"
									value={formatTime(data?.acara?.waktu_selesai)}
									class="w-full rounded-lg border px-2 py-1"
								/>
								{#if error}
									{#each error.waktuselesai as a}
										<p class="text-left text-red-500">{a}</p>
									{/each}
								{/if}
							</div>
						</div>
					</div>
					<div class="w-full" style="position:relative">
						<p>Alamat acara<span class="text-red-500">*</span></p>

						<input
							class="input-field w-full rounded-lg border p-2 pr-8"
							type="text"
							name="alamatacara"
							value={data?.acara?.alamat_acara}
							onkeydown={handleLokasiKeyDown}
							placeholder="Cari alamat..."
							autocomplete="off"
						/>
						{#if $showLokasiDropdown}
							<ul class="dropdown">
								{#each $lokasiDropdown as name}
									<li onclick={() => selectLokasi(name)}>{name}</li>
								{/each}
							</ul>
						{/if}
						{#if error}
							{#each error.lokasiacara as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Deskripsi Acara<span class="text-red-500">*</span></p>
						<textarea
							name="deskripsiacara"
							value={data?.acara?.deskripsi_acara}
							placeholder="Masukkan Deskripsi Acara"
							class="h-12 w-full resize-none rounded-md border px-3 py-3 text-lg"
						></textarea>
						{#if error}
							{#each error.deskripsiacara as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>
			<div class="mt-4 flex justify-center">
				<p class="text-lg font-[600]">Daftar Anggota yang Diundang</p>
			</div>
			{#if data.dataUndangan.length > 0}
				<div class="mt-4 grid grid-cols-8 items-center gap-2">
					<!-- Undangan dari backend -->
					{#each dataUndangan as undangan, i}
						<div class="col-span-1">{i + 1}</div>

						<div class="col-span-1 w-full rounded-lg border px-2 py-1">
							<p class="w-full text-center">{undangan.jenis_kelamin || 'No Data'}</p>
						</div>
						<div class="col-span-3 w-full rounded-lg border px-2 py-1">
							<p class="w-full text-center">{undangan.nama}</p>
						</div>
						<div class="col-span-2 w-full rounded-lg border px-2 py-1">
							<p class="w-full text-center">{undangan.notelepon || 'No Phone'}</p>
						</div>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div class="col-span-1">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<span
								class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-400 p-2"
								onclick={() => {
									deleteUndangan(undangan);
								}}
							>
								<i class="gg--trash z-10 items-center text-2xl"></i>
							</span>
						</div>
					{/each}
				</div>
			{:else}
				<div>
					<p class="text-center">No Undangan Yet</p>
				</div>
			{/if}
			<p class="mt-2 text-center text-lg font-[600]">Daftar Panitia</p>
			<div class="mt-4 grid grid-cols-6 items-center gap-2">
				{#each dataPanit as panit, i}
					<div class="col-span-1">{i + 1}</div>

					<div class="col-span-1 w-full rounded-lg border px-2 py-1">
						<p class="w-full text-center">{panit.nama || 'No Data'}</p>
					</div>
					<div class="col-span-3 w-full rounded-lg border px-2 py-1">
						<select
							bind:value={dataPanit[i].jabatan}
							name="jabatan_baru"
							onchange={(e) => (dataPanit[i].jabatan = e.target.value)}
							class="mt-1 w-full"
						>
							<option value="" disabled selected>Silahkan Pilih!</option>
							<option value="ketua">Ketua</option>
							<option value="wakilketua">Wakil Ketua</option>
							<option value="sekretariat">Sekretariat</option>
							<option value="bendahara">Bendahara</option>
							<option value="acara">Acara</option>
							<option value="komunikasi">Komunikasi</option>
							<option value="perlengkapan">Perlengkapan</option>
							<option value="pdd">PDD</option>
							<option value="keamanan">Keamanan</option>
							<option value="humas">Humas</option>
						</select>
					</div>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="col-span-1 flex gap-2">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<span
							class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-400 p-2"
							onclick={() => {
								deletePanit(panit);
							}}
						>
							<i class="gg--trash z-10 items-center text-2xl"></i>
						</span>
						<span
							class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-yellow-400 p-2"
							onclick={() => {
								editPanit(panit);
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="white"
								class="size-6"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
								/>
							</svg>
						</span>
					</div>
				{/each}
			</div>
			{#if dataPanit?.length === 0 || !dataPanit}
				<p class="text-center">No Panitia Data</p>
			{/if}
			<div class="mt-5 h-1 w-full bg-slate-300"></div>
			<div class="mt-8 flex w-full">
				<p class="my-auto ml-10 w-full text-center font-bold">Undangan</p>
				<button
					class="w-60 justify-end text-nowrap rounded-lg bg-blue-400 px-2 py-2 text-white"
					onclick={() => {
						console.log('hi');
						tambah();
					}}
					type="button"
				>
					Tambah Undangan
				</button>
			</div>

			<div class="mt-10 grid grid-cols-8 gap-2">
				{#each invitations as invitation, i (invitation.id)}
					<div class="col-span-1">{i + 1}</div>
					<input type="hidden" name="id" value={invitation.id} />
					<div class="col-span-1 w-full rounded-lg border px-2 py-1">
						<select
							bind:value={panggilan[invitation.id]}
							name={`panggilan_${invitation.id}`}
							id={`panggilan_${invitation.id}`}
							class="mt-1 w-full"
						>
							<option value="laki-laki">Laki-laki</option>
							<option value="perempuan">Perempuan</option>
						</select>
					</div>

					<div class="col-span-3 w-full rounded-lg border px-2 py-1">
						<!-- Nama jadi dropdown -->
						<select
							bind:value={namabawah[invitation.id]}
							name={`namabawah_${invitation.id}`}
							id={`namabawah_${invitation.id}`}
							class="w-full focus:outline-none"
							onchange={() => handleNamaChange(invitation.id)}
						>
							<option value="" disabled selected>Pilih Nama</option>
							{#each data.users as user}
								<option value={user.id_user}>{user.nama_lengkap}</option>
							{/each}
						</select>
						{#if error}
							{console.log(error)}
							{#if error.namabawah && !namabawah[invitation.id]}
								<p class="text-left text-red-500">{error.namabawah[0]}</p>
							{:else}
								{console.log('No error for namabawah with id', invitation.id)}
							{/if}
						{/if}
					</div>

					<div class="col-span-2 w-full rounded-lg border px-2 py-1">
						<input
							type="text"
							bind:value={notelpbawah[invitation.id]}
							name={`notelpbawah_${invitation.id}`}
							id={`notelpbawah_${invitation.id}`}
							placeholder="081638149124"
							class="w-full focus:outline-none"
							pattern="\d+"
							title="Hanya angka yang diizinkan"
							minlength="10"
						/>
						{#if error.notelpbawah && !notelpbawah[invitation.id]}
							<p class="text-left text-red-500">{error.notelpbawah[0]}</p>
						{/if}
					</div>
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="col-span-1">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<span
							class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-400 p-2"
							onclick={() => hapus(i)}
						>
							<i class="gg--trash z-10 items-center text-2xl"></i>
						</span>
					</div>
				{/each}
			</div>

			<div class="mt-5 h-1 w-full bg-slate-300"></div>
			<div class="mt-8 flex w-full">
				<p class="my-auto ml-10 w-full text-start font-bold">Panitia Acara</p>
				<button
					class="w-60 justify-end text-nowrap rounded-lg bg-blue-400 px-2 py-2 text-white"
					onclick={() => {
						console.log('hi2');
						tambah2();
					}}
					type="button"
				>
					Tambah Undangan
				</button>
			</div>

			<div class="mt-10 grid grid-cols-10 gap-2">
				{#each invitations2 as invitation, i (invitation.id)}
					<div class="col-span-1">{i + 1}</div>
					<input type="hidden" name="id2" value={invitation.id} />

					<div class="col-span-4 w-full rounded-lg border px-2 py-1">
						<select
							bind:value={namalengkapbawah[invitation.id]}
							name={`namalengkapbawah_${invitation.id}`}
							id={`namalengkapbawah_${invitation.id}`}
							class="w-full focus:outline-none"
						>
							<option value="" disabled selected>Pilih Nama</option>
							{#each data.users as user}
								<option value={user.id_user}>{user.nama_lengkap}</option>
							{/each}
						</select>
						{#if error}
							{console.log(error)}
							{#if error.namalengkapbawah && !namalengkapbawah[invitation.id]}
								<p class="text-left text-red-500">{error.namalengkapbawah[0]}</p>
							{:else}
								{console.log('No error for namabawah with id', invitation.id)}
							{/if}
						{/if}
					</div>

					<div class="col-span-4 w-full rounded-lg border px-2 py-1">
						<select
							bind:value={namajabatan[invitation.id]}
							name={`namajabatan_${invitation.id}`}
							id={`namajabatan_${invitation.id}`}
							class="mt-1 w-full"
						>
							<option value="" disabled selected>Silahkan Pilih!</option>
							<option value="ketua" disabled={isKetuaDipilih(invitation.id)}>Ketua</option>
							<option value="wakilketua">Wakil Ketua</option>
							<option value="sekretariat">Sekretariat</option>
							<option value="bendahara">Bendahara</option>
							<option value="acara">Acara</option>
							<option value="komunikasi">Komunikasi</option>
							<option value="perlengkapan">Perlengkapan</option>
							<option value="pdd">PDD</option>
							<option value="keamanan">Keamanan</option>
							<option value="humas">Humas</option>
						</select>
						{#if error.namajabatan && !namajabatan[invitation.id]}
							<p class="text-left text-red-500">{error.namajabatan[0]}</p>
						{/if}
					</div>
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="col-span-1">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<span
							class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-red-400 p-2"
							onclick={() => hapus2(i)}
						>
							<i class="gg--trash z-10 items-center text-2xl"></i>
						</span>
					</div>
				{/each}
			</div>

			<div class="mt-8 flex w-full justify-center lg:justify-end">
				<button class="w-50 text-nowrap rounded-lg bg-green-400 px-2 py-2 text-white" type="submit">
					Update Acara
				</button>
			</div>
		</div>
	</form>
</div>

{#if open}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SuccessModal text="Berhasil"></SuccessModal>
	</div>
{/if}
{#if success}
	<SuccessModal text="Berhasil!"></SuccessModal>
{/if}

<style>
	.gg--trash {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fff6f6'%3E%3Cpath fill-rule='evenodd' d='M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2zm-2-1H9v1h6zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z' clip-rule='evenodd'/%3E%3Cpath d='M9 9h2v8H9zm4 0h2v8h-2z'/%3E%3C/g%3E%3C/svg%3E");
	}

	.dropdown {
		position: absolute;
		left: 0;
		right: 0;
		z-index: 20;
		width: 100%;
		max-height: 120px;
		overflow-y: auto;
		background: #fff;
		border: 1px solid #d1d5db;
		border-radius: 0.5rem;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
		margin-top: 0.25rem;
		padding: 0.25rem 0;
	}

	.dropdown li {
		padding: 0.75rem 1rem;
		cursor: pointer;
		transition:
			background 0.2s,
			color 0.2s;
		font-size: 1rem;
		color: #222;
	}

	.dropdown li:hover,
	.dropdown li:focus {
		background: #2563eb;
		color: #fff;
	}

	/* Optional: animate dropdown */
	.dropdown {
		animation: fadeIn 0.2s;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (max-width: 1100px) {
		.flexcoba {
			flex-direction: column;
		}
	}
</style>
