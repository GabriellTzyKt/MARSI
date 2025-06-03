<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../nav/Navbar.svelte';
	import Cardshow from '../Cardshow.svelte';
	import gambarHeader from '../../../asset/umum/gambar_header_situs.png';
	import { sort } from 'd3';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';

	let value = $state(6);
	let displayedCount = $state(6);
	let keyword = $state('');
	let selectedDaerah = $state<string>('');
	let selectKepemilikan = $state<string>('');
	// Kategori
	let selectKategori = $state<string>('');
	let sortOrder: string = $state('');
	let latitude: number | null = null;
	let longitude: number | null = null;
	let userLocation: string | null = $state('');
	let selectedLokasi: string = $state('');
	let loading = $state(false);

	const { data } = $props();
	console.log('Data diterima ', data);
	// judul lokasi gambar
	const dataGet: any = data.detil_situs;
	console.log('Data diterima ', dataGet);

	console.log('User location : ', userLocation);
	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedLokasi = target.value;

		if (selectedLokasi === 'lokasi') {
			// Reset nilai sebelum mencoba mendapatkan lokasi baru
			userLocation = '';
			selectedDaerah = '';

			// Tampilkan pesan loading
			// alert("Mencari lokasi Anda... Mohon izinkan akses lokasi jika diminta.");

			getLocation();
		} else if (selectedLokasi === ' ') {
			selectedDaerah = '';
			userLocation = '';
			sortOrder = '';
			selectKategori = '';
			selectKepemilikan = '';
			displayedCount = value;
		} else if (selectedLokasi === 'tahun-asc') {
			sortOrder = 'asc';
		} else if (selectedLokasi === 'tahun-desc') {
			sortOrder = 'desc';
		}
	}

	function getLocation() {
		if ('geolocation' in navigator) {
			loading = true;

			// Set a timeout to handle cases where geolocation takes too long
			const timeoutId = setTimeout(() => {
				loading = false;
				alert('Pencarian lokasi terlalu lama. Silakan pilih lokasi secara manual.');
				selectedLokasi = ' ';
				userLocation = ' ';
			}, 10000); // 10 second timeout

			navigator.geolocation.getCurrentPosition(
				(position) => {
					clearTimeout(timeoutId); // Clear the timeout if we get a position
					console.log('Posisi ditemukan:', position.coords);
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					getCity(latitude, longitude);
				},
				(error) => {
					clearTimeout(timeoutId); // Clear the timeout on error
					loading = false;
					console.error('Error getting location:', error);

					let errorMessage = 'Tidak dapat mengakses lokasi Anda.';
					if (error.code === 1) {
						errorMessage = 'Akses lokasi ditolak. Mohon izinkan akses lokasi di browser Anda.';
					} else if (error.code === 2) {
						errorMessage = 'Lokasi tidak tersedia. Coba lagi nanti.';
					} else if (error.code === 3) {
						errorMessage = 'Waktu permintaan lokasi habis. Coba lagi.';
					}

					alert(errorMessage);
					selectedLokasi = ' ';
					userLocation = ' ';
				},
				{
					timeout: 8000, // Reduce timeout to 8 seconds
					enableHighAccuracy: false, // Low accuracy is faster
					maximumAge: 300000 // Allow cached location up to 5 minutes old
				}
			);
		} else {
			console.error('Geolocation is not supported by this browser.');
			alert(
				'Browser Anda tidak mendukung fitur lokasi. Gunakan browser lain atau pilih lokasi secara manual.'
			);
			selectedLokasi = ' ';
		}
	}

	async function getCity(lat: number, lon: number) {
		try {
			console.log(`Mencoba mendapatkan lokasi dengan koordinat: ${lat}, ${lon}`);

			// Use a faster geocoding API with a timeout
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&accept-language=id`,
				{ signal: controller.signal }
			);

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			loading = false;
			const data = await response.json();

			if (data && data.address) {
				userLocation =
					data.address.city ||
					data.address.town ||
					data.address.village ||
					data.address.county ||
					data.address.state ||
					data.address.region ||
					data.address.country ||
					'Tidak diketahui';

				console.log(`Lokasi ditemukan: ${userLocation}`);
				alert(`Mencari situs di daerah: ${userLocation}`);
				selectedDaerah = userLocation || '';
			} else {
				throw new Error('Tidak ada data alamat yang ditemukan');
			}
		} catch (error) {
			loading = false;
			console.error('Error saat fetching city data:', error);

			// Try backup API with shorter timeout
			try {
				const backupController = new AbortController();
				const backupTimeoutId = setTimeout(() => backupController.abort(), 4000);

				const backupResponse = await fetch(
					`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`,
					{ signal: backupController.signal }
				);

				clearTimeout(backupTimeoutId);

				if (backupResponse.ok) {
					const backupData = await backupResponse.json();
					userLocation =
						backupData.city ||
						backupData.locality ||
						backupData.principalSubdivision ||
						'Tidak diketahui';

					alert(`Mencari situs di daerah: ${userLocation}`);
					selectedDaerah = userLocation || '';
					return;
				}
			} catch (backupError) {
				console.error('API backup juga gagal:', backupError);
			}

			alert('Gagal mendapatkan informasi lokasi. Silakan pilih lokasi secara manual.');
			selectedLokasi = ' ';
			userLocation = ' ';
		}
	}

	function updateDisplayedCount() {
		displayedCount = value;
	}

	function updateFilteredData() {
		const filteredData = dataGet.filter((v: any) => {
			const isDaerahMatch = selectedDaerah
				? (v.region?.toLowerCase() || '').includes(selectedDaerah.toLowerCase())
				: true;
			const isKeywordMatch = v.nama_situs.toLowerCase().includes(keyword.toLowerCase());
			const isKategoriMatch = v.nama_situs.toLowerCase().includes(selectKategori.toLowerCase());
			const isKepemilikanMatch = v.pemilik_situs
				.toLowerCase()
				.includes(selectKepemilikan.toLowerCase());

			return isDaerahMatch && isKeywordMatch && isKategoriMatch && isKepemilikanMatch;
		});

		if (sortOrder === 'asc') {
			filteredData.sort((a: any, b: any) => Number(a.tahun_berdiri) - Number(b.tahun_berdiri));
		} else if (sortOrder === 'desc') {
			filteredData.sort((a: any, b: any) => Number(b.tahun_berdiri) - Number(a.tahun_berdiri));
		} else {
			filteredData;
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

{#if loading}
	<Loader text="Processing..."></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}

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

	<div class="ml-11 flex flex-col gap-y-2 lg:flex-row lg:justify-between lg:gap-y-0">
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
				<!-- <option value="era">Era</option>
				<option value="popularity">Popularity</option> -->
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
				<option value="">None</option>
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
				<option value="">None</option>
				<!-- Extract unique pemilik_situs values from the array -->
				{#if Array.isArray(dataGet) && dataGet.length > 0}
					{#each [...new Set(dataGet.map((item) => item.pemilik_situs).filter(Boolean))] as pemilik}
						<option value={pemilik}>{pemilik}</option>
					{/each}
				{/if}
			</select>
		</div>
		<!--  -->
		<div class="relative mr-11 flex items-center gap-x-2">
			<p>Daerah :</p>
			{#if (selectedDaerah === ' ' && userLocation === ' ') || (selectedDaerah !== ' ' && userLocation === ' ') || selectedDaerah === ' ' || userLocation === ''}
				<select
					bind:value={selectedDaerah}
					class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value="">None</option>
					{#if Array.isArray(dataGet) && dataGet.length > 0}
						{#each [...new Set(dataGet.map((item) => item.region).filter(Boolean))] as daerah}
							<option value={daerah}>{daerah}</option>
						{/each}
					{/if}
				</select>
			{:else if userLocation !== ' '}
				<select
					bind:value={userLocation}
					onchange={handleSortChange}
					disabled
					class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value="">None</option>
					{#if Array.isArray(dataGet) && dataGet.length > 0}
						{#each [...new Set(dataGet.map((item) => item.region).filter(Boolean))] as daerah}
							<option value={daerah}>{daerah}</option>
						{/each}
					{/if}
				</select>
			{/if}
		</div>
	</div>

	<div class="relative mb-20 ml-10 mr-10 mt-10 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2">
		{#each updateFilteredData().slice(0, displayedCount) as situs}
			<Cardshow
				judul={situs.nama_situs}
				lokasi={situs.region}
				gambar={situs.imageUrls}
				id={situs.id_situs}
				tahun={situs.tahun_berdiri}
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
