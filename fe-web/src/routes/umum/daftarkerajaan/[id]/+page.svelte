<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../../nav/Navbar.svelte';
	import keris from '../../../../asset/umum/keris.png';
	import rumah from '../../../../asset/umum/rumah.png';

	const { data } = $props();
	console.log('Data yang diterima:', data);
	const anggota = data.detil_kerajaan;
	let gambar = anggota.gambartop;
	let nama = anggota.nama_kerajaan;
	let tahun = anggota.tahun;
	let lambang_kerajaan = anggota.lambang_kerajaan;
	let nama_kasunanan = anggota.nama_kasunanan;
	let isi = anggota.isi_singkat;
	let lokasi = anggota.lokasi;
	let bendera = anggota.bendera;
	let gambar1 = anggota.gambar1;
	let gambar2 = anggota.gambar2;
	let gambar3 = anggota.gambar3;
	let gambar4 = anggota.gambar4;
</script>

<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<section class="relative w-full">
	<div class="relative">
		<img src={gambar} alt="" class="min-w-screen min-h-screen object-cover" />
		<div class="absolute inset-0 flex items-center justify-center">
			<p class="absolute left-10 top-[15%]">
				<a href="/umum/daftarkerajaan">
					<span class="ph--arrow-bend-up-left-bold mt-3"></span>
					Kembali Ke Daftar Kerajaan
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

<section class="bg-customBg2 relative h-fit w-full md:pt-10">
	<div class="edit">
		<div class="form-container absolute mx-auto px-4 lg:mb-20">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<div>
					<img src={gambar1} class="h-auto w-full rounded-lg object-cover" alt="" />
					<div class="mt-4 flex justify-center gap-1 lg:gap-4">
						<span class="material-symbols--arrow-circle-left-rounded self-center"></span>
						<img src={gambar2} class="h-16 w-auto rounded-lg object-cover lg:h-24" alt="" />
						<img src={gambar3} class="h-16 w-auto rounded-lg object-cover lg:h-24" alt="" />
						<img src={gambar4} class="h-16 w-auto rounded-lg object-cover lg:h-24" alt="" />
						<span class="material-symbols--arrow-circle-right self-center"></span>
					</div>
				</div>
				<div>
					<p class="text-xl font-semibold">{nama}</p>
					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="ph--scroll"></span>
						</div>
						<p class="ml-2">Tahun berdiri : {tahun}</p>
					</div>
					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="tabler--flag"></span>
						</div>
						<p class="ml-2 flex items-center">
							Bendera Kerajaan : <img src={bendera} alt="" class="ml-2 h-6" />
						</p>
					</div>
					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="material-symbols--shield-outline-rounded"></span>
						</div>
						<p class="ml-2 flex items-center">
							Lambang Kerajaan : <img src={lambang_kerajaan} alt="" class="ml-2 h-6" />
						</p>
					</div>
					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="bx--map text-xl"></span>
						</div>
						<p class="ml-3 items-center text-start">Lokasi : {lokasi}</p>
					</div>
					<p class="mt-3 text-start">{nama_kasunanan}</p>
					<p class="mt-3 text-start text-sm">{isi}</p>
					<p class="mt-3 text-center lg:text-start">Navigasi</p>
					<div class="duar mt-3 flex gap-4">
						<div class="flex h-12 w-12 items-center justify-center rounded-full border bg-blue-600">
							<span class="ri--link"></span>
						</div>
						<div class="flex h-12 w-12 items-center justify-center rounded-full border bg-red-600">
							<img src={rumah} alt="" class="h-[50%] w-[50%] object-contain" />
						</div>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full border bg-yellow-600"
						>
							<img src={keris} alt="" class="h-[75%] w-[75%] object-contain" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<div class="relative">
	<Footer></Footer>
</div>

<style>
	@media (max-width: 768px) {
		.duar {
			justify-content: center;
		}

		.edit {
			margin-top: 50%;
			margin-bottom: 10px;
		}
	}
	.ri--link {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 0 0-7.071-7.071L9.878 7.05L8.464 5.636l1.414-1.414a7 7 0 0 1 9.9 9.9zm-2.829 2.828l-1.414 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 0 0 7.07 7.071l1.415-1.414zm-.707-10.607l1.415 1.415l-7.072 7.07l-1.414-1.414z'/%3E%3C/svg%3E");
	}
	.bx--map {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 14c2.206 0 4-1.794 4-4s-1.794-4-4-4s-4 1.794-4 4s1.794 4 4 4m0-6c1.103 0 2 .897 2 2s-.897 2-2 2s-2-.897-2-2s.897-2 2-2'/%3E%3Cpath fill='%23000' d='M11.42 21.814a1 1 0 0 0 1.16 0C12.884 21.599 20.029 16.44 20 10c0-4.411-3.589-8-8-8S4 5.589 4 9.995c-.029 6.445 7.116 11.604 7.42 11.819M12 4c3.309 0 6 2.691 6 6.005c.021 4.438-4.388 8.423-6 9.73c-1.611-1.308-6.021-5.294-6-9.735c0-3.309 2.691-6 6-6'/%3E%3C/svg%3E");
	}
	.material-symbols--shield-outline-rounded {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 21.9q-.175 0-.325-.025t-.3-.075Q8 20.675 6 17.638T4 11.1V6.375q0-.625.363-1.125t.937-.725l6-2.25q.35-.125.7-.125t.7.125l6 2.25q.575.225.938.725T20 6.375V11.1q0 3.5-2 6.538T12.625 21.8q-.15.05-.3.075T12 21.9m0-2q2.6-.825 4.3-3.3t1.7-5.5V6.375l-6-2.25l-6 2.25V11.1q0 3.025 1.7 5.5t4.3 3.3m0-7.9'/%3E%3C/svg%3E");
	}
	.tabler--flag {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 5a5 5 0 0 1 7 0a5 5 0 0 0 7 0v9a5 5 0 0 1-7 0a5 5 0 0 0-7 0zm0 16v-7'/%3E%3C/svg%3E");
	}
	.ph--scroll {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='M96 104a8 8 0 0 1 8-8h64a8 8 0 0 1 0 16h-64a8 8 0 0 1-8-8m8 40h64a8 8 0 0 0 0-16h-64a8 8 0 0 0 0 16m128 48a32 32 0 0 1-32 32H88a32 32 0 0 1-32-32V64a16 16 0 0 0-32 0c0 5.74 4.83 9.62 4.88 9.66A8 8 0 0 1 24 88a7.9 7.9 0 0 1-4.79-1.61C18.05 85.54 8 77.61 8 64a32 32 0 0 1 32-32h136a32 32 0 0 1 32 32v104h8a8 8 0 0 1 4.8 1.6c1.2.86 11.2 8.79 11.2 22.4M96.26 173.48A8.07 8.07 0 0 1 104 168h88V64a16 16 0 0 0-16-16H67.69A31.7 31.7 0 0 1 72 64v128a16 16 0 0 0 32 0c0-5.74-4.83-9.62-4.88-9.66a7.82 7.82 0 0 1-2.86-8.86M216 192a12.58 12.58 0 0 0-3.23-8h-94a27 27 0 0 1 1.21 8a31.8 31.8 0 0 1-4.29 16H200a16 16 0 0 0 16-16'/%3E%3C/svg%3E");
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
