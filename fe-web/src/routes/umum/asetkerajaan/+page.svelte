<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../nav/Navbar.svelte';
	import gambarHeader from '../../../asset/umum/keraton 2.png';
	import gambar from '../../../asset/umum/gbr_1.png';
	import gambar2 from '../../../asset/umum/gbr_2.png';
	import gambar3 from '../../../asset/umum/gbr_3.png';
	import gambar4 from '../../../asset/umum/gbr_4.png';
	import Cardshow from '../Cardshow.svelte';
	import PaginationUmum from '../PaginationUmum.svelte';
	let value = $state(0);
</script>

<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<!-- Section 1 -->
<section class="relative mt-10 md:mt-0">
	<!-- Gambar -->
	<div class="relative text-center">
		<img src={gambarHeader} alt="" class="h-auto w-full" />
		<div class="absolute inset-0 z-10 flex items-center justify-center">
			<p class="text-6xl font-bold text-black">Daftar Aset</p>
		</div>
	</div>

	<!-- Search bar -->
	<div class="relative z-10 mb-20 mt-[-30px] flex justify-center">
		<div
			class="mx-4 flex w-[50%] items-center justify-center self-center rounded-2xl border bg-white pe-4 ps-4 shadow-md sm:w-[50%] md:justify-between"
		>
			<input
				type="text"
				class="flex flex-grow justify-center rounded-2xl border-none shadow-md outline-none focus:border-none focus:outline-none focus:ring-0 md:pe-16"
				placeholder="Search"
			/>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="hidden size-6 md:block"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
				/>
			</svg>
		</div>
	</div>
	<div class="">
		<!-- Pagination ? -->
		<div class="mx-8 grid grid-cols-1 gap-y-3 xl:grid-cols-2 xl:gap-y-0">
			<div
				class="flex flex-col flex-wrap items-center justify-center gap-y-3 md:flex-row md:gap-y-0 xl:items-start xl:justify-start"
			>
				<div class="me-2 flex items-center justify-center">
					<label for="kategori" class="me-2">Kategori: </label>
					<select
						name=""
						class="w-40 rounded-lg shadow-lg"
						placeholder="benda"
						id="kategori"
						value="Benda"
					>
						<option value="Mahluk">Mahluk</option>
					</select>
				</div>
				<div class="flex items-center justify-center">
					<label for="daerah" class="me-2">Daerah: </label>
					<select name="" class="w-40 rounded-lg shadow-lg" id="daerah" value="Jogjakarta">
						<option value="Surabaya">Surabaya</option>
						<option value="Jakarta">Jakarta</option>
						<option value="Madura">Madura</option>
						<option value="Jember">Jember</option>
						<option value="Bali">Bali</option>
					</select>
				</div>
			</div>
			<div
				class="flex flex-col items-center justify-center gap-y-3 md:flex-row xl:justify-end xl:gap-y-0"
			>
				<div class="flex items-center justify-center">
					<label for="Kepemilikan" class="me-2">Kepemilikan: </label>
					<select name="" class="w-48 rounded-lg shadow-lg" id="Kepemilikan" value="Jogjakarta">
						<option value="Surabaya">Surabaya</option>
						<option value="Jakarta">Jakarta</option>
						<option value="Madura">Madura</option>
						<option value="Jember">Jember</option>
						<option value="Bali">Bali</option>
					</select>
				</div>
				<div>
					<PaginationUmum></PaginationUmum>
				</div>
			</div>
			<!-- <p>Show :</p>
            <details class="dropdown border-rounded ml-3 border">
                <summary class="no-arrow w-[50px] text-center"> {value} </summary>
                <ul class="bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li><button onclick={() => (value = 6)}>6</button></li>
                    <li><button onclick={() => (value = 8)}>8</button></li>
                </ul>
            </details>
            <p class="ml-2">Entries</p> -->
		</div>

		<!-- Card Show  -->
		<div class="mx-8 mb-20 me-0 mt-10 grid grid-cols-1 items-center justify-center md:grid-cols-2">
			<div>
				<Cardshow
					judul="Keraton Kasunanan Surakarta"
					lokasi="Surakarta, Jawa Tengah"
					{gambar}
					id="1"
				></Cardshow>
			</div>
			<div>
				<Cardshow
					judul="Keraton Ngayogyakarta Hadiningrat"
					lokasi="Yogyakarta, Daerah Istimewa Yogyakarta"
					gambar={gambar2}
					id="2"
				></Cardshow>
			</div>
			<div>
				<Cardshow
					judul="Kadipaten Mangkunagaran"
					lokasi="Surakarta, Jawa Tengah"
					gambar={gambar4}
					id="3"
				></Cardshow>
			</div>
			<div>
				<Cardshow
					judul="Keraton Kasunanan Surakarta"
					lokasi="Surakarta, Jawa Tengah"
					gambar={gambar3}
					id="4"
				></Cardshow>
			</div>
		</div>
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
