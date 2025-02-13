<script lang="ts">
	import gambar from '$lib/asset/kerajaan/image.svg';
	import Footer from '$lib/footer/Footer.svelte';
	import gambar2 from '$lib/asset/kerajaan/temp_gbr_login.png';
	import Navbar from '$lib/navbarLogin/Navbar.svelte';
</script>

<!-- Navbar -->
<Navbar></Navbar>

<!-- Singup Page -->
<section class="flex-shrink-0">
	<div class="relative">
		<img src={gambar} alt="" class="h-full w-full" />
		<div class="absolute left-0 top-0 flex h-full w-full items-center justify-center p-4">
			<div
				class="h-fit w-full max-w-[450px] rounded-lg border border-gray-500 bg-gray-200 p-6 opacity-90"
			>
				<div class="mt-6 inline-flex w-full justify-center">
					<div class="relative">
						<div class="absolute inset-0 rounded-full bg-gray-600 opacity-80"></div>
						<img src={gambar2} alt="" class="relative h-auto w-auto rounded-xl" />
					</div>
				</div>

				<div class="mt-4 flex flex-col">
					<label for="username" class="text-md">Username</label>
					<input
						type="text"
						id="username"
						class="mt-2 w-full rounded-md border border-black bg-white p-2"
					/>
				</div>
				<div class="mt-4 flex flex-col">
					<label for="password" class="text-md">Kata Sandi</label>
					<input
						type="password"
						id="password"
						class="mb-12 mt-2 w-full rounded-md border border-black bg-white p-2"
					/>
				</div>

				<div class="mt-6 flex flex-col">
					<button class="mt-5 w-full rounded-lg bg-blue-600 p-2 text-center text-white"
						>Lanjut</button
					>
					<p class="mt-3 pb-3 text-center">
						Belum punya akun? <span class="cursor-pointer text-blue-500 underline">Daftar</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Footer -->
<div class="relative">
	<Footer></Footer>
</div>

<div></div>

<style>
</style>
