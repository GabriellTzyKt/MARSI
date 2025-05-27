<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../../nav/Navbar.svelte';
	import keris from '../../../../asset/umum/keris.png';

	const { data } = $props();
	console.log('Data yang diterima:', data);
	const anggota = data.detil_aset;
	let gambar = anggota.imageUrls[0];
	let nama = anggota.nama_aset;
	let lagu = anggota.audioUrls;
	let aset = anggota.kategori_aset;
	let vidio = anggota.videoUrls;
	let isi = anggota.isi;
	let kepemilikan = anggota.kepemilikan;
	let gambar1 = anggota.gambar1;
	let gambar2 = anggota.gambar2;
	let gambar3 = anggota.gambar3;
	let gambar4 = anggota.gambar4;
	let durasiLagu = $state(0);
	let waktuSekarang = $state(0);
	let showModalVideo = $state(false);

	let currentImageIndex = $state(0);

	function nextImages() {
		if (currentImageIndex < anggota.imageUrls.length - 4) {
			currentImageIndex++;
		}
	}

	function prevImages() {
		if (currentImageIndex > 0) {
			currentImageIndex--;
		}
	}

	function OpenModalVideo() {
		showModalVideo = true;
	}

	function closeModalVideo() {
		showModalVideo = false;
	}

	let playingState = 'paused';
	let song = new Audio(lagu[0]);

	// svelte-ignore non_reactive_update
	let videoRef: HTMLVideoElement | null = null;

	function formatTime(time: number) {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60)
			.toString()
			.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}

	function togglePlaying() {
		playingState === 'paused' ? play() : pause();
	}

	function loadSong() {
		song.volume = 0.2;
		song.play();
	}

	function play() {
		if (playingState === 'playing') {
			pause();
		}

		playingState = 'playing';
		loadSong();
	}

	function pause() {
		playingState = 'paused';
		song.pause();
	}

	function updateIndikator() {
		waktuSekarang = song.currentTime;
	}

	function ambilDurasi() {
		durasiLagu = song.duration;
	}

	song.onloadedmetadata = ambilDurasi;
	song.ontimeupdate = updateIndikator;
</script>

<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<section class="relative w-full">
	<div class="relative h-screen w-full overflow-hidden">
		<img src={gambar} alt="" class="object-coverr absolute inset-0 h-full w-full" />
		<div class="absolute inset-0 flex items-center justify-center">
			<p class="absolute left-10 top-[15%]">
				<a href="/umum/daftaraset">
					<span class="ph--arrow-bend-up-left-bold mt-3"></span>
					Kembali Ke Daftar Aset
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
					{#if lagu.length !== 0}
						<img src={gambar} class="h-auto w-full rounded-lg object-cover" alt="" />

						<div class="mt-4 flex justify-center gap-1 lg:gap-4">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<span
								class="material-symbols--arrow-circle-left-rounded cursor-pointer self-center"
								onclick={prevImages}
								class:opacity-50={currentImageIndex === 0}
							></span>

							<div class="flex gap-1 overflow-hidden lg:gap-4">
								{#each anggota.imageUrls.slice(currentImageIndex, currentImageIndex + 3) as imageUrl}
									<img
										src={imageUrl}
										class="h-16 w-[200px] rounded-lg object-cover lg:h-24"
										alt=""
									/>
								{/each}
							</div>

							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<span
								class="material-symbols--arrow-circle-right cursor-pointer self-center"
								onclick={nextImages}
								class:opacity-50={currentImageIndex >= anggota.imageUrls.length - 3}
							></span>
						</div>
					{/if}

					{#if vidio.length !== 0}
						<div class="relative">
							<!-- Video -->
							<!-- svelte-ignore a11y_media_has_caption -->
							<video bind:this={videoRef} src={vidio} class="h-auto w-full rounded-lg object-cover"
							></video>
						</div>
						<div class="mt-4 flex justify-center gap-1 lg:gap-4">
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<span
								class="material-symbols--arrow-circle-left-rounded cursor-pointer self-center"
								onclick={prevImages}
								class:opacity-50={currentImageIndex === 0}
							></span>

							<div class="flex gap-1 overflow-hidden lg:gap-4">
								{#each anggota.imageUrls.slice(currentImageIndex, currentImageIndex + 3) as imageUrl}
									<img
										src={imageUrl}
										class="h-16 w-[200px] rounded-lg object-cover lg:h-24"
										alt=""
									/>
								{/each}
							</div>

							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<span
								class="material-symbols--arrow-circle-right cursor-pointer self-center"
								onclick={nextImages}
								class:opacity-50={currentImageIndex >= anggota.imageUrls.length - 3}
							></span>
						</div>
					{/if}

					{#if vidio.length === 0 && lagu.length === 0}
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
								{#each anggota.imageUrls.slice(currentImageIndex, currentImageIndex + 3) as imageUrl}
									<img
										src={imageUrl}
										class="h-16 w-[200px] rounded-lg object-cover lg:h-24"
										alt=""
									/>
								{/each}
							</div>

							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<span
								class="material-symbols--arrow-circle-right cursor-pointer self-center"
								onclick={nextImages}
								class:opacity-50={currentImageIndex >= anggota.imageUrls.length - 3}
							></span>
						</div>
					{/if}
				</div>
				<div>
					<p class="relative flex items-center space-x-2 text-xl font-semibold">
						{nama}

						{#if vidio.length !== 0}
							<button onclick={OpenModalVideo} class="group ml-5 flex items-center justify-center">
								<span
									class="bg-customKrem relative flex h-10 w-10 items-center justify-center rounded-full border-2 p-2 transition-all duration-500 ease-in-out group-hover:w-[150px]"
								>
									<!-- svelte-ignore node_invalid_placement_ssr -->
									<p
										class="text-xs opacity-0 transition-opacity delay-200 duration-300 ease-in-out group-hover:opacity-100"
									>
										Putar Video
									</p>

									<i class="iconoir--play absolute left-2 text-2xl text-white"></i>
								</span>
							</button>
						{/if}

						{#if lagu.length !== 0}
							<button onclick={togglePlaying} class="group ml-5 flex items-center justify-center">
								<span
									class="bg-customKrem relative flex h-10 w-10 items-center justify-center rounded-full border-2 p-2 transition-all duration-500 ease-in-out group-hover:w-[200px]"
								>
									<span class="absolute left-7 hidden text-xs text-white group-hover:block">
										{Math.floor(waktuSekarang)}s
									</span>

									<!-- svelte-ignore node_invalid_placement_ssr -->
									<div
										class="absolute left-[45px] right-[45px] hidden h-1 rounded-full bg-slate-500 group-hover:block"
									>
										<div
											class="z-10 h-1 rounded-full bg-green-400 transition-all duration-200"
											style="width: {durasiLagu > 0
												? (waktuSekarang / durasiLagu) * 100 + '%'
												: '0%'}"
										></div>
									</div>

									<span class="absolute right-4 hidden text-xs text-white group-hover:block">
										{Math.floor(durasiLagu)}s
									</span>

									<i class="iconoir--play absolute left-2 text-2xl text-white"></i>
								</span>
							</button>
						{/if}
					</p>

					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<img src={keris} alt="" />
						</div>
						<p class="ml-2 items-center text-start">Jenis Aset : {aset}</p>
					</div>

					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="bxs--castle"></span>
						</div>
						<p class="ml-2 items-center text-start">Kepemilikan : {kepemilikan}</p>
					</div>

					<p class="mt-3 text-start text-sm">{isi}</p>
				</div>
			</div>
		</div>
	</div>
</section>

{#if showModalVideo}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="relative max-h-[80vh] w-[80vw] overflow-hidden rounded-lg p-5">
			<!-- svelte-ignore a11y_media_has_caption -->
			<video
				bind:this={videoRef}
				src={vidio}
				class="relative max-h-[80vh] w-[80vw] rounded-lg object-cover"
				controls
			>
			</video>

			<!-- Close Button -->
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button onclick={closeModalVideo} class="absolute right-4 top-4 z-10 rounded-full p-2 shadow">
				<span class="carbon--close-outline"></span>
			</button>
		</div>
	</div>
{/if}

<section class="h-full w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	.carbon--close-outline {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23bba5a5' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12'/%3E%3Cpath fill='%23bba5a5' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");
	}
	@media (max-width: 768px) {
		.edit {
			margin-top: 50%;
			margin-bottom: 10px;
		}
	}

	.iconoir--play {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23f6f6f6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6.906 4.537A.6.6 0 0 0 6 5.053v13.894a.6.6 0 0 0 .906.516l11.723-6.947a.6.6 0 0 0 0-1.032z'/%3E%3C/svg%3E");
	}

	.bxs--castle {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20 11h-2V6h1V2h-2v2h-1V2h-2v2h-1V2h-2v2h-1V2H8v2H7V2H5v4h1v5H4V9H2v12h7v-5a3 3 0 0 1 6 0v5h7V9h-2zm-10-1H8V7h2zm6 0h-2V7h2z'/%3E%3C/svg%3E");
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
