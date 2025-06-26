<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../../nav/Navbar.svelte';
	import bangunan from '../../../../asset/umum/2.png';

	const { data } = $props();
	console.log('Data yang diterima:', data);
	const acara = data.detil_acara;
	let gambar = acara.gambartop;
	let nama = acara.nama_tempat;
	let gambar1 = acara.gambar1;
	let gambar2 = acara.gambar2;
	let gambar3 = acara.gambar3;
	let gambar4 = acara.gambar4;
	let kepemilikan = acara.kepemilikan;
	let tanggal_acara = acara.tanggal_acara;
	let jam_selesai = acara.jam_selesai;
    let lokasi_acara = acara.lokasi;
	let isi = acara.isi;
</script>

<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<section class="relative w-full">
	<div class="relative">
		<img src={gambar} alt="" class="min-w-full min-h-screen object-cover" />
		<div class="absolute inset-0 flex items-center justify-center">
			<p class="absolute left-10 top-[15%]">
				<a href="/umum/daftaracara">
					<span class="ph--arrow-bend-up-left-bold mt-3"></span>
					Kembali Ke Daftar Acara
				</a>
			</p>
			<p
				class="mb-10 text-center text-6xl font-bold text-black"
				style="text-shadow: 2px 2px 4px #fff;"
			>
				{nama}
			</p>
		</div>
	</div>
</section>

<section class="bg-customBg2 relative h-fit w-full pt-10">
	<div class="edit">
		<div class="form-container absolute mx-auto px-4 lg:mb-20">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div>
					<img src={gambar1} class="mt-10 h-auto w-full rounded-lg object-cover" alt="" />
					<div class="mt-4 flex justify-center gap-1 lg:gap-4">
						<span class="material-symbols--arrow-circle-left-rounded self-center"></span>
						<img src={gambar2} class="h-16 w-auto rounded-lg object-cover lg:h-24" alt="" />
						<img src={gambar3} class="h-16 w-auto rounded-lg object-cover lg:h-24" alt="" />
						<img src={gambar4} class="h-16 w-auto rounded-lg object-cover lg:h-24" alt="" />
						<span class="material-symbols--arrow-circle-right self-center"></span>
					</div>
				</div>
				<div>
					<p class="mt-10 text-start text-xl font-semibold">{nama}</p>
					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="bxs--castle"></span>
						</div>
						<p class="ml-2 items-center text-start">Kepemilikan : {kepemilikan}</p>
					</div>
					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="solar--calendar-bold"></span>
						</div>
						<p class="ml-2 items-center text-start">Tanggal Acara : {tanggal_acara}</p>
					</div>
					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="tabler--clock-filled"></span>
						</div>
						<p class="ml-2 items-center text-start">Jam : {jam_selesai}</p>
					</div>
					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="bx--map"></span>
						</div>
						<p class="ml-2 items-center text-start">Lokasi Acara : {lokasi_acara}</p>
					</div>

					<p class="mb-5 mt-3 text-start text-sm">{isi}</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="h-full w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	@media (max-width: 768px) {
		.edit {
			margin-top: 50%;
			margin-bottom: 10px;
		}
	}

	.bx--map {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fffefb' d='M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4m0-6c1.103 0 2 .897 2 2s-.897 2-2 2s-2-.897-2-2s.897-2 2-2'/%3E%3Cpath fill='%23fffefb' d='M11.42 21.814a1 1 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819M12 4c3.309 0 6 2.691 6 6.005c.021 4.438-4.388 8.423-6 9.73c-1.611-1.308-6.021-5.294-6-9.735c0-3.309 2.691-6 6-6'/%3E%3C/svg%3E");
	}

	.tabler--clock-filled {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fffefb' d='M17 3.34a10 10 0 1 1-14.995 8.984L2 12l.005-.324A10 10 0 0 1 17 3.34M12 6a1 1 0 0 0-.993.883L11 7v5l.009.131a1 1 0 0 0 .197.477l.087.1l3 3l.094.082a1 1 0 0 0 1.226 0l.094-.083l.083-.094a1 1 0 0 0 0-1.226l-.083-.094L13 11.585V7l-.007-.117A1 1 0 0 0 12 6'/%3E%3C/svg%3E");
	}

	.solar--calendar-bold {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fffefb' d='M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z'/%3E%3Cpath fill='%23fffefb' fill-rule='evenodd' d='M2 12c0-.839 0-1.585.013-2.25h19.974C22 10.415 22 11.161 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14zm15 2a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2m-4-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m0 4a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-6-3a1 1 0 1 0 0-2a1 1 0 0 0 0 2m0 4a1 1 0 1 0 0-2a1 1 0 0 0 0 2' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

	.bxs--castle {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20 11h-2V6h1V2h-2v2h-1V2h-2v2h-1V2h-2v2h-1V2H8v2H7V2H5v4h1v5H4V9H2v12h7v-5a3 3 0 0 1 6 0v5h7V9h-2zm-10-1H8V7h2zm6 0h-2V7h2z'/%3E%3C/svg%3E");
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
	.ph--arrow-bend-up-left-bold {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='M236 200a12 12 0 0 1-24 0a84.09 84.09 0 0 0-84-84H61l27.52 27.51a12 12 0 0 1-17 17l-48-48a12 12 0 0 1 0-17l48-48a12 12 0 0 1 17 17L61 92h67a108.12 108.12 0 0 1 108 108'/%3E%3C/svg%3E");
	}

	/* Mengatur Section agar form container berada di tengah */
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.form-container {
		background: white;
		position: static;
		padding: 20px;
		border-radius: 10px;
		width: 90%; /* Menyesuaikan lebar form */
		height: 90%;
		text-align: center;
		margin-top: -250px; /* Memberikan ruang antara gambar dan form */
	}
</style>
