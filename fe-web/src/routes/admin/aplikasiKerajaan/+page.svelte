<script lang="ts">
	// Variabel untuk menyimpan pilihan radio button
	let fiturSitus = '';
	let fiturAcara = '';
	let fiturOrganisasi = '';
	let fiturKomunitas = '';
	let fiturAset = '';
	let fiturMobile = '';
</script>

<div class="w-full px-5">
	<a href="#" class="mb-4 inline-block">
		<p class="text-md font-semibold">← Kembali ke Halaman Kerajaan</p>
	</a>

	<p class="mt-8 text-2xl font-semibold">Buat Aplikasi Kerajaan</p>
	<div class="mt-1 h-1 w-full bg-slate-400"></div>

	<div class="mt-6 w-full rounded-lg border bg-white p-6 shadow-sm">
		<!-- Konten form aplikasi kerajaan -->
		<p class="text-md mb-6 font-semibold">
			Silahkan mengisi list fitur yang anda inginkan di website kerajaan anda melalui form di bawah
			ini!
		</p>

		<div class="mb-6">
			<p class="text-md font-semibold">
				1. Apakah anda ingin memiliki fitur <span class="font-[750]"> Situs </span> di website kerajaan
				anda?
			</p>
			<p class="mb-2 text-sm text-gray-500">
				**Fitur ini sudah mencakup manajemen situs kerajaan, profil situs, acara situs (jika memilih
				fitur acara) dan buku tamu situs.
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
		</div>

		<div class="mb-6">
			<p class="text-md font-semibold">
				2. Apakah anda ingin memiliki fitur <span class="font-[750]"> Acara </span> di website kerajaan
				anda?
			</p>
			<p class="mb-2 text-sm text-gray-500">
				**Fitur ini sudah mencakup manajemen acara kerajaan, detail acara, RSVP acara, acara situs,
				dan acara komunitas/organisasi (jika memilih fitur komunitas/organisasi).
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
		</div>

		<div class="mb-6">
			<p class="text-md font-semibold">
				4. Apakah anda ingin memiliki fitur <span class="font-[750]"> Komunitas </span> di website kerajaan
				anda?
			</p>
			<p class="mb-2 text-sm text-gray-500">
				**Fitur ini sudah mencakup manajemen komunitas, detail komunitas, daftar anggota komunitas,
				acara komunitas (jika memilih fitur acara).
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
					<label for="komunitas-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
				</div>
			</div>
		</div>

		<div class="mb-6">
			<p class="text-md font-semibold">
				5. Apakah anda ingin memiliki fitur <span class="font-[750]"> Organisasi </span> di website kerajaan
				anda?
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
					<label for="organisasi-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
				</div>
			</div>
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
					<label for="organisasi-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
				</div>
			</div>
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
						name="fitur-mobile"
						class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
					/>
					<label for="mobile-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
				</div>
			</div>
		</div>

		<!-- Tombol Submit -->
		<div class="mt-8 flex w-full justify-end">
			<button
				type="submit"
				class="flex items-end rounded-md bg-yellow-500 px-4 py-2 text-white hover:bg-blue-700"
			>
				Simpan Preferensi
			</button>
		</div>
	</div>
</div>

<style>
</style>
