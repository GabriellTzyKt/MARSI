<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import gambarAtas from '$lib/asset/kerajaan/image.svg';
	import gambar2 from '$lib/asset/kerajaan/gambar2.png';
	import gambar3 from '$lib/asset/kerajaan/gambar3.png';
	import gambar4 from '$lib/asset/kerajaan/gambar4.png';
	import gambarAbout1 from '$lib/asset/kerajaan/aboutUs1.png';
	import gambarAbout2 from '$lib/asset/kerajaan/aboutUs2.png';
	import gambarAbout3 from '$lib/asset/kerajaan/aboutUs3.png';
	import situs1 from '$lib/asset/kerajaan/situs1.png';
	import CardAbout from '$lib/card1/CardAbout.svelte';
	import Card2 from '$lib/card2/Card2.svelte';
	import Card3 from '$lib/card3/Card3.svelte';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
</script>

<Navbar></Navbar>
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<!-- 1  -->
<section class="h-fit w-full">
	<div class="relative">
		<img src={gambarAtas} alt="" class="min-h-screen w-full object-cover" />
		<div class="absolute top-[35%] flex h-full w-full flex-col text-center lg:top-[25%]">
			<p class="items-center text-white sm:text-2xl md:text-8xl">Maha Menteri</p>
			<div>
				<p class="mt-4 items-center text-2xl text-white lg:text-8xl">Keraton Surakarta</p>
				<p class="mt-4 items-center text-2xl text-white">
					Deskripsi singkat mengenai Maha Menteri Keraton Surakarta
				</p>
				<p class="mt-12 text-2xl text-white">Acara Mendatang</p>
				<div class="mt-4 flex justify-center gap-1 lg:gap-4">
					<span class="gg--arrow-left-o self-center"></span>
					<img src={gambar2} class="h-20 w-auto rounded-lg object-cover lg:h-40" alt="" />
					<img src={gambar3} class="h-20 w-auto rounded-lg object-cover lg:h-40" alt="" />
					<img src={gambar4} class="h-20 w-auto rounded-lg object-cover lg:h-40" alt="" />
					<span class="gg--arrow-right-o self-center"></span>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- 2 -->
<section class="h-auto w-full bg-slate-200 py-5">
	<p class="mb-5 py-5 text-center text-2xl font-bold text-blue-500">Tentang Keraton Solo</p>
	<div class="flex justify-center">
		<div class="mx-auto grid grid-cols-1 gap-2 p-5 lg:grid-cols-3">
			<!-- Grid item 1 -->
			<CardAbout
				gambarAbout={gambarAbout1}
				isiAbout="Keraton Surakarta Hadiningrat adalah istana resmi Kesultanan Surakarta, yang didirikan
                oleh Paku Buwono II pada tahun 1745. Terletak di kota Surakarta, Jawa Tengah, keraton ini merupakan
                salah satu pusat kebudayaan Jawa dan simbol dari keberlanjutan tradisi kerajaan di Indonesia. Selain 
                sebagai kediaman resmi raja-raja Surakarta, keraton juga berfungsi sebagai pusat spiritual, sosial, 
                dan budaya, serta menyimpan berbagai artefak bersejarah yang berkaitan dengan sejarah kerajaan dan tradisi Jawa."
				warna="blue"
			></CardAbout>

			<!-- Grid item 2 -->
			<CardAbout
				gambarAbout={gambarAbout2}
				isiAbout="Keraton Surakarta Hadiningrat adalah istana resmi Kesultanan Surakarta, yang didirikan
						oleh Paku Buwono II pada tahun 1745. Terletak di kota Surakarta, Jawa Tengah, keraton
						ini merupakan salah satu pusat kebudayaan Jawa dan simbol dari keberlanjutan tradisi
						kerajaan di Indonesia. Selain sebagai kediaman resmi raja-raja Surakarta, keraton juga
						berfungsi sebagai pusat spiritual, sosial, dan budaya, serta menyimpan berbagai artefak
						bersejarah yang berkaitan dengan sejarah kerajaan dan tradisi Jawa."
				warna="red"
			></CardAbout>

			<!-- Grid item 3 -->
			<CardAbout
				gambarAbout={gambarAbout3}
				isiAbout="Keraton Surakarta memiliki jumlah abdi yang sangat banyak, mencakup berbagai peran dan
						tingkatan dalam struktur keraton. Beberapa di antaranya bahkan berasal dari mancanegara,
						yang menunjukkan daya tarik dan nilai historis tradisi keraton. Keberadaan abdi dari
						luar negeri ini mencerminkan komitmen internasional dalam melestarikan dan mempelajari
						warisan budaya yang kaya dan beragam di Surakarta."
				warna="yellow"
			></CardAbout>
		</div>
	</div>
</section>

<!-- 3 -->
<section class="h-auto w-full bg-slate-200 py-5">
	<div class="mb-3 flex w-full items-center justify-between px-5">
		<p class="w-full items-center self-center text-lg font-bold text-blue-500">Situs Bersejarah</p>
		<div class="flex h-fit w-full justify-center md:justify-end">
			<a
				href="/situs"
				class="my-2 flex items-center gap-2 rounded-full border-2 px-2 py-1 text-blue-500"
			>
				Lihat Semua
				<span class="fluent--arrow-right-12-filled"></span>
			</a>
		</div>
	</div>
	<!-- Situs -->
	<div class="ml-5 mr-5 flex justify-center">
		<div class="mx-auto grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
					Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
					wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
					pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
					menyegarkan."
				icon=""
				id="0"
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
				id="0"
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
				id="0"
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
				id="0"
			></Card2>
		</div>
	</div>
</section>

<!-- 4 -->
<section class="h-auto w-full bg-slate-200 py-5">
	<div class="mb-3 flex w-full items-center justify-between px-5">
		<p class="w-full items-center self-center text-lg font-bold text-blue-500">Acara</p>
		<div class="flex h-fit w-full justify-center md:justify-end">
			<a
				href="/acara"
				class="my-2 flex items-center gap-2 rounded-full border-2 px-2 py-1 text-blue-500"
			>
				Lihat Semua
				<span class="fluent--arrow-right-12-filled"></span>
			</a>
		</div>
	</div>
	<!-- Situs -->
	<div class="ml-5 mr-5 flex justify-center">
		<div class="mx-auto grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			<Card2
				situs={situs1}
				header="Keraton Surakarta Hadiningrat"
				isi="Umbul Tirtomulyo adalah sebuah mata air alami yang terletak di Surakarta, Jawa Tengah.
					Dikenal karena kejernihan airnya yang memukau, tempat ini menjadi salah satu tujuan
					wisata populer bagi penduduk lokal maupun wisatawan. Dengan suasana yang tenang dan
					pemandangan alam yang indah, Umbul Tirtomulyo menawarkan pengalaman rekreasi yang
					menyegarkan."
				icon=""
				id="0"
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
				id="0"
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
				id="0"
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
				id="0"
			></Card2>
		</div>
	</div>
</section>

<!-- 5 -->
<section class="h-auto w-full bg-slate-200 py-5">
	<div class="mb-3 flex w-full items-center justify-between px-5">
		<p class=" w-full items-center self-center text-lg font-bold text-blue-500">Organisasi</p>
		<div class="flex h-fit w-full justify-center md:justify-end">
			<a
				href="/kelompok"
				class="my-2 flex items-center gap-2 rounded-full border-2 px-2 py-1 text-blue-500"
			>
				Lihat Semua
				<span class="fluent--arrow-right-12-filled"></span>
			</a>
		</div>
	</div>
	<div class="ml-5 mr-5">
		<div class="mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			<Card3 gambar={situs1} header="Putri Narpo Wandowo"></Card3>

			<Card3 gambar={situs1} header="Putri Narpo Wandowo"></Card3>

			<Card3 gambar={situs1} header="Putri Narpo Wandowo"></Card3>

			<Card3 gambar={situs1} header="Putri Narpo Wandowo"></Card3>
		</div>
	</div>
</section>

<!-- 6 -->
<section class="h-auto w-full bg-slate-200 py-5">
	<div class="mb-3 flex w-full items-center justify-between px-5">
		<p class=" w-full items-center self-center text-lg font-bold text-blue-500">Komunitas</p>
		<div class="flex h-fit w-full justify-center md:justify-end">
			<a
				href="/kelompok"
				class="my-2 flex items-center gap-2 rounded-full border-2 px-2 py-1 text-blue-500"
			>
				Lihat Semua
				<span class="fluent--arrow-right-12-filled"></span>
			</a>
		</div>
	</div>
	<div class="ml-5 mr-5">
		<div class="mx-auto grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
			<Card3 gambar={situs1} header="Putri Narpo Wandowo"></Card3>

			<Card3 gambar={situs1} header="Putri Narpo Wandowo"></Card3>

			<Card3 gambar={situs1} header="Putri Narpo Wandowo"></Card3>

			<Card3 gambar={situs1} header="Putri Narpo Wandowo"></Card3>
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

	.gg--arrow-left-o {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fffefb'%3E%3Cpath d='m11.948 14.829l-1.414 1.414L6.29 12l4.243-4.243l1.414 1.415L10.12 11h7.537v2H10.12z'/%3E%3Cpath fill-rule='evenodd' d='M4.222 19.778c-4.296-4.296-4.296-11.26 0-15.556s11.26-4.296 15.556 0s4.296 11.26 0 15.556s-11.26 4.296-15.556 0m1.414-1.414A9 9 0 1 1 18.364 5.636A9 9 0 0 1 5.636 18.364' clip-rule='evenodd'/%3E%3C/g%3E%3C/svg%3E");
	}

	.gg--arrow-right-o {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fffefb'%3E%3Cpath d='m12.052 14.829l1.414 1.414L17.71 12l-4.243-4.243l-1.414 1.415L13.88 11H6.343v2h7.537z'/%3E%3Cpath fill-rule='evenodd' d='M19.778 19.778c4.296-4.296 4.296-11.26 0-15.556s-11.26-4.296-15.556 0s-4.296 11.26 0 15.556s11.26 4.296 15.556 0m-1.414-1.414A9 9 0 1 0 5.636 5.636a9 9 0 0 0 12.728 12.728' clip-rule='evenodd'/%3E%3C/g%3E%3C/svg%3E");
	}
</style>
