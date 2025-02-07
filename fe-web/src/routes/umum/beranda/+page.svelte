<script lang="ts">
	import bgTemp from '../../../asset/bg_webumum.png';
	import candi from '../../../asset/umum/candi.png';
	import Hover from '../Hoverpopup.svelte';
	import candi1 from '../../../asset/umum/candi2.png';
	import gbr from '../../../asset/umum/gbr.png';
	import Footer from '../../../lib/footer/Footer.svelte';

	let isHovered = $state(false);
</script>

<section>
	<div class=" bg-umum flex h-screen flex-col items-center justify-center">
		<div class=" text-center">
			<p class="text-5xl font-[600]">MAJELIS AGUNG RAJA SULTAN INDONESIA</p>
		</div>
		<div class="relative mt-10 flex justify-center text-center">
			<img src={bgTemp} class="w-2/3" alt="" />
			<div
				class="absolute bottom-10 z-10 mb-3 ml-8 mr-40"
				tabindex="0"
				role="button"
				onmouseenter={() => (isHovered = true)}
				onmouseleave={() => (isHovered = false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if isHovered}
					<Hover
						text="Keraton Kasunanan Surakarta"
						location="Surakarta, Jawa Tengah"
						link="#"
						isHovered="true"
					/>
				{/if}
			</div>
		</div>
	</div>
	<div class="wave1">
		<svg
			data-name="Layer 1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
		>
			<path
				d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
				class="shape-fill"
			></path>
		</svg>
	</div>
</section>
<section>
	<div class="mt-10 grid grid-cols-2 items-center justify-center bg-white">
		<div class="m-4 text-center">
			<img src={candi} alt="" />
		</div>
		<div class="ms-60 max-w-full break-words p-4 text-right">
			<p class="mb-4 text-4xl font-[500]">Kerajaan di Indonesia</p>
			<p>
				Kerajaan-kerajaan yang berdiri di Indonesia berjumlah ratusan. Majelis Agung Raja Sultan
				Indonesia (MARSI) sendiri merupakan sebuah organisasi yang beranggotakan para Raja beserta
				dengan Kerajaannya. Anggota MARSI tersebar dari sabang hingga merauke. Melalui laman ini,
				anda dapat memperkaya pengetahuan anda mengenai ratusan kerajaan yang berdiri di Indonesia.
			</p>
			<div class="flex items-center justify-end">
				<a href="" class="bg-btn my-2 rounded-full px-4 py-2 hover:bg-yellow-800"
					>Selengkapnya ->
					<!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg> -->
				</a>
			</div>
		</div>
	</div>
</section>
<section>
	<div class="bg-umum relative mt-10 grid grid-cols-2 items-center justify-center">
		<div class="me-60 max-w-full break-words p-4 text-left">
			<p class="mb-4 text-4xl font-[500]">Situs Bersejarah Kerajaan</p>
			<p>
				Dari banyaknya kerajaan yang berdiri dan tersebar di seluruh penjuru nusantara, semua pasti
				memiliki situs bersejarahnya masing-masing. Mulai dari bangunan, situs khusus, ataupun yang
				hanya dalam bentuk struktur. Di laman ini, anda dapat mengakses secara lengkap mengenai
				informasi seputar situs-situs bersejarah dari ratusan kerajaan yang tentunya sangat menarik
				untuk anda lihat!
			</p>
			<div class="flex items-center justify-start">
				<a href="" class="bg-btn my-2 rounded-full px-4 py-2 hover:bg-yellow-800"
					>Selengkapnya ->
					<!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg> -->
				</a>
			</div>
		</div>
		<div class="m-4 text-center">
			<img src={candi1} alt="" />
		</div>
	</div>
	<div class="wave2">
		<svg
			data-name="Layer 1"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1200 120"
			preserveAspectRatio="none"
		>
			<path
				d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
				class="shape-fill"
			></path>
		</svg>
	</div>
</section>
<section>
	<div class="relative mt-10 grid grid-cols-2 items-center justify-center bg-white">
		<div class="m-4 text-center">
			<img src={gbr} alt="" />
		</div>
		<div class="ms-60 max-w-full break-words p-4 text-right">
			<p class="mb-4 text-4xl font-[500]">Situs Bersejarah Kerajaan</p>
			<p>
				Dari banyaknya kerajaan yang berdiri dan tersebar di seluruh penjuru nusantara, semua pasti
				memiliki situs bersejarahnya masing-masing. Mulai dari bangunan, situs khusus, ataupun yang
				hanya dalam bentuk struktur. Di laman ini, anda dapat mengakses secara lengkap mengenai
				informasi seputar situs-situs bersejarah dari ratusan kerajaan yang tentunya sangat menarik
				untuk anda lihat!
			</p>
			<div class="flex items-center justify-end">
				<a href="" class="bg-btn my-2 rounded-full px-2 py-2 hover:bg-yellow-800"
					>Selengkapnya ->
					<!-- <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg> -->
				</a>
			</div>
		</div>
	</div>
</section>
<section>
	<Footer></Footer>
</section>

<style>
	.mdi--map-marker-radius {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fa0000' d='M12 2c3.31 0 6 2.66 6 5.95C18 12.41 12 19 12 19S6 12.41 6 7.95C6 4.66 8.69 2 12 2m0 4a2 2 0 0 0-2 2a2 2 0 0 0 2 2a2 2 0 0 0 2-2a2 2 0 0 0-2-2m8 13c0 2.21-3.58 4-8 4s-8-1.79-8-4c0-1.29 1.22-2.44 3.11-3.17l.64.91C6.67 17.19 6 17.81 6 18.5c0 1.38 2.69 2.5 6 2.5s6-1.12 6-2.5c0-.69-.67-1.31-1.75-1.76l.64-.91C18.78 16.56 20 17.71 20 19'/%3E%3C/svg%3E");
	}
	.bg-umum {
		background-color: #ffeec5;
	}

	.wave1 {
		width: 100%;
		overflow: hidden;
		line-height: 0;
		transform: rotate(180deg);
		/* transform: scaleY(-1); */
	}
	.bg-btn {
		background-color: #ffa600;
	}
	.wave1 svg {
		position: relative;
		display: block;
		width: calc(140% + 1.3px);
		height: 212px;
	}

	.wave1 .shape-fill {
		fill: #ffeec5;
	}
	.wave2 {
		width: 100%;
		overflow: hidden;
		line-height: 0;
		transform: rotate(180deg);
		transform: scaleY(-1);
	}
	.wave2 svg {
		position: relative;
		display: block;
		width: calc(140% + 1.3px);
		height: 212px;
	}

	.wave2 .shape-fill {
		fill: #ffeec5;
	}

	section {
		margin-top: 0;
		padding-top: 0;
	}

	.wave3 {
		width: 100%;
		overflow: hidden;
		line-height: 0;
		transform: scaleX(-1);
	}
	.wave3 svg {
		position: relative;
		display: block;
		width: calc(140% + 1.3px);
		height: 212px;
	}

	.wave3 .shape-fill {
		fill: #ffa600; /* Sesuaikan warna sesuai kebutuhan */
	}
</style>
