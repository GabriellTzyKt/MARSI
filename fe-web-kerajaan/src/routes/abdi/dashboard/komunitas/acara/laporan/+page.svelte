<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';

	let total = $state(8);
</script>

<div class="min-h-full w-full">
	<div class="block min-h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex w-full justify-between">
			<p class="mt-2">Informasi Acara</p>
			<a href="/abdi/dashboard/komunitas/acara/edit"
				><button class="w-40 rounded-lg border-2 bg-yellow-500 px-2 py-2">Ubah</button></a
			>
		</div>

		<div class="mt-5 grid grid-cols-2 gap-12 lg:grid-cols-4">
			<div class="col-span-2">
				<div class="mt-2 w-full">
					<p>Nama Acara:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Penanggung Jawab:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Tujuan Acara:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Deskripsi Acara:</p>
					<textarea
						placeholder="Masukkan Deskripsi Acara"
						class="h-32 w-full resize-none rounded-md border px-3 py-3 text-lg"
					></textarea>
				</div>
			</div>

			<div class="col-span-2 lg:col-span-1">
				<div class="mt-2 w-full">
					<p>Jenis Acara:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Tanggal Mulai:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Jam Mulai:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
			</div>

			<div class="col-span-2 lg:col-span-1">
				<div class="mt-2 w-full">
					<p>Kapasitas Acara:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Tanggal Selesai:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Jam Selesai:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
			</div>
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<!-- bawah -->

		<p class="mb-5 mt-5 text-start text-xl font-bold text-blue-600">Daftar Undangan</p>
		<div class="grid grid-cols-8 gap-2">
			{#each Array(total) as _, i}
				<div class="col-span-1 w-full">{i + 1}</div>
				<div class="col-span-1 w-full rounded-lg border px-1 py-1 lg:px-2">Tn</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">Tn</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">Tn</div>
			{/each}
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<div class="flex flex-col">
			<div>
				<p class="mt-5 text-start text-2xl font-bold text-blue-700">Laporan Acara</p>
			</div>
			<div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
				<div class="col-span-1 mt-5 h-full w-full rounded-lg border-2 border-gray-500">
					<p class="ml-5 mt-5 text-xl font-bold text-blue-700">Peserta</p>
					<p class="ml-5 mt-5">Jumlah Orang Hadir</p>
					<input
						type="text"
						placeholder="Masukkan Jumlah"
						class="ml-3 w-[90%] rounded-lg border-2 border-gray-400 px-2 py-2"
					/>
					<p class="ml-5 mt-5">Perkiraan Jumlah Orang Hadir</p>
					<input
						type="text"
						placeholder="Masukkan Jumlah"
						class="ml-3 w-[90%] rounded-lg border-2 border-gray-400 px-2 py-2"
					/>
					<p class="ml-5 mt-5">Bukti Foto</p>
					<div class="relative ml-3 w-[90%]">
						<input
							type="text"
							placeholder="Unggah Bukti Foto"
							class="w-full rounded-lg border-2 border-gray-400 px-2 py-2"
						/>
						<span class="pajamas--media absolute right-2 mt-2.5 opacity-55"> </span>
					</div>
				</div>

				<!-- 2 -->
				<div
					class="col-span-1 mt-5 h-full w-full rounded-lg border-2 border-gray-500 lg:col-span-2"
				>
					<div class="flex items-center justify-between">
						<p class="ml-5 text-xl font-bold text-blue-700">RAB</p>
						<button
							class="px-15 mb-6 ml-7 mr-10 mt-5 rounded-lg border bg-blue-500 py-2 text-white lg:ml-0"
						>
							Tambah
						</button>
					</div>
					<div class="h-13 mx-auto w-[95%] rounded-lg border-2 border-gray-400">
						<p class="px-3 py-2 text-xl">
							Total Biaya : <span class="text-green-600">1.000.000</span>
						</p>
					</div>
					<!-- Component Kotak Bawah -->
					<div class="mx-auto mt-4 h-fit w-[95%] rounded-lg border-2 border-gray-400 py-3">
						<div
							class="mx-auto mt-4 grid h-fit w-[95%] grid-cols-3 gap-2 rounded-lg border-2 border-gray-400 px-3 py-2"
						>
							<input
								class="col-span-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Keterangan"
							/>
							<input
								class="col-span-1 mb-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Jumlah Uang"
							/>
						</div>
						<div
							class="mx-auto mt-4 grid h-fit w-[95%] grid-cols-3 gap-2 rounded-lg border-2 border-gray-400 px-3 py-2"
						>
							<input
								class="col-span-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Keterangan"
							/>
							<input
								class="col-span-1 mb-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Jumlah Uang"
							/>
						</div>
						<div
							class="mx-auto mt-4 grid h-fit w-[95%] grid-cols-3 gap-2 rounded-lg border-2 border-gray-400 px-3 py-2"
						>
							<input
								class="col-span-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Keterangan"
							/>
							<input
								class="col-span-1 mb-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Jumlah Uang"
							/>
						</div>
						<div
							class="mx-auto mt-4 grid h-fit w-[95%] grid-cols-3 gap-2 rounded-lg border-2 border-gray-400 px-3 py-2"
						>
							<input
								class="col-span-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Keterangan"
							/>
							<input
								class="col-span-1 mb-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Jumlah Uang"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-12 h-1 w-full bg-slate-300"></div>

		<div class="mt-5 flex w-full justify-between">
			<p class="mt-2 w-full font-bold text-blue-600">Dokumentasi Acara</p>
			<button class="w-60 justify-end text-nowrap rounded-lg bg-blue-400 px-2 py-2 text-white">
				Tambah Gambar
			</button>
		</div>

		<div class="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
			<div class="relative">
				<img src={gambartemp} class="rounded-lg" alt="Gambar" />
				<span
					class="absolute bottom-0.5 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-400 p-2"
				>
					<i class="gg--trash absolute bottom-0.5 right-0.5 z-10 items-center text-2xl text-white"
					></i>
				</span>
			</div>
			<div class="relative">
				<img src={gambartemp} class="rounded-lg" alt="Gambar" />
				<span
					class="absolute bottom-0.5 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-400 p-2"
				>
					<i class="gg--trash absolute bottom-0.5 right-0.5 z-10 items-center text-2xl text-white"
					></i>
				</span>
			</div>
			<div class="relative">
				<img src={gambartemp} class="rounded-lg" alt="Gambar" />
				<span
					class="absolute bottom-0.5 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-400 p-2"
				>
					<i class="gg--trash absolute bottom-0.5 right-0.5 z-10 items-center text-2xl text-white"
					></i>
				</span>
			</div>
			<div class="relative">
				<img src={gambartemp} class="rounded-lg" alt="Gambar" />
				<span
					class="absolute bottom-0.5 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-400 p-2"
				>
					<i class="gg--trash absolute bottom-0.5 right-0.5 z-10 items-center text-2xl text-white"
					></i>
				</span>
			</div>
		</div>
	</div>
</div>

<style>
	.pajamas--media {
		display: inline-block;
		width: 22px;
		height: 22px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23101010' fill-rule='evenodd' d='M13 2.5H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm9 9.857L9.5 8l-2.476 2.83L5.5 9L4 10.8V12h8zM6.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

	.gg--trash {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fff6f6'%3E%3Cpath fill-rule='evenodd' d='M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2zm-2-1H9v1h6zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z' clip-rule='evenodd'/%3E%3Cpath d='M9 9h2v8H9zm4 0h2v8h-2z'/%3E%3C/g%3E%3C/svg%3E");
	}
</style>
