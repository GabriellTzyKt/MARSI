<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	let { data } = $props();
	let situs = data.data;
	console.log(situs);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="h-full w-full">
	<div class="block h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="group relative mx-auto h-[100px] w-[100px] items-center justify-center">
			<img src={data?.data.profileUrl || gambardefault} class="h-full w-full rounded-full" alt="" />

			<div
				class="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			>
				<p class="font-semibold text-white">Ganti Foto</p>
			</div>
		</div>
		<div class="mt-5 flex w-full justify-center lg:mt-0 lg:justify-end">
			<a href={`/abdi/sekretariat/situs/edit/${situs.id_situs}`}
				><button class="w-50 h-fit items-end rounded-lg bg-yellow-300 px-2 py-2 text-black">
					Edit Situs
				</button></a
			>
		</div>
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-4">
			<!-- 1 -->
			<div class="col-span-2">
				<div
					class="flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Nama Situs:</p>
					<input type="text" placeholder="Masukkan Nama" disabled value={situs.nama_situs || '-'} />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Alamat :</p>
					<input type="text" placeholder="Masukkan Alamat" disabled value={situs.alamat || '-'} />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Wisata :</p>
					<input type="text" placeholder="Masukkan Wisata" disabled value={situs.wisata || '-'} />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Email :</p>
					<input type="text" placeholder="Masukkan Email" disabled value={situs.email || '-'} />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Deskripsi Situs :</p>
					<textarea placeholder="Desc Situs" disabled value={situs.deskripsi_situs || '-'}
					></textarea>
				</div>
			</div>

			<!-- 2 -->
			<div class="col-span-2">
				<div class="flex w-full flex-col gap-3 lg:flex-row">
					<div
						class="flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>Dibangun Oleh:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							disabled
							value={situs.nama_pendiri || '-'}
						/>
					</div>
					<div
						class="flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>Tahun Berdiri:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							disabled
							value={situs.tahun_berdiri || '-'}
						/>
					</div>
				</div>

				<div class="mt-5 flex w-full flex-col gap-3 lg:flex-row">
					<div
						class="flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>Pembina :</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							disabled
							value={situs.pembina_nama || '-'}
						/>
					</div>
					<div
						class="flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>Pelindung :</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							disabled
							value={situs.pelindung_nama || '-'}
						/>
					</div>
				</div>

				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Juru Kunci :</p>
					<input
						type="text"
						placeholder="Masukkan Alamat"
						disabled
						value={situs.juru_kunci_nama || '-'}
					/>
				</div>

				<div class="mt-5 flex w-full flex-col gap-1 lg:flex-row">
					<div
						class="mt-3 flex h-fit w-[100%] flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm lg:mt-0 lg:w-[32.7%]"
					>
						<p>Jam Buka:</p>
						<input type="text" placeholder="Masukkan Nama" disabled value={situs.jam_buka || '-'} />
					</div>
					<div
						class="mt-3 flex h-fit w-[100%] flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm lg:mt-0 lg:w-[32.7%]"
					>
						<p>Jam Tutup:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							disabled
							value={situs.jam_tutup || '-'}
						/>
					</div>
				</div>

				<div class="mt-5 flex w-full flex-col gap-3 lg:flex-row">
					<div
						class="flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>No telepon :</p>
						<input type="text" placeholder="Masukkan Nama" disabled value={situs.no_telp || '-'} />
					</div>
					<div
						class="flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>Kepemilikan :</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							disabled
							value={situs.pemilik_situs || '-'}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.mdi--edit {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'/%3E%3C/svg%3E");
	}
</style>
