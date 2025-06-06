<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { page } from '$app/stores';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';
	import { writable } from 'svelte/store';

	let { form, data } = $props();
	let namasitus = $state('');
	let email = $state('');
	let notelepon = $state('');
	let kepemilikan = $state('');
	let deskripsi = $state('');
	let dibangunoleh = $state('');
	let tanggalberdiri = $state('');
	let alamat = $state('');
	let jurukunci: Number = $state<Number>(parseInt(data?.situs.jurukunci) || 0);
	let jenissitus = $state('');
	let pembina: Number = $state<Number>(parseInt(data?.situs.pembina) || 0);
	let pelindung: Number = $state<Number>(parseInt(data?.situs.pelindung) || 0);
	let jambuka = $state('');
	let jamtutup = $state('');
	let wisata = $state('');
	let showEditIcon = $state(true);

	let dataambil = data.situs;
	console.log('Data : ', data);
	let jenisSitusList = data.jenisSitusList || [];
	let usersList = data.usersList || [];
	let wisataList = data.wisataList || [];
	console.log('User list : ', usersList);
	console.log('Data ambil : ', dataambil);
	console.log('form data', form?.formData);
	console.log('wisata : ', data.wisataList);

	if (form?.formData) {
		namasitus = form.formData.namasitus;
		notelepon = form.formData.notelepon;
		email = form.formData.email;
		kepemilikan = form.formData.kepemilikan;
		dibangunoleh = form.formData.dibangunoleh;
		tanggalberdiri = form.formData.tanggalberdiri;
		alamat = form.formData.alamat;
		jurukunci = form.formData.jurukunci;
		jenissitus = form.formData.jenissitus;
		pembina = form.formData.pembina;
		pelindung = form.formData.pelindung;
		jambuka = form.formData.jambuka;
		jamtutup = form.formData.jamtutup;
		wisata = form.formData.wisata;
	}

	let tanggal = $state(
		dataambil.tanggalberdiri
			? typeof dataambil.tanggalberdiri === 'string'
				? dataambil.tanggalberdiri.includes('T')
					? dataambil.tanggalberdiri.split('T')[0]
					: dataambil.tanggalberdiri
				: dataambil.tanggalberdiri instanceof Date
					? dataambil.tanggalberdiri.toISOString().split('T')[0]
					: String(dataambil.tanggalberdiri)
			: ''
	);

	let currentID = $state();

	$effect(() => {
		currentID = $page.params.id;
		console.log('ID: ', currentID);
	});

	let open = $state(false);
	let timer: any;
	let loading = $state(false);
	let error: any = $state('');
	let selectedFile = $state<File | null>(null);

	function previewImage(event: any) {
		const file = event.target.files[0];
		const preview = document.getElementById('preview-image') as HTMLImageElement;
		if (file && preview) {
			selectedFile = file; // Store the file for submission
			preview.src = URL.createObjectURL(file);
			showEditIcon = false; // Sembunyikan icon edit setelah file dipilih
		}
	}

	let results = writable<string[]>([]);
	let showDropdown = writable(false);
	let lokasi = $state(dataambil.alamat || '');
	let locationsData: any[] = [];
	let lat = $state(dataambil.latitude || '');
	let long = $state(dataambil.longitude || '');
	let selectedLocation: any = $state('');
	const API_KEY = 'pk.def50126ee21d7c7b667386e05fc8bcb';

	async function fetchLocations() {
		if (!lokasi.trim()) return; // Prevent empty search

		const url = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(lokasi)}&format=json&limit=5`;

		try {
			const res = await fetch(url);
			const data = await res.json();

			if (data && Array.isArray(data)) {
				locationsData = data; // Store all location data
				const extractedNames = data.map((item: any) => item.display_name);

				results.set(extractedNames);
				showDropdown.set(extractedNames.length > 0);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault(); // Prevent form submission
			fetchLocations();
		}
	}

	function selectLocation(name: string) {
		lokasi = name;
		results.set([]);
		showDropdown.set(false);

		// Find latitude and longitude based on selected location name
		selectedLocation = locationsData.find((item) => item.display_name === name);
		if (selectedLocation) {
			lat = selectedLocation.lat;
			long = selectedLocation.lon;
			console.log('Latitude:', lat, 'Longitude:', long);
		} else {
			console.log('Coordinates not found.');
		}
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="h-full w-full">
	<form
		method="post"
		action="?/edit"
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				console.log('Form submission result:', result);
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
						goto('/abdi/dashboard/situs/beranda');
					}, 3000);
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
					console.error('Form submission errors:', error);
				}
			};
		}}
	>
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div class="relative mx-auto mb-9 flex w-full items-center justify-center">
					<!-- Image yang bisa diklik -->
					<label for="upload-photo" class="relative ml-5 mr-5 cursor-pointer hover:opacity-25">
						<img
							id="preview-image"
							src={dataambil.imageUrls[0]}
							class="h-20 w-20 rounded-full object-cover"
							alt="Profile"
						/>
						{#if showEditIcon}
							<span class="mdi--edit absolute"></span>
						{/if}
					</label>

					<!-- Input file yang disembunyikan -->
					<input
						type="file"
						id="upload-photo"
						name="profile_picture"
						accept="image/*"
						class="hidden"
						onchange={previewImage}
					/>

					<input type="hidden" name="existing_foto_profile" bind:value={dataambil.profile} />

					<!-- Add a hidden input to store the existing photo ID -->
					<input type="hidden" name="existing_foto_situs" bind:value={dataambil.foto_situs} />
				</div>
				<div>
					<p>Nama Situs<span class="text-red-500">*</span></p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Nama"
							name="namasitus"
							bind:value={dataambil.namasitus}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.namasitus as a}
							<p class="text-center text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Email<span class="text-red-500">*</span></p>
					<div class="relative">
						<input
							type="text"
							name="email"
							bind:value={dataambil.email}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.email as a}
							<p class="text-center text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>No telepon<span class="text-red-500">*</span></p>
						<input
							type="text"
							name="notelepon"
							bind:value={dataambil.notelepon}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.notelepon as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Kepemilikan :</p>
						<input
							type="text"
							placeholder="Masukkan nama"
							name="kepemilikan"
							bind:value={dataambil.kepemilikan}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.kepemilikan as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div>
					<p class="mt-5">Deskripsi Situs<span class="text-red-500">*</span></p>
					<div class="relative w-full">
						<textarea
							placeholder="Masukkan nama"
							name="deskripsi"
							bind:value={dataambil.deskripsi}
							class="mt-2 h-32 w-full resize-none rounded-md border-2 px-3 py-3 text-lg"
						></textarea>
						<div class="h-full">
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
						{#if error}
							{#each error.deskripsi as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<!-- 2 -->
			<div>
				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Dibangun Oleh<span class="text-red-500">*</span></p>
						<input
							type="text"
							name="dibangunoleh"
							bind:value={dataambil.dibangunoleh}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.dibangunoleh as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Tahun Berdiri :</p>
						<input
							type="text"
							name="tanggalberdiri"
							bind:value={tanggal}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.tanggalberdiri as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5">
					<p>Alamat<span class="text-red-500">*</span></p>
					<div class="relative">
						<input
							class="input-field mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
							type="text"
							id="alamat"
							name="alamat"
							placeholder="Masukkan alamat..."
							bind:value={lokasi}
							onkeydown={handleKeyDown}
						/>
						<input type="hidden" name="longitude" bind:value={long} />
						<input type="hidden" name="latitude" bind:value={lat} />
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						{#if $showDropdown && lokasi !== ''}
							<ul
								class="dropdown absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg"
							>
								{#each $results as name}
									<li
										class="cursor-pointer px-3 py-2 hover:bg-gray-100"
										onclick={() => selectLocation(name)}
									>
										{name}
									</li>
								{/each}
							</ul>
						{/if}
					</div>
					{#if error}
						{#each error.alamat as a}
							<p class="text-center text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Juru Kunci<span class="text-red-500">*</span></p>
						<select
							name="jurukunci"
							bind:value={jurukunci}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						>
							{#each usersList as user}
								<option value={user.id}>
									{user.nama_lengkap || 'Unnamed'}
								</option>
							{/each}
						</select>
						{#if error}
							{#each error.jurukunci as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Jenis Situs<span class="text-red-500">*</span></p>
						<select
							name="jenissitus"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						>
							{#each jenisSitusList as jenis}
								<option value={jenis.id_jenis_situs}>
									{jenis.jenis_situs || jenis.nama_jenis || 'Unnamed'}
								</option>
							{/each}
						</select>
						{#if error}
							{#each error.jenissitus as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Pembina<span class="text-red-500">*</span></p>
						<select
							name="pembina"
							bind:value={pembina}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						>
							{#each usersList as user}
								<option value={user.id}>
									{user.nama_lengkap || 'Unnamed'}
								</option>
							{/each}
						</select>
						{#if error}
							{#each error.pembina as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Pelindung<span class="text-red-500">*</span></p>
						<select
							name="pelindung"
							bind:value={pelindung}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						>
							{#each usersList as user}
								<option value={user.id}>
									{user.nama_lengkap || 'Unnamed'}
								</option>
							{/each}
						</select>
						{#if error}
							{#each error.pelindung as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Jam Buka<span class="text-red-500">*</span></p>
						<input
							type="time"
							bind:value={dataambil.jambuka}
							name="jambuka"
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.jambuka as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Jam Tutup<span class="text-red-500">*</span></p>
						<input
							type="time"
							bind:value={dataambil.jamtutup}
							name="jamtutup"
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.jamtutup as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-3">
					<p>Wisata<span class="text-red-500">*</span></p>
					<div class="relative">
						<select
							name="wisata"
							bind:value={dataambil.wisata}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						>
							<option value="" disabled>Pilih Pembina</option>
							{#each wisataList as user}
								<option value={user.id_wisata}>
									{user.nama_wisata || 'Unnamed'}
								</option>
							{/each}
						</select>
					</div>
					{#if error}
						{#each error.wisata as a}
							<p class="text-center text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="relative flex w-full items-end justify-center lg:justify-end">
					<button
						class="w-50 t-0 mt-10 rounded-lg border-2 border-black bg-green-500 px-2 py-2 text-white"
						type="submit">Simpan Data</button
					>
				</div>
			</div>
		</div>
	</form>
</div>

{#if open}
	<div transition:fade={{ duration: 100 }}>
		<SuccessModal text="Acara berhasil diubah!"></SuccessModal>
	</div>
{/if}

<style>
	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}

	.raphael--edit {
		display: inline-block;
		width: 28px;
		height: 28px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23a59494' d='M27.87 7.863L23.024 4.82l-7.89 12.566l4.843 3.04zM14.395 21.25l-.107 2.855l2.527-1.337l2.35-1.24l-4.673-2.936zM29.163 3.24L26.63 1.647a1.364 1.364 0 0 0-1.88.43l-1 1.588l4.843 3.042l1-1.586c.4-.64.21-1.483-.43-1.883zm-3.965 23.82c0 .275-.225.5-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5h13.244l1.884-3H5.698c-1.93 0-3.5 1.57-3.5 3.5v19c0 1.93 1.57 3.5 3.5 3.5h19c1.93 0 3.5-1.57 3.5-3.5V11.097l-3 4.776v11.19z'/%3E%3C/svg%3E");
	}

	.mdi--edit {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'/%3E%3C/svg%3E");
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		max-height: 200px;
		overflow-y: auto;
		background-color: white;
		border: 1px solid #ccc;
		border-radius: 4px;
		z-index: 10;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.dropdown li {
		padding: 8px 12px;
		cursor: pointer;
	}

	.dropdown li:hover {
		background-color: #f0f0f0;
	}
</style>
