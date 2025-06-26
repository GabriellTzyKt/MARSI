<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import situs1 from '$lib/asset/kerajaan/situs1.png';
	import Card2 from '$lib/card2/Card2.svelte';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
</script>

<Navbar></Navbar>
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<section class="h-auto w-full bg-slate-200 py-5">
	<div class="mb-3 flex w-full flex-col px-5">
		<p class="w-full text-center text-lg font-bold text-black">Riwayat Acara</p>
		<div class="flex h-fit w-full justify-center lg:justify-end">
			<a
				href="/acara"
				class="my-2 flex items-center gap-2 rounded-full border-2 px-2 py-1 text-blue-500"
			>
				Lihat Semua
				<span class="fluent--arrow-right-12-filled"></span>
			</a>
		</div>
	</div>

	<div class="ml-5 mr-5 flex justify-center">
		<div class="mx-auto grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
					Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
					wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
					pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
					menyegarkan."
				icon=""
				id="1"
			></Card2>

			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                    Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                    wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                    pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                    menyegarkan."
				icon=""
				id="2"
			></Card2>

			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                    Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                    wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                    pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                    menyegarkan."
				icon=""
				id="3"
			></Card2>

			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                    Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                    wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                    pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                    menyegarkan."
				icon=""
				id="4"
			></Card2>

			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                menyegarkan."
				icon=""
				id="5"
			></Card2>

			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                menyegarkan."
				icon=""
				id="6"
			></Card2>

			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                menyegarkan."
				icon=""
				id="7"
			></Card2>

			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                menyegarkan."
				icon=""
				id="8"
			></Card2>
		</div>
	</div>
</section>

<section class="flex h-fit min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	.fluent--arrow-right-12-filled {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='%23007dff' d='M1.5 6a.75.75 0 0 1 .75-.75h5.94L6.22 3.28a.75.75 0 0 1 1.06-1.06l3.25 3.25a.75.75 0 0 1 0 1.06L7.28 9.78a.75.75 0 0 1-1.06-1.06l1.97-1.97H2.25A.75.75 0 0 1 1.5 6'/%3E%3C/svg%3E");
	}
</style>
