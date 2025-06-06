<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import { env } from '$env/dynamic/public';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	let { data } = $props();
	let total = $state(8);
	console.log(" data : ", data);
	let loading = $state(false);
	let success = $state(false);

</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="min-h-full w-full">
	<div class="block min-h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex w-full justify-between">
			<p class="mt-2">Informasi Acara</p>
			<a href="/abdi/dashboard/komunitas/beranda/{data.id}/detail/acara/edit/{data.id_acara}"
				><button class="w-40 rounded-lg border-2 bg-yellow-500 px-2 py-2">Ubah</button></a
			>
		</div>

		<div class="mt-5 grid grid-cols-1 gap-12 lg:grid-cols-2">
			<div class="col-span-1">
				<div class="mt-2 w-full">
					<p>Nama Acara:</p>
					<input
						type="text"
						value={data.data?.nama_acara}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Penanggung Jawab:</p>
					<input
						type="text"
						value={data.data?.nama_penanggungjawab}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						value={data.data?.alamat_acara}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Tujuan Acara:</p>
					<input
						type="text"
						value={data.data?.tujuan_acara}
						placeholder="Masukkan Nama"
						disabled
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Deskripsi Acara:</p>
					<textarea
						placeholder="Masukkan Deskripsi Acara"
						disabled
						value={data.data?.deskripsi_acara}
						class="h-32 w-full resize-none rounded-md border px-3 py-3 text-lg"
					></textarea>
				</div>
			</div>

			<div class="col-span-1">
				<div class="flexcoba flex gap-2">
					<div class="mt-2 w-full">
						<p>Jenis Acara:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							value={data.data?.jenis_acara}
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Kapasitas Acara:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							value={data.data?.kapasitas_acara}
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
				</div>

				<div class="mt-2 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						value={data.data?.alamat_acara}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>

				<div class="flexcoba flex gap-2">
					<div class="mt-2 w-full">
						<p>Tanggal Mulai:</p>
						<input
							type="text"
							value={data.data?.tanggal_mulai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Tanggal Selesai:</p>
						<input
							type="text"
							value={data.data?.tanggal_selesai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
				</div>

				<div class="flexcoba flex gap-2">
					<div class="mt-2 w-full">
						<p>Jam Mulai:</p>
						<input
							type="text"
							value={data.data?.waktu_mulai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Jam Selesai:</p>
						<input
							type="text"
							value={data.data?.waktu_selesai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
				</div>
				<!-- {#if data?.data?.status.toLowerCase() === 'diajukan'}
					<div class="  w-full gap-2">
						<div class="mt-2 grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
							<div class="flex items-center justify-center">
								<button
									class="w-full cursor-pointer rounded-lg bg-green-500 py-2 text-lg font-[600] text-white"
									onclick={() => persetujuan(true)}>Terima</button
								>
							</div>
							<div class="flex items-center justify-center">
								<button
									class="w-full cursor-pointer rounded-lg bg-red-500 py-2 text-lg font-[600] text-white"
									onclick={() => persetujuan(false)}>Tolak</button
								>
							</div>
						</div>
					</div>
				{/if} -->
			</div>
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<!-- bawah -->

		<p class="mb-5 mt-5 text-start text-xl font-bold text-blue-600">Daftar Undangan</p>
		<div class="mt-10 grid grid-cols-9 gap-2">
			{#each data?.undangan as undangan, i}
				<div class="col-span-1 w-full">{i + 1}</div>
				<div class="col-span-2 w-full rounded-lg border px-2 py-1">
					<p class="w-full py-2 text-center">{undangan.jenis_kelamin || 'No Data'}</p>
				</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">
					<p class="w-full py-2 text-center">{undangan.nama_penerima}</p>
				</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">
					<p class="w-full py-2 text-center">{undangan.nomer_telepon || 'No Phone'}</p>
				</div>
			{/each}
			{#if data?.undangan?.length === 0}
				<div class="col-span-full items-center justify-center py-2">
					<p>No Panitia Yet</p>
				</div>
			{/if}
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<!-- bawah -->

		<p class="mb-5 mt-5 text-start text-xl font-bold text-blue-600">Panitia Acara</p>
		<div class="grid grid-cols-8 gap-2">
			{#each data?.panit as panit, i}
				<div class="col-span-1 w-full">{i + 1}</div>
				<div class="col-span-4 w-full rounded-lg border px-2 py-1">{panit.nama_panit}</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">{panit.jabatan}</div>
			{/each}
		</div>
	</div>
</div>
{#if loading}
	<Loader></Loader>
{/if}
{#if success}
	<SuccessModal text="Berhasil!"></SuccessModal>
{/if}

<style>
	.material-symbols--cancel {
		display: inline-block;
		width: 28px;
		height: 28px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23f6f6f6' d='m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22'/%3E%3C/svg%3E");
	}

	.gg--trash {
		display: inline-block;
		width: 16px;
		height: 16px;
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
