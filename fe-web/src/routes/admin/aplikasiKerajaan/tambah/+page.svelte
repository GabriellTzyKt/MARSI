<script lang="ts">
	// Variabel untuk menyimpan pilihan radio button
	let fiturSitus = '';
	let fiturAcara = '';
	let fiturOrganisasi = '';
	let fiturKomunitas = '';
	let fiturAset = '';
	let fiturMobile = '';
	let fiturPenanggalan1 = '';
	// Ubah dari string ke array untuk multiple selection
	let fiturPenanggalan2 = [];
	let fiturTugas = '';
	let fiturTugasAcara = '';
	let fiturSitusKerajaan = '';
	let fiturCheckin = '';
	let fiturAcaraKerajaan = '';
	let fiturGroupChat = '';
	let fiturForum = '';
</script>

<div class="w-full px-5">
	<a href="/admin/aplikasiKerajaan" class="mb-4 inline-block">
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

		{#if fiturMobile === 'ya'}
			
			<p class="text-md mb-6 font-semibold">
				Silahkan mengisi list fitur yang anda inginkan di aplikasi mobile kerajaan anda melalui form
				di bawah ini!
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
						<label for="penanggalan2-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>
			</div>

			<!-- 1.1 -->
			<div class="mb-6 ml-5">
				<p class="text-md font-semibold">
					1.1 Jenis <span class="font-[750]"> Penanggalan </span> apa yang anda inginkan di aplikasi mobile kerajaan anda ?
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
						<label for="penanggalan-jawa" class="ml-2 text-sm font-medium text-gray-900">Penanggalan Jawa</label>
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
						<label for="penanggalan-bali" class="ml-2 text-sm font-medium text-gray-900">Penanggalan Bali</label>
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
						<label for="penanggalan-hindu" class="ml-2 text-sm font-medium text-gray-900">Penanggalan Hindu</label>
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
						<label for="penanggalan-hijriah" class="ml-2 text-sm font-medium text-gray-900">Penanggalan Hijriah</label>
					</div>
				</div>
			</div>

			<!-- 2 -->
			<div class="mb-6">
				<p class="text-md font-semibold">
					2. Apakah anda ingin memiliki fitur <span class="font-[750]"> Tugas pribadi </span> di aplikasi
					mobile kerajaan anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini akan memungkinkan pengguna untuk melihat dan melaporkan bukti tugas pribadi yang di milikinya
				</p>

				<div class="items-left mt-3 flex flex-col gap-2">
					<div class="mr-6 flex items-center">
						<input
							id="tugas-ya"
							type="radio"
							value="ya"
							bind:group={fiturTugas}
							name="fitur-tugas"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="tugas-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center">
						<input
							id="tugas-tidak"
							type="radio"
							value="tidak"
							bind:group={fiturTugas}
							name="fitur-tugas"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="tugas-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>
			</div>

			<!-- 3 -->
			<div class="mb-6">
				<p class="text-md font-semibold">
					3. Apakah anda ingin memiliki fitur <span class="font-[750]"> Tugas Acara </span> di aplikasi
					mobile kerajaan anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini akan memungkinkan pengguna untuk melihat dan melaporkan bukti tugas acara yang di milikinya
				</p>

				<div class="items-left mt-3 flex flex-col gap-2">
					<div class="mr-6 flex items-center">
						<input
							id="tugasAcara-ya"
							type="radio"
							value="ya"
							bind:group={fiturTugasAcara}
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
							name="fitur-tugasacara"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="tugasAcara-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>
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
							name="fitur-situskerajaan"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="situsKerajaan-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center">
						<input
							id="situsKerajaan-tidak"
							type="radio"
							value="tidak"
							bind:group={fiturSitusKerajaan}
							name="fitur-situskerajaan"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="situsKerajaan-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>
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
							name="fitur-checkin"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="checkin-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>
			</div>

			<!-- 6 -->
			<div class="mb-6">
				<p class="text-md font-semibold">
					6. Apakah anda ingin memiliki fitur <span class="font-[750]"> Acara Kerajaan </span> di aplikasi
					mobile kerajaan anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini akan memungkinkan pengguna untuk melihat daftar acara dan melakukan RSVP di acara kerajaan.
				</p>

				<div class="items-left mt-3 flex flex-col gap-2">
					<div class="mr-6 flex items-center">
						<input
							id="acaraKerajaan-ya"
							type="radio"
							value="ya"
							bind:group={fiturAcaraKerajaan}
							name="fitur-acarakerajaan"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="acaraKerajaan-ya" class="ml-2 text-sm font-medium text-gray-900">Ya</label>
					</div>
					<div class="flex items-center">
						<input
							id="acaraKerajaan-tidak"
							type="radio"
							value="tidak"
							bind:group={fiturAcaraKerajaan}
							name="fitur-acarakerajaan"
							class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
						/>
						<label for="acaraKerajaan-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>
			</div>

			<!-- 7 -->
			<div class="mb-6">
				<p class="text-md font-semibold">
					7. Apakah anda ingin memiliki fitur <span class="font-[750]"> Group Chat </span> di aplikasi
					mobile kerajaan anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini akan memungkinkan pengguna untuk berkomunikasi dalam suatu grup yang dapat dibuat masing-masing.
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
						<label for="groupChat-tidak" class="ml-2 text-sm font-medium text-gray-900">Tidak</label>
					</div>
				</div>
			</div>

			<!-- 8 -->
			<div class="mb-6">
				<p class="text-md font-semibold">
					8. Apakah anda ingin memiliki fitur <span class="font-[750]"> Forum </span> di aplikasi
					mobile kerajaan anda?
				</p>
				<p class="mb-2 text-sm text-gray-500">
					**Fitur ini akan memungkinkan pengguna untuk membaca dan berkomentar dalam suatu topik pembahasan.
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
			</div>
		{/if}

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
