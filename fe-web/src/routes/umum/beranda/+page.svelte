<script lang="ts">
	import Flipcard from '../Flipcard.svelte';
	import candi from '../../../asset/umum/candi.png';
	import candi2 from '../../../asset/umum/candi2.png';
	import gbr from '../../../asset/umum/gbr.png';
	import Footer from '../../../lib/footer/Footer.svelte';
	import gambar1 from '../../../asset/umum/img_1.png';
	import gambar2 from '../../../asset/umum/img_2.png';
	import gambar3 from '../../../asset/umum/img_3.png';
	import gambar4 from '../../../asset/umum/img_4.png';
	import gambar5 from '../../../asset/umum/image-bg.png';
	import type { LatLngExpression } from 'leaflet';
	import Leaflet from '$lib/Leaflet.svelte';
	import Marker from '$lib/Marker.svelte';
	import Popup from '$lib/Popup.svelte';
	import gambar from '$lib/logo_popup_umum.png';

	const initialView: LatLngExpression = [-2.5489, 118.0149]; // Pusat Indonesia (biar tampilan awal pas)

	// Lokasi marker di beberapa wilayah Indonesia
	const markerLocations: Array<{ latLng: LatLngExpression; text: string; location: string }> = [
		{ latLng: [5.5483, 95.3238], text: 'Keraton Surakarta', location: 'Sumatera' }, // Sumatera (Aceh)
		// { latLng: [-0.7893, 113.9213], text: 'Keraton Surakarta 2', location: 'Kalimantan' }, // Kalimantan
		{ latLng: [-7.2504, 112.7688], text: 'Keraton Surakarta 3', location: 'Jawa' }, // Jawa (Surabaya)
		{ latLng: [-7.2504, 112.77], text: 'Keraton Surakarta 4', location: 'Jawa lagi' }, // Jawa (Surabaya)
		{ latLng: [-6.2088, 106.8456], text: 'Keraton Surakarta 5', location: 'Jakarta' }, // Jakarta
		{ latLng: [-8.3405, 115.3], text: 'Keraton Surakarta 6', location: 'Bali' }, // Bali
		{ latLng: [-3.3194, 114.5908], text: 'Keraton Surakarta 7', location: 'Kalsel' } // Kalimantan Selatan
	];

	let { data } = $props();
	console.log(data);
	const selectedFlip = data.selectedFlip;
</script>

<!-- Section 1 -->
<section class="relative overflow-x-hidden">
	<div class=" min-w-screen bg-umum flex min-h-screen flex-col items-center justify-center">
		<div class="text-center">
			<p class="mt-20 text-5xl font-[600]">MAJELIS AGUNG RAJA SULTAN INDONESIA</p>
		</div>
		<div class=" z-0 h-screen w-[80%] py-6">
			<Leaflet view={initialView} zoom={4.5}>
				{#each markerLocations as { latLng, text, location }}
					<Marker {latLng} width={20} height={20}>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
							><path
								fill="#fa0404"
								d="M12 2C7.589 2 4 5.589 4 9.995C3.971 16.44 11.696 21.784 12 22c0 0 8.029-5.56 8-12c0-4.411-3.589-8-8-8m0 12c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4"
							/></svg
						>

						<Popup {text} {location} link="https://example.com" image={gambar} />
					</Marker>
				{/each}
			</Leaflet>
		</div>
	</div>
</section>

<!-- Section 2 -->
<section
	class=" relative mb-20 h-[100%] w-[100%] overflow-hidden bg-cover bg-center p-5"
	style:background-image="url('{gambar5}')"
>
	<div class=" grid grid-cols-1 items-center justify-center md:grid-cols-2">
		<div class="mb-10 ml-10 mt-10 grid grid-cols-3 grid-rows-[auto_auto_1fr] gap-1">
			<img src={gambar1} alt="dor" class="col-span-1 row-span-2 h-full object-cover" />
			<img src={gambar2} class="col-span-2 row-span-1 h-[205px] object-cover" alt="dor" />
			<img src={gambar3} class="col-span-2 row-span-1 h-[172px] object-cover" alt="dor" />
			<img
				src={gambar4}
				class="col-span-3 h-auto max-h-60 w-[100%] object-cover lg:w-[93%]"
				alt="dordordor"
			/>
		</div>

		<div class="ms-30 mb-10 max-w-full break-words p-4 text-center lg:mb-0 lg:mr-10 lg:text-left">
			<p class="mb-4 text-4xl font-[500]">Tentang Kami</p>
			<p>
				Majelis Agung Raja Sultan Indonesia (MARSI) adalah sebuah organisasi yang menghimpun
				raja-raja dan sultan-sultan dari berbagai keraton dan kerajaan di Indonesia. Organisasi ini
				bertujuan untuk menjaga dan melestarikan nilai-nilai budaya, tradisi, dan adat istiadat yang
				berasal dari keraton-keraton Nusantara.
			</p>
		</div>
	</div>
</section>

<!-- Section 3 + 4 -->
<section class="relative h-fit">
	<div class="waves_a rotate-180">
		<svg
			data-name="Layer 1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
		>
			<path
				d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
				class="shape-fill"
			></path>
		</svg>
	</div>
	<div class="bg-umum relative pb-10">
		<div class="grid grid-cols-1 items-center justify-center md:grid-cols-2">
			<div class="m-4 text-center">
				<img src={candi} alt="" />
			</div>
			<div class="me-30 max-w-full break-words p-4 text-center md:me-60 lg:text-left">
				<p class="mb-4 text-4xl font-[500]">Kerajaan di Indonesia</p>
				<p>
					Kerajaan-kerajaan yang berdiri di Indonesia berjumlah ratusan. Majelis Agung Raja Sultan
					Indonesia (MARSI) sendiri merupakan sebuah organisasi yang beranggotakan para Raja beserta
					dengan Kerajaannya. Anggota MARSI tersebar dari sabang hingga merauke. Melalui laman ini,
					anda dapat memperkaya pengetahuan anda mengenai ratusan kerajaan yang berdiri di
					Indonesia.
				</p>
				<div class="flex w-full justify-center lg:justify-start">
					<a
						href="/"
						class="group relative my-2 flex items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-orange-500"
					>
						<span class="relative z-10 pr-5 transition-colors duration-500 group-hover:text-black">
							Selengkapnya
						</span>
						<span
							class="absolute right-0 flex h-7 w-7 items-center justify-end rounded-full border-2 border-orange-400 px-1 pt-0.5 transition-all duration-500 ease-in-out group-hover:h-full group-hover:w-full group-hover:bg-orange-400"
						>
							<i
								class="solar--arrow-right-linear right-2 text-2xl text-orange-400 transition-colors duration-500 group-hover:absolute group-hover:text-white"
							></i>
						</span>
					</a>
				</div>
			</div>
		</div>

		<div class="flexcoba mb-10 mt-20 flex items-center justify-between px-20">
			<p class="text-nowrap text-3xl font-semibold">Kerajaan di Indonesia</p>
			<button
				class="mt-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-slate-400 lg:mt-0"
				onclick={() => window.location.reload()}
			>
				<i class="material-symbols--refresh lg:mt-0"></i>
			</button>
		</div>
		<div class="mx-auto flex flex-wrap justify-center gap-12 gap-y-4">
			{#each selectedFlip as item, i}
				<Flipcard
					gambar={item.gambar}
					kerajaan={item.kerajaan}
					judul={item.kerajaan}
					lokasi={item.lokasi}
					isi={item.isi}
				/>
			{/each}
		</div>
	</div>
</section>

<!-- Section 5 -->
<section class="relative">
	<section class="relative bg-white pb-10 pt-10">
		<div class="grid grid-cols-1 items-center justify-center md:grid-cols-2">
			<div class=" max-w-full break-words p-4 text-center lg:text-right">
				<p class="mb-4 text-4xl font-[500]">Situs Bersejarah Kerajaan</p>
				<p class=" min-w-screen lg:ml-auto lg:w-[80%]">
					Dari banyaknya kerajaan yang berdiri dan tersebar di seluruh penjuru nusantara, semua
					pasti memiliki situs bersejarahnya masing-masing. Mulai dari bangunan, situs khusus,
					ataupun yang hanya dalam bentuk struktur. Di laman ini, anda dapat mengakses secara
					lengkap mengenai informasi seputar situs-situs bersejarah dari ratusan kerajaan yang
					tentunya sangat menarik untuk anda lihat!
				</p>
				<div class="flex w-full justify-center lg:justify-end">
					<a
						href="/"
						class="group relative my-2 flex items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-orange-500"
					>
						<span class="relative z-10 pr-5 transition-colors duration-500 group-hover:text-black">
							Selengkapnya
						</span>
						<span
							class="absolute right-0 flex h-7 w-7 items-center justify-end rounded-full border-2 border-orange-400 px-1 pt-0.5 transition-all duration-500 ease-in-out group-hover:h-full group-hover:w-full group-hover:bg-orange-400"
						>
							<i
								class="solar--arrow-right-linear right-2 text-2xl text-orange-400 transition-colors duration-500 group-hover:absolute group-hover:text-white"
							></i>
						</span>
					</a>
				</div>
			</div>
			<div class="m-4 text-center">
				<img src={candi2} alt="" />
			</div>
		</div>
	</section>
</section>

<!-- Section 6 -->
<section class="relative">
	<div class="waves_a my-rotate-x-180">
		<svg
			data-name="Layer 1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
		>
			<path
				d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
				class="shape-fill"
			></path>
		</svg>
	</div>

	<div class="bg-umum relative mt-10 grid grid-cols-1 items-center justify-center md:grid-cols-2">
		<div class="m-4">
			<img src={gbr} class="mt-20" alt="" />
		</div>
		<div
			class="mr-4 ms-4 flex max-w-full flex-col break-words p-4 text-center md:mr-20 md:ms-40 lg:text-right"
		>
			<p class="mb-4 text-4xl font-[500]">Aset Bersejarah Kerajaan</p>
			<p>
				Kerajaan yang telah berdiri sejak lama tentu memiliki aset yang senantiasa dijaga. Ada aset
				yang berupa benda (contohnya keris), lalu juga ada aset yang berupa takbenda (contohnya
				tarian). Tentu aset-aset tersebut memiliki nilai sejarah yang sangat tinggi dan pastinya
				akan sangat menarik untuk anda lihat dan pelajari melalui laman berikut!
			</p>

			<!-- Tombol Animasi 1 -->
			<div class="flex w-full justify-center lg:justify-end">
				<a
					href="/"
					class="group relative my-2 flex items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-orange-500"
				>
					<span class="relative z-10 pr-5 transition-colors duration-500 group-hover:text-black">
						Selengkapnya
					</span>
					<span
						class="absolute right-0 flex h-7 w-7 items-center justify-end rounded-full border-2 border-orange-400 px-1 pt-0.5 transition-all duration-500 ease-in-out group-hover:h-full group-hover:w-full group-hover:bg-orange-400"
					>
						<i
							class="solar--arrow-right-linear right-2 text-2xl text-orange-400 transition-colors duration-500 group-hover:absolute group-hover:text-white"
						></i>
					</span>
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Section 7  -->
<div class="mb-10 mt-20">
	<section class="relative">
		<section class="relative bg-white pb-10">
			<div class="grid grid-cols-1 items-center justify-center md:grid-cols-2">
				<div class="item-center max-w-full break-words p-4 text-center lg:text-right">
					<p class="mb-5 mt-5">SOROTAN ACARA</p>
					<p class="mb-5 text-4xl font-[500] lg:ms-40">
						Pengukuhan Majelis Agung Raja Sultan Indonesia
					</p>
					<p class="mb-2 w-[100%] items-center lg:ml-auto lg:w-[70%]">
						Kementrian Dalam Negeri (Kemendagri) mengukuhkan Majelis Agung Raja Sultan (MARS)
						Indonesia di Kantor Kemendagri, Medan Merdeka Utara, Jakarta Pusat, Kamis (24/8/2017).
					</p>
					<div class="flex w-full justify-center lg:justify-end">
						<a href="/" class="my-2 flex items-center gap-2 rounded-full px-5 py-3">
							Lihat Selengkapnya
							<span class="prime--arrow-right"></span>
						</a>
					</div>
				</div>
				<div class="m-4 flex items-center justify-center lg:-mx-20 lg:mr-20">
					<img src={gambar2} alt="" class="h-[300px] w-[450px]" />
				</div>
			</div>
		</section>
	</section>
</div>

<!-- Footer -->
<section class="h-full w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	.prime--arrow-right {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M13 18.75a.74.74 0 0 1-.53-.22a.75.75 0 0 1 0-1.06L17.94 12l-5.47-5.47a.75.75 0 0 1 1.06-1.06l6 6a.75.75 0 0 1 0 1.06l-6 6a.74.74 0 0 1-.53.22'/%3E%3Cpath fill='%23000' d='M19 12.75H5a.75.75 0 0 1 0-1.5h14a.75.75 0 0 1 0 1.5'/%3E%3C/svg%3E");
	}
	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}

	.solar--arrow-right-linear {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23dc7e00' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 12h16m0 0l-6-6m6 6l-6 6'/%3E%3C/svg%3E");
		transition: background-image 0.3s ease-in-out;
	}

	.group:hover .solar--arrow-right-linear {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M4 12h16m0 0l-6-6m6 6l-6 6'/%3E%3C/svg%3E");
	}

	.bg-umum {
		background-color: #ffeec5;
	}

	.waves_a {
		position: absolute;
		margin-top: -205px;
		top: 0;
		left: 0;
		width: 100%;
		overflow: hidden;
		line-height: 0;
	}

	.waves_a svg {
		position: relative;
		display: block;
		width: calc(160% + 1.3px);
		height: 210px;
	}

	.waves_a .shape-fill {
		fill: #ffeec5;
	}

	section {
		margin-top: 0;
		padding-top: 0;
	}

	.material-symbols--refresh {
		display: inline-block;
		width: 48px;
		height: 48px;
		--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 20q-3.35 0-5.675-2.325T4 12t2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.187-2.2T12 6Q9.5 6 7.75 7.75T6 12t1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20'/%3E%3C/svg%3E");
		background-color: currentColor;
		-webkit-mask-image: var(--svg);
		mask-image: var(--svg);
		-webkit-mask-repeat: no-repeat;
		mask-repeat: no-repeat;
		-webkit-mask-size: 100% 100%;
		mask-size: 100% 100%;
	}
</style>
