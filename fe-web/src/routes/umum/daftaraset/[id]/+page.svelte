<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '../../nav/Navbar.svelte';
	import keris from '../../../../asset/umum/keris.png';

	const { data } = $props();
	console.log('Data yang diterima:', data);
	const anggota = data.detil_aset;
	let gambar = anggota.gambartop;
	let nama = anggota.nama;
	let lagu = anggota.lagu;
	let aset = anggota.aset;
	let isi = anggota.isi;
	let kepemilikan = anggota.kepemilikan;
	let gambar1 = anggota.gambar1;
	let gambar2 = anggota.gambar2;
	let gambar3 = anggota.gambar3;
	let gambar4 = anggota.gambar4;

	let playingState = 'paused'
	let song = new Audio(lagu)

	function togglePlaying() {
		playingState === 'paused'? play() : pause()
	}
	
	function loadSong() {
		song.volume = 0.2
		song.play()		
	}

	function play() {
		if (playingState === 'playing') {
			pause()
		}
		
		playingState = 'playing'
		loadSong()
	}

	function pause() {
		playingState = 'paused'
		song.pause()
	}	

</script>

<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<!-- Section 1 -->
<Navbar></Navbar>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

<section class="relative w-full">
	<div class="relative">
		<img src={gambar} alt="" class="min-w-screen min-h-screen object-cover" />
		<div class="absolute inset-0 flex items-center justify-center">
			<p class="absolute left-10 top-[15%]">
				<a href="/umum/daftaraset">
					<span class="ph--arrow-bend-up-left-bold mt-3"></span>
					Kembali Ke Daftar Aset
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
					<img src={gambar1} class="h-auto w-full rounded-lg object-cover" alt="" />
					{#if lagu == ''}
						<div class="mt-4 flex justify-center gap-1 lg:gap-4">
							<span class="material-symbols--arrow-circle-left-rounded self-center"></span>
							<img src={gambar2} class="h-16 w-auto rounded-lg object-cover lg:h-24" alt="" />
							<img src={gambar3} class="h-16 w-auto rounded-lg object-cover lg:h-24" alt="" />
							<img src={gambar4} class="h-16 w-auto rounded-lg object-cover lg:h-24" alt="" />
							<span class="material-symbols--arrow-circle-right self-center"></span>
						</div>
					{/if}
				</div>
				<div>
					<p class="flex items-center self-center text-start text-xl font-semibold">
						{nama}
						{#if lagu !== ''}
							<button class="gg--play-button-o ml-3" onclick={togglePlaying}></button>
						{/if}

						<!-- {lagu ? <span class="gg--play-button-o ml-3"></span> : ""} -->
					</p>
					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<img src={keris} alt="" />
						</div>
						<p class="ml-2 items-center text-start">Jenis Aset : {aset}</p>
					</div>

					<div class="mt-5 flex items-center">
						<div
							class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border bg-yellow-600"
						>
							<span class="bxs--castle"></span>
						</div>
						<p class="ml-2 items-center text-start">Kepemilikan : {kepemilikan}</p>
					</div>

					<p class="mt-3 text-start text-sm">{isi}</p>
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
		.edit {
			margin-top: 50%;
			margin-bottom: 10px;
		}
	}
	.gg--play-button-o {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23F9D48B'%3E%3Cpath fill-rule='evenodd' d='M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m0 2c6.075 0 11-4.925 11-11S18.075 1 12 1S1 5.925 1 12s4.925 11 11 11' clip-rule='evenodd'/%3E%3Cpath d='m16 12l-6 4.33V7.67z'/%3E%3C/g%3E%3C/svg%3E");
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
