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
	let datasitus = data.data;

	// Gunakan state untuk tab aktif
	let activeTab = $state('organisasi');

	function setActive(tab: string) {
		activeTab = tab;
	}
</script>

<Navbar></Navbar>
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<section class="h-auto w-auto">
	<div class="flex flex-col items-center">
		<p class="mt-10 text-center text-2xl font-bold">Situs Bersejarah</p>
	</div>

	<div class="mb-10 ml-5 mr-5 mt-10 flex h-full justify-center">
		{#if datasitus}
			<div
				class="mx-auto grid grid-flow-row auto-rows-auto gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
			>
				{#each datasitus as item}
					<div class="h-auto">
						<Card2
							situs={item.imageUrls[0] || ''}
							header={item.nama_situs}
							isi={item.deskripsi_situs || 'No Description'}
							icon={item.jenis_situs}
							id={item.id_situs}
							href={`/situs/${item.id_situs}`}
						/>
					</div>
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
