<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/state';
	import { env } from '$env/dynamic/public';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	// import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { Item } from '@radix-ui/react-dropdown-menu';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	console.log('Acara: ', data.data);
	let total = $state(8);
	let activeTab = $state('upcoming');
	let showDropdown = $state(false);
	console.log('User: ', data.data.jenis_acara);
	let input_radio = $state(data?.data?.jenis_acara || '');
	let res = $state();
	let isLocationSelected = $state(data?.data.id_lokasi ? true : false);

	let penanggungjawabSearchTerm = $state(
		data?.user.find((user) => user.id == data?.data?.id_penanggung_jawab).name || ''
	);
	let selectedPenanggungjawab = $state<any>(
		data?.user.find((nama) => nama.id == data?.data.id_penanggung_jawab) || null
	);
	let showPenanggungjawabDropdown = $state(false);

	let namaacara = $state(data?.data.nama_acara || '-');
	let alamatacara = $state(data?.data.alamat_acara || '');
	let waktumulai = $state(data?.data.waktu_mulai || '');
	let waktuselesai = $state(data?.data.waktu_selesai || '');
	let tujuanacara = $state(data?.data.tujuan_acara || '');
	let tanggalmulai = $state(data?.data.tanggal_mulai || '');
	let tanggalselesai = $state(data?.data.tanggal_selesai || '');
	let penanggungjawab = $state(data?.data.nama_penanggung_jawab || '');
	let panggilan: any = $state([]);
	let namabawah: any = $state([]);
	let namalengkapbawah = $state([]);
	let namajabatan = $state([]);
	let notelpbawah: any = $state([]);

	let invitations: { id: number; panggilan: string; nama: string; notelepon: string }[] = $state(
		[]
	);
	let invitationIds: number[] = $state([]); // Array that stores only the invitation ids

	let invitations2: { id: number; namalengkap: string; namajabatan: string }[] = $state([]);
	let invitationIds2: number[] = $state([]); // Array that stores only the invitation ids

	function setActive(tab: string) {
		activeTab = tab;
	}

	let errors: any = $state('');
	let success = $state(false);
	let lokasi_acara = $state(data?.data.nama_situs || '');
	let id_alamat = $state();
	let lokasi = $state(data?.data.alamat_acara || '');
	let users = $state(data?.user || []);
	function filter(data: any[]) {
		return data.filter((item) =>
			item.nama_situs.toLowerCase().includes(lokasi_acara.toLowerCase())
		);
	}
	let dataUndangan = $state();
	function filterUser(searchTerm: string) {
		return users.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
	}
	function isKetuaDipilih(currentId: number) {
		return invitations2.some((inv) => inv.id !== currentId && namajabatan[inv.id] === 'ketua');
	}
	function bindId(item: any) {
		if (lokasi_acara) {
			id_alamat = item.nama_situs;
			lokasi = item.alamat;
			isLocationSelected = true;
		}
	}
	function selectPenanggungjawab(user: any) {
		selectedPenanggungjawab = user;
		penanggungjawabSearchTerm = user.name;
		showPenanggungjawabDropdown = false;
	}
	function handleLocationInput() {
		showDropdown = true;
		// If user manually types, allow alamat editing
		if (isLocationSelected && !resData.includes((item: any) => item.nama_situs === lokasi_acara)) {
			isLocationSelected = false;
		}
	}
	let filteredPenanggungJawab = $derived(
		penanggungjawabSearchTerm ? filterUser(penanggungjawabSearchTerm) : []
	);
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

	function hapus(index: number) {
		console.log('Sebelum hapus:', invitations);
		console.log('Menghapus indeks:', index);

		invitations = invitations.filter((_, i) => i !== index);
		invitationIds = invitationIds.filter((_, i) => i !== index);

		console.log('Sesudah hapus:', invitations);
		console.log('Sesudah hapus:', invitationIds);
	}
	$effect(() => {
		if (data?.dataUndangan && data.dataUndangan.length > 0) {
			dataUndangan = data.dataUndangan.map((und) => {
				const user = data.user.find((u) => u.id == und.id_penerima);
				return {
					id: und.id_undangan,
					jenis_kelamin: user.jenis_kelamin || '', // jika ada field panggilan di dataUndangan
					nama: user ? user.name : '',
					notelepon: user ? user.no_telp : '',
					id_penerima: und.id_penerima
				};
			});
		}
	});
	console.log('data undangan', dataUndangan);
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
	function handleNamaChange(invitationId: number) {
		const user = data.user.find((u: any) => u.id == namabawah[invitationId]);
		if (user) {
			// Set panggilan otomatis berdasarkan jenis_kelamin
			panggilan[invitationId] =
				user.jenis_kelamin.toLowerCase() === 'laki-laki' ? 'laki-laki' : 'perempuan';
			// Set nomor telepon otomatis
			notelpbawah[invitationId] = user.no_telp ?? '';
		}
	}
	function hapus2(index: number) {
		console.log('Sebelum hapus:', invitations2);
		console.log('Menghapus indeks:', index);

		invitations2 = invitations2.filter((_, i) => i !== index);
		invitationIds2 = invitationIds2.filter((_, i) => i !== index);

		console.log('Sesudah hapus:', invitations);
		console.log('Sesudah hapus:', invitationIds);
	}

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}
	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};
	let selectedLokasi = $state(
		data?.situs.find((item) => item.id_situs == data?.data.id_lokasi) || null
	);
	function select(item: any) {
		lokasi_acara = item.nama_situs;
		lokasi = item.alamat;
		selectedLokasi = item;
		isLocationSelected = true;
		showDropdown = false;
	}
	console.log(data.data);
	// let resData = $derived(data?.data ? filter(data.data) : []);
	let resData = $derived(data?.situs ? filter(data.situs) : []);
	let open = $state(false);
	let timer: number;
	let loading = $state(false);

	let deleteModal = $state(false);
	let deleteId = $state();

	async function deleteUndangan(undangan: any) {
		console.log('delete Undangan', undangan);
		deleteModal = true;
		// try {
		// 	loading = true;
		// 	let res = await fetch(`${env.PUBLIC_URL_KERAJAAN}/undangan/${undangan.id}`, {
		// 		method: 'DELETE'
		// 	});
		// 	let msg = await res.json();
		// 	if (!res.ok) {
		// 		console.error(msg.message);
		// 	}

		// 	console.log(msg);
		// 	success = true;
		// } catch (error) {
		// } finally {
		// 	loading = false;
		// 	await invalidateAll().then(() => {
		// 		setTimeout(() => {
		// 			success = false;
		// 		}, 1000);
		// 	});
		// }
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
		action="?/editAcara"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				console.log(result);
				loading = false;
				if (result.type === 'success') {
					success = true;
					console.log(result);

					setTimeout(() => {
						success = false;
						goto('/abdi/sekretariat/acara');
					}, 3000);
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
				}
			};
		}}
	>
		<input type="hidden" name="id_acara" value={data?.data.id_acara} />
		<div class="mt-5 grid grid-cols-1 gap-12 lg:grid-cols-4">
			<div class="col-span-2">
				<div class="mt-2 w-full">
					<p>Nama Acara:</p>
					<input
						type="text"
						name="namaacara"
						placeholder="Masukkan Nama"
						bind:value={namaacara}
						class="w-full rounded-lg border px-2 py-1"
					/>
					{#if errors && errors.namaacara}
						{#each errors.namaacara as e}
							<p class="text-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<!-- <div class="mt-3 w-full">
					<p>Penanggung Jawab Acara:</p>
					<input
						type="text"
						name="penanggungjawab_acara"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div> -->
				<!-- <div class="mt-3 w-full">
					<p>Penyelenggara Acara:</p>
					<input
						type="text"
						name="penyelenggara_acara"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div> -->
				<div class="relative mt-3 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						autocomplete="off"
						onfocus={toggleDropdown}
						oninput={handleLocationInput}
						name="lokasi_acara"
						bind:value={lokasi_acara}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
					<!-- Location dropdown -->
					<input type="hidden" name="id_lokasi" value={selectedLokasi?.id_situs || ''} />
					{#if showDropdown && data?.data}
						<ul
							class="dropdown absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white"
						>
							{#if resData.length > 0}
								{#each resData as item}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
									<li
										onclick={() => select(item)}
										class="cursor-pointer px-3 py-2 hover:bg-gray-100"
									>
										{item.nama_situs}
									</li>
								{/each}
							{:else}
								<li class="px-3 py-2 text-gray-500">No locations found</li>
							{/if}
						</ul>
					{/if}
				</div>
				{#if errors && errors.lokasiacara}
					{#each errors.lokasiacara as e}
						<p class="text-red-500">{e}</p>
					{/each}
				{/if}
				<div class="mt-3 w-full">
					<p>Alamat Acara:</p>
					<input
						type="text"
						name="alamat_acara"
						bind:value={lokasi}
						readonly={isLocationSelected}
						placeholder="Masukkan Alamat"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				{#if errors && errors.alamatacara}
					{#each errors.alamatacara as e}
						<p class="text-red-500">{e}</p>
					{/each}
				{/if}
				<!-- <div class="mt-3 w-full">
					<p>Tujuan Acara:</p>
					<input
						type="text"
						name="alamat_acara"
						placeholder="Masukkan Alamat Acara"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div> -->
				<div class="mt-2 w-full">
					<p>Deskripsi Acara:</p>
					<textarea
						placeholder="Masukkan Deskripsi Acara"
						name="deskripsi_acara"
						value={data?.data.deskripsi_acara || '-'}
						class="h-20 w-full resize-none rounded-md border px-3 py-1 text-lg"
					></textarea>
				</div>
				{#if errors && errors.deskripsiacara}
					{#each errors.deskripsiacara as e}
						<p class="text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<div class="col-span-2">
				<div class=" flex">
					<div class="grid w-full grid-cols-1 lg:grid-cols-2">
						<div class="flex flex-col">
							<p class="mb-3 mt-3 lg:mb-0 lg:mt-0">Kapasitas Acara</p>
							<input
								name="kapasitasacara"
								type="text"
								value={data?.data.kapasitas_acara || ''}
								placeholder="Masukkan Jumlah Kapasitas"
								class="w-full rounded-lg border px-2 py-1"
							/>
						</div>
						<div class="mr-10 w-full items-center text-center">
							<p class="mb-3 mt-3 lg:mb-0 lg:mt-0">Jenis Acara</p>
							<div class="mt-2 flex items-center justify-center self-center">
								<div class="mx-2 flex items-center justify-center">
									<input
										id="default-radio-1"
										type="radio"
										value="private"
										bind:group={input_radio}
										name="jenisacara"
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
										name="jenisacara"
										class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
									/>
									<label for="default-radio-2" class="mx-5 ms-2 text-sm font-medium text-black"
										>Public</label
									>
								</div>
							</div>
							{#if errors}
								{#each errors.inputradio as a}
									<p class="text-center text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>

				<div class="mt-3 w-full">
					<p>Penanggung Jawab:</p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Juru Kunci"
							bind:value={penanggungjawabSearchTerm}
							onfocus={() => (showPenanggungjawabDropdown = true)}
							onblur={() => {
								// Delay hiding dropdown to allow for click
								setTimeout(() => {
									showPenanggungjawabDropdown = false;
								}, 200);
							}}
							class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
						/>
						<input type="hidden" name="penanggungjawab" value={selectedPenanggungjawab.name} />
						<input type="hidden" name="penanggungjawab_id" value={selectedPenanggungjawab.id} />

						{#if showPenanggungjawabDropdown && filteredPenanggungJawab.length > 0}
							<div class="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
								<ul class="max-h-60 overflow-y-auto">
									{#each filteredPenanggungJawab as user}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
										<li
											class="cursor-pointer px-3 py-2 hover:bg-gray-100"
											onclick={() => selectPenanggungjawab(user)}
										>
											<div class="flex flex-col">
												<span class="font-medium">{user.name}</span>
												<span class="text-sm text-gray-500">{user.email}</span>
											</div>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
					{#if errors}
						{#each errors.juru_kunci as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
				<div class="mt-3 w-full">
					<p>Tujuan Acara:</p>
					<input
						type="text"
						name="tujuanacara"
						bind:value={tujuanacara}
						placeholder="Masukkan Alamat Acara"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				{#if errors && errors.tujuanacara}
					{#each errors.tujuanacara as e}
						<p class="text-red-500">{e}</p>
					{/each}
				{/if}
				<div class="flexcoba mt-2 flex w-full">
					<div class="mt-2 lg:flex-1">
						<p>Tanggal Mulai:</p>
						<input
							type="date"
							name="tanggalmulai"
							bind:value={tanggalmulai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
						/>
						{#if errors && errors.tanggalmulai}
							{#each errors.tanggalmulai as e}
								<p class="text-red-500">{e}</p>
							{/each}
						{/if}
					</div>
					<div class="flex-1 lg:ml-10">
						<div class="mt-2 w-full">
							<p>Tanggal Selesai:</p>
							<input
								type="date"
								name="tanggalselesai"
								bind:value={tanggalselesai}
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
							/>
							{#if errors && errors.tanggalselesai}
								{#each errors.tanggalselesai as e}
									<p class="text-red-500">{e}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>
				<div class="flexcoba mt-2 flex w-full">
					<div class="mt-2 lg:flex-1">
						<p>Waktu Mulai:</p>
						<input
							type="time"
							name="waktumulai"
							bind:value={waktumulai}
							class="w-full rounded-lg border px-2 py-1"
						/>
						{#if errors}
							{#each errors.waktumulai as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="flex-1 lg:ml-10">
						<div class="mt-2 w-full">
							<p>Waktu Selesai:</p>
							<input
								type="time"
								name="waktuselesai"
								bind:value={waktuselesai}
								class="w-full rounded-lg border px-2 py-1"
							/>
							{#if errors}
								{#each errors.waktuselesai as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>
				<!-- <div class="mt-2 w-full">
					<p>Deskripsi Acara:</p>
					<textarea
						placeholder="Masukkan Deskripsi Acara"
						name="deskripsi_acara"
						class="h-20 w-full resize-none rounded-md border px-3 py-1 text-lg"
					></textarea>
				</div> -->
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
				<p class="text-center">No Panitia Yet</p>
			</div>
		{/if}

		<div class="mt-5 h-1 w-full bg-slate-300"></div>
		<div class="mt-8 flex w-full">
			<p class="my-auto ml-10 w-full font-bold">Undangan</p>
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
						{#each data.user as user}
							<option value={user.id}>{user.name}</option>
						{/each}
					</select>
					{#if errors}
						{console.log(errors)}
						{#if errors.namabawah && !namabawah[invitation.id]}
							<p class="text-left text-red-500">{errors.namabawah[0]}</p>
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
					{#if errors.notelpbawah && !notelpbawah[invitation.id]}
						<p class="text-left text-red-500">{errors.notelpbawah[0]}</p>
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
		<!-- bawah -->

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
						{#each data.user as user}
							<option value={user.id}>{user.name}</option>
						{/each}
					</select>
					{#if errors}
						{console.log(errors)}
						{#if errors.namalengkapbawah && !namalengkapbawah[invitation.id]}
							<p class="text-left text-red-500">{errors.namalengkapbawah[0]}</p>
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
					{#if errors.namajabatan && !namajabatan[invitation.id]}
						<p class="text-left text-red-500">{errors.namajabatan[0]}</p>
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
	</form>
</div>
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

	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}
</style>
