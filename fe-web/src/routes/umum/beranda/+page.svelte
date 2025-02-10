<script lang="ts">
	import bgTemp from '../../../asset/bg_webumum.png';
	import Hover from '../Hoverpopup.svelte';
	import candi1 from '../../../asset/umum/candi2.png';
	import gbr from '../../../asset/umum/gbr.png';
	import Footer from '../../../lib/footer/Footer.svelte';
	import gambar1 from '../../../asset/umum/img_1.png';
	import gambar2 from '../../../asset/umum/img_2.png';
	import gambar3 from '../../../asset/umum/img_3.png';
	import gambar4 from '../../../asset/umum/img_4.png';
	import gambar5 from '../../../asset/umum/image-bg.png';

	let hoveredIcons = new Set();

	function setHover(id: string, isHover: boolean) {
		if (isHover) {
			hoveredIcons.add(id);
		} else {
			hoveredIcons.delete(id);
		}
		hoveredIcons = new Set(hoveredIcons);
	}
</script>

<section class="relative">
	<div class="bg-umum flex h-screen flex-col items-center justify-center">
		<div class="text-center">
			<p class="mt-20 text-5xl font-[600]">MAJELIS AGUNG RAJA SULTAN INDONESIA</p>
		</div>
		<div class="relative mt-10 flex justify-center text-center">
			<img src={bgTemp} class="h-[90%] w-[90%]" alt="" />

			<!-- Icon 1 -->
			<div
				class="absolute bottom-10 z-10 mb-3 ml-8 mr-40"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon1', true)}
				onmouseleave={() => setHover('icon1', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon1')}
					<Hover
						text="Keraton Kasunanan Surakarta"
						location="Surakarta, Jawa Tengah"
						link="#"
						isHovered="true"
					/>
				{/if}
			</div>
			<!-- Icon 2 -->
			<div
				class="absolute top-12 mt-12"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon2', true)}
				onmouseleave={() => setHover('icon2', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon2')}
					<Hover
						text="Keraton Yogyakarta"
						location="Yogyakarta, DI Yogyakarta"
						link="#"
						isHovered="true"
					/>
				{/if}
			</div>

			<!-- Icon 3 -->
			<div
				class="absolute left-1/4 top-10 -ml-2 mt-11"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon3', true)}
				onmouseleave={() => setHover('icon3', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon3')}
					<Hover text="Test3" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 4 -->
			<div
				class="absolute left-1/4 top-12 ml-5 mt-12"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon4', true)}
				onmouseleave={() => setHover('icon4', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon4')}
					<Hover text="Test4" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 5 -->
			<div
				class="absolute bottom-1/2 left-1/4 ml-2"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon5', true)}
				onmouseleave={() => setHover('icon5', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon5')}
					<Hover text="Test5" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 6 -->
			<div
				class="absolute bottom-1/2 left-1/4 mb-4 ml-12"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon6', true)}
				onmouseleave={() => setHover('icon6', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon6')}
					<Hover text="Test6" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 7 -->
			<div
				class="absolute bottom-1/2 left-1/4 -mb-8 ml-8"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon7', true)}
				onmouseleave={() => setHover('icon7', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon7')}
					<Hover text="Test7" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 8 -->
			<div
				class="absolute bottom-1/2 left-[30%] -mb-5 ml-5"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon8', true)}
				onmouseleave={() => setHover('icon8', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon8')}
					<Hover text="Test8" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 9 -->
			<div
				class="absolute bottom-1/2 left-[30%] -mb-11 ml-5"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon9', true)}
				onmouseleave={() => setHover('icon9', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon9')}
					<Hover text="Test9" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 10 -->
			<div
				class="absolute bottom-10 left-[35%] z-10 mb-8 ml-8"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon10', true)}
				onmouseleave={() => setHover('icon10', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon10')}
					<Hover text="Test10" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 11 -->
			<div
				class="absolute bottom-10 left-[36%] z-10 mb-12 ml-12"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon11', true)}
				onmouseleave={() => setHover('icon11', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon11')}
					<Hover text="Test11" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 12 -->
			<div
				class="absolute bottom-11 left-[32%] z-10 mb-12 ml-11"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon12', true)}
				onmouseleave={() => setHover('icon12', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon12')}
					<Hover text="Test11" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 13 -->
			<div
				class="absolute bottom-[14%] left-[30%] z-10 mb-12 ml-11"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon13', true)}
				onmouseleave={() => setHover('icon13', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon13')}
					<Hover text="Test13" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 14 -->
			<div
				class="absolute bottom-[37%] left-[36%] z-10 mb-12 ml-11"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon14', true)}
				onmouseleave={() => setHover('icon14', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon14')}
					<Hover text="Test14" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 15 -->
			<div
				class="absolute bottom-[49%] left-[36%] z-10 mb-12 ml-4"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon15', true)}
				onmouseleave={() => setHover('icon15', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon15')}
					<Hover text="Test15" location="Maldives" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 16 -->
			<div
				class="absolute right-[53%] top-[23%]"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon16', true)}
				onmouseleave={() => setHover('icon16', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon16')}
					<Hover text="Ba" location="Yog" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 17 -->
			<div
				class="absolute right-[53%] top-[50%]"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon17', true)}
				onmouseleave={() => setHover('icon17', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon17')}
					<Hover text="Ba" location="Yog" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 18 -->
			<div
				class="absolute right-[44%] top-[27%]"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon18', true)}
				onmouseleave={() => setHover('icon18', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon18')}
					<Hover text="18" location="Yog" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 19 -->
			<div
				class="absolute right-[47%] top-[49%] mr-2"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon19', true)}
				onmouseleave={() => setHover('icon19', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon19')}
					<Hover text="19" location="Yog" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 20 -->
			<div
				class="absolute right-[46%] top-[58%] mr-2"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon20', true)}
				onmouseleave={() => setHover('icon20', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon20')}
					<Hover text="20" location="Yog" link="#" isHovered="true" />
				{/if}
			</div>

			<!-- Icon 21 -->
			<div
				class="absolute bottom-[5%] right-[40%] mr-2"
				tabindex="0"
				role="button"
				onmouseenter={() => setHover('icon21', true)}
				onmouseleave={() => setHover('icon21', false)}
			>
				<span class="mdi--map-marker-radius text-3xl"></span>

				{#if hoveredIcons.has('icon21')}
					<Hover text="21" location="Yog" link="#" isHovered="true" />
				{/if}
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
	</div>
</section>

<section
	class=" relative h-[100%] w-[100%] overflow-hidden bg-cover bg-center p-5 mb-20"
	style:background-image="url('{gambar5}')"
>
	<div class=" grid grid-cols-2 items-center justify-center">
		<div class="mb-10 ml-10 mt-10 grid grid-cols-3 grid-rows-[auto_auto_1fr] gap-1">
			<img src={gambar1} alt="dor" class="col-span-1 row-span-2 h-full object-cover" />
			<img src={gambar2} class="col-span-2 row-span-1 h-[205px] object-cover" alt="dor" />
			<img src={gambar3} class="col-span-2 row-span-1 h-[172px] object-cover" alt="dor" />
			<img src={gambar4} class="col-span-3 h-auto max-h-60 object-cover" alt="dordordor" />
		</div>

		<div class="ms-30 mr-10 max-w-full break-words p-4 text-left">
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
	<div class="bg-umum relative grid grid-cols-2 items-center justify-center">
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

	.waves_a {
		position: absolute;
		left: 0;
		z-index: 10;
		width: 100%;
		margin-top: -320px;
		overflow: hidden;
		line-height: 0;
	}

	.waves_a svg {
		position: relative;
		display: block;
		width: calc(168% + 1.3px);
		height: 325px;
	}

	.waves_a .shape-fill {
		fill: #ffeec5;
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
</style>
