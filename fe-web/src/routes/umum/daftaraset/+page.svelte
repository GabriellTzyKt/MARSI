<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../nav/Navbar.svelte';
	import gambarHeader from '../../../asset/umum/aset_top.png';
	import gambar from '../../../asset/umum/aset1.png';
	import gambar2 from '../../../asset/umum/aset2.png';
	import gambar3 from '../../../asset/umum/aset3.png';
	import gambar4 from '../../../asset/umum/aset4.png';
	import Cardshow from '../Cardshow.svelte';
	let value = $state(6);
	let displayedCount = $state(6);
	let keyword = $state('');

	const situsList = [
		{ id: 1, judul: 'Keraton Kasunanan Surakarta', lokasi: 'Surakarta, Jawa Tengah', gambar },
		{
			id: 2,
			judul: 'Keraton Ngayogyakarta Hadiningrat',
			lokasi: 'Yogyakarta, Daerah Istimewa Yogyakarta',
			gambar: gambar2
		},
		{ id: 3, judul: 'Kadipaten Mangkunagaran', lokasi: 'Surakarta, Jawa Tengah', gambar: gambar3 },
		{
			id: 4,
			judul: 'Keraton Kasunanan Surakarta',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar4
		},
		{
			id: 5,
			judul: 'Keraton Kasunanan Surakarta',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar4
		},
		{
			id: 6,
			judul: 'Keraton Kasunanan Surakarta 6',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar4
		},
		{
			id: 7,
			judul: 'Keraton Kasunanan Surakarta 7',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar4
		},
		{
			id: 8,
			judul: 'Keraton Kasunanan Surakarta 8',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar4
		},
		{
			id: 9,
			judul: 'Keraton Kasunanan Surakarta 9',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar4
		},
		{
			id: 10,
			judul: 'Keraton Kasunanan Surakarta 10',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 11,
			judul: 'Keraton Kasunanan Surakarta 11',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 12,
			judul: 'Keraton Kasunanan Surakarta 12',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 13,
			judul: 'Keraton Kasunanan Surakarta 13',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 14,
			judul: 'Keraton Kasunanan Surakarta 14',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 15,
			judul: 'Keraton Kasunanan Surakarta 15',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 16,
			judul: 'Keraton Kasunanan Surakarta 16',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 17,
			judul: 'Keraton Kasunanan Surakarta 17',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 18,
			judul: 'Keraton Kasunanan Surakarta 18',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 19,
			judul: 'Keraton Kasunanan Surakarta 19',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 20,
			judul: 'Keraton Kasunanan Surakarta 20',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 21,
			judul: 'Keraton Kasunanan Surakarta 21',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 22,
			judul: 'Keraton Kasunanan Surakarta 22',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 23,
			judul: 'Keraton Kasunanan Surakarta 23',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		},
		{
			id: 24,
			judul: 'Keraton Kasunanan Surakarta 24',
			lokasi: 'Surakarta, Jawa Tengah',
			gambar: gambar
		}
	];

	let filteredData = $derived(situsList.filter((v) => v.judul.toLowerCase()
	.includes(keyword.toLowerCase())));

	// $effect(() => {
	// 	displayedCount = filteredData.length
	// });

	function loadMore() {
		displayedCount += value;
		console.log(displayedCount);
	}
</script>

<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<section class="relative">
	<div class="relative h-screen w-screen">
		<img src={gambarHeader} alt="" class="h-screen w-screen" />
		<p
			class="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-6xl font-bold text-black"
		>
			Daftar Aset
		</p>
	</div>

	<div class="relative z-10 mb-20 mt-[-30px] flex justify-center">
		<div
			class="mx-4 flex h-fit w-[100%] items-center justify-between self-center rounded-2xl border bg-white pe-4 ps-4 shadow-md lg:w-[50%]"
		>
			<input
				type="text"
				class="flex flex-grow border-none outline-none focus:ring-0"
				bind:value={keyword}
				placeholder="Search"
			/>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-6"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
				/>
			</svg>
		</div>
	</div>

	<div class="ml-11 flex justify-between">
		<div class="flex justify-start">
			<p>Show :</p>
			<details class="dropdown border-rounded ml-3 border">
				<summary class="no-arrow w-[50px] text-center"> {value} </summary>
				<ul class="bg-base-100 rounded-box z-[1] w-fit p-2 shadow">
					<li>
						<button
							onclick={() => {
								value = 6;
								displayedCount = 6;
							}}>6</button
						>
					</li>
					<li>
						<button
							onclick={() => {
								value = 8;
								displayedCount = 8;
							}}>8</button
						>
					</li>
				</ul>
			</details>
			<p class="ml-2">Entries</p>
		</div>
		<p class="me-12">{displayedCount} / {situsList.length}</p>
	</div>

	<div class="relative mb-20 ml-10 mr-10 mt-10 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2">
		{#each filteredData.slice(0, displayedCount) as situs}
			<Cardshow judul={situs.judul} lokasi={situs.lokasi} gambar={situs.gambar} id={situs.id} />
		{/each}
	</div>

	{#if displayedCount >= situsList.length || keyword.trim() !== ''}
		<button
			onclick={loadMore}
			class="mb-10 me-10 ml-10 hidden h-[40px] w-[95%] items-center rounded-lg border bg-white shadow-md"
		>
			See More !
		</button>
	{:else if displayedCount < situsList.length}
		<div class="flex justify-center">
			<button
				onclick={loadMore}
				class="edit flex-shrink-1 mx-auto mb-10 h-[40px] w-[85%] items-center rounded-lg border bg-white shadow-md"
			>
				See More !
			</button>
		</div>
	{/if}
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
