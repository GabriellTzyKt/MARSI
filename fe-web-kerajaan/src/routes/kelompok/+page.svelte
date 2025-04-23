<script lang="ts">
	import Card2 from '$lib/card2/Card2.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import situs1 from '$lib/asset/kerajaan/situs1.png';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';

	const events = [
		{
			id: 1,
			header: 'Keraton Surakarta Hadiningrat',
			isi: `Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
				  Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
				  wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
				  pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
				  menyegarkan. In the name of the wind`,
			situs: situs1,
			status: 'organisasi'
		},
		{
			id: 2,
			header: 'Candi Prambanan',
			isi: `Candi Prambanan adalah kompleks candi Hindu terbesar di Indonesia dan diakui
				  sebagai situs warisan dunia UNESCO. Tempat ini menawarkan sejarah dan keindahan
				  arsitektur yang memukau.`,
			situs: situs1,
			status: 'komunitas'
		},
		{
			id: 3,
			header: 'Keraton Surakarta Hadiningrat',
			isi: `Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
				  Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
				  wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
				  pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
				  menyegarkan.`,
			situs: situs1,
			status: 'organisasi'
		},
		{
			id: 4,
			header: 'Candi Borobudur',
			isi: `Candi Borobudur merupakan candi Buddha terbesar di dunia dan menjadi ikon
				  kebudayaan Indonesia. Tempat ini tidak hanya menawarkan nilai sejarah tetapi juga
				  pemandangan alam yang luar biasa.`,
			situs: situs1,
			status: 'komunitas'
		}
	];

	let activeTab = $state('organisasi');

	function setActive(tab: string) {
		activeTab = tab;
	}

	let filteredData = $derived(events.filter((event) => event.status == activeTab));

	$inspect(activeTab);
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

			<!-- Tombol 'Selesai' -->
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
		<div class="mx-auto grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			{#each filteredData as event}
				<Card2 situs={event.situs} header={event.header} isi={event.isi} icon="" id={event.id} />
			{/each}
		</div>
	</div>
</section>

<section class="flex h-fit min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
</style>
