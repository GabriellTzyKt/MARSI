<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { navigating, page } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';

	let { data } = $props();
	console.log('detail : ', data.komunitas);
	let dataambil = $state(data.komunitas);
	let dataanggota = $state(data.dataanggota.length);
	let datagambar = $state(data.fileDetails?.url);
	let datafotokomunitas = $state(data.fotoKomunitasDetails?.map((detail: any) => detail.url));
	console.log(datafotokomunitas);

	let idAktif = $state(page.params.id);
	$effect(() => {
		idAktif = page.params.id;
	});
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="h-full w-full">
	<div class="block h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="relative mx-auto flex w-full items-center justify-center">
			{#if datagambar}
				<img src={datagambar} class="h-25 w-25 relative ml-5 mr-5 rounded-full" alt="" />
			{:else}
				<img src={gambardefault} class="h-25 w-25 relative ml-5 mr-5 rounded-full" alt="" />
			{/if}
		</div>
		<div class="mt-5 flex w-full justify-center lg:mt-0 lg:justify-end">
			<a href="/abdi/dashboard/komunitas/beranda/{idAktif}/detail/edit"
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
						readonly
						bind:value={dataambil.nama_komunitas}
						placeholder="Masukkan Nama"
					/>
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Alamat :</p>
					<input type="text" readonly bind:value={dataambil.alamat} placeholder="Masukkan Alamat" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Email :</p>
					<input type="text" readonly bind:value={dataambil.email} placeholder="Masukkan Email" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Deskripsi Komunitas :</p>
					<textarea
						readonly
						bind:value={dataambil.deskripsi_komunitas}
						placeholder="Masukkan nama"
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
						readonly
						value={data?.penanggungjawab}
						placeholder="Masukkan Penanggung Jawab"
					/>
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Pembina :</p>
					<input type="text" readonly value={data?.pembina} placeholder="Masukkan Pembina" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Pelindung :</p>
					<input type="text" readonly value={data?.pelindung} placeholder="Masukkan Pelindung" />
				</div>

				<!-- No Telp + Anggota -->
				<div class=" flexcoba flex gap-2">
					<div
						class="mt-5 flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>No telepon :</p>
						<input
							type="text"
							readonly
							bind:value={dataambil.no_telp}
							placeholder="--"
							class="h-full"
						/>
					</div>
					<div
						class="mt-5 flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>Jumlah Anggota :</p>
						<input
							type="text"
							readonly
							bind:value={dataanggota}
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
			{#if datafotokomunitas && datafotokomunitas.length > 0}
				{#each datafotokomunitas as imageUrl}
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
	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}
</style>
