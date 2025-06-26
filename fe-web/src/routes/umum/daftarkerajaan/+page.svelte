<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../nav/Navbar.svelte';
	import gambarHeader from '../../../asset/umum/keraton 2.png';
	import Cardshow from '../Cardshow.svelte';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import gambarDefault from '../../../asset/noimage.jpeg';

	let value = $state<number>(6);
	let selectedDaerah = $state<string>('');
	let selectTipe = $state<string>('');
	// $inspect(selectedDaerah)
	let displayedCount = $state<number>(6);
	let keyword = $state('');
	let loading = $state(false);

	let selectedLokasi: string = $state('');
	let sortOrder: string = $state('');

	let latitude: number | null = null;
	let longitude: number | null = null;
	let userLocation: string | null = $state(' ');

	const { data } = $props();
	console.log('Data yang diterima ( Umum Kerajaan ):', data);
	const dataGet = data.detil_kerajaan;

	function handleSortChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		selectedLokasi = target.value;

		if (selectedLokasi === 'lokasi') {
			// Reset nilai sebelum mencoba mendapatkan lokasi baru
			userLocation = ' ';
			selectedDaerah = '';

			// Tampilkan pesan loading
			// alert("Mencari lokasi Anda... Mohon izinkan akses lokasi jika diminta.");

			getLocation();
		} else if (selectedLokasi === ' ') {
			selectedDaerah = '';
			userLocation = ' ';
			sortOrder = ' ';
			selectTipe = '';
			displayedCount = value;
		} else if (selectedLokasi === 'tahun-asc') {
			sortOrder = 'asc';
		} else if (selectedLokasi === 'tahun-desc') {
			sortOrder = 'desc';
		}
	}

	// pakai API Geolocation untuk dapet latitude longitude
	function getLocation() {
		if ('geolocation' in navigator) {
			// Tampilkan pesan loading
			// alert("Mencari lokasi Anda... Mohon izinkan akses lokasi jika diminta.");
			loading = true;

			navigator.geolocation.getCurrentPosition(
				(position) => {
					console.log('Posisi ditemukan:', position.coords);
					latitude = position.coords.latitude;
					longitude = position.coords.longitude;
					getCity(latitude, longitude);
					loading = false;
				},
				(error) => {
					// Log error lengkap untuk debugging
					console.error('Error getting location:', error);

					// Tampilkan pesan error yang sesuai
					let errorMessage = 'Tidak dapat mengakses lokasi Anda.';

					if (error.code === 1) {
						errorMessage = 'Akses lokasi ditolak. Mohon izinkan akses lokasi di browser Anda.';
					} else if (error.code === 2) {
						errorMessage = 'Lokasi tidak tersedia. Coba lagi nanti.';
					} else if (error.code === 3) {
						errorMessage = 'Waktu permintaan lokasi habis. Coba lagi.';
					}

					alert(errorMessage);

					// Reset nilai lokasi
					selectedLokasi = ' ';
					userLocation = ' ';
				},
				{
					timeout: 15000, // Tambah timeout menjadi 15 detik
					enableHighAccuracy: false, // Coba dengan akurasi rendah dulu
					maximumAge: 60000 // Izinkan cache lokasi selama 1 menit
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

			// pakai bantuan API dari openstreetmap untuk mendapat lokasi
			const response = await fetch(
				`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10&accept-language=id`
			);

			if (!response.ok) {
				console.error(`HTTP error! Status: ${response.status}, Text: ${await response.text()}`);
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			loading = false;
			const data = await response.json();
			console.log('Data lokasi yang diterima:', data);

			if (data && data.address) {
				// Coba dapatkan lokasi dengan prioritas yang lebih luas
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
				alert(`Mencari kerajaan di daerah: ${userLocation}`);
				selectedDaerah = userLocation || '';
			} else {
				console.error('Tidak ada data alamat yang ditemukan dalam respons:', data);
				throw new Error('Tidak ada data alamat yang ditemukan');
			}
		} catch (error) {
			console.error('Error lengkap saat fetching city data:', error);

			// Coba gunakan API alternatif jika OpenStreetMap gagal
			try {
				console.log('Mencoba API alternatif...');
				const backupResponse = await fetch(
					`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`
				);

				if (backupResponse.ok) {
					const backupData = await backupResponse.json();
					console.log('Data dari API backup:', backupData);

					userLocation =
						backupData.city ||
						backupData.locality ||
						backupData.principalSubdivision ||
						'Tidak diketahui';

					alert(`Mencari kerajaan di daerah: ${userLocation}`);
					selectedDaerah = userLocation || '';
					return;
				}
			} catch (backupError) {
				console.error('API backup juga gagal:', backupError);
			}

			alert('Gagal mendapatkan informasi lokasi. Silakan pilih lokasi secara manual.');

			// Reset nilai lokasi jika gagal
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
			const isKeywordMatch = v.nama_kerajaan.toLowerCase().includes(keyword.toLowerCase());
			const isTipeMatch = v.nama_kerajaan.toLowerCase().includes(selectTipe.toLowerCase());

			return isDaerahMatch && isKeywordMatch && isTipeMatch;
		});

		// kalau hasilnya > 0 maka swap
		if (sortOrder === 'asc') {
			filteredData.sort((a: any, b: any) => {
				const yearA = a.tanggal_berdiri ? new Date(a.tanggal_berdiri).getFullYear() : 0;
				const yearB = b.tanggal_berdiri ? new Date(b.tanggal_berdiri).getFullYear() : 0;
				return yearA - yearB;
			});
			// kalau hasilnya < 0 maka swap
		} else if (sortOrder === 'desc') {
			filteredData.sort((a: any, b: any) => {
				const yearA = a.tanggal_berdiri ? new Date(a.tanggal_berdiri).getFullYear() : 0;
				const yearB = b.tanggal_berdiri ? new Date(b.tanggal_berdiri).getFullYear() : 0;
				return yearB - yearA;
			});
		}

		console.log('Filtered Data:', filteredData);
		return filteredData;
	}

	function loadMore() {
		displayedCount += value;
		console.log(displayedCount);
	}
</script>

{#if loading}
	<Loader text="Processing..."></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}

<Navbar></Navbar>

<section class="relative">
	<div class="relative h-screen w-full">
		<img src={gambarHeader} alt="" class="h-screen w-screen" />
		<p
			class="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-6xl font-bold text-black"
		>
			Daftar Kerajaan
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
		<div class="relative flex items-center gap-x-2">
			<p>Jenis Kerajaan :</p>
			<select
				id="sortSelect"
				bind:value={selectTipe}
				class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
			>
				<option value="">None</option>
				<option value="kerajaan">Kerajaan</option>
				<option value="kekaisaran">Kekaisaran</option>
				<option value="kesultanan">Kesultanan</option>
				<option value="kadipaten">Kadipaten</option>
				<option value="kasunanan">Kasunanan</option>
				<option value="keprabuan">Keprabuan</option>
				<option value="keratuan">Keratuan</option>
				<option value="dinasti">Dinasti</option>
			</select>
		</div>
		<div class="relative mr-11 flex items-center gap-x-2">
			<p>Daerah :</p>
			{#if (selectedDaerah === ' ' && userLocation === ' ') || (selectedDaerah !== ' ' && userLocation === ' ') || selectedDaerah === ' '}
				<select
					bind:value={selectedDaerah}
					class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value="">None</option>
					{#each Array.from(new Set(dataGet.map((item) => item.region))) as region}
						<option value={region}>{region}</option>
					{/each}
					<option value="surabaya">Surabaya</option>
				</select>
			{:else if userLocation !== ' '}
				<select
					bind:value={userLocation}
					onchange={handleSortChange}
					disabled
					class="h-[40px] w-fit rounded border border-gray-300 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value="">None</option>
					<option value="surakarta">Surakarta</option>
					<option value="yogyakarta">Yogyakarta</option>
					<option value="Surabaya">Surabaya</option>
				</select>
			{/if}
		</div>
	</div>

	<div class="relative mb-20 ml-10 mr-10 mt-10 grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2">
		{#each updateFilteredData().slice(0, displayedCount) as situs}
			<Cardshow
				judul={situs.nama_kerajaan}
				lokasi={situs.region}
				gambar={situs.imageUrl && situs.imageUrl.length > 0 ? situs.imageUrl : [gambarDefault]}
				id={situs.id_kerajaan}
				tahun={situs.tanggal_berdiri ? new Date(situs.tanggal_berdiri).getFullYear() : ''}
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
