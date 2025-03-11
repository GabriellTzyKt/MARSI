<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import situs1 from '$lib/asset/kerajaan/situs1.png';
	import Card2 from '$lib/card2/Card2.svelte';

	let value = $state('Keterangan');
</script>

<Navbar></Navbar>

<section class="h-auto w-full bg-slate-200 py-5">
	<div class="mb-3 flex w-full flex-col items-end px-5">
		<p class="w-full text-center text-lg font-bold text-black">Situs Bersejarah</p>
		<div class="flex items-center space-x-2">
			<div class="relative">
				<select
					bind:value
					class="block w-full rounded border border-gray-300 bg-white pr-2 pl-4 py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option>Keterangan</option>
					<option>Opsi 1</option>
					<option>Opsi 2</option>
				</select>
			</div>

			<!-- Kotak Pencarian -->
			<div class="flex">
				<div class="relative">
					<input
						type="text"
						placeholder="Cari"
						class="block w-full rounded border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
					<span class="icon-park-twotone--search absolute right-2 top-2 text-gray-400"></span>
				</div>
			</div>
		</div>
	</div>

	<div class="ml-5 mr-5 flex justify-center">
		<div class="mx-auto grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1  gap-4">
			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
					Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
					wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
					pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
					menyegarkan."
				icon="air"
                id=1
			></Card2>

			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                    Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                    wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                    pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                    menyegarkan."
				icon="tempatIstirahat"
                id=2
			></Card2>

			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                    Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                    wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                    pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                    menyegarkan."
				icon="tempatBersejarah"
                id=3
			></Card2>

			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                    Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                    wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                    pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                    menyegarkan."
				icon="tempatIstirahat"
                id=4
			></Card2>

            <Card2
            situs={situs1}
            header="Keraton Surakarta Hadiningrat"
            isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                menyegarkan."
            icon="air"
            id=5
        ></Card2>

        <Card2
            situs={situs1}
            header="Keraton Surakarta Hadiningrat"
            isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                menyegarkan."
            icon="tempatBersejarah"
            id=6
        ></Card2>

        <Card2
            situs={situs1}
            header="Keraton Surakarta Hadiningrat"
            isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                menyegarkan."
            icon="air"
            id=7
        ></Card2>

        <Card2
            situs={situs1}
            header="Keraton Surakarta Hadiningrat"
            isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
                Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
                wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
                pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
                menyegarkan."
            icon="tempatIstirahat"
            id=8
        ></Card2>
		</div>
	</div>
</section>

<section class="flex h-fit min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	.icon-park-twotone--search {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cmask id='ipTSearch0'%3E%3Cg fill='none' stroke='%23fff' stroke-linejoin='round' stroke-width='4'%3E%3Cpath fill='%23555555' d='M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z'/%3E%3Cpath stroke-linecap='round' d='M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485'/%3E%3C/g%3E%3C/mask%3E%3C/defs%3E%3Cpath fill='%231b1b1b' d='M0 0h48v48H0z' mask='url(%23ipTSearch0)'/%3E%3C/svg%3E");
	}
</style>
