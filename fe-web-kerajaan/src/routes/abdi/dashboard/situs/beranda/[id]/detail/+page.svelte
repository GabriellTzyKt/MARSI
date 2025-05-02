<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { page } from '$app/stores';

	let { data } = $props();
	let dataambil = $state(data.situs) 
	console.log("data ambil : ", dataambil)
	let datasemuafoto = $state(data.fotoSitusDetails)
	let datafotoprofil = $state(data.fileDetails)
	
	let situsId = $state($page.params.id);
	
	$effect(() => {
		situsId = $page.params.id;
	});
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="h-full w-full">
	<div class="block h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="relative mx-auto flex w-full items-center justify-center">
			<img src={datafotoprofil?.url || gambardefault} class="h-25 w-25 relative ml-5 mr-5 rounded-full" alt="" />
		</div>
		<div class="mt-5 flex w-full justify-center lg:mt-0 lg:justify-end">
			<a href="/abdi/dashboard/situs/beranda/{situsId}/detail/ubah"
				><button class="w-50 h-fit items-end rounded-lg bg-yellow-300 px-2 py-2 text-black">
					Ubah
				</button></a
			>
		</div>
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
			<!-- 1 -->
			<div class="grid-cols-5">
				<div
					class="flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Nama Situs:</p>
					<input type="text" bind:value={dataambil.nama_situs} readonly placeholder="Masukkan Nama" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Alamat :</p>
					<input type="text" bind:value={dataambil.alamat} readonly placeholder="Masukkan Alamat" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Wisata :</p>
					<input type="text" bind:value={dataambil.wisata} readonly placeholder="Masih Kosong" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Email :</p>
					<input type="text" bind:value={dataambil.email} readonly  placeholder="Masukkan Email" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Deskripsi Situs :</p>
					<textarea bind:value={dataambil.deskripsi_situs} readonly placeholder="Masukkan Email"></textarea>
				</div>
			</div>

			<!-- 2 -->
			<div class="grid-cols-5">
				<div
					class="flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Dibangun Oleh:</p>
					<input type="text" bind:value={dataambil.nama_pendiri} readonly placeholder="Masukkan Nama" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Pembina :</p>
					<input type="text" bind:value={dataambil.pembina} readonly placeholder="Masukkan Alamat" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Juru Kunci :</p>
					<input type="text" bind:value={dataambil.juru_kunci} readonly placeholder="Masukkan Email" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Jam Buka :</p>
					<input type="text" bind:value={dataambil.jam_buka} readonly placeholder="Masukkan Email" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>No Telpon :</p>
					<input type="text" bind:value={dataambil.no_telp} readonly placeholder="Masukkan Email" />
				</div>
			</div>

			<!-- 3 -->
			<div class="grid-cols-5">
				<div
					class="flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Tahun Berdiri:</p>
					<input type="text" bind:value={dataambil.tahun_berdiri} readonly placeholder="Masukkan Nama" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Pelindung :</p>
					<input type="text" bind:value={dataambil.pelindung} readonly placeholder="Masukkan Alamat" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Jenis Situs :</p>
					<input type="text" bind:value={dataambil.id_jenis_situs} readonly placeholder="Masukkan Email" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Jam Tutup :</p>
					<input type="text" bind:value={dataambil.jam_tutup} readonly placeholder="Masukkan Email" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Kepemilikan :</p>
					<input type="text" bind:value={dataambil.kepemilikan} readonly placeholder="Masih Kosong" />
				</div>
			</div>
		</div>

		<div class="mt-5 h-1 w-full rounded-full bg-gray-300"></div>

		<div class="mt-5 flex w-full">
			<p class="ml-10 mt-2 w-full text-start font-bold lg:text-center">Dokumentasi</p>
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
	.mdi--edit {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'/%3E%3C/svg%3E");
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
