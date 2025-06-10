<script lang="ts">
	import { navigating, page } from '$app/state';
	import Footer from '$lib/footer/Footer.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import Marquee from 'svelte-fast-marquee';

	const { data } = $props();
	console.log('Data yang diterima:', data);

	let idAktif = $state(' ');

	$effect(() => {
		idAktif = page.params.id;
		console.log('ID : ', idAktif);
	});

	// Check if data exists and has the expected structure
	const komunitas = data?.komunitas || {}; // Access komunitas data
	console.log(komunitas);
	const nama_komunitas = komunitas?.nama_komunitas || 'Nama Komunitas Tidak Tersedia';
	const tanggal_berdiri = komunitas?.tanggal_berdiri
		? new Date(komunitas.tanggal_berdiri).toLocaleDateString('id-ID')
		: '-';
	const alamat = komunitas?.alamat || 'Alamat tidak tersedia';
	const deskripsi = komunitas?.deskripsi_komunitas || 'Tidak ada deskripsi';
	const id = komunitas?.id_komunitas || '';

	// Get penanggung jawab name
	const penanggung_jawab =
		data?.penanggungJawab?.nama_lengkap || komunitas?.penanggung_jawab || '-';

	// Handle image URLs safely
	const imageUrls = data?.imageUrls || [];
	const gambar1 = imageUrls[0] || 'https://picsum.photos/200/300'; // Use placeholder if no image
	const gambar2 = imageUrls[1] || gambar1; // Fallback to first image or placeholder
	const gambar3 = imageUrls[2] || gambar1;
	const gambar4 = imageUrls[3] || gambar1;
</script>

<div class="relative">
	<Navbar></Navbar>
</div>
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<section class="bg-gray-100 pb-10 pt-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="form-container">
			<div
				class="flex items-center justify-center self-center pt-10 text-center text-3xl font-bold"
			>
				<p>{nama_komunitas}</p>
			</div>
			<div class="grid grid-cols-1 gap-8 px-10 py-10 md:grid-cols-2">
				<div>
					<img
						src={data.profileUrl}
						class="mt-12 h-auto w-[500px] self-center rounded-lg object-cover"
						alt="foto 1"
					/>
					<div class="mt-5">
						<Marquee>
							<div class="flex items-center">
								{#if imageUrls.length > 0}
									{#each imageUrls as imageUrl}
										<img src={imageUrl} class="col-span-1 m-1 h-auto w-[200px]" alt="foto" />
									{/each}
								{/if}
							</div>
						</Marquee>
					</div>
				</div>
				<div>
					<div class="mt-5 flex items-center">
						<span class="material-symbols--person flex-shrink-0"></span>
						<div class="text-md flex-col text-start">
							<p class="ml-4">Penanggung Jawab Komunitas : {penanggung_jawab}</p>
						</div>
					</div>

					<div class="mt-5 flex items-center">
						<span class="mdi--clock flex-shrink-0"></span>
						<p class="text-md ml-4">Tanggal Berdiri : {tanggal_berdiri}</p>
					</div>

					<div class="mt-5 flex items-center">
						<span class="solar--calendar-linear flex-shrink-0"></span>
						<p class="text-md ml-4 text-start">
							Lokasi: {data?.lokasi?.nama_situs || 'Lokasi tidak tersedia'}
						</p>
					</div>

					<div class="mt-5 flex items-center">
						<span
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-400 p-2"
						>
							<i class="mdi--location text-lg text-white"></i>
						</span>
						<p class="text-md ml-5 text-start">Alamat: {alamat}</p>
					</div>

					<div class="mt-5 flex items-center">
						<p class="text-md text-start">{deskripsi}</p>
					</div>

					<!-- <div class="mt-8 flex items-center">
						<button
							class=" h-fit w-full rounded-full border-2 border-red-400 bg-red-400 px-2 py-3 text-center text-white"
						>
							<a href="/kelompok/komunitas/{idAktif}/anggota">Lihat Anggota</a></button
						>
					</div> -->
				</div>
			</div>
		</div>
	</div>
</section>

<section class="flex h-fit min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	.solar--calendar-linear {
		display: inline-block;
		width: 42px;
		height: 42px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath stroke='%23eb5151' stroke-width='1.5' d='M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z'/%3E%3Cpath stroke='%23eb5151' stroke-linecap='round' stroke-width='1.5' d='M7 4V2.5M17 4V2.5M2.5 9h19'/%3E%3Cpath fill='%23eb5151' d='M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0'/%3E%3C/g%3E%3C/svg%3E");
	}

	.material-symbols--person {
		display: inline-block;
		width: 42px;
		height: 42px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23eb5151' d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4'/%3E%3C/svg%3E");
	}

	.mdi--clock {
		display: inline-block;
		width: 42px;
		height: 42px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23eb5151' d='M12 20c4.4 0 8-3.6 8-8s-3.6-8-8-8s-8 3.6-8 8s3.6 8 8 8m0-18c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m5 9.5V13h-6V7h1.5v4.5z'/%3E%3C/svg%3E");
	}

	.mdi--location {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7'/%3E%3C/svg%3E");
	}

	.form-container {
		background: white;
		border-radius: 10px;
		width: 100%;
		height: 100%;
		text-align: center;
		margin-right: auto;
	}
</style>
