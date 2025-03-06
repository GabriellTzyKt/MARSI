<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../nav/Navbar.svelte';
	import Cardshow from '../Cardshow.svelte';
	import gambarHeader from '../../../asset/umum/gambar_header_situs.png';
	import { sort } from 'd3';

	let value = $state(6);
	let displayedCount = $state(6);
	let keyword = $state('');
	let selectedDaerah = $state<string>(' ');
	let selectKepemilikan = $state<string>(' ');
	// Kategori
	let selectKategori = $state<string>(' ');
	let sortOrder: string = $state('');
	let latitude: number | null = null;
	let longitude: number | null = null;
	let userLocation: string | null = $state(' ');
	let selectedLokasi: string = $state('');


	const { data } = $props();
	console.log('Data diterima ', data);
	// judul lokasi gambar
	const dataGet = data.find;

	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedLokasi = target.value;

		if (selectedLokasi === 'lokasi') {
			getLocation();
		} else if (selectedLokasi === ' ') {
			selectedDaerah = ' ';
			userLocation = ' ';
			sortOrder = ' ';
			selectKategori = ' ';
			selectKepemilikan = ' ';
			displayedCount = value;
		} else if (selectedLokasi === 'tahun-asc'){
			sortOrder = 'asc'
		} else if (selectedLokasi === 'tahun-desc'){
			sortOrder = 'desc'
		}
	}

	function getLocation() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					getCity(latitude, longitude);
				},
				(error) => {
					console.error('Error getting location:', error);
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
		}
	}

	async function getCity(lat: number, lon: number) {
		const response = await fetch(
			`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
		);
		const data = await response.json();
		console.log('User Location Before : ', userLocation);
		if (data.address) {
			userLocation =
				data.address.city || data.address.town || data.address.village || 'Tidak diketahui';
			alert(`Mencari kerajaan di daerah : ${userLocation}`);
			selectedDaerah = userLocation || '';
		}
		console.log('User Location After : ', userLocation);
	}

	function updateDisplayedCount() {
		displayedCount = value;
	}

	function updateFilteredData() {
		const filteredData = dataGet.filter((v) => {
			const isDaerahMatch = selectedDaerah
				? v.lokasi.toLowerCase().includes(selectedDaerah.toLowerCase())
				: true;
			const isKeywordMatch = v.nama_tempat.toLowerCase().includes(keyword.toLowerCase());
			const isKategoriMatch = v.nama_tempat.toLowerCase().includes(selectKategori.toLowerCase());

			return isDaerahMatch && isKeywordMatch && isKategoriMatch;
		});

		if (sortOrder === 'asc') {
			filteredData.sort((a, b) => Number(a.tahun) - Number(b.tahun));
		} else if (sortOrder === 'desc') {
			filteredData.sort((a, b) => Number(b.tahun) - Number(a.tahun));
		} else {
			filteredData
		}

		console.log('Filtered Data:', filteredData);
		return filteredData;
	}

	// $effect(() => {
	// 	displayedCount = filteredData.length
	// });

	function loadMore() {
		displayedCount += value;
		console.log(displayedCount);
	}
</script>

<Navbar></Navbar>

<section class="relative">
	<div class="relative h-screen w-full">
		<img src={gambarHeader} alt="" class="h-screen w-full" />
		<p
			class="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-6xl font-bold text-black"
		>
			Daftar Situs
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

	<div class="ml-11 flex lg:justify-between lg:flex-row flex-col lg:gap-y-0 gap-y-2">
		<div class="relative flex items-center gap-x-2">
			<p>Sort By :</p>
			<select
				id="sortSelect"
				class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				onchange={handleSortChange}
			>
				<option value=" " selected>None</option>
				<option value="lokasi">Lokasi</option>
				<option value="tahun-asc">Tahun ( Ascending )</option>
				<option value="tahun-desc">Tahun ( Descending )</option>
				<option value="era">Era</option>
				<option value="popularity">Popularity</option>
			</select>
		</div>
		<div class="relative flex items-center gap-x-2">
			<p>Show :</p>
			<select
				bind:value
				onchange={() => updateDisplayedCount()}
				class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			>
				<option disabled selected>None</option>
				<option value={6}>6</option>
				<option value={8}>8</option>
			</select>
			<p>Entries</p>
		</div>
		<!-- Belom Nyoba Di Filter, masih nunggu datanya apa aja biar pasti -->
		<div class="relative flex items-center gap-x-2">
			<p>Kategori :</p>
			<select
				id="sortSelect"
				bind:value={selectKategori}
				class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			>
				<option value=" ">None</option>
				<option value="kerajaan">Kerajaan</option>
				<option value="kekaisaran">Kekaisaran</option>
			</select>
		</div>
		<!--  -->
		<!-- Belom Nyoba Di Filter, masih nunggu datanya apa aja biar pasti -->
		<div class="relative flex items-center gap-x-2">
			<p>Kepemilikan :</p>
			<select
				id="sortSelect"
				bind:value={selectKepemilikan}
				class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			>
				<option value=" ">None</option>
				<option value="kerajaan">Kerajaan</option>
				<option value="kekaisaran">Kekaisaran</option>
			</select>
		</div>
		<!--  -->
		<div class="relative mr-11 flex items-center gap-x-2">
			<p>Daerah :</p>
			{#if (selectedDaerah === ' ' && userLocation === ' ') || (selectedDaerah !== ' ' && userLocation === ' ') || (selectedDaerah === ' ')}
				<select
					bind:value={selectedDaerah}
					class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value=" ">None</option>
					<option value="Magelang">Magelang</option>
					<option value="Surabaya">Surabaya</option>
				</select>
			{:else if userLocation !== ' '}
				<select
					bind:value={userLocation}
					onchange={handleSortChange}
					disabled
					class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value=" ">None</option>
					<option value="Magelang">Magelang</option>
					<option value="Surabaya">Surabaya</option>
				</select>
			{/if}
		</div>
	</div>

	<div class="relative mb-20 ml-10 mr-10 mt-10 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2">
		{#each updateFilteredData().slice(0, displayedCount) as situs}
			<Cardshow
				judul={situs.nama_tempat}
				lokasi={situs.lokasi}
				gambar={situs.gambartop}
				id={situs.id}
				tahun={situs.tahun}
			/>
		{/each}
	</div>

	{#if updateFilteredData().length <= displayedCount || updateFilteredData().length < 6}
		<button
			onclick={loadMore}
			class="mb-10 me-10 ml-10 hidden h-[40px] w-[95%] items-center rounded-lg border bg-white shadow-md"
		>
			See More !
		</button>
	{:else}
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

<section class="h-full w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	@media (max-width: 820px) {
		.edit {
			display: flex;
			justify-content: center;
		}
	}
</style>
