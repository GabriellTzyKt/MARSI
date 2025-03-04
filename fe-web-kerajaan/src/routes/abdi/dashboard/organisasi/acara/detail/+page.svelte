<script lang="ts">
	let total = $state(8);
</script>

<div class="min-h-full w-full">
	<div class="block min-h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex w-full justify-between">
			<p class="mt-2">Informasi Acara</p>
			<a href="/abdi/dashboard/organisasi/acara/ubah"
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
				<div class="col-span-1 w-full rounded-lg border px-2 py-1">Tn</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">Tn</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">Tn</div>
			{/each}
		</div>
	</div>
</div>

<style>
</style>
