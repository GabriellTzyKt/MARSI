<script lang="ts">
	import Card2 from '$lib/card2/Card2.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import situs1 from '$lib/asset/kerajaan/situs1.png'; // Tetap sebagai fallback image
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';

	// Ambil data dari server
	let { data } = $props();
	console.log('Data dari server:', data);

	// Gunakan state untuk tab aktif
	let activeTab = $state('organisasi');

	function setActive(tab: string) {
		activeTab = tab;
	}

	// Filter data berdasarkan tab aktif dengan pengecekan data
	let filteredData = $derived(() => {
		// Pastikan data dan properti yang dibutuhkan tersedia
		if (!data) return [];

		if (activeTab === 'organisasi') {
			return data.organisasi
				? data.organisasi.map((org) => ({
						id: org.id_organisasi,
						header: org.nama_organisasi || 'Organisasi',
						isi: org.deskripsi || 'Tidak ada deskripsi',
						situs: org.profileUrl || situs1,
						status: 'organisasi'
					}))
				: [];
		} else {
			return data.komunitas
				? data.komunitas.map((kom) => ({
						id: kom.id_komunitas,
						header: kom.nama_komunitas || 'Komunitas',
						isi: kom.deskripsi || 'Tidak ada deskripsi',
						situs: kom.profileUrl || situs1,
						status: 'komunitas'
					}))
				: [];
		}
	});
</script>

<Navbar></Navbar>
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<section class="h-auto w-auto">
	<div class="flex flex-col items-center">
		<p class="mt-10 text-center text-2xl font-bold">Kelompok</p>
		<div class="mt-2 flex gap-2 rounded-full border-2 px-5 py-2">
			<button
				onclick={() => setActive('organisasi')}
				class="relative overflow-hidden rounded-full border-2 px-5 py-1 font-semibold"
			>
				<span
					class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
					style:width={activeTab === 'organisasi' ? '100%' : '0%'}
				></span>
				<span
					class="relative z-10 transition-colors duration-300"
					class:text-white={activeTab === 'organisasi'}
					class:text-blue-600={activeTab !== 'organisasi'}
				>
					Organisasi
				</span>
			</button>

			<!-- Tombol 'Komunitas' -->
			<button
				onclick={() => setActive('komunitas')}
				class="relative overflow-hidden rounded-full border-2 px-5 py-1 font-semibold"
			>
				<span
					class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
					style:width={activeTab === 'komunitas' ? '100%' : '0%'}
				></span>
				<span
					class="relative z-10 transition-colors duration-300"
					class:text-white={activeTab === 'komunitas'}
					class:text-blue-600={activeTab !== 'komunitas'}
				>
					Komunitas
				</span>
			</button>
		</div>
	</div>

	<div class="mb-10 ml-5 mr-5 mt-10 flex justify-center">
		{#if !data || (!data.organisasi && !data.komunitas)}
			<div class="text-center">
				<p>Memuat data...</p>
			</div>
		{:else if filteredData().length === 0}
			<div class="text-center">
				<p>Tidak ada data</p>
			</div>
		{:else}
			<div class="mx-auto grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
				{#each filteredData() as item}
					<Card2
						situs={item.situs}
						header={item.header}
						isi={item.isi}
						icon=""
						id={item.id}
						href={`/kelompok/${item.id}`}
					/>
				{/each}
			</div>
		{/if}
	</div>
</section>

<section class="flex h-fit min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
</style>
