<script lang="ts">
	import bgTemp from '../../../asset/bg_webumum.png';
	import Flipcard from '../Flipcard.svelte';
	import Mapicon from '../Mapicon.svelte';
	import kerajaan1 from '../../../asset/umum/kerajaan_1.png';
	import kerajaan2 from '../../../asset/umum/kerajaan_2.png';
	import kerajaan3 from '../../../asset/umum/kerajaan_3.png';
	import candi from '../../../asset/umum/candi.png';
	import candi2 from '../../../asset/umum/candi2.png';
	import gbr from '../../../asset/umum/gbr.png';
	import Footer from '../../../lib/footer/Footer.svelte';
	import gambar1 from '../../../asset/umum/img_1.png';
	import gambar2 from '../../../asset/umum/img_2.png';
	import gambar3 from '../../../asset/umum/img_3.png';
	import gambar4 from '../../../asset/umum/img_4.png';
	import gambar5 from '../../../asset/umum/image-bg.png';
	let hoveredIcons = new Set();
</script>

<!-- Section 1 -->
<section class="relative overflow-x-hidden">
    <div class=" min-w-screen bg-umum flex flex-col items-center justify-center min-h-screen">
        <div class="text-center">
            <p class="mt-20 text-5xl font-[600]">MAJELIS AGUNG RAJA SULTAN INDONESIA</p>
        </div>
        <div class="relative mt-10 w-full">
            <img src={bgTemp} class="w-auto h-auto mb-10 mr-10 mt-10" alt="" />

            <Mapicon
                id="icon1"
                text="Keraton Kasunanan Surakarta"
                location="Surakarta, Jawa Tengah"
                link="#"
                position="absolute top-[20%] left-[20%] translate-x-[-50%] translate-y-[-50%]"
                {hoveredIcons}
            ></Mapicon>

            <Mapicon
                id="icon2"
                text="Keraton Kasunanan Surakarta"
                location="Surakarta, Jawa Tengah"
                link="#"
                position="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                {hoveredIcons}
            ></Mapicon>

            <Mapicon
                id="icon3"
                text="Keraton Kasunanan Surakarta"
                location="Surakarta, Jawa Tengah"
                link="#"
                position="absolute bottom-[20%] right-[20%] translate-x-[-50%] translate-y-[-50%]"
                {hoveredIcons}
            ></Mapicon>
        </div>
    </div>
</section>



<!-- Section 2 -->
<section
	class=" relative mb-20 h-[100%] w-[100%] overflow-hidden bg-cover bg-center p-5"
	style:background-image="url('{gambar5}')"
>
	<div class=" grid grid-cols-1 md:grid-cols-2 items-center justify-center">
		<div class="mb-10 ml-10 mt-10 grid grid-cols-3 grid-rows-[auto_auto_1fr] gap-1">
			<img src={gambar1} alt="dor" class="col-span-1 row-span-2 h-full object-cover" />
			<img src={gambar2} class="col-span-2 row-span-1 h-[205px] object-cover" alt="dor" />
			<img src={gambar3} class="col-span-2 row-span-1 h-[172px] object-cover" alt="dor" />
			<img src={gambar4} class="col-span-3 h-auto max-h-60 lg:w-[93%] w-[100%] object-cover" alt="dordordor" />
		</div>

		<div class="ms-30 max-w-full break-words text-center p-4 lg:text-left lg:mr-10 lg:mb-0 mb-10">
			<p class="mb-4 text-4xl font-[500]">Tentang Kami</p>
			<p>
				Majelis Agung Raja Sultan Indonesia (MARSI) adalah sebuah organisasi yang menghimpun
				raja-raja dan sultan-sultan dari berbagai keraton dan kerajaan di Indonesia. Organisasi ini
				bertujuan untuk menjaga dan melestarikan nilai-nilai budaya, tradisi, dan adat istiadat yang
				berasal dari keraton-keraton Nusantara.
			</p>
		</div>
	</div>
</section>

<!-- Section 3 + 4 -->
<section class="relative">
	<div class="waves_a rotate-180">
		<svg
			data-name="Layer 1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
		>
			<path
				d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
				class="shape-fill"
			></path>
		</svg>
	</div>
	<div class="bg-umum relative pb-10">
		<div class="grid grid-cols-1 md:grid-cols-2 items-center justify-center">
			<div class="m-4 text-center">
				<img src={candi} alt="" />
			</div>
			<div class="me-30 md:me-60 max-w-full break-words p-4 text-center lg:text-left">
				<p class="mb-4 text-4xl font-[500]">Kerajaan di Indonesia</p>
				<p>
					Kerajaan-kerajaan yang berdiri di Indonesia berjumlah ratusan. Majelis Agung Raja Sultan
					Indonesia (MARSI) sendiri merupakan sebuah organisasi yang beranggotakan para Raja beserta
					dengan Kerajaannya. Anggota MARSI tersebar dari sabang hingga merauke. Melalui laman ini,
					anda dapat memperkaya pengetahuan anda mengenai ratusan kerajaan yang berdiri di
					Indonesia.
				</p>
				<div class="flex justify-center lg:justify-start">
					<a href="/" class="my-2 flex items-center gap-2 rounded-full px-5 py-3 text-orange-500">
						Selengkapnya
						<span class="gg--arrow-right-o"></span>
					</a>
				</div>
			</div>
		</div>

		<p class="mb-10 mt-20 text-center text-6xl font-semibold">Beberapa Kerajaan Di Indonesia</p>
		<div class="flex flex-wrap justify-center gap-x-10 gap-y-4">
			<Flipcard
				gambar={kerajaan1}
				kerajaan="Keraton Surakarta Kasunanan"
				judul="Uvuvwevwevwe"
				lokasi="Surakarta, Jawa Tengah"
				isi="ugwebmubwim osas"
			></Flipcard>
			<Flipcard
				gambar={kerajaan2}
				kerajaan="Kesultanan Ngayogyakarta Hadiningrat"
				judul="Uvuvwevwevwe"
				lokasi="Yogyakarta, Jawa Tengah"
				isi="ugwebmubwim osas"
			></Flipcard>
			<Flipcard
				gambar={kerajaan3}
				kerajaan="Kesultanan Cirebon"
				judul="Uvuvwevwevwe"
				lokasi="Cirebon, Jawa Barat"
				isi="ugwebmubwim osas"
			></Flipcard>
		</div>
	</div>
</section>

<!-- Section 5 -->
<section class="relative">
	<section class="relative bg-white pb-10 pt-10">
		<div class="grid grid-cols-1 md:grid-cols-2 items-center justify-center">
			<div class=" max-w-full break-words p-4 text-center lg:text-right">
				<p class="mb-4 text-4xl font-[500]">Situs Bersejarah Kerajaan</p>
				<p class=" min-w-screen lg:ml-auto lg:w-[80%]">
					Dari banyaknya kerajaan yang berdiri dan tersebar di seluruh penjuru nusantara, semua
					pasti memiliki situs bersejarahnya masing-masing. Mulai dari bangunan, situs khusus,
					ataupun yang hanya dalam bentuk struktur. Di laman ini, anda dapat mengakses secara
					lengkap mengenai informasi seputar situs-situs bersejarah dari ratusan kerajaan yang
					tentunya sangat menarik untuk anda lihat!
				</p>
				<div class="flex min-w-screen lg:w-full justify-self-center">
					<a
						href="/"
						class="my-2 lg:ml-auto flex items-center gap-2 rounded-full px-5 py-3 text-orange-500"
					>
						Selengkapnya
						<span class="gg--arrow-right-o"></span>
					</a>
				</div>
			</div>
			<div class="m-4 text-center">
				<img src={candi2} alt="" />
			</div>
		</div>
	</section>
</section>

<!-- Section 6 -->
<section class="relative">
	<div class="waves_a my-rotate-x-180">
		<svg
			data-name="Layer 1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
		>
			<path
				d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
				class="shape-fill"
			></path>
		</svg>
	</div>

	<div class="bg-umum relative mt-10 grid grid-cols-1 md:grid-cols-2 items-center justify-center">
		<div class="m-4">
			<img src={gbr} class="mt-20" alt="" />
		</div>
		<div class="mr-4 ms-4 md:mr-20 md:ms-40 flex max-w-full flex-col break-words p-4 text-center lg:text-right">
			<p class="mb-4 text-4xl font-[500]">Aset Bersejarah Kerajaan</p>
			<p>
				Kerajaan yang telah berdiri sejak lama tentu memiliki aset yang senantiasa dijaga. Ada aset
				yang berupa benda (contohnya keris), lalu juga ada aset yang berupa takbenda (contohnya
				tarian). Tentu aset-aset tersebut memiliki nilai sejarah yang sangat tinggi dan pastinya
				akan sangat menarik untuk anda lihat dan pelajari melalui laman berikut!
			</p>
			<div class="flex w-full justify-center lg:justify-end">
				<a
					href="/"
					class="my-2 flex items-center gap-2 rounded-full px-5 py-3 text-orange-500"
				>
					Selengkapnya
					<span class="gg--arrow-right-o"></span>
				</a>
			</div>
		</div>
	</div>
</section>

<!-- Section 7  -->
<div class="mb-10 mt-20">
	<section class="relative">
		<section class="relative bg-white pb-10">
			<div class="grid grid-cols-1 md:grid-cols-2 items-center justify-center">
				<div class="max-w-full break-words p-4 lg:text-right text-center item-center">
					<p class="mb-5 mt-5">SOROTAN ACARA</p>
					<p class="mb-5 lg:ms-40 text-4xl font-[500]">
						Pengukuhan Majelis Agung Raja Sultan Indonesia
					</p>
					<p class="mb-2 lg:ml-auto lg:w-[70%] w-[100%] items-center">
						Kementrian Dalam Negeri (Kemendagri) mengukuhkan Majelis Agung Raja Sultan (MARS)
						Indonesia di Kantor Kemendagri, Medan Merdeka Utara, Jakarta Pusat, Kamis (24/8/2017).
					</p>
					<div class="flex w-full justify-center lg:justify-end">
						<a href="/" class="my-2 flex items-center gap-2 rounded-full px-5 py-3">
							Lihat Selengkapnya
							<span class="prime--arrow-right"></span>
						</a>
					</div>
				</div>
				<div class="m-4 flex items-center justify-center lg:mr-20 lg:-mx-20">
					<img src={gambar2} alt="" class="h-[300px] w-[450px]" />
				</div>
			</div>
		</section>
	</section>
</div>

<!-- Footer -->
<section>
	<Footer></Footer>
</section>

<style>
	.prime--arrow-right {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M13 18.75a.74.74 0 0 1-.53-.22a.75.75 0 0 1 0-1.06L17.94 12l-5.47-5.47a.75.75 0 0 1 1.06-1.06l6 6a.75.75 0 0 1 0 1.06l-6 6a.74.74 0 0 1-.53.22'/%3E%3Cpath fill='%23000' d='M19 12.75H5a.75.75 0 0 1 0-1.5h14a.75.75 0 0 1 0 1.5'/%3E%3C/svg%3E");
	}
	.gg--arrow-right-o {
		display: inline-block;
		width: 40px;
		height: 40px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23ff9400'%3E%3Cpath d='m12.052 14.829l1.414 1.414L17.71 12l-4.243-4.243l-1.414 1.415L13.88 11H6.343v2h7.537z'/%3E%3Cpath fill-rule='evenodd' d='M19.778 19.778c4.296-4.296 4.296-11.26 0-15.556s-11.26-4.296-15.556 0s-4.296 11.26 0 15.556s11.26 4.296 15.556 0m-1.414-1.414A9 9 0 1 0 5.636 5.636a9 9 0 0 0 12.728 12.728' clip-rule='evenodd'/%3E%3C/g%3E%3C/svg%3E");
	}
	.bg-umum {
		background-color: #ffeec5;
	}

	.waves_a {
		position: absolute;
		margin-top: -205px;
		top: 0;
		left: 0;
		width: 100%;
		overflow: hidden;
		line-height: 0;
	}

	.waves_a svg {
		position: relative;
		display: block;
		width: calc(160% + 1.3px);
		height: 210px;
	}

	.waves_a .shape-fill {
		fill: #ffeec5;
	}

	section {
		margin-top: 0;
		padding-top: 0;
	}
</style>
