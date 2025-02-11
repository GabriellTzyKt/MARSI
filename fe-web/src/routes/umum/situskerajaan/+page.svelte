<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../nav/Navbar.svelte';
	import gambarHeader from '../../../asset/umum/keraton 2.png';
	import gambar from '../../../asset/umum/gbr_1.png';
	import gambar2 from '../../../asset/umum/gbr_2.png';
	import gambar3 from '../../../asset/umum/gbr_3.png';
	import gambar4 from '../../../asset/umum/gbr_4.png';
	import Cardshow from '../Cardshow.svelte';
	let value = $state(0);
</script>

<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<!-- Section 1 -->
<section class="relative">
	<!-- Gambar -->
	<div class="relative">
		<img src={gambarHeader} alt="" class="h-auto w-full" />

		<p
			class="absolute left-[35%] top-1/2 z-10 -translate-y-1/2 transform text-6xl font-bold text-black"
		>
			Daftar Kerajaan
		</p>
	</div>

	<!-- Search bar -->
	<div class="relative z-10 mb-20 mt-[-30px] flex justify-center">
		<div
			class="mx-4 flex h-fit w-[50%] items-center justify-between self-center rounded-2xl border bg-white pe-4 ps-4 shadow-md"
		>
			<input
				type="text"
				class="flex-grow justify-center border-none pe-16 outline-none focus:border-none focus:outline-none focus:ring-0"
				placeholder="Search"
			/>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="display-none size-6 md:flex"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
				/>
			</svg>
		</div>
	</div>

	<!-- Pagination ? -->
	<div class="ml-11 flex justify-start">
		<p>Show :</p>
		<details class="dropdown border-rounded ml-3 border">
			<summary class="no-arrow w-[50px] text-center"> {value} </summary>
			<ul class="bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
				<li><button onclick={() => (value = 6)}>6</button></li>
				<li><button onclick={() => (value = 8)}>8</button></li>
			</ul>
		</details>
		<p class="ml-2">Entries</p>
	</div>

	<!-- Card Show  -->
	<div class="relative mb-20 ml-10 mr-10 mt-10 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2">
		<Cardshow judul="Keraton Kasunanan Surakarta" lokasi="Surakarta, Jawa Tengah" {gambar} linkTo=""
		></Cardshow>
		<Cardshow
			judul="Keraton Ngayogyakarta Hadiningrat"
			lokasi="Yogyakarta, Daerah Istimewa Yogyakarta"
			gambar={gambar2}
			linkTo=""
		></Cardshow>
		<Cardshow
			judul="Kadipaten Mangkunagaran"
			lokasi="Surakarta, Jawa Tengah"
			gambar={gambar4}
			linkTo=""
		></Cardshow>
		<Cardshow
			judul="Keraton Kasunanan Surakarta"
			lokasi="Surakarta, Jawa Tengah"
			gambar={gambar3}
			linkTo=""
		></Cardshow>
	</div>
</section>

<!-- Footer -->
<div class="relative">
	<Footer></Footer>
</div>

<style>
	.no-arrow {
		list-style: none;
	}
</style>
