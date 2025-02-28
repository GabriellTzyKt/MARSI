<script lang="ts">
	import Footer from '$lib/footer/Footer.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
</script>

<Navbar></Navbar>

<section class="h-auto w-full mb-5">
	<div class="flex flex-col items-center">
		<p class="mt-10 text-center text-2xl font-bold">Kelompok</p>
		<div class="mb-5 ml-12 mt-2 flex w-[95%] items-center gap-2 text-start">
			<p class="h-auto">ID Abdi</p>
			<input class="rounded-lg border px-2 py-1" type="text" placeholder="Masukkan ID Abdi" />
			<button class="w-15 h-10 rounded-lg border-2 bg-blue-600 text-white"> Cari </button>
		</div>
		<div class="w-[90%] rounded-lg border bg-gray-300">
			<div class="grid lg:grid-cols-3 grid-cols-1">
				<div class="h-136 m-2 flex flex-col rounded-lg border">
					<div class="relative mx-auto mt-5 flex w-full items-center justify-center">
						<img src={gambardefault} class="relative ml-5 mr-5 h-16 w-16 rounded-full" alt="" />
						<span class="mdi--edit absolute"></span>
					</div>
					<div class="mt-2">
						<p class="text-ms ml-5">Nama :</p>
						<p class="text-ms ml-5">Temp</p>
						<p class="text-ms ml-5">Nama Dalem :</p>
						<p class="text-ms ml-5">temp</p>
						<p class="text-ms ml-5">Jenis Kelamin :</p>
						<p class="text-ms ml-5">temp</p>
						<p class="text-ms ml-5">No Telepon :</p>
						<p class="text-ms ml-5">temp</p>
						<p class="text-ms ml-5">Hobi :</p>
						<p class="text-ms ml-5">temp</p>
						<p class="text-ms ml-5">Jabatan Organisai :</p>
						<p class="text-ms ml-5">temp</p>
						<p class="text-ms ml-5">Jabatan Komunitas :</p>
						<p class="text-ms ml-5">temp</p>
						<p class="text-ms ml-5">Gelar :</p>
						<p class="text-ms ml-5">temp</p>
					</div>
				</div>
				<div class="m-2 rounded-lg border">
					<p class="ml-5 mt-3">Riwayat Komunitas</p>
					<div class="mt-2 mx-auto h-20 w-[90%] rounded-lg border px-2 py-2 text-xs">
						<p>Nama Acara</p>
						<p>Didirikan</p>
						<p>Tanggal</p>
						<p>Oleh</p>
					</div>
				</div>
				<div class="flex flex-col">
					<div class="h-66 m-2 rounded-lg border overflow-auto mt-2">
						<p class="ml-5 mt-3 mb-4">Riwayat Acara</p>
						<div class="mt-2 mx-auto h-20 w-[90%] rounded-lg border px-2 py-2 text-xs">
							<p>Nama Acara</p>
							<p>Didirikan</p>
							<p>Tanggal</p>
							<p>Oleh</p>
						</div>
                        <div class="mt-2 mx-auto h-20 w-[90%] rounded-lg border px-2 py-2 text-xs">
							<p>Nama Acara</p>
							<p>Didirikan</p>
							<p>Tanggal</p>
							<p>Oleh</p>
						</div>
                        <div class="mt-2 mx-auto h-20 w-[90%] rounded-lg border px-2 py-2 text-xs">
							<p>Nama Acara</p>
							<p>Didirikan</p>
							<p>Tanggal</p>
							<p>Oleh</p>
						</div>
                        <div class="mt-2 mx-auto h-20 w-[90%] rounded-lg border px-2 py-2 text-xs">
							<p>Nama Acara</p>
							<p>Didirikan</p>
							<p>Tanggal</p>
							<p>Oleh</p>
						</div>
					</div>
                    <div class="h-66 m-2 rounded-lg border overflow-auto mt-2">
						<p class="ml-5 mt-3 mb-4">Riwayat Situs</p>
						<div class="mt-2 mx-auto h-20 w-[90%] rounded-lg border px-2 py-2 text-xs">
							<p>Nama Acara</p>
							<p>Didirikan</p>
							<p>Tanggal</p>
							<p>Oleh</p>
						</div>
                        <div class="mt-2 mx-auto h-20 w-[90%] rounded-lg border px-2 py-2 text-xs">
							<p>Nama Acara</p>
							<p>Didirikan</p>
							<p>Tanggal</p>
							<p>Oleh</p>
						</div>
                        <div class="mt-2 mx-auto h-20 w-[90%] rounded-lg border px-2 py-2 text-xs">
							<p>Nama Acara</p>
							<p>Didirikan</p>
							<p>Tanggal</p>
							<p>Oleh</p>
						</div>
                        <div class="mt-2 mx-auto h-20 w-[90%] rounded-lg border px-2 py-2 text-xs">
							<p>Nama Acara</p>
							<p>Didirikan</p>
							<p>Tanggal</p>
							<p>Oleh</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="flex h-full min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
</style>
