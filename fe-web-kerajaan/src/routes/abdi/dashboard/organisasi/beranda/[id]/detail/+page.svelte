<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { navigating, page } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';

	let { data } = $props();
	let dataambil = $state(data.organisasi);
	let datafotoprofile = $state(data.fileDetails?.url);
	let datasemuafoto = $state(data.fotoOrganisasiDetails?.map((detail: any) => detail.url));
	let dataanggota = $state(data.dataanggota.length);

	console.log('data ambil : ', dataambil);
	console.log('data foto profil : ', datafotoprofile);
	console.log('data all foto : ', datasemuafoto);

	let idAktif = $state(page.params.id);
	console.log('ID Aktif : ', idAktif);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="h-full w-full">
	<div class="block h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="relative mx-auto flex w-full items-center justify-center">
			<img
				src={datafotoprofile || gambardefault}
				class="h-25 w-25 relative ml-5 mr-5 rounded-full"
				alt=""
			/>
		</div>
		<div class="mt-5 flex w-full justify-center lg:mt-0 lg:justify-end">
			<a href="/abdi/dashboard/organisasi/beranda/{idAktif}/detail/edit"
				><button class="w-50 h-fit items-end rounded-lg bg-yellow-300 px-2 py-2 text-black">
					Ubah
				</button></a
			>
		</div>
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div
					class="flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Nama Komunitas:</p>
					<input
						type="text"
						bind:value={dataambil.nama_organisasi}
						readonly
						placeholder="Masukkan Nama"
					/>
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
					<p>Email :</p>
					<input type="text" bind:value={dataambil.email} readonly placeholder="Masukkan Email" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Deskripsi Organisasi :</p>
					<textarea
						placeholder="Masukkan nama"
						bind:value={dataambil.deskripsi_organisasi}
						readonly
						class="rounded-mdpx-3 h-32 w-full resize-none py-3 text-lg"
					></textarea>
				</div>
			</div>

			<!-- 2 -->
			<div>
				<div
					class="flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Penanggung Jawab :</p>
					<input
						type="text"
						value={data?.penanggungJawab.nama_lengkap}
						readonly
						placeholder="Masukkan Penanggung Jawab"
					/>
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Pembina :</p>
					<input
						type="text"
						value={data?.pembina.nama_lengkap}
						readonly
						placeholder="Masukkan Pembina"
					/>
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Pelindung :</p>
					<input
						type="text"
						value={data?.pelindung?.nama_lengkap || '-'}
						readonly
						placeholder="Masukkan Pelindung"
					/>
				</div>

				<!-- No Telp + Anggota -->
				<div class=" flexcoba flex gap-2">
					<div
						class="mt-5 flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>No telepon :</p>
						<input
							type="text"
							bind:value={dataambil.no_telp}
							readonly
							placeholder="Masukkan nama"
							class="h-full"
						/>
					</div>
					<div
						class="mt-5 flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>Jumlah Anggota :</p>
						<input
							type="text"
							bind:value={dataanggota}
							readonly
							placeholder="Masukkan nama"
							class="h-full"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-5 h-1 w-full rounded-full bg-gray-300"></div>

		<div class="mt-5 flex w-full">
			<p class="ml-10 mt-2 w-full text-start font-bold lg:text-center">Dokumentasi</p>
		</div>

		<div class="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-4">
			{#if datasemuafoto && datasemuafoto.length > 0}
				{#each datasemuafoto as imageUrl}
					<div class="relative h-48 w-full">
						<img
							src={imageUrl}
							class="h-full w-full rounded-lg object-cover"
							alt="Gambar Komunitas"
						/>
					</div>
				{/each}
			{:else}
				<div class="relative h-48 w-full">
					<img
						src={gambartemp}
						class="h-full w-full rounded-lg object-cover"
						alt="Gambar Default"
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.gg--trash {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fff6f6'%3E%3Cpath fill-rule='evenodd' d='M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2zm-2-1H9v1h6zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z' clip-rule='evenodd'/%3E%3Cpath d='M9 9h2v8H9zm4 0h2v8h-2z'/%3E%3C/g%3E%3C/svg%3E");
	}

	.mdi--edit {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'/%3E%3C/svg%3E");
	}

	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}
</style>
