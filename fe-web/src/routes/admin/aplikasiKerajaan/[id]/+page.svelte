<script lang="ts">
	import gambarEmpty from '../../../../../src/asset/Empty2.png';
	let berhasil = $state('ayaya');
	let currentStep = $state(1);
	let isDetailOpen = $state(false);

	const { data } = $props();
	console.log("Data  : ", data)
	console.log('Data website : ', data.websiteFeatures);
	console.log('Data mobile : ', data.mobileFeatures);

	if (
		data.mobileFeatures?.status_permintaan == 'Ditinjau' ||
		data.websiteFeatures?.status_permintaan == 'Ditinjau'
	) {
		berhasil = 'ayaya2';
	}

	function nextStep() {
		currentStep = currentStep >= 3 ? 1 : currentStep + 1;
	}

	function toggleDetail() {
		isDetailOpen = !isDetailOpen;
	}
</script>

<div class="w-full px-5">
	<p class="mt-8 text-2xl font-semibold">Aplikasi Kerajaan</p>
	<div class="mt-2 h-0.5 w-full bg-slate-400"></div>

	{#if berhasil === 'ayaya'}
		<img src={gambarEmpty} alt="" class=" h-50 mt-2 flex w-full items-center" />
		<div class="mt-5 flex w-full items-center justify-center">
			<a href="/admin/aplikasiKerajaan/{data.id_kerajaan}/tambah">
				<button class=" bg-customOrange2 rounded-lg px-2 py-1 font-semibold">
					+ Tambah Permintaan
				</button>
			</a>
		</div>
	{/if}

	{#if berhasil === 'ayaya2'}
		<div class="mt-8 flex justify-center">
			<div class="relative w-full max-w-3xl">
				<div class="flex items-center justify-between">
					<div class="relative flex flex-col items-center">
						<div class="icon-circle" class:active={currentStep >= 1}>
							<span class="ic--baseline-email"></span>
						</div>
						<div class="step-text-container">
							{#if currentStep === 1}
								<span class="mt-2 text-center text-xs">Permintaan Anda telah kami simpan</span>
							{/if}
						</div>
					</div>

					<!-- Connecting line 1-2 -->
					<div class="connecting-line">
						<div class="progress-line" style="width: {currentStep > 1 ? '100%' : '0%'};"></div>
					</div>

					<!-- Step 2: Tools -->
					<div class="relative flex flex-col items-center">
						<div class="icon-circle" class:active={currentStep >= 2}>
							<span class="mdi--wrench"></span>
						</div>
						<div class="step-text-container">
							{#if currentStep === 2}
								<span class="max-w-30 mt-2 text-center text-xs"
									>Proses pengembangan Aplikasi Kerajaan Anda sedang berlangsung. Harap bersabar dan
									pantau progresnya secara berkala.</span
								>
							{/if}
						</div>
					</div>

					<!-- Connecting line 2-3 -->
					<div class="connecting-line">
						<div class="progress-line" style="width: {currentStep > 2 ? '100%' : '0%'};"></div>
					</div>

					<!-- Step 3: Checkmark -->
					<div class="relative flex flex-col items-center">
						<div class="icon-circle" class:active={currentStep >= 3}>
							<span class="ic--baseline-check"></span>
						</div>
						<div class="step-text-container">
							{#if currentStep === 3}
								<span class="mt-2 text-center text-xs"
									>Aplikasi Kerajaan Anda sudah selesai dan dapat anda akses melalui link dibawah
									ini. Harap hubungi kami apabila ada kendala atau pertanyaan</span
								>
							{:else}
								<span class="mt-2 text-center text-xs opacity-0">Placeholder</span>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Tombol coba animasi -->
		<div class="mt-20 flex justify-center">
			<button
				class="bg-customOrange2 rounded-md px-4 py-2 text-white transition-colors hover:bg-orange-600"
				onclick={nextStep}
			>
				Langkah Berikutnya (Saat ini: {currentStep}/3)
			</button>
		</div>
	{/if}

	{#if currentStep === 3}
		<p>Link Website Kerajaan :</p>
		<div class="rounded-lg border-2 border-black bg-slate-300 px-2 py-2">
			<p>https://kerajaan.com</p>
		</div>
		<p>Upload aplikasi kerajaan :</p>
		<div class="rounded-lg border-2 border-black bg-slate-300 px-2 py-2">
			<p>aplikasi.apk</p>
		</div>
	{/if}

	{#if berhasil === "ayaya2"}
	<div class="mt-24 w-full">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex w-full cursor-pointer items-center justify-between rounded-t-lg border bg-gray-100 px-4 py-3"
			onclick={toggleDetail}
		>
			<p class="font-medium">Detail Permintaan Aplikasi Kerajaan Anda</p>
			<span class="transform transition-transform duration-300" class:rotate-180={isDetailOpen}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</span>
		</div>

		{#if isDetailOpen}
			<div
				class="rounded-b-lg border-x border-b bg-white p-4 transition-all duration-300 ease-in-out"
			>
				<!-- Website Kerajaan Section -->
				<div class="mb-6">
					<div class="mb-2 grid grid-cols-12">
						<h3 class="col-span-8 text-lg font-semibold">Website Kerajaan</h3>
						<div class="col-span-2 border-r border-gray-300 text-center font-medium">Ya</div>
						<div class="col-span-2 text-center font-medium">Tidak</div>
					</div>

					<div class="border-t border-gray-200 pt-2">
						<!-- Fitur Situs -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Situs</div>
							<div class="col-span-2 flex justify-center border-r border-gray-300">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
							<div class="col-span-2"></div>
						</div>

						<!-- Fitur Acara -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Acara</div>
							<div class="col-span-2 flex justify-center border-r border-gray-300">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
							<div class="col-span-2"></div>
						</div>

						<!-- Fitur Aset -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Aset</div>
							<div class="col-span-2 border-r border-gray-300"></div>
							<div class="col-span-2 flex justify-center">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
						</div>

						<!-- Fitur Komunitas -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Komunitas</div>
							<div class="col-span-2 flex justify-center">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
							<div class="col-span-2 border-l border-gray-300"></div>
						</div>

						<!-- Fitur Organisasi -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Organisasi</div>
							<div class="col-span-2 flex justify-center border-r border-gray-300">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
							<div class="col-span-2"></div>
						</div>

						<!-- Fitur Tugas -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Tugas</div>
							<div class="col-span-2 border-r border-gray-300"></div>
							<div class="col-span-2 flex justify-center">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Aplikasi Mobile Kerajaan Section -->
				<div class="border-t border-gray-300 pt-4">
					<div class="mb-2 grid grid-cols-12">
						<h3 class="col-span-8 text-lg font-semibold">Aplikasi Mobile Kerajaan</h3>
						<div class="col-span-2 border-r border-gray-300 text-center font-medium">Ya</div>
						<div class="col-span-2 text-center font-medium">Tidak</div>
					</div>

					<div class="border-t border-gray-200 pt-2">
						<!-- Fitur Penanggalan -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Penanggalan</div>
							<div class="col-span-2 flex justify-center">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
							<div class="col-span-2 border-l border-gray-300"></div>
						</div>

						<!-- Fitur Tugas Pribadi -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Tugas Pribadi</div>
							<div class="col-span-2 flex justify-center">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
							<div class="col-span-2 border-l border-gray-300"></div>
						</div>

						<!-- Fitur Tugas Acara -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Tugas Acara</div>
							<div class="col-span-2 flex justify-center">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
							<div class="col-span-2 border-l border-gray-300"></div>
						</div>

						<!-- Fitur Situs Kerajaan -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Situs Kerajaan</div>
							<div class="col-span-2 flex justify-center">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
							<div class="col-span-2 border-l border-gray-300"></div>
						</div>

						<!-- Fitur Check-In Situs -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Check-In Situs</div>
							<div class="col-span-2 border-r border-gray-300"></div>
							<div class="col-span-2 flex justify-center">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
						</div>

						<!-- Fitur Acara Kerajaan -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Acara Kerajaan</div>
							<div class="col-span-2 border-r border-gray-300"></div>
							<div class="col-span-2 flex justify-center">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
						</div>

						<!-- Fitur Group Chat -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Group Chat</div>
							<div class="col-span-2 flex justify-center border-r border-gray-300">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
							<div class="col-span-2"></div>
						</div>

						<!-- Fitur Forum -->
						<div class="grid grid-cols-12 py-2">
							<div class="col-span-8">Fitur Forum</div>
							<div class="col-span-2 flex justify-center">
								<span class="text-customOrange2 text-xl">✓</span>
							</div>
							<div class="col-span-2 border-l border-gray-300"></div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
	{/if}
</div>

<style>
	.ic--baseline-email {
		display: inline-block;
		width: 48px;
		height: 48px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z'/%3E%3C/svg%3E");
	}

	.mdi--wrench {
		display: inline-block;
		width: 48px;
		height: 48px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFA600' d='m22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9c-2-2-5-2.4-7.4-1.3L9 6L6 9L1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4'/%3E%3C/svg%3E");
	}

	.icon-circle.active .mdi--wrench {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='m22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9c-2-2-5-2.4-7.4-1.3L9 6L6 9L1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4'/%3E%3C/svg%3E");
	}

	.ic--baseline-check {
		display: inline-block;
		width: 48px;
		height: 48px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23FFA600' d='M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z'/%3E%3C/svg%3E");
	}

	.icon-circle.active .ic--baseline-check {
		display: inline-block;
		width: 48px;
		height: 48px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z'/%3E%3C/svg%3E");
	}

	.icon-circle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 96px;
		height: 96px;
		border-radius: 50%;
		background-color: white;
		border: 1px solid #e5e7eb;
		z-index: 10;
		transition:
			background-color 0.5s ease,
			border 0.5s ease;
	}

	.icon-circle.active {
		background-color: #ffa600;
		border: none;
	}

	.connecting-line {
		height: 3px;
		flex-grow: 1;
		background-color: #e5e7eb;
		margin: 0 -1px;
		z-index: 5;
	}

	.progress-line {
		height: 100%;
		background-color: #ffa600;
		transition: width 0.5s ease;
	}

	.step-text-container {
		position: absolute;
		top: 100%;
		width: 400px;
		text-align: center;
		margin-top: 8px;
		height: 2.5em; /* Tinggi tetap untuk teks */
	}
</style>
