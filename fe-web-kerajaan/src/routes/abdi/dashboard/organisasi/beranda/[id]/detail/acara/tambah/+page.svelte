<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import TambahArray from '$lib/tambah/TambahArray.svelte';
	import { fade } from 'svelte/transition';
	import { number } from 'zod';
	import { writable } from 'svelte/store';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';

	let input_radio = $state('');
	let namaacara = $state('');
	let lokasiacara: any = $state('');
	let tujuanacara = $state('');
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

	let panggilan: any = $state([]);
	let namabawah: any = $state([]);
	let namalengkapbawah = $state([]);
	let namajabatan = $state([]);
	let notelpbawah: any = $state([]);

	let { form, data } = $props();
	console.log('Data : ', data.acara);
	console.log('form data', form);

	let selectedAcara = null;

	$effect(() => {
		if (activeTab === 'completed' && namaacara) {
			selectedAcara = data.acara.find((a: any) => a.Acara.nama_acara === namaacara) ?? null;
			lokasiacara = Number(selectedAcara.Acara.id_lokasi);
			penanggungjawab = Number(selectedAcara.Acara.id_penanggung_jawab);
			alamatacara = selectedAcara.Acara.alamat_acara;
			kapasitasacara = selectedAcara.Acara.kapasitas_acara;
			penyelenggaraacara = selectedAcara.id_organisasi;
			deskripsiacara = selectedAcara.Acara.deskripsi_acara;
			tujuanacara = selectedAcara.Acara.tujuan_acara;
			input_radio = selectedAcara.Acara.jenis_acara;
			if (input_radio.toLowerCase() === 'tertutup') {
				input_radio = 'private';
			} else {
				input_radio = 'public';
			}
		} else {
			selectedAcara = null;
			namaacara = '';
			lokasiacara = '';
			penanggungjawab = '';
			alamatacara = '';
			kapasitasacara = '';
			deskripsiacara = '';
			tujuanacara = '';
			input_radio = '';
		}
	});

	if (form?.formData) {
		buttonselect = form.formData.buttonselect;
		input_radio = form.formData.inputradio;
		namaacara = form.formData.namaacara;
		lokasiacara = form.formData.lokasiacara;
		tujuanacara = form.formData.tujuanacara;
		kapasitasacara = form.formData.kapasitascara;
		deskripsiacara = form.formData.deskripsiacara;
		penanggungjawab = form.formData.penanggungjawab;
		tanggalmulai = form.formData.tanggalmulai;
		tanggalselesai = form.formData.tanggalselesai;
		waktumulai = form.formData.waktumulai;
		waktuselesai = form.formData.waktuselesai;
	}

	let activeTab = $state('upcoming');
	let open = $state(false);
	let timer: number;

	let invitations: { id: number; panggilan: string; nama: string; notelepon: string }[] = $state(
		[]
	);
	let invitationIds: number[] = $state([]); // Array that stores only the invitation ids

	let invitations2: { id: number; namalengkap: string; namajabatan: string }[] = $state([]);
	let invitationIds2: number[] = $state([]); // Array that stores only the invitation ids

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

	function setActiveTab(tab: string) {
		activeTab = tab;
		buttonselect = tab === 'upcoming' ? 'baru' : 'selesai';
		console.log('active tab : ', activeTab);
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
		action="?/tambah"
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
			<div class="mt-2 flex w-fit gap-2 rounded-full border-2 px-5 py-2">
				<input type="hidden" name="buttonselect" bind:value={buttonselect} />

				<!-- Tombol 'Baru' -->
				<button
					type="button"
					onclick={(e) => {
						e.preventDefault();
						setActiveTab('upcoming');
					}}
					value="baru"
					class="relative overflow-hidden rounded-full border-2 px-5 py-1 font-semibold"
				>
					<span
						class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
						style:width={activeTab === 'upcoming' ? '100%' : '0%'}
					></span>
					<span
						class="relative z-10 transition-colors duration-300"
						class:text-white={activeTab === 'upcoming'}
						class:text-blue-600={activeTab !== 'upcoming'}
					>
						Baru
					</span>
				</button>

				<!-- Tombol 'Selesai' -->
				<button
					type="button"
					value="lama"
					onclick={(e) => {
						e.preventDefault();
						setActiveTab('completed');
					}}
					class="relative overflow-hidden rounded-full border-2 px-5 py-1 font-semibold"
				>
					<span
						class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
						style:width={activeTab === 'completed' ? '100%' : '0%'}
					></span>
					<span
						class="relative z-10 transition-colors duration-300"
						class:text-white={activeTab === 'completed'}
						class:text-blue-600={activeTab !== 'completed'}
					>
						Lama
					</span>
				</button>
				{#if error}
					{#each error.buttonselect as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>

			<input type="hidden" name="id_user" bind:value={data.id} />

			<div class="mt-5 grid grid-cols-1 gap-12 lg:grid-cols-4">
				<div class="col-span-2">
					<div class="mt-2 w-full">
						<p>Nama Acara:</p>
						{#if activeTab === 'completed'}
							<select
								name="namaacara"
								bind:value={namaacara}
								class="w-full rounded-lg border px-2 py-1"
							>
								<option value="" disabled selected>Pilih Acara Lama</option>
								{#each data.acara as acara}
									<option value={acara.Acara.nama_acara}>{acara.Acara.nama_acara}</option>
								{/each}
							</select>
						{:else}
							<input
								type="text"
								name="namaacara"
								bind:value={namaacara}
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
							/>
						{/if}
						{#if error}
							{#each error.namaacara as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<div class="col-span-2 mt-2 w-full">
						<p class="mt-2">Penanggung Jawab:</p>
						<select
							name="penanggungjawab"
							bind:value={penanggungjawab}
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

					<div class="col-span-2 mt-2 w-full">
						<p class="mt-2">Penyelenggara Acara:</p>
						<select
							name="penyelenggaraacara"
							bind:value={penyelenggaraacara}
							class="w-full rounded-lg border px-2 py-1"
						>
							<option value="" disabled selected>Pilih Penyelenggara</option>
							<optgroup label="Organisasi">
								{#each data.organisasi as organisasi}
									<option value={organisasi.id_organisasi}>{organisasi.nama_organisasi}</option>
								{/each}
							</optgroup>
						</select>
						{#if error}
							{#each error.penyelenggaraacara as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<div class="mt-2 w-full">
						<p>Lokasi Acara:</p>
						<select
							name="lokasiacara"
							bind:value={lokasiacara}
							class="w-full rounded-lg border px-2 py-1"
						>
							<option value="" disabled selected>Pilih Lokasi Acara</option>
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
						<p>Tujuan Acara:</p>
						<input
							type="text"
							name="tujuanacara"
							bind:value={tujuanacara}
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
							<p>Kapasitas Acara:</p>
							<input
								type="text"
								bind:value={kapasitasacara}
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
								<p class="mb-3 mt-3 lg:mb-0 lg:mt-0">Jenis Acara</p>
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
							<p>Tanggal Mulai:</p>
							<input
								type="date"
								name="tanggalmulai"
								placeholder="Masukkan Nama"
								bind:value={tanggalmulai}
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
								<p>Tanggal Selesai:</p>
								<input
									type="date"
									name="tanggalselesai"
									placeholder="Masukkan Nama"
									bind:value={tanggalselesai}
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
							<p>Waktu Mulai:</p>
							<input
								type="time"
								name="waktumulai"
								bind:value={waktumulai}
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
								<p>Waktu Selesai:</p>
								<input
									type="time"
									name="waktuselesai"
									bind:value={waktuselesai}
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
						<p>Alamat acara:</p>
						{#if activeTab === 'completed'}
							<input
								type="text"
								name="alamatacara"
								bind:value={alamatacara}
								placeholder="Masukkan alamat"
								class="w-full rounded-lg border px-2 py-1"
							/>
						{:else}
							<input
								class="input-field w-full rounded-lg border p-2 pr-8"
								type="text"
								name="alamatacara"
								bind:value={alamatacara}
								onkeydown={handleLokasiKeyDown}
								placeholder="Cari alamat..."
								autocomplete="off"
							/>
							{#if $showLokasiDropdown && alamatacara !== ''}
								<ul class="dropdown">
									{#each $lokasiDropdown as name}
										<li onclick={() => selectLokasi(name)}>{name}</li>
									{/each}
								</ul>
							{/if}
						{/if}
						{#if error}
							{#each error.lokasiacara as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Deskripsi Acara:</p>
						<textarea
							name="deskripsiacara"
							bind:value={deskripsiacara}
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
					Buat acara
				</button>
			</div>
		</div>
	</form>
</div>

{#if open}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SuccessModal text="Sukses"></SuccessModal>
	</div>
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
