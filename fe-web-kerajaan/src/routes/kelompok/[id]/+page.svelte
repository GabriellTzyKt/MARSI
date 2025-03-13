<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import Marquee from 'svelte-fast-marquee';

	const { data } = $props();
	console.log('Data yang diterima:', data);
	const kelompok = data.detil_kelompok;
	const id = kelompok.id;
	const lokasi = kelompok.lokasi;
	const penanggung_jawab = kelompok.penanggungjawab;
	const pembina = kelompok.pembina;
	const isi = kelompok.isi;
	const email = kelompok.email;
	const pelindung = kelompok.pelindung;
	const nama_kegiatan = kelompok.nama_kegiatan;
	const nomor_telepon = kelompok.nomor_telepon;
	const jumlah_anggota = kelompok.jumlah_anggota;
	const gambar1 = kelompok.gambar1;
	const gambar2 = kelompok.gambar2;
	const gambar3 = kelompok.gambar3;
	const gambar4 = kelompok.gambar4;
</script>

<div class="relative">
	<Navbar></Navbar>
</div>

<section class="bg-gray-100 pb-10 pt-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="form-container">
			<div class="flex justify-start p-2">
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<a href="/kelompok">
					<span class="solar--arrow-left-outline"></span>
				</a>
			</div>
			<div class="relative flex w-full items-center justify-center pt-10 text-center">
				<p class="text-xl font-semibold">{nama_kegiatan}</p>
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
						<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
							<span class="bx--map flex-shrink-0"></span>
						</span>
						<p class="text-md ml-4">Lokasi : {lokasi}</p>
					</div>

					<div class="mt-5 flex items-center">
						<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
							<span class="mdi--head-thinking-outline flex-shrink-0"></span>
						</span>
						<p class="text-md ml-4">{penanggung_jawab}</p>
					</div>

					<div class="mt-5 flex items-center">
						<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
							<span class="ri--parent-fill flex-shrink-0"></span>
						</span>
						<p class="text-md ml-4">Pembina : {pembina}</p>
					</div>

					<div class="mt-5 flex items-center">
						<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
							<span class="mingcute--shield-line flex-shrink-0"></span>
						</span>
						<p class="text-md ml-4">Pelindung : {pelindung}</p>
					</div>

					<div class="mt-5 flex items-center">
						<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
							<span class="ic--baseline-email flex-shrink-0"></span>
						</span>
						<p class="text-md ml-4">Email : {email}</p>
					</div>

					<div class="mt-5 flex items-center">
						<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
							<span class="mdi--telephone flex-shrink-0"></span>
						</span>
						<p class="text-md ml-4">Telepon : {nomor_telepon}</p>
					</div>

					<div class="mt-5 flex items-center">
						<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
							<span class="typcn--group flex-shrink-0"></span>
						</span>
						<p class="text-md ml-4 text-start">Jumlah Anggota : {jumlah_anggota}</p>
					</div>

					<div class="mt-5 flex items-center">
						<p class="text-md text-start">{isi}</p>
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
	.typcn--group {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M12 14c1.381 0 2.631-.56 3.536-1.465C16.44 11.631 17 10.381 17 9s-.56-2.631-1.464-3.535C14.631 4.56 13.381 4 12 4s-2.631.56-3.536 1.465C7.56 6.369 7 7.619 7 9s.56 2.631 1.464 3.535A5 5 0 0 0 12 14m8 1a2.495 2.495 0 0 0 2.5-2.5c0-.69-.279-1.315-.732-1.768A2.5 2.5 0 0 0 20 10a2.495 2.495 0 0 0-2.5 2.5A2.496 2.496 0 0 0 20 15m0 .59c-1.331 0-2.332.406-2.917.968C15.968 15.641 14.205 15 12 15c-2.266 0-3.995.648-5.092 1.564C6.312 15.999 5.3 15.59 4 15.59c-2.188 0-3.5 1.09-3.5 2.182c0 .545 1.312 1.092 3.5 1.092c.604 0 1.146-.051 1.623-.133l-.04.27c0 1 2.406 2 6.417 2c3.762 0 6.417-1 6.417-2l-.02-.255c.463.073.995.118 1.603.118c2.051 0 3.5-.547 3.5-1.092c0-1.092-1.373-2.182-3.5-2.182M4 15c.69 0 1.315-.279 1.768-.732A2.5 2.5 0 0 0 6.5 12.5A2.495 2.495 0 0 0 4 10a2.496 2.496 0 0 0-2.5 2.5A2.495 2.495 0 0 0 4 15'/%3E%3C/svg%3E");
	}

	.mdi--telephone {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z'/%3E%3C/svg%3E");
	}

	.ic--baseline-email {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z'/%3E%3C/svg%3E");
	}

	.mingcute--shield-line {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23fff' d='m12.702 2.195l7 2.625A2 2 0 0 1 21 6.693v5.363a9 9 0 0 1-4.975 8.05l-3.354 1.677a1.5 1.5 0 0 1-1.342 0l-3.354-1.677A9 9 0 0 1 3 12.056V6.693A2 2 0 0 1 4.298 4.82l7-2.625a2 2 0 0 1 1.404 0M12 4.068L5 6.693v5.363a7 7 0 0 0 3.87 6.26L12 19.883l3.13-1.565A7 7 0 0 0 19 12.056V6.693zM12 8a1 1 0 0 1 1 1v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2H9a1 1 0 1 1 0-2h2V9a1 1 0 0 1 1-1'/%3E%3C/g%3E%3C/svg%3E");
	}

	.bx--map {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4m0-6c1.103 0 2 .897 2 2s-.897 2-2 2s-2-.897-2-2s.897-2 2-2'/%3E%3Cpath fill='%23fff' d='M11.42 21.814a1 1 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819M12 4c3.309 0 6 2.691 6 6.005c.021 4.438-4.388 8.423-6 9.73c-1.611-1.308-6.021-5.294-6-9.735c0-3.309 2.691-6 6-6'/%3E%3C/svg%3E");
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
