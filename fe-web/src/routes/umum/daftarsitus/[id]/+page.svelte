<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../../nav/Navbar.svelte';
	import bangunan from '../../../../asset/umum/2.png';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';

	const { data } = $props();
	console.log('Data yang diterima:', data);
	const situs = data.detil;
	let gambar = situs.imageUrls[0];
	let nama = situs.nama_situs;
	let gambar1 = situs.gambar1;
	let gambar2 = situs.gambar2;
	let gambar3 = situs.gambar3;
	let gambar4 = situs.gambar4;
	let nomorcagarbudaya = situs.nomor_cagarbudaya;
	let namawisata = situs.nama_wisata;
	let kepemilikan = situs.kepemilikan || "Kasunanan";
	let pendiri = situs.nama_pendiri;
	let tahun_berdiri = situs.tahun_berdiri;
	let jenis_situs = situs.jenis_situs;
	let isi = situs.deskripsi_situs;
	let lokasi = situs.alamat;

	let currentImageIndex = $state(0);

	function nextImages() {
		if (currentImageIndex < situs.imageUrls.length - 3) {
			currentImageIndex++;
		}
	}

	function prevImages() {
		if (currentImageIndex > 0) {
			currentImageIndex--;
		}
	}
</script>

<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<section class="relative w-full">
	<div class="relative h-screen w-full overflow-hidden">
		<img src={gambar} alt="" class="min-h-screen min-w-full object-cover" />
		<div class="absolute inset-0 flex items-center justify-center">
			<p class="absolute left-10 top-[15%] text-black">
				<a href="/umum/daftarsitus">
					<span class="ph--arrow-bend-up-left-bold mt-3"></span>
					Kembali Ke Daftar Situs
				</a>
			</p>
			<p
				class="mb-10 text-center text-6xl font-bold text-black"
				style="text-shadow: 2px 2px 4px #fff;"
			>
				{nama}
			</p>
		</div>
	</div>
</section>

<section class="bg-customBg2 relative h-fit w-full pt-10">
	<div class="edit">
		<div class="form-container absolute mx-auto px-4 lg:mb-20">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div>
					<img src={gambar} class="mt-10 h-[400px] w-full rounded-lg object-cover" alt="" />
					<div class="mt-4 flex justify-center gap-1 lg:gap-4">
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							class="material-symbols--arrow-circle-left-rounded cursor-pointer self-center"
							onclick={prevImages}
							class:opacity-50={currentImageIndex === 0}
						></span>

						<div class="flex gap-1 overflow-hidden lg:gap-4">
							{#each situs.imageUrls.slice(currentImageIndex, currentImageIndex + 3) as imageUrl}
								<img src={imageUrl} class="h-16 w-[200px] rounded-lg object-cover lg:h-24" alt="" />
							{/each}
						</div>

						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							class="material-symbols--arrow-circle-right cursor-pointer self-center"
							onclick={nextImages}
							class:opacity-50={currentImageIndex >= situs.imageUrls.length - 3}
						></span>
					</div>
				</div>
				<div>
					<p class="mt-10 text-start text-xl font-semibold">{nama}</p>

					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="bxs--castle"></span>
						</div>
						<p class="ml-2 items-center text-start">Keterikatan : {kepemilikan}</p>
					</div>

					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="material-symbols--person"></span>
						</div>
						<p class="ml-2 items-center text-start">Dibangun Oleh : {pendiri}</p>
					</div>

					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="ph--scroll"></span>
						</div>
						<p class="ml-2 items-center text-start">Tahun berdiri : {tahun_berdiri}</p>
					</div>

					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="mingcute--wave-fill"></span>
						</div>
						<p class="ml-2 items-center text-start">Jenis Situs : {jenis_situs}</p>
					</div>

					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="mdi--run"></span>
						</div>
						<p class="ml-2 items-center text-start">Aktivitas : {namawisata}</p>
					</div>

					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="bx--map text-xl"></span>
						</div>
						<p class="ml-2 items-center text-start">Lokasi : {lokasi}</p>
					</div>

					<!-- <div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<img src={bangunan} alt="" />
						</div>
						<p class="ml-2 items-center text-start">Nomor Cagar Budaya : {nomorcagarbudaya}</p>
					</div> -->

					<p class="mb-5 mt-3 text-start text-sm">{isi}</p>
				</div>
			</div>
		</div>
	</div>
</section>

{#if navigating.to}
	<Loader></Loader>
{/if}

<section class="h-full w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	.mdi--run {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23161616' d='M13.5 5.5c1.09 0 2-.92 2-2a2 2 0 0 0-2-2c-1.11 0-2 .88-2 2c0 1.08.89 2 2 2M9.89 19.38l1-4.38L13 17v6h2v-7.5l-2.11-2l.61-3A7.3 7.3 0 0 0 19 13v-2c-1.91 0-3.5-1-4.31-2.42l-1-1.58c-.4-.62-1-1-1.69-1c-.31 0-.5.08-.81.08L6 8.28V13h2V9.58l1.79-.7L8.19 17l-4.9-1l-.4 2z'/%3E%3C/svg%3E");
	}
	@media (max-width: 768px) {
		.edit {
			margin-top: 50%;
			margin-bottom: 10px;
		}
	}

	.bx--map {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4m0-6c1.103 0 2 .897 2 2s-.897 2-2 2s-2-.897-2-2s.897-2 2-2'/%3E%3Cpath fill='%23000' d='M11.42 21.814a1 1 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819M12 4c3.309 0 6 2.691 6 6.005c.021 4.438-4.388 8.423-6 9.73c-1.611-1.308-6.021-5.294-6-9.735c0-3.309 2.691-6 6-6'/%3E%3C/svg%3E");
	}

	.mingcute--wave-fill {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M18.147 6.733a10.6 10.6 0 0 0-5.244.528l-.346.132a13.6 13.6 0 0 1-7.16.84c-1.038-.16-2.12-.418-3.068-.891a1.5 1.5 0 0 1 1.202-2.745l.132.058c.682.32 1.45.499 2.19.613c1.344.206 3.183.22 5.244-.529l.346-.132a13.6 13.6 0 0 1 7.16-.84c1.038.16 2.119.419 3.066.89a1.514 1.514 0 0 1 .672 2.014c-.369.738-1.122.907-2.005.674l-2.19-.612Zm0 6a10.6 10.6 0 0 0-5.244.528l-.346.132a13.6 13.6 0 0 1-7.16.84c-1.038-.16-2.12-.418-3.068-.891a1.5 1.5 0 0 1 1.202-2.745l.132.058c.682.32 1.45.499 2.19.613c1.344.206 3.183.22 5.244-.529l.346-.132a13.6 13.6 0 0 1 7.16-.84c1.038.16 2.119.419 3.066.89a1.514 1.514 0 0 1 .672 2.014c-.369.739-1.122.907-2.005.674l-2.19-.612Zm-5.954 6.8l.364-.14a10.6 10.6 0 0 1 5.59-.66l2.19.612c.882.233 1.635.065 2.005-.674a1.514 1.514 0 0 0-.673-2.013c-.947-.472-2.028-.73-3.066-.89a13.6 13.6 0 0 0-6.797.7l-.363.14c-2.202.88-4.172.878-5.59.66c-.634-.098-1.29-.243-1.893-.484l-.297-.13a1.5 1.5 0 0 0-1.334 2.688c.947.473 2.03.731 3.068.89c1.752.27 4.143.28 6.796-.7Z'/%3E%3C/g%3E%3C/svg%3E");
	}

	.material-symbols--person {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z'/%3E%3C/svg%3E");
	}

	.bxs--castle {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20 11h-2V6h1V2h-2v2h-1V2h-2v2h-1V2h-2v2h-1V2H8v2H7V2H5v4h1v5H4V9H2v12h7v-5a3 3 0 0 1 6 0v5h7V9h-2zm-10-1H8V7h2zm6 0h-2V7h2z'/%3E%3C/svg%3E");
	}

	.ph--scroll {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='M96 104a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16h-64a8 8 0 0 1-8-8m8 40h64a8 8 0 0 0 0-16h-64a8 8 0 0 0 0 16m128 48a32 32 0 0 1-32 32H88a32 32 0 0 1-32-32V64a16 16 0 0 0-32 0c0 5.74 4.83 9.62 4.88 9.66A8 8 0 0 1 24 88a7.9 7.9 0 0 1-4.79-1.61C18.05 85.54 8 77.61 8 64a32 32 0 0 1 32-32h136a32 32 0 0 1 32 32v104h8a8 8 0 0 1 4.8 1.6c1.2.86 11.2 8.79 11.2 22.4M96.26 173.48A8.07 8.07 0 0 1 104 168h88V64a16 16 0 0 0-16-16H67.69A31.7 31.7 0 0 1 72 64v128a16 16 0 0 0 32 0c0-5.74-4.83-9.62-4.88-9.66a7.82 7.82 0 0 1-2.86-8.86M216 192a12.58 12.58 0 0 0-3.23-8h-94a27 27 0 0 1 1.21 8a31.8 31.8 0 0 1-4.29 16H200a16 16 0 0 0 16-16'/%3E%3C/svg%3E");
	}
	.material-symbols--arrow-circle-left-rounded {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M11.8 13H15q.425 0 .713-.288T16 12t-.288-.712T15 11h-3.2l.9-.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275l-2.6 2.6q-.3.3-.3.7t.3.7l2.6 2.6q.275.275.7.275t.7-.275t.275-.7t-.275-.7zm.2 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22'/%3E%3C/svg%3E");
	}

	.material-symbols--arrow-circle-right {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m12 16l4-4l-4-4l-1.4 1.4l1.6 1.6H8v2h4.2l-1.6 1.6zm0 6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22'/%3E%3C/svg%3E");
	}
	.ph--arrow-bend-up-left-bold {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='M236 200a12 12 0 0 1-24 0a84.09 84.09 0 0 0-84-84H61l27.52 27.51a12 12 0 0 1-17 17l-48-48a12 12 0 0 1 0-17l48-48a12 12 0 0 1 17 17L61 92h67a108.12 108.12 0 0 1 108 108'/%3E%3C/svg%3E");
	}

	/* Mengatur Section agar form container berada di tengah */
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.form-container {
		background: white;
		position: static;
		padding: 20px;
		border-radius: 10px;
		width: 90%; /* Menyesuaikan lebar form */
		height: 90%;
		text-align: center;
		margin-top: -250px; /* Memberikan ruang antara gambar dan form */
	}
</style>
