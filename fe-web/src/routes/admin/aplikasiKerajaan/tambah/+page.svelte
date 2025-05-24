<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';
	import SModal from '$lib/popup/SModal.svelte';
	import ColorPicker from 'svelte-awesome-color-picker';

	// Website features
	let fiturSitus = $state(' ');
	let fiturAcara = $state(' ');
	let fiturOrganisasi = $state(' ');
	let fiturKomunitas = $state(' ');
	let fiturAset = $state(' ');
	let fiturTugasWeb = $state(' '); // Renamed to fiturTugasWeb for website

	// Mobile features
	let fiturMobile = $state(' ');
	let fiturPenanggalan1 = $state(' ');
	let fiturPenanggalan2 = $state([]); // Array for multiple selections
	let fiturTugasMobile = $state(' ');
	let fiturTugasAcara = $state(' ');
	let fiturSitusKerajaan = $state(' ');
	let fiturCheckin = $state(' ');
	let fiturAcaraKerajaan = $state(' ');
	let fiturGroupChat = $state(' ');
	let fiturForum = $state(' ');
	let fiturPermohonan = $state(' ');

	let warnaUtama = $state('#4F46E5');
	let warnaSecondary = $state('#FF5500');
	let warnaAksen1 = $state('#FFF3D8');
	let warnaAksen2 = $state('#005A78');

	// Tambahkan state untuk warna mobile
	let warnaMobileUtama = $state('#4F46E5');
	let warnaMobileSecondary = $state('#FF5500');
	let warnaMobileAksen1 = $state('#FFF3D8');
	let warnaMobileAksen2 = $state('#005A78');

	let activeColorPicker = $state('');
	let showColorPicker = $state(false);
	let currentColor = $state('');

	// Function to open color picker
	function openColorPicker(type: any) {
		activeColorPicker = type;
		switch (type) {
			// Warna website
			case 'utama':
				currentColor = warnaUtama;
				break;
			case 'secondary':
				currentColor = warnaSecondary;
				break;
			case 'aksen1':
				currentColor = warnaAksen1;
				break;
			case 'aksen2':
				currentColor = warnaAksen2;
				break;
			// Warna mobile
			case 'mobile-utama':
				currentColor = warnaMobileUtama;
				break;
			case 'mobile-secondary':
				currentColor = warnaMobileSecondary;
				break;
			case 'mobile-aksen1':
				currentColor = warnaMobileAksen1;
				break;
			case 'mobile-aksen2':
				currentColor = warnaMobileAksen2;
				break;
		}
		showColorPicker = true;
	}

	$effect(() => {
		if (fiturSitus === 'tidak') {
			fiturCheckin = 'tidak';
			fiturSitusKerajaan = 'tidak';
		} else if (fiturSitus === 'ya') {
			fiturCheckin = '';
			fiturSitusKerajaan = '';
		} else if (fiturAcara === 'tidak') {
			fiturTugasAcara = 'tidak';
			fiturAcaraKerajaan = 'tidak';
		} else if (fiturAcara === 'ya') {
			fiturTugasAcara = '';
			fiturAcaraKerajaan = '';
		} else if (fiturTugasWeb === 'tidak') {
			fiturTugasAcara = 'tidak';
			fiturTugasMobile = 'tidak';
		} else if (fiturTugasWeb === 'ya') {
			fiturTugasAcara = '';
			fiturTugasMobile = '';
		} else if (fiturSitusKerajaan === 'tidak') {
			fiturCheckin = 'tidak';
		} else if (fiturSitusKerajaan === 'ya') {
			fiturCheckin = '';
		}
	});

	// Function to apply selected color
	function applyColor() {
		switch (activeColorPicker) {
			// Warna website
			case 'utama':
				warnaUtama = currentColor;
				break;
			case 'secondary':
				warnaSecondary = currentColor;
				break;
			case 'aksen1':
				warnaAksen1 = currentColor;
				break;
			case 'aksen2':
				warnaAksen2 = currentColor;
				break;
			// Warna mobile
			case 'mobile-utama':
				warnaMobileUtama = currentColor;
				break;
			case 'mobile-secondary':
				warnaMobileSecondary = currentColor;
				break;
			case 'mobile-aksen1':
				warnaMobileAksen1 = currentColor;
				break;
			case 'mobile-aksen2':
				warnaMobileAksen2 = currentColor;
				break;
		}
		showColorPicker = false;
	}

	let loading = $state(false);
	let success = $state(false);
	let error: any = $state('');
	let timer: ReturnType<typeof setTimeout>;

	// Tambahkan state untuk menyimpan preview logo
	let logoPreview: any = $state(null);
	let logoFile = $state(null);

	// Fungsi untuk menangani upload logo
	function handleLogoUpload(event: any) {
		const file = event.target.files[0];
		if (file) {
			logoFile = file;
			// Buat URL untuk preview logo
			logoPreview = URL.createObjectURL(file);
		}
	}

	// Fungsi untuk menghapus logo yang sudah diupload
	function removeLogoPreview() {
		if (logoPreview) {
			URL.revokeObjectURL(logoPreview);
		}
		logoPreview = null;
		logoFile = null;
		// Reset input file
		const logoInput = document.getElementById('logo-upload');
		if (logoInput) {
			(logoInput as HTMLInputElement).value = '';
		}
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}

<!-- Color Picker Modal -->
{#if showColorPicker}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<div class="relative w-[350px] rounded-lg bg-white p-6 shadow-lg">
			<button
				class="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
				onclick={() => (showColorPicker = false)}
			>
				✕
			</button>
			<h3 class="mb-4 text-lg font-semibold">Pilih Warna</h3>
			<div class="mb-4">
				<ColorPicker bind:hex={currentColor} />
			</div>
			<div class="flex justify-end gap-2">
				<button
					class="rounded bg-gray-300 px-4 py-2 text-gray-700"
					onclick={() => (showColorPicker = false)}
				>
					Batal
				</button>
				<button class="rounded bg-blue-600 px-4 py-2 text-white" onclick={applyColor}>
					Pilih
				</button>
			</div>
		</div>
	</div>
{/if}

<div class="w-full px-5">
	<a href="/admin/aplikasiKerajaan" class="mb-4 inline-block">
		<p class="text-md font-semibold">← Kembali ke Halaman Kerajaan</p>
	</a>

	<p class="mt-8 text-2xl font-semibold">Buat Aplikasi Kerajaan</p>
	<div class="mt-1 h-1 w-full bg-slate-400"></div>

	<form
		action="?/tambahAplikasi"
		method="post"
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						success = false;
						goto('/admin/aplikasiKerajaan/11');
					}, 3000);
				} else if (result.type === 'failure') {
					error = result.data?.errors;
					{
						console.log('errors : ', error);
					}
				}
			};
		}}
	>
		<input type="hidden" name="id_kerajaan" value="32" />
		<input type="hidden" name="warna_utama" value={warnaUtama} />
		<input type="hidden" name="warna_secondary" value={warnaSecondary} />
		<input type="hidden" name="warna_aksen1" value={warnaAksen1} />
		<input type="hidden" name="warna_aksen2" value={warnaAksen2} />
		<input type="hidden" name="warna_mobile_utama" value={warnaMobileUtama} />
		<input type="hidden" name="warna_mobile_secondary" value={warnaMobileSecondary} />
		<input type="hidden" name="warna_mobile_aksen1" value={warnaMobileAksen1} />
		<input type="hidden" name="warna_mobile_aksen2" value={warnaMobileAksen2} />

		<div class="mt-6 w-full rounded-lg border bg-white p-6 shadow-sm">
			{#if success}
				<SModal text="Kerajaan berhasil Ditambahkan"></SModal>
			{/if}

			<!-- Konten form aplikasi kerajaan -->
			<p class="text-md mb-6 font-semibold">
				Silahkan mengisi list fitur yang anda inginkan di website kerajaan anda melalui form di
				bawah ini!
			</p>

			<div class="mb-6">
				<p class="text-md font-semibold">
					1. Apakah anda ingin memiliki fitur <span class="font-[750]"> Situs </span> di website kerajaan
					anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini sudah mencakup manajemen situs kerajaan, profil situs, acara situs (jika
					memilih fitur acara) dan buku tamu situs.
				</p>

				<div class="items-left mt-3 flex flex-col gap-2">
					<div class="mr-6 flex items-center">
						<input
							id="situs-ya"
							type="radio"
							value="ya"
							bind:group={fiturSitus}
							name="fitur-situs"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="situs-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center">
						<input
							id="situs-tidak"
							type="radio"
							value="tidak"
							bind:group={fiturSitus}
							name="fitur-situs"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="situs-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>

				{#if error}
					{#each error.fitur_situs as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<div class="mb-6">
				<p class="text-md font-semibold">
					2. Apakah anda ingin memiliki fitur <span class="font-[750]"> Acara </span> di website kerajaan
					anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini sudah mencakup manajemen acara kerajaan, detail acara, RSVP acara, acara
					situs, dan acara komunitas/organisasi (jika memilih fitur komunitas/organisasi).
				</p>

				<div class="items-left mt-3 flex flex-col gap-2">
					<div class="mr-6 flex items-center">
						<input
							id="acara-ya"
							type="radio"
							value="ya"
							bind:group={fiturAcara}
							name="fitur-acara"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="acara-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center">
						<input
							id="acara-tidak"
							type="radio"
							value="tidak"
							bind:group={fiturAcara}
							name="fitur-acara"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="acara-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>
				{#if error}
					{#each error.fitur_acara as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<div class="mb-6">
				<p class="text-md font-semibold">
					3. Apakah anda ingin memiliki fitur <span class="font-[750]"> Aset </span> di website kerajaan
					anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini sudah mencakup manajemen aset kerajaan, detail aset kerajaan, dan dokumentasi
					aset kerajaan.
				</p>

				<div class="items-left mt-3 flex flex-col gap-2">
					<div class="mr-6 flex items-center">
						<input
							id="aset-ya"
							type="radio"
							value="ya"
							bind:group={fiturAset}
							name="fitur-aset"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="aset-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center">
						<input
							id="aset-tidak"
							type="radio"
							value="tidak"
							bind:group={fiturAset}
							name="fitur-aset"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="aset-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>
				{#if error}
					{#each error.fitur_aset as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<div class="mb-6">
				<p class="text-md font-semibold">
					4. Apakah anda ingin memiliki fitur <span class="font-[750]"> Komunitas </span> di website
					kerajaan anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini sudah mencakup manajemen komunitas, detail komunitas, daftar anggota
					komunitas, acara komunitas (jika memilih fitur acara).
				</p>

				<div class="items-left mt-3 flex flex-col gap-2">
					<div class="mr-6 flex items-center">
						<input
							id="komunitas-ya"
							type="radio"
							value="ya"
							bind:group={fiturKomunitas}
							name="fitur-komunitas"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="komunitas-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center">
						<input
							id="komunitas-tidak"
							type="radio"
							value="tidak"
							bind:group={fiturKomunitas}
							name="fitur-komunitas"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="komunitas-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label
						>
					</div>
				</div>
				{#if error}
					{#each error.fitur_komunitas as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<div class="mb-6">
				<p class="text-md font-semibold">
					5. Apakah anda ingin memiliki fitur <span class="font-[750]"> Organisasi </span> di website
					kerajaan anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini sudah mencakup manajemen organisasi, detail organisasi, daftar anggota
					organisasi, acara organisasi (jika memilih fitur acara).
				</p>

				<div class="items-left mt-3 flex flex-col gap-2">
					<div class="mr-6 flex items-center">
						<input
							id="organisasi-ya"
							type="radio"
							value="ya"
							bind:group={fiturOrganisasi}
							name="fitur-organisasi"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="organisasi-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center">
						<input
							id="organisasi-tidak"
							type="radio"
							value="tidak"
							bind:group={fiturOrganisasi}
							name="fitur-organisasi"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="organisasi-tidak" class="ml-2 text-sm font-medium text-gray-900"
							>Tidak</label
						>
					</div>
				</div>

				{#if error}
					{#each error.fitur_organisasi as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<div class="mb-6">
				<p class="text-md font-semibold">
					6. Apakah anda ingin memiliki fitur <span class="font-[750]"> Tugas </span> di website kerajaan
					anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini sudah mencakup manajemen tugas, detail tugas, laporan tugas.
				</p>

				<div class="items-left mt-3 flex flex-col gap-2">
					<div class="mr-6 flex items-center">
						<input
							id="tugas-web-ya"
							type="radio"
							value="ya"
							bind:group={fiturTugasWeb}
							name="fitur-tugas-web"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="tugas-web-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center">
						<input
							id="tugas-web-tidak"
							type="radio"
							value="tidak"
							bind:group={fiturTugasWeb}
							name="fitur-tugas-web"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="tugas-web-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label
						>
					</div>
				</div>

				{#if error}
					{#each error.fitur_tugas_web as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<!-- Color selection section -->
			<div class="mb-6 mt-8">
				<p class="text-md font-semibold">7. Tentukan warna untuk website kerajaan anda!</p>
				<p class="mb-4 text-sm text-gray-500">
					Warna utama paling banyak digunakan, lalu warna sekunder, dan warna aksen untuk
					aksen-aksen dan tombol di website kerajaan.
				</p>

				<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
					<!-- Warna Utama -->
					<div class="flex items-center gap-3">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="h-8 w-8 cursor-pointer rounded border shadow-sm"
							style="background-color: {warnaUtama};"
							onclick={() => openColorPicker('utama')}
						></div>
						<input
							type="text"
							class="w-24 rounded border px-2 py-1 text-sm uppercase"
							value={warnaUtama}
							readonly
							onclick={() => openColorPicker('utama')}
						/>
						<span class="text-sm font-medium">Warna Utama</span>
					</div>

					<!-- Warna Sekunder -->
					<div class="flex items-center gap-3">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="h-8 w-8 cursor-pointer rounded border shadow-sm"
							style="background-color: {warnaSecondary};"
							onclick={() => openColorPicker('secondary')}
						></div>
						<input
							type="text"
							class="w-24 rounded border px-2 py-1 text-sm uppercase"
							value={warnaSecondary}
							readonly
							onclick={() => openColorPicker('secondary')}
						/>
						<span class="text-sm font-medium">Warna Sekunder</span>
					</div>

					<!-- Warna Aksen 1 -->
					<div class="flex items-center gap-3">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="h-8 w-8 cursor-pointer rounded border shadow-sm"
							style="background-color: {warnaAksen1};"
							onclick={() => openColorPicker('aksen1')}
						></div>
						<input
							type="text"
							class="w-24 rounded border px-2 py-1 text-sm uppercase"
							value={warnaAksen1}
							readonly
							onclick={() => openColorPicker('aksen1')}
						/>
						<span class="text-sm font-medium">Warna Aksen 1</span>
					</div>

					<!-- Warna Aksen 2 -->
					<div class="flex items-center gap-3">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="h-8 w-8 cursor-pointer rounded border shadow-sm"
							style="background-color: {warnaAksen2};"
							onclick={() => openColorPicker('aksen2')}
						></div>
						<input
							type="text"
							class="w-24 rounded border px-2 py-1 text-sm uppercase"
							value={warnaAksen2}
							readonly
							onclick={() => openColorPicker('aksen2')}
						/>
						<span class="text-sm font-medium">Warna Aksen 2</span>
					</div>
				</div>
			</div>

			<!-- Upload Logo section -->
			<div class="mb-6">
				<p class="text-md font-semibold">8. Silahkan mengupload logo kerajaan anda!</p>
				<div class="mt-3 flex items-center">
					<label
						for="logo-upload"
						class="flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 hover:bg-gray-200"
					>
						{#if logoPreview}
							<div class="relative h-32 w-32">
								<img
									src={logoPreview}
									alt="Logo Preview"
									class="h-full w-full rounded-lg object-cover"
								/>
								<!-- <button 
									type="button"
									class="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
									onclick={removeLogoPreview}
								>
									✕
								</button> -->
								<button
									type="button"
									class="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 bg-opacity-70 text-white"
									onclick={() => document.getElementById('logo-upload')?.click()}
								>
									✎
								</button>
							</div>
						{:else}
							<div class="flex flex-col items-center justify-center">
								<svg
									class="mb-1 h-8 w-8 text-gray-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									></path>
								</svg>
								<p class="text-xs text-gray-500">Upload Logo</p>
							</div>
						{/if}
						<input
							id="logo-upload"
							name="logo"
							type="file"
							class="hidden"
							accept="image/*"
							onchange={handleLogoUpload}
						/>
					</label>
				</div>
				{#if error}
					{#each error.logo as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<div class="mb-6">
				<div class="mt-3 flex items-center gap-2">
					<p class="text-md font-semibold">
						Apakah anda ingin memiliki aplikasi mobile untuk kerajaan anda?
					</p>
					<div class="mr-6 flex items-center">
						<input
							id="mobile-ya"
							type="radio"
							value="ya"
							bind:group={fiturMobile}
							name="fitur-mobile"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="mobile-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center">
						<input
							id="mobile-tidak"
							type="radio"
							value="tidak"
							bind:group={fiturMobile}
							checked
							name="fitur-mobile"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="mobile-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>
			</div>

			{#if fiturMobile === 'ya'}
				<p class="text-md mb-6 font-semibold">
					Silahkan mengisi list fitur yang anda inginkan di aplikasi mobile kerajaan anda melalui
					form di bawah ini!
				</p>

				<!-- 1 -->
				<div class="mb-6">
					<p class="text-md font-semibold">
						1. Apakah anda ingin memiliki fitur <span class="font-[750]"> Penanggalan </span> di aplikasi
						mobile kerajaan anda?
					</p>
					<p class="mb-2 text-sm text-gray-500">
						**Fitur ini sudah mencakup manajemen situs kerajaan, profil situs, acara situs (jika
						memilih fitur acara) dan buku tamu situs.
					</p>

					<div class="items-left mt-3 flex flex-col gap-2">
						<div class="mr-6 flex items-center">
							<input
								id="penanggalan1-ya"
								type="radio"
								value="ya"
								bind:group={fiturPenanggalan1}
								name="fitur-penanggalan1"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="penanggalan1-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
						</div>
						<div class="flex items-center">
							<input
								id="penanggalan1-tidak"
								type="radio"
								value="tidak"
								bind:group={fiturPenanggalan1}
								name="fitur-penanggalan1"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="penanggalan2-tidak" class="ml-2 text-sm font-medium text-gray-900"
								>Tidak</label
							>
						</div>
					</div>
					{#if error}
						{#each error.fitur_penanggalan1 as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<!-- 1.1 -->
				{#if fiturPenanggalan1 === 'ya'}
					<div class="mb-6 ml-5">
						<p class="text-md font-semibold">
							1.1 Jenis <span class="font-[750]"> Penanggalan </span> apa yang anda inginkan di aplikasi
							mobile kerajaan anda ?
						</p>
						<p class="mb-2 text-sm text-gray-500">
							**Fitur ini sudah mencakup penanggalan jawa,hindu,bali, Hijriah
						</p>

						<div class="items-left mt-3 flex flex-row gap-3">
							<div class="mr-6 flex items-center">
								<input
									id="penanggalan-jawa"
									type="checkbox"
									value="jawa"
									bind:group={fiturPenanggalan2}
									name="fitur-penanggalan2"
									class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="penanggalan-jawa" class="ml-2 text-sm font-medium text-gray-900"
									>Penanggalan Jawa</label
								>
							</div>
							<div class="flex items-center">
								<input
									id="penanggalan-bali"
									type="checkbox"
									value="bali"
									bind:group={fiturPenanggalan2}
									name="fitur-penanggalan2"
									class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="penanggalan-bali" class="ml-2 text-sm font-medium text-gray-900"
									>Penanggalan Bali</label
								>
							</div>
						</div>

						<div class="items-left mt-3 flex flex-row gap-1">
							<div class="mr-6 flex items-center">
								<input
									id="penanggalan-hindu"
									type="checkbox"
									value="hindu"
									bind:group={fiturPenanggalan2}
									name="fitur-penanggalan2"
									class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="penanggalan-hindu" class="ml-2 text-sm font-medium text-gray-900"
									>Penanggalan Hindu</label
								>
							</div>
							<div class="flex items-center">
								<input
									id="penanggalan-hijriah"
									type="checkbox"
									value="hijriah"
									bind:group={fiturPenanggalan2}
									name="fitur-penanggalan2"
									class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="penanggalan-hijriah" class="ml-2 text-sm font-medium text-gray-900"
									>Penanggalan Hijriah</label
								>
							</div>
						</div>

						{#if error}
							{#each error.fitur_penanggalan2 as e}
								<p class="text-left text-red-500">{e}</p>
							{/each}
						{/if}
					</div>
				{/if}

				<!-- 2 -->
				<div class="mb-6">
					<p class="text-md font-semibold">
						2. Apakah anda ingin memiliki fitur <span class="font-[750]"> Tugas pribadi </span> di aplikasi
						mobile kerajaan anda?
					</p>
					<p class="mb-2 text-sm text-gray-500">
						**Fitur ini akan memungkinkan pengguna untuk melihat dan melaporkan bukti tugas pribadi
						yang di milikinya
					</p>

					<div class="items-left mt-3 flex flex-col gap-2">
						<div class="mr-6 flex items-center">
							<input
								id="tugas-mobile-ya"
								type="radio"
								value="ya"
								disabled={fiturTugasWeb === 'tidak' || fiturTugasWeb === "tidak"}
								bind:group={fiturTugasMobile}
								name="fitur-tugas-mobile"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="tugas-mobile-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
						</div>
						<div class="flex items-center">
							<input
								id="tugas-mobile-tidak"
								type="radio"
								value="tidak"
								bind:group={fiturTugasMobile}
								disabled={fiturTugasWeb === 'tidak' || fiturTugasWeb === "tidak"}
								name="fitur-tugas-mobile"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="tugas-mobile-tidak" class="ml-2 text-sm font-medium text-gray-900"
								>Tidak</label
							>
						</div>
					</div>

					{#if error}
						{#each error.fitur_tugas_mobile as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<!-- 3 -->
				<div class="mb-6">
					<p class="text-md font-semibold">
						3. Apakah anda ingin memiliki fitur <span class="font-[750]"> Tugas Acara </span> di aplikasi
						mobile kerajaan anda?
					</p>
					<p class="mb-2 text-sm text-gray-500">
						**Fitur ini akan memungkinkan pengguna untuk melihat dan melaporkan bukti tugas acara
						yang di milikinya
					</p>

					<div class="items-left mt-3 flex flex-col gap-2">
						<div class="mr-6 flex items-center">
							<input
								id="tugasAcara-ya"
								type="radio"
								value="ya"
								bind:group={fiturTugasAcara}
								disabled={fiturAcara === 'tidak' || fiturTugasWeb === "tidak"}
								name="fitur-tugasacara"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="tugasAcara-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
						</div>
						<div class="flex items-center">
							<input
								id="tugasAcara-tidak"
								type="radio"
								value="tidak"
								bind:group={fiturTugasAcara}
								disabled={fiturAcara === 'tidak' || fiturTugasWeb === "tidak"}
								name="fitur-tugasacara"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="tugasAcara-tidak" class="ml-2 text-sm font-medium text-gray-900"
								>Tidak</label
							>
						</div>
					</div>
					{#if error}
						{#each error.fitur_tugasacara as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<!-- 4 -->
				<div class="mb-6">
					<p class="text-md font-semibold">
						4. Apakah anda ingin memiliki fitur <span class="font-[750]"> Situs Kerajaan </span> di aplikasi
						mobile kerajaan anda?
					</p>
					<p class="mb-2 text-sm text-gray-500">
						**Fitur ini akan memungkinkan pengguna untuk melihat daftar situs kerajaan yang ada
					</p>

					<div class="items-left mt-3 flex flex-col gap-2">
						<div class="mr-6 flex items-center">
							<input
								id="situsKerajaan-ya"
								type="radio"
								value="ya"
								bind:group={fiturSitusKerajaan}
								disabled={fiturSitus === 'tidak'}
								name="fitur-situskerajaan"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="situsKerajaan-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label
							>
						</div>
						<div class="flex items-center">
							<input
								id="situsKerajaan-tidak"
								type="radio"
								value="tidak"
								bind:group={fiturSitusKerajaan}
								disabled={fiturSitus === 'tidak'}
								name="fitur-situskerajaan"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="situsKerajaan-tidak" class="ml-2 text-sm font-medium text-gray-900"
								>Tidak</label
							>
						</div>
					</div>
					{#if error}
						{#each error.fitur_situskerajaan as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<!-- 5 -->
				<div class="mb-6">
					<p class="text-md font-semibold">
						5. Apakah anda ingin memiliki fitur <span class="font-[750]"> Check-In Situs </span> di aplikasi
						mobile kerajaan anda?
					</p>
					<p class="mb-2 text-sm text-gray-500">
						**Fitur ini akan memungkinkan pengguna untuk melakukan check-in di buku tamu suatu situs
					</p>

					<div class="items-left mt-3 flex flex-col gap-2">
						<div class="mr-6 flex items-center">
							<input
								id="checkin-ya"
								type="radio"
								value="ya"
								bind:group={fiturCheckin}
								disabled={fiturSitus === 'tidak' || fiturSitusKerajaan === "tidak"}
								name="fitur-checkin"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="checkin-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
						</div>
						<div class="flex items-center">
							<input
								id="checkin-tidak"
								type="radio"
								value="tidak"
								bind:group={fiturCheckin}
								disabled={fiturSitus === 'tidak' || fiturSitusKerajaan === "tidak"}
								name="fitur-checkin"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="checkin-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label
							>
						</div>
					</div>
					{#if error}
						{#each error.fitur_checkin as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<!-- 6 -->
				<div class="mb-6">
					<p class="text-md font-semibold">
						6. Apakah anda ingin memiliki fitur <span class="font-[750]"> Acara Kerajaan </span> di aplikasi
						mobile kerajaan anda?
					</p>
					<p class="mb-2 text-sm text-gray-500">
						**Fitur ini akan memungkinkan pengguna untuk melihat daftar acara dan melakukan RSVP di
						acara kerajaan.
					</p>

					<div class="items-left mt-3 flex flex-col gap-2">
						<div class="mr-6 flex items-center">
							<input
								id="acaraKerajaan-ya"
								type="radio"
								value="ya"
								bind:group={fiturAcaraKerajaan}
								disabled={fiturAcara === 'tidak'}
								name="fitur-acarakerajaan"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="acaraKerajaan-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label
							>
						</div>
						<div class="flex items-center">
							<input
								id="acaraKerajaan-tidak"
								type="radio"
								value="tidak"
								bind:group={fiturAcaraKerajaan}
								disabled={fiturAcara === 'tidak'}
								name="fitur-acarakerajaan"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="acaraKerajaan-tidak" class="ml-2 text-sm font-medium text-gray-900"
								>Tidak</label
							>
						</div>
					</div>
					{#if error}
						{#each error.fitur_acarakerajaan as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<!-- 7 -->
				<div class="mb-6">
					<p class="text-md font-semibold">
						7. Apakah anda ingin memiliki fitur <span class="font-[750]"> Group Chat </span> di aplikasi
						mobile kerajaan anda?
					</p>
					<p class="mb-2 text-sm text-gray-500">
						**Fitur ini akan memungkinkan pengguna untuk berkomunikasi dalam suatu grup yang dapat
						dibuat masing-masing.
					</p>

					<div class="items-left mt-3 flex flex-col gap-2">
						<div class="mr-6 flex items-center">
							<input
								id="groupChat-ya"
								type="radio"
								value="ya"
								bind:group={fiturGroupChat}
								name="fitur-groupchat"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="groupChat-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
						</div>
						<div class="flex items-center">
							<input
								id="groupChat-tidak"
								type="radio"
								value="tidak"
								bind:group={fiturGroupChat}
								name="fitur-groupchat"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="groupChat-tidak" class="ml-2 text-sm font-medium text-gray-900"
								>Tidak</label
							>
						</div>
					</div>
					{#if error}
						{#each error.fitur_groupchat as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<!-- 8 -->
				<div class="mb-6">
					<p class="text-md font-semibold">
						8. Apakah anda ingin memiliki fitur <span class="font-[750]"> Forum </span> di aplikasi mobile
						kerajaan anda?
					</p>
					<p class="mb-2 text-sm text-gray-500">
						**Fitur ini akan memungkinkan pengguna untuk membaca dan berkomentar dalam suatu topik
						pembahasan.
					</p>

					<div class="items-left mt-3 flex flex-col gap-2">
						<div class="mr-6 flex items-center">
							<input
								id="forum-ya"
								type="radio"
								value="ya"
								bind:group={fiturForum}
								name="fitur-forum"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="forum-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
						</div>
						<div class="flex items-center">
							<input
								id="forum-tidak"
								type="radio"
								value="tidak"
								bind:group={fiturForum}
								name="fitur-forum"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
							/>
							<label for="forum-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
						</div>
					</div>
					{#if error}
						{#each error.fitur_forum as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<!-- Tambahkan bagian pemilihan warna untuk mobile -->
				<div class="mb-6 mt-8">
					<p class="text-md font-semibold">9. Tentukan warna untuk aplikasi mobile kerajaan anda!</p>
					<p class="mb-4 text-sm text-gray-500">
						Warna utama paling banyak digunakan, lalu warna sekunder, dan warna aksen untuk
						aksen-aksen dan tombol di aplikasi mobile kerajaan.
					</p>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<!-- Warna Utama Mobile -->
						<div class="flex items-center gap-3">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="h-8 w-8 cursor-pointer rounded border shadow-sm"
								style="background-color: {warnaMobileUtama};"
								onclick={() => openColorPicker('mobile-utama')}
							></div>
							<input
								type="text"
								class="w-24 rounded border px-2 py-1 text-sm uppercase"
								value={warnaMobileUtama}
								readonly
								
							/>
							<span class="text-sm font-medium">Warna Utama Mobile</span>
						</div>

						<!-- Warna Sekunder Mobile -->
						<div class="flex items-center gap-3">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="h-8 w-8 cursor-pointer rounded border shadow-sm"
								style="background-color: {warnaMobileSecondary};"
								onclick={() => openColorPicker('mobile-secondary')}
							></div>
							<input
								type="text"
								class="w-24 rounded border px-2 py-1 text-sm uppercase"
								value={warnaMobileSecondary}
								readonly
								onclick={() => openColorPicker('mobile-secondary')}
							/>
							<span class="text-sm font-medium">Warna Sekunder Mobile</span>
						</div>

						<!-- Warna Aksen 1 Mobile -->
						<div class="flex items-center gap-3">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="h-8 w-8 cursor-pointer rounded border shadow-sm"
								style="background-color: {warnaMobileAksen1};"
								onclick={() => openColorPicker('mobile-aksen1')}
							></div>
							<input
								type="text"
								class="w-24 rounded border px-2 py-1 text-sm uppercase"
								value={warnaMobileAksen1}
								readonly
								onclick={() => openColorPicker('mobile-aksen1')}
							/>
							<span class="text-sm font-medium">Warna Aksen 1 Mobile</span>
						</div>

						<!-- Warna Aksen 2 Mobile -->
						<div class="flex items-center gap-3">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="h-8 w-8 cursor-pointer rounded border shadow-sm"
								style="background-color: {warnaMobileAksen2};"
								onclick={() => openColorPicker('mobile-aksen2')}
							></div>
							<input
								type="text"
								class="w-24 rounded border px-2 py-1 text-sm uppercase"
								value={warnaMobileAksen2}
								readonly
								onclick={() => openColorPicker('mobile-aksen2')}
							/>
							<span class="text-sm font-medium">Warna Aksen 2 Mobile</span>
						</div>
					</div>
				</div>
			{/if}

			<!-- Submit button -->
			<div class="mt-8 flex justify-end">
				<button
					type="submit"
					class="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Simpan
				</button>
			</div>
		</div>
	</form>
</div>

<style>
</style>
