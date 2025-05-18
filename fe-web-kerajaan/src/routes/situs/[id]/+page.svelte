<script lang="ts">
	import { navigating } from '$app/state';
	import Footer from '$lib/footer/Footer.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import Marquee from 'svelte-fast-marquee';

	const { data } = $props();
	const detil = data.detil_kelompok;
	console.log('Data yang diterima:', data);
</script>

<div class="relative">
	<Navbar></Navbar>
</div>
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<section class="bg-gray-100 pb-10 pt-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="form-container">
			<div class="flex justify-start p-2">
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<a href="/situs">
					<span class="solar--arrow-left-outline"></span>
				</a>
			</div>
			<div class="relative flex w-full items-center justify-between pt-10 text-center">
				<p class="invisible"></p>
				<p class="text-xl font-semibold">{detil.nama_situs}</p>
				<div class="mr-2 w-fit rounded-lg bg-red-300 px-2 py-2">
					<p class="text-center">Milik : {detil.pemilik_situs}</p>
				</div>
			</div>
			<div class="grid grid-cols-1 gap-8 px-10 py-10 md:grid-cols-2">
				<div>
					<img
						src={data?.detil_kelompok?.imageUrls[0] || 'https://picsum.photos/200/300'}
						class="mt-12 h-[50%] w-[500px] self-center rounded-lg object-cover"
						alt="foto 1"
					/>
					<div class="mt-5">
						<Marquee>
							<div class="flex items-center">
								{#if data?.detil_kelompok?.imageUrls.length > 0}
									{#each data.detil_kelompok.imageUrls as imageUrl (imageUrl)}
										<img src={imageUrl} class="col-span-1 m-1 h-auto w-[200px]" alt="foto" />
									{/each}
								{/if}
							</div>
						</Marquee>
					</div>
					<!-- svelte-ignore a11y_invalid_attribute -->
					<a href="/situs/riwayat/{detil.id_situs}">
						<button class="mt-10 w-fit rounded-lg border bg-blue-500 px-5 py-2 text-white">
							Riwayat Acara
						</button>
					</a>
				</div>
				<div>
					<div class="mt-5 flex items-center">
						<!-- <span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2"> -->
						<span class="ion--person-sharp flex-shrink-0"></span>
						<!-- </span> -->
						<div class="flex flex-col">
							<p class="text-md ml-4">Dibangun oleh : {detil.nama_pendiri || '-'}</p>
							<p class="text-md ml-4 text-start">Tahun berdiri : {detil.tahun_berdiri || '-'}</p>
						</div>
					</div>

					<div class="mt-5 flex items-center">
						<span class="mdi--clock flex-shrink-0"></span>
						<p class="text-md ml-6">
							Waktu Mulai : {detil.jam_buka || '-'} - {detil.jam_tutup || '-'}
						</p>
					</div>

					<div class="mt-5 flex items-center">
						<span class="clarity--key-line flex-shrink-0"></span>
						<p class="text-md ml-6">{detil.juru_kunci || '-'}</p>
					</div>

					<div class="ml-1 mt-5 flex items-center">
						{#if detil.jenis_situs == 'tempatIstirahat'}
							<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
								<i class="material-symbols--bed-outline-rounded text-lg text-white"></i>
							</span>
							<p class="text-md ml-6">Tempat Istirahat</p>
						{:else if detil.jenis_situs == 'air'}
							<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
								<i class="mingcute--wave-fill text-lg text-white"></i>
							</span>
							<p class="text-md ml-6">Tempat Berwisata</p>
						{:else if detil.jenis_situs == 'tempatBersejarah'}
							<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
								<i class="material-symbols--castle text-lg text-white"></i>
							</span>
							<p class="text-md ml-6">Tempat Bersejarah</p>
						{:else}
							<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
								<i class="material-symbols--question-mark bg-white text-lg text-white"></i>
							</span>
							<p class="text-md ml-6">{detil.jenis_situs || '-'}</p>
						{/if}
					</div>

					<div class="ml-1.5 mt-5 flex items-center">
						<span class="flex h-10 w-16 items-center justify-center rounded-full bg-red-400 p-2">
							<span class="bx--map flex-shrink-0"></span>
						</span>
						<p class="text-md ml-4">Lokasi : {detil.alamat || '-'}</p>
					</div>

					<!-- {#if jenis_situs === 'air'}
						<div class="mt-5 flex gap-4">
							<span
								class="mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2"
							>
								<i class="icon-park-outline--shower-head text-lg text-white"></i>
							</span>
							<span
								class="mt-5 flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2"
							>
								<i class="bx--swim text-lg text-white"></i>
							</span>
						</div>
					{/if} -->

					<div class="mt-5 flex items-center">
						<p class="text-md text-justify">{detil.deskripsi_situs || '-'}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="flex h-fit min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	.bx--swim {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='19.003' cy='6.002' r='2.002' fill='%23fefefe'/%3E%3Cpath fill='%23fefefe' d='M18.875 13.219c-.567.453-.978.781-1.878.781s-1.288-.311-1.876-.781c-.68-.543-1.525-1.219-3.127-1.219s-2.445.676-3.124 1.219c-.588.47-.975.781-1.875.781c-.898 0-1.286-.311-1.873-.78C4.443 12.676 3.6 12 2 12v2c.897 0 1.285.311 1.872.78c.679.544 1.523 1.22 3.123 1.22s2.446-.676 3.125-1.22c.587-.47.976-.78 1.874-.78c.9 0 1.311.328 1.878.781c.679.543 1.524 1.219 3.125 1.219c1.602 0 2.447-.676 3.127-1.219c.588-.47.977-.781 1.876-.781v-2c-1.601 0-2.446.676-3.125 1.219M16.997 19c-.899 0-1.288-.311-1.876-.781c-.68-.543-1.525-1.219-3.127-1.219s-2.445.676-3.124 1.219c-.588.47-.975.781-1.875.781c-.898 0-1.286-.311-1.873-.78C4.443 17.676 3.6 17 2 17v2c.897 0 1.285.311 1.872.78c.679.544 1.523 1.22 3.123 1.22s2.446-.676 3.125-1.22c.587-.47.976-.78 1.874-.78c.9 0 1.311.328 1.878.781c.679.543 1.524 1.219 3.125 1.219c1.602 0 2.447-.676 3.127-1.219c.588-.47.977-.781 1.876-.781v-2c-1.601 0-2.446.676-3.125 1.219c-.567.453-.978.781-1.878.781M11 5.419l2.104 2.104l-2.057 2.57c.286-.056.596-.093.947-.093c1.602 0 2.447.676 3.127 1.219c.588.47.977.781 1.876.781c.9 0 1.311-.328 1.878-.781c.132-.105.274-.217.423-.326l-2.096-2.09l.005-.005l-5.5-5.5a1 1 0 0 0-1.414 0l-4 4l1.414 1.414z'/%3E%3C/svg%3E");
	}

	.icon-park-outline--shower-head {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23fefefe' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath d='M27 20v2H9v-2c0-3.314 4.03-6 9-6s9 2.686 9 6'/%3E%3Cpath d='M42 44V12.5C42 7.806 36.627 4 30 4s-12 3.806-12 8.5V14m0 15v-1m-7.829.03l-.342.94M4.171 43.03l-.342.94M18 44v-1m0-6v-2m-10.658.06l-.684 1.88'/%3E%3C/g%3E%3C/svg%3E");
	}
	.material-symbols--castle {
		display: inline-block;
		width: 16px;
		height: 16px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M1 21V9h2v2h2V3h2v2h2V3h2v2h2V3h2v2h2V3h2v8h2V9h2v12h-9v-3q0-.825-.587-1.412T12 16t-1.412.588T10 18v3zm8-9h2V9H9zm4 0h2V9h-2z'/%3E%3C/svg%3E");
	}

	.mingcute--wave-fill {
		display: inline-block;
		width: 16px;
		height: 16px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23fff' d='M18.147 6.733a10.6 10.6 0 0 0-5.244.528l-.346.132a13.6 13.6 0 0 1-7.16.84c-1.038-.16-2.12-.418-3.068-.891a1.5 1.5 0 0 1 1.202-2.745l.132.058c.682.32 1.45.499 2.19.613c1.344.206 3.183.22 5.244-.529l.346-.132a13.6 13.6 0 0 1 7.16-.84c1.038.16 2.119.419 3.066.89a1.514 1.514 0 0 1 .672 2.014c-.369.738-1.122.907-2.005.674l-2.19-.612Zm0 6a10.6 10.6 0 0 0-5.244.528l-.346.132a13.6 13.6 0 0 1-7.16.84c-1.038-.16-2.12-.418-3.068-.891a1.5 1.5 0 0 1 1.202-2.745l.132.058c.682.32 1.45.499 2.19.613c1.344.206 3.183.22 5.244-.529l.346-.132a13.6 13.6 0 0 1 7.16-.84c1.038.16 2.119.419 3.066.89a1.514 1.514 0 0 1 .672 2.014c-.369.739-1.122.907-2.005.674l-2.19-.612Zm-5.954 6.8l.364-.14a10.6 10.6 0 0 1 5.59-.66l2.19.612c.882.233 1.635.065 2.005-.674a1.514 1.514 0 0 0-.673-2.013c-.947-.472-2.028-.73-3.066-.89a13.6 13.6 0 0 0-6.797.7l-.363.14c-2.202.88-4.172.878-5.59.66c-.634-.098-1.29-.243-1.893-.484l-.297-.13a1.5 1.5 0 0 0-1.334 2.688c.947.473 2.03.731 3.068.89c1.752.27 4.143.28 6.796-.7Z'/%3E%3C/g%3E%3C/svg%3E");
	}

	.material-symbols--bed-outline-rounded {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M2 18v-5q0-.675.275-1.225T3 10.8V8q0-1.25.875-2.125T6 5h4q.575 0 1.075.213T12 5.8q.425-.375.925-.587T14 5h4q1.25 0 2.125.875T21 8v2.8q.45.425.725.975T22 13v5q0 .425-.288.713T21 19t-.712-.288T20 18v-1H4v1q0 .425-.288.713T3 19t-.712-.288T2 18m11-8h6V8q0-.425-.288-.712T18 7h-4q-.425 0-.712.288T13 8zm-8 0h6V8q0-.425-.288-.712T10 7H6q-.425 0-.712.288T5 8zm-1 5h16v-2q0-.425-.288-.712T19 12H5q-.425 0-.712.288T4 13zm16 0H4z'/%3E%3C/svg%3E");
	}

	.ion--person-sharp {
		display: inline-block;
		width: 42px;
		height: 42px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23e57373' d='M256 256a112 112 0 1 0-112-112a112 112 0 0 0 112 112m0 32c-69.42 0-208 42.88-208 128v64h416v-64c0-85.12-138.58-128-208-128'/%3E%3C/svg%3E");
	}

	.mdi--clock {
		display: inline-block;
		width: 42px;
		height: 42px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23e57373' d='M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z'/%3E%3C/svg%3E");
	}

	.bx--map {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4m0-6c1.103 0 2 .897 2 2s-.897 2-2 2s-2-.897-2-2s.897-2 2-2'/%3E%3Cpath fill='%23fff' d='M11.42 21.814a1 1 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819M12 4c3.309 0 6 2.691 6 6.005c.021 4.438-4.388 8.423-6 9.73c-1.611-1.308-6.021-5.294-6-9.735c0-3.309 2.691-6 6-6'/%3E%3C/svg%3E");
	}

	.clarity--key-line {
		display: inline-block;
		width: 42px;
		height: 42px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'%3E%3Crect width='9.71' height='2.57' x='6.33' y='10.71' fill='%23e57373' class='clr-i-outline clr-i-outline-path-1' rx='1' ry='1' transform='rotate(-45 11.192 12.004)'/%3E%3Cpath fill='%23e57373' d='m23.35 16.8l.63-.63A5 5 0 0 0 24 9.1l-5.29-5.26a5 5 0 0 0-7.07 0l-8.55 8.55a5 5 0 0 0 0 7.07l5.26 5.26a5 5 0 0 0 7.07 0l.4-.4L18 26.48h3.44v3h3.69v1.63L28 34h6v-6.55ZM32 32h-3.14l-1.77-1.76v-2.8h-3.68v-3H18.8l-3-3l-1.8 1.87a3 3 0 0 1-4.24 0L4.5 18a3 3 0 0 1 0-4.24l8.56-8.56a3 3 0 0 1 4.24 0l5.26 5.26a3 3 0 0 1 0 4.24l-2 2L32 28.28Z' class='clr-i-outline clr-i-outline-path-2'/%3E%3Cpath fill='none' d='M0 0h36v36H0z'/%3E%3C/svg%3E");
	}

	.mdi--head-thinking-outline {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M13 3c3.9 0 7 3.1 7 7c0 2.8-1.6 5.2-4 6.3V21H9v-3H8c-1.1 0-2-.9-2-2v-3H4.5c-.4 0-.7-.5-.4-.8L6 9.7C6.2 5.9 9.2 3 13 3m0-2C8.4 1 4.6 4.4 4.1 8.9L2.5 11c-.6.8-.6 1.8-.2 2.6c.4.7 1 1.2 1.7 1.3V16c0 1.9 1.3 3.4 3 3.9V23h11v-5.5c2.5-1.7 4-4.4 4-7.5c0-5-4-9-9-9m-3 9c-.6 0-1-.4-1-1s.4-1 1-1s1 .4 1 1s-.4 1-1 1m3 0c-.6 0-1-.4-1-1s.4-1 1-1s1 .4 1 1s-.4 1-1 1m3 0c-.5 0-1-.4-1-1s.5-1 1-1s1 .4 1 1s-.5 1-1 1'/%3E%3C/svg%3E");
	}

	.solar--arrow-left-outline {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M10.53 5.47a.75.75 0 0 1 0 1.06l-4.72 4.72H20a.75.75 0 0 1 0 1.5H5.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

	.ri--parent-fill {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M7 11a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9m10.5 4a4 4 0 1 1 0-8a4 4 0 0 1 0 8m0 1a4.5 4.5 0 0 1 4.5 4.5v.5h-9v-.5a4.5 4.5 0 0 1 4.5-4.5M7 12a5 5 0 0 1 5 5v4H2v-4a5 5 0 0 1 5-5'/%3E%3C/svg%3E");
	}

	.form-container {
		background: white;
		border-radius: 10px;
		width: 100%;
		height: 100%;
		text-align: center;
		margin-right: auto;
	}

	.material-symbols--arrow-circle-left-rounded {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M11.8 13H15q.425 0 .713-.288T16 12t-.288-.712T15 11h-3.2l.9-.9q.275-.275.275-.7t-.275-.7t-.7-.275t-.7.275l-2.6 2.6q-.3.3-.3.7t.3.7l2.6 2.6q.275.275.7.275t.7-.275t.275-.7t-.275-.7zm.2 9q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22'/%3E%3C/svg%3E");
	}

	.material-symbols--arrow-circle-right {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m12 16l4-4l-4-4l-1.4 1.4l1.6 1.6H8v2h4.2l-1.6 1.6zm0 6q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22'/%3E%3C/svg%3E");
	}
</style>
