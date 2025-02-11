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
	import { tempdata } from '$lib/dummy';

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
			<p class="text-6xl font-bold text-black">Daftar Acara</p>
		</div>
	</div>

	<!-- Search bar -->
	<div class="relative z-10 mb-20 mt-[-30px] flex justify-center">
		<div
			class="mx-4 flex w-[50%] items-center justify-center self-center rounded-2xl border bg-white pe-4 ps-4 sm:w-[50%] md:justify-between"
		>
			<input
				type="text"
				class="flex flex-grow justify-center rounded-2xl border-none outline-none focus:border-none focus:outline-none focus:ring-0 md:pe-16"
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
		<div class="me-20 flex justify-center md:justify-end">
			<PaginationUmum></PaginationUmum>
		</div>

		<!-- Card Show  -->
		<!-- Card Show  -->
		<div class="mx-8 mb-20 mt-10 grid grid-cols-1 items-center justify-center md:grid-cols-2">
			<!-- kalau mau kamu loop aja, tinggal import data dari datadummy -->
			{#each tempdata as t}
				<div class="mx-2 my-2">
					<Cardshow judul={t.nama_kerajaan} lokasi={t.lokasi} gambar={t.gambartop} id={t.id}
					></Cardshow>
				</div>
			{/each}
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
