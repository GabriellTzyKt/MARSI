<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../../nav/Navbar.svelte';
	import keris from '../../../../asset/umum/keris.png';
	import rumah from '../../../../asset/umum/rumah.png';
	import Flipcard2 from '../../Flipcard2.svelte';
	import gambartemp from '../../../../asset/gambarsementara.jpg';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';

	const currentDate = new Date();
	let showModal = $state(false);
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

	let isExpand: boolean[] = $state([]);

	function toggleExpand(index: number) {
		isExpand[index] = !isExpand[index];
		isExpand = [...isExpand];
	}

	function formatDate(date: Date): string {
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}/${month}/${year}`;
	}

	function OpenModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function OpenModalVideo() {
		showModalVideo = true;
	}

	function closeModalVideo() {
		showModalVideo = false;
	}

	let formattedDate = formatDate(currentDate);

	// svelte-ignore non_reactive_update
	let videoRef: HTMLVideoElement | null = null;

	const { data } = $props();
	console.log('Data yang diterima:', data);
	const anggota = data.detil_kerajaan;
	let gambar = anggota.imageUrls[0];
	let nama = anggota.nama_kerajaan;
	let tahun = anggota.tanggal_berdiri
		? new Date(anggota.tanggal_berdiri).getFullYear().toString()
		: ' ';
	let lambang_kerajaan = anggota.lambangUrl;
	let nama_kasunanan = anggota.nama_kasunanan;
	let isi = anggota.deskripsi_kerajaan;
	let lokasi = anggota.alamat_kerajaan;
	let alamat = anggota.alamat;
	let vidio = anggota.videoUrl || ' ';
	let bendera = anggota.benderaUrl;
	let gambar1 = anggota.gambar1;
	let gambar2 = anggota.gambar2;
	let gambar3 = anggota.gambar3;
	let gambar4 = anggota.gambar4;

	let hover1 = $state(false);
	let hover2 = $state(false);
	let hover3 = $state(false);
	let hover4 = $state(false);

	const selectedFlip = data.detil_flip;
	const showRaja = data.show_raja;
</script>

<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<section class="relative w-full">
	<div class="relative h-screen w-full overflow-hidden">
		<img src={gambar} alt="" class="absolute inset-0 h-full w-full object-cover" />
		<div class="absolute inset-0 flex items-center justify-center">
			<p class="absolute left-10 top-[15%] z-10 border-2 bg-red-400 border-red-400 px-2 rounded-lg">
				<a href="/umum/daftarkerajaan" class="flex items-center text-black">
					<span class="ph--arrow-bend-up-left-bold"></span>
					-Kembali Ke Daftar Kerajaan
				</a>
			</p>
			<p
				class="z-10 mb-10 text-center text-xl font-bold text-white"
				style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);"
			>
				{nama}
			</p>
		</div>
	</div>
</section>

<section class="bg-customBg2 relative h-fit w-full md:pt-10">
	<div class="form-container absolute mx-auto mb-5 px-4 lg:mb-20">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
			<div>
				<!-- svelte-ignore a11y_media_has_caption -->
				{#if vidio && vidio !== ' ' && !vidio.endsWith('.gif')}
					<video bind:this={videoRef} src={vidio} class="h-auto w-full rounded-lg object-cover"
					></video>
				{:else if vidio && vidio !== ' ' && vidio.endsWith('.gif')}
					<img src={vidio} class="h-auto w-full rounded-lg object-cover" alt="Animated GIF" />
				{:else if anggota.imageUrls[0]}
					<img src={anggota.imageUrls[0]} class="h-auto w-full rounded-lg object-cover" alt="" />
				{/if}
				<div class="mt-4 flex justify-center gap-1 lg:gap-4">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<span
						class="material-symbols--arrow-circle-left-rounded cursor-pointer self-center"
						onclick={prevImages}
						class:opacity-50={currentImageIndex === 0}
					></span>

					<div class="flex gap-1 overflow-hidden lg:gap-4">
						{#each anggota.imageUrls.slice(currentImageIndex + 1, currentImageIndex + 4) as imageUrl}
							<img src={imageUrl} class="h-16 w-auto rounded-lg object-cover lg:h-24" alt="" />
						{/each}
					</div>

					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<span
						class="material-symbols--arrow-circle-right cursor-pointer self-center"
						onclick={nextImages}
						class:opacity-50={currentImageIndex >= anggota.imageUrls.length - 4}
					></span>
				</div>
			</div>
			<div>
				<!-- svelte-ignore a11y_missing_attribute -->
				<div class="group flex items-center">
					<p class="items-center text-start text-xl font-semibold">{nama}</p>
					<!-- svelte-ignore a11y_invalid_attribute -->
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					{#if vidio.endsWith('.mp4')}
						<a onclick={OpenModalVideo}>
							<span
								class="bg-customKrem relative ml-5 flex h-10 w-10 items-center justify-center rounded-full border-2 p-2 transition-all duration-500 ease-in-out group-hover:w-[150px]"
							>
								<p
									class="text-xs opacity-0 transition-opacity delay-200 duration-300 ease-in-out group-hover:opacity-100"
								>
									Putar Video
								</p>
								<i class="iconoir--play absolute left-2 text-2xl text-white"></i>
							</span>
						</a>
					{/if}
				</div>
				<div class="mt-5 flex items-center">
					<div class="flex h-10 w-10 items-center justify-center rounded-full border bg-yellow-600">
						<span class="ph--scroll"></span>
					</div>
					<p class="ml-2">Tahun berdiri : {tahun}</p>
				</div>
				<div class="mt-5 flex items-center">
					<div class="flex h-10 w-10 items-center justify-center rounded-full border bg-yellow-600">
						<span class="tabler--flag"></span>
					</div>
					<p class="ml-2 flex items-center">
						Bendera Kerajaan : <img src={bendera} alt="" class="ml-2 h-6" />
					</p>
				</div>
				<div class="mt-5 flex items-center">
					<div class="flex h-10 w-10 items-center justify-center rounded-full border bg-yellow-600">
						<span class="material-symbols--shield-outline-rounded"></span>
					</div>
					<p class="ml-2 flex items-center">
						Lambang Kerajaan : <img src={lambang_kerajaan} alt="" class="ml-2 h-6" />
					</p>
				</div>
				<div class="mt-5 flex items-center">
					<div
						class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
					>
						<span class="bx--map text-xl"></span>
					</div>
					<p class="ml-3 items-center text-start">Lokasi : {lokasi}</p>
				</div>
				<p class="mt-3 text-start">{nama_kasunanan}</p>
				<p class="mt-3 text-start text-sm">{isi}</p>
				<p class="mt-3 text-center lg:text-start">Navigasi</p>
				<div class="duar mt-3 flex flex-col gap-4 lg:flex-row">
					<!-- Button 1 -->
					<button
						class="group relative flex items-center justify-center"
						onmouseenter={() => (hover1 = true)}
						onmouseleave={() => (hover1 = false)}
					>
						<span
							class="relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-blue-600 p-2 transition-all duration-500 ease-in-out group-hover:w-[250px]"
						>
							<p
								class="text-md ml-7 text-white opacity-0 transition-opacity delay-300 duration-300 ease-in-out group-hover:opacity-100"
							>
								Kunjungi Web Kerajaan ➜
							</p>
							<i class="ri--link absolute left-2 text-2xl text-white group-hover:hidden"></i>
						</span>
					</button>

					<!-- Button 2 -->
					<button
						class="group relative flex items-center justify-center"
						onmouseenter={() => (hover2 = true)}
						onmouseleave={() => (hover2 = false)}
					>
						<span
							class="relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-red-600 p-2 transition-all duration-500 ease-in-out group-hover:w-[250px]"
						>
							<p
								class="text-md ml-7 text-white opacity-0 transition-opacity delay-300 duration-300 ease-in-out group-hover:opacity-100"
							>
								Kunjungi Web Kerajaan ➜
							</p>
							<img
								src={rumah}
								alt=""
								class="absolute left-2 h-[75%] w-[75%] items-center object-contain pr-1 group-hover:hidden"
							/>
						</span>
					</button>

					<!-- Button 3 -->
					<button
						class="group relative flex items-center justify-center"
						onmouseenter={() => (hover3 = true)}
						onmouseleave={() => (hover3 = false)}
					>
						<span
							class="relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-yellow-600 p-2 transition-all duration-500 ease-in-out group-hover:w-[250px]"
						>
							<p
								class="text-md ml-7 text-white opacity-0 transition-opacity delay-300 duration-300 ease-in-out group-hover:opacity-100"
							>
								Kunjungi Web Kerajaan ➜
							</p>
							<img
								src={keris}
								alt=""
								class="absolute left-2 h-[75%] w-[75%] items-center object-contain pr-1 group-hover:hidden"
							/>
						</span>
					</button>

					<!-- Button 4 -->
					<button
						class="group relative flex items-center justify-center"
						onmouseenter={() => (hover4 = true)}
						onmouseleave={() => (hover4 = false)}
						onclick={OpenModal}
					>
						<span
							class="relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-gray-600 p-2 transition-all duration-500 ease-in-out hover:w-[250px]"
						>
							<p
								class="text-md ml-7 text-white opacity-0 transition-opacity delay-300 duration-300 ease-in-out group-hover:opacity-100"
							>
								Kunjungi Web Kerajaan ➜
							</p>
							<i class="ph--crown absolute left-2 text-2xl text-white group-hover:hidden"></i>
						</span>
					</button>
				</div>
				<!-- Teks -->
				<div class="relative">
					{#if hover1 === true}
						<p class="left-1/6 absolute mt-2 text-xs font-bold text-blue-600 lg:left-0">
							Temukan informasi resmi, berita terkini, dan pengumuman penting langsung dari sumber
							terpercaya
						</p>
					{/if}
					{#if hover2 === true}
						<p class="left-1/6 absolute mt-2 text-xs font-bold text-red-600 lg:left-0">
							Jelajahi situs kerajaan dengan tampilan yang menarik dan informasi lengkap seputar
							sejarah dan budaya kerajaan
						</p>
					{/if}
					{#if hover3 === true}
						<p class="left-1/6 absolute mt-2 text-xs font-bold text-yellow-600 lg:left-0">
							Telusuri lebih banyak lagi aset aset kebudayaan yang dimiliki kejayaan yang ada di
							Indonesia
						</p>
					{/if}
					{#if hover4 === true}
						<p class="left-1/6 absolute mt-2 text-xs font-bold text-gray-600 lg:left-0">
							Lihat semua raja yang pernah memimpin kerajaan ini
						</p>
					{/if}
				</div>

				<!-- Acara Sorotan -->
				<div></div>
			</div>
		</div>
		
		<p class="text-md mt-10 text-start text-gray-300">Last Updated : {formattedDate}</p>
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

{#if showModal}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-[70%] overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
			<div class="mb-5 flex justify-between">
				<h2 class="font-bold lg:text-xl">List Raja</h2>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button onclick={closeModal}>
					<span class="carbon--close-outline items-center"></span>
				</button>
			</div>
			{#each showRaja as raja, index}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="mb-5 flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 bg-yellow-300 transition-all duration-300"
					onclick={() => toggleExpand(index)}
				>
					<div class="mr-5 flex h-[50px] w-full items-center justify-between gap-2 px-3">
						<p class="text-xs lg:text-lg">
							{raja.nama_raja} ({raja.periodeMenjabat})
						</p>
						<div
							class="flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-red-500"
						>
							<span
								class="formkit--arrowdown transition-transform duration-300"
								class:rotate-180={isExpand[index]}
							></span>
						</div>
					</div>
					{#if isExpand[index]}
						<div class="border-t-2 border-black bg-white p-4">
							<div class="flex w-full gap-8">
								<img src={raja.imageUrl} class="h-[25%] w-[25%]" alt="" />
								<div class="w-full flex-col">
									<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
										<p class="text-md px-2 py-2">
											Nama Lengkap Raja : <span class="font-bold">{raja.nama_raja}</span>
										</p>
									</div>
									<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
										<p class="text-md px-2 py-2">
											Tanggal Lahir : <span class="font-bold"
												>{raja.tanggal_lahir.split('T')[0]}</span
											>
										</p>
									</div>
									<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
										<p class="text-md px-2 py-2">
											Kota Kelahiran : <span class="font-bold">{raja.tempat_lahir}</span>
										</p>
									</div>
									<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
										<p class="text-md px-2 py-2">
											Wangsa : <span class="font-bold">{raja.wangsa}</span>
										</p>
									</div>
									<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
										<p class="text-md px-2 py-2">
											Nama Ayah : <span class="font-bold">{raja.nama_ayah}</span>
										</p>
									</div>
									<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
										<p class="text-md px-2 py-2">
											Nama Ibu : <span class="font-bold">{raja.nama_ibu}</span>
										</p>
									</div>
									<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
										<p class="text-md px-2 py-2">
											Agama : <span class="font-bold">{raja.agama}</span>
										</p>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
{/if}

<section class="h-full w-full overflow-hidden">
	<Footer></Footer>
</section>

{#if navigating.to}
	<Loader></Loader>
{/if}

<style>
	.formkit--arrowdown {
		display: inline-block;
		width: 10.13px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 16'%3E%3Cpath fill='%23fff' d='M4.5 13c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5s.5.22.5.5v9c0 .28-.22.5-.5.5'/%3E%3Cpath fill='%23fff' d='M4.5 14a.47.47 0 0 1-.35-.15l-3.5-3.5c-.2-.2-.2-.51 0-.71s.51-.2.71 0l3.15 3.15l3.15-3.15c.2-.2.51-.2.71 0s.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z'/%3E%3C/svg%3E");
	}
	.carbon--close-outline {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23bba5a5' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12'/%3E%3Cpath fill='%23bba5a5' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");
	}
	.iconoir--play {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23f6f6f6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6.906 4.537A.6.6 0 0 0 6 5.053v13.894a.6.6 0 0 0 .906.516l11.723-6.947a.6.6 0 0 0 0-1.032z'/%3E%3C/svg%3E");
	}
	.ph--crown {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23fff' d='M248 80a28 28 0 1 0-51.12 15.77l-26.79 33L146 73.4a28 28 0 1 0-36.06 0l-24.03 55.34l-26.79-33a28 28 0 1 0-26.6 12L47 194.63A16 16 0 0 0 62.78 208h130.44A16 16 0 0 0 209 194.63l14.47-86.85A28 28 0 0 0 248 80M128 40a12 12 0 1 1-12 12a12 12 0 0 1 12-12M24 80a12 12 0 1 1 12 12a12 12 0 0 1-12-12m169.22 112H62.78l-13.92-83.48L81.79 149a8 8 0 0 0 6.21 3a8 8 0 0 0 1.08-.07a8 8 0 0 0 6.26-4.74l29.3-67.4a27 27 0 0 0 6.72 0l29.3 67.4a8 8 0 0 0 6.26 4.74a8 8 0 0 0 1.08.07a8 8 0 0 0 6.21-3l32.93-40.52ZM220 92a12 12 0 1 1 12-12a12 12 0 0 1-12 12'/%3E%3C/svg%3E");
	}
	@media (max-width: 768px) {
		.duar {
			justify-content: center;
		}
		/* 
		.edit {
			margin-top: 50%;
			margin-bottom: 10px;
		} */
	}

	.ri--link {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 0 0-7.071-7.071L9.878 7.05L8.464 5.636l1.414-1.414a7 7 0 0 1 9.9 9.9zm-2.829 2.828l-1.414 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 0 0 7.07 7.071l1.415-1.414zm-.707-10.607l1.415 1.415l-7.072 7.07l-1.414-1.414z'/%3E%3C/svg%3E");
	}
	.bx--map {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4m0-6c1.103 0 2 .897 2 2s-.897 2-2 2s-2-.897-2-2s.897-2 2-2'/%3E%3Cpath fill='%23000' d='M11.42 21.814a1 1 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819M12 4c3.309 0 6 2.691 6 6.005c.021 4.438-4.388 8.423-6 9.73c-1.611-1.308-6.021-5.294-6-9.735c0-3.309 2.691-6 6-6'/%3E%3C/svg%3E");
	}
	.material-symbols--shield-outline-rounded {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 21.9q-.175 0-.325-.025t-.3-.075Q8 20.675 6 17.638T4 11.1V6.375q0-.625.363-1.125t.937-.725l6-2.25q.35-.125.7-.125t.7.125l6 2.25q.575.225.938.725T20 6.375V11.1q0 3.5-2 6.538T12.625 21.8q-.15.05-.3.075T12 21.9m0-2q2.6-.825 4.3-3.3t1.7-5.5V6.375l-6-2.25l-6 2.25V11.1q0 3.025 1.7 5.5t4.3 3.3m0-7.9'/%3E%3C/svg%3E");
	}
	.tabler--flag {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1-7 0a5 5 0 0 0-7 0zm0 16v-7'/%3E%3C/svg%3E");
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

	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.form-container {
		background: white;
		position: static;
		padding: 28px;
		border-radius: 10px;
		width: 95%;
		height: 90%;
		text-align: center;
		margin-top: -250px;
	}
</style>
