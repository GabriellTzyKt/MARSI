<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../nav/Navbar.svelte';
	import gambarHeader from '../../../asset/umum/aset_top.png';
	import gambar from '../../../asset/umum/aset1.png';
	import gambar2 from '../../../asset/umum/aset2.png';
	import gambar3 from '../../../asset/umum/aset3.png';
	import gambar4 from '../../../asset/umum/aset4.png';
	import Cardshow from '../Cardshow.svelte';
	import { tempasetdata } from '$lib/dummy';

	let value = $state(0);
</script>

<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<!-- Section 1 -->
<section class="relative">
	<!-- Gambar -->
	<div class="relative h-screen w-screen">
		<img src={gambarHeader} alt="" class="h-screen w-screen" />

		<p
			class="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-6xl font-bold text-black"
		>
			Daftar Acara
		</p>
	</div>

	<!-- Search bar -->
	<div class="relative z-10 mb-20 mt-[-30px] flex justify-center">
		<div
			class="mx-4 flex h-fit w-[100%] items-center justify-between self-center rounded-2xl border bg-white pe-4 ps-4 shadow-md lg:w-[50%]"
		>
			<input
				type="text"
				class="flex flex-grow justify-center border-none pe-5 outline-none focus:border-none focus:outline-none focus:ring-0"
				placeholder="Search"
			/>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="flex size-6 flex-shrink-0"
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
		{#each tempasetdata as t}
			<Cardshow judul={t.nama} lokasi={t.kepemilikan} gambar={t.gambartop} id={t.id}></Cardshow>
		{/each}
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
