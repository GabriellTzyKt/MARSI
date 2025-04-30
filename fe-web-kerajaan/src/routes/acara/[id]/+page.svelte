<script lang="ts">
	import { navigating } from '$app/state';
	import Footer from '$lib/footer/Footer.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import Marquee from 'svelte-fast-marquee';

	const { data } = $props();
	console.log('Data yang diterima:', data);

	// Check if data exists and has the expected structure
	const situs = data?.data || {}; // Access first item in array or use empty object as fallback
	const nama_acara = situs?.nama_acara || 'Nama Acara Tidak Tersedia';
	const tanggal = situs?.tanggal_mulai || '-';
	const jam = situs?.waktu_mulai || '-';
	const id = situs?.id_acara || '';
	const lokasi = situs?.alamat_acara || 'Lokasi tidak tersedia';
	const isi = situs?.deskripsi_acara || 'Tidak ada deskripsi';
	const penanggung_jawab = situs?.penanggungjawab || situs?.nama_penanggung_jawab || '-';

	// Handle image URLs safely
	const imageUrls = situs?.imageUrls || [];
	const gambar1 = imageUrls[0] || 'https://picsum.photos/200/300'; // Use placeholder if no image
	const gambar2 = imageUrls[1] || gambar1; // Fallback to first image or placeholder
	const gambar3 = imageUrls[2] || gambar1;
	const gambar4 = imageUrls[3] || gambar1;
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
			<div
				class="flex items-center justify-center self-center pt-10 text-center text-3xl font-bold"
			>
				<p>{nama_acara}</p>
			</div>
			<div class="grid grid-cols-1 gap-8 px-10 py-10 md:grid-cols-2">
				<div>
					<img
						src={gambar1}
						class="mt-12 h-[50%] w-[500px] self-center rounded-lg object-cover"
						alt="foto 1"
					/>
					<div class="mt-5">
						<Marquee>
							<div class="grid grid-cols-3 items-center">
								<img src={gambar2} class="col-span-1 m-1 h-24 w-fit lg:h-fit" alt="" />
								<img src={gambar3} class="col-span-1 m-1 h-24 w-fit lg:h-fit" alt="" />
								<img src={gambar4} class="col-span-1 m-1 h-24 w-fit lg:h-fit" alt="" />
							</div>
						</Marquee>
					</div>
				</div>
				<div>
					<div class="mt-5 flex items-center">
						<span class="material-symbols--person flex-shrink-0"></span>
						<div class="text-md flex-col text-start">
							<p class="ml-4">Penanggung Jawab Acara : {penanggung_jawab}</p>
						</div>
					</div>

					<div class="mt-5 flex items-center">
						<span class="mdi--clock flex-shrink-0"></span>
						<p class="text-md ml-4">Jam Acara : {jam}</p>
					</div>

					<div class="mt-5 flex items-center">
						<span class="solar--calendar-linear flex-shrink-0"></span>
						<p class="text-md ml-4 text-start">{tanggal}</p>
					</div>

					<div class="mt-5 flex items-center">
						<span
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-400 p-2"
						>
							<i class="mdi--location text-lg text-white"></i>
						</span>
						<p class="text-md ml-5 text-start">{lokasi}</p>
					</div>

					<div class="mt-5 flex items-center">
						<p class="text-md text-start">{isi}</p>
					</div>

					<div class="mt-8 flex items-center">
						<button
							class=" h-fit w-full rounded-full border-2 border-red-400 bg-red-400 px-2 py-3 text-center text-white"
						>
							<a href="/acara/rsvp">Daftar Acara</a></button
						>
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
	.solar--calendar-linear {
		display: inline-block;
		width: 42px;
		height: 42px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath stroke='%23eb5151' stroke-width='1.5' d='M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z'/%3E%3Cpath stroke='%23eb5151' stroke-linecap='round' stroke-width='1.5' d='M7 4V2.5M17 4V2.5M2.5 9h19'/%3E%3Cpath fill='%23eb5151' d='M18 17a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-5 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0-4a1 1 0 1 1-2 0a1 1 0 0 1 2 0'/%3E%3C/g%3E%3C/svg%3E");
	}

	.solar--arrow-left-outline {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M10.53 5.47a.75.75 0 0 1 0 1.06l-4.72 4.72H20a.75.75 0 0 1 0 1.5H5.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

	.mdi--location {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7'/%3E%3C/svg%3E");
	}

	.mingcute--wave-fill {
		display: inline-block;
		width: 16px;
		height: 16px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23fff' d='M18.147 6.733a10.6 10.6 0 0 0-5.244.528l-.346.132a13.6 13.6 0 0 1-7.16.84c-1.038-.16-2.12-.418-3.068-.891a1.5 1.5 0 0 1 1.202-2.745l.132.058c.682.32 1.45.499 2.19.613c1.344.206 3.183.22 5.244-.529l.346-.132a13.6 13.6 0 0 1 7.16-.84c1.038.16 2.119.419 3.066.89a1.514 1.514 0 0 1 .672 2.014c-.369.738-1.122.907-2.005.674l-2.19-.612Zm0 6a10.6 10.6 0 0 0-5.244.528l-.346.132a13.6 13.6 0 0 1-7.16.84c-1.038-.16-2.12-.418-3.068-.891a1.5 1.5 0 0 1 1.202-2.745l.132.058c.682.32 1.45.499 2.19.613c1.344.206 3.183.22 5.244-.529l.346-.132a13.6 13.6 0 0 1 7.16-.84c1.038.16 2.119.419 3.066.89a1.514 1.514 0 0 1 .672 2.014c-.369.739-1.122.907-2.005.674l-2.19-.612Zm-5.954 6.8l.364-.14a10.6 10.6 0 0 1 5.59-.66l2.19.612c.882.233 1.635.065 2.005-.674a1.514 1.514 0 0 0-.673-2.013c-.947-.472-2.028-.73-3.066-.89a13.6 13.6 0 0 0-6.797.7l-.363.14c-2.202.88-4.172.878-5.59.66c-.634-.098-1.29-.243-1.893-.484l-.297-.13a1.5 1.5 0 0 0-1.334 2.688c.947.473 2.03.731 3.068.89c1.752.27 4.143.28 6.796-.7Z'/%3E%3C/g%3E%3C/svg%3E");
	}

	.tabler--key-filled {
		display: inline-block;
		width: 42px;
		height: 42px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23e04949' d='M14.52 2c1.029 0 2.015.409 2.742 1.136l3.602 3.602a3.877 3.877 0 0 1 0 5.483l-2.643 2.643a3.88 3.88 0 0 1-4.941.452l-.105-.078l-5.882 5.883a3 3 0 0 1-1.68.843l-.22.027l-.221.009H4c-1.014 0-1.867-.759-1.991-1.823L2 20v-1.172c0-.704.248-1.386.73-1.96l.149-.161l.414-.414A1 1 0 0 1 4 16h1v-1a1 1 0 0 1 .883-.993L6 14h1v-1a1 1 0 0 1 .206-.608l.087-.1l1.468-1.469l-.076-.103a3.9 3.9 0 0 1-.678-1.963L8 8.521c0-1.029.409-2.015 1.136-2.742l2.643-2.643A3.88 3.88 0 0 1 14.52 2m.495 5h-.02a2 2 0 1 0 0 4h.02a2 2 0 1 0 0-4'/%3E%3C/svg%3E");
	}

	.mdi--clock {
		display: inline-block;
		width: 42px;
		height: 42px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23e04949' d='M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m4.2 14.2L11 13V7h1.5v5.2l4.5 2.7z'/%3E%3C/svg%3E");
	}

	.material-symbols--person {
		display: inline-block;
		width: 42px;
		height: 42px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23e04949' d='M12 12q-1.65 0-2.825-1.175T8 8t1.175-2.825T12 4t2.825 1.175T16 8t-1.175 2.825T12 12m-8 8v-2.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2V20z'/%3E%3C/svg%3E");
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
