<script lang="ts">
	import Nav from '$lib/nav/Nav.svelte';
	import bg from '$lib/assets/icon/badran-logo-big.png';
	import Footer from '$lib/footer/Footer.svelte';
	let temp: string[] = $state([]);
	let username = $state('');
	let pass = $state('');
	let cek = $derived(() => {
		temp = [];
		if (username.length < 8) {
			temp.push('username harus minimal 8 kata');
		}
		if (pass.length < 8) {
			temp.push('password harus minimal 8 kata');
		}
	});
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

<div class=" max-w-screen flex min-h-screen flex-col">
	<Nav></Nav>

	<div class="bg flex grow flex-col items-center justify-center">
		<div
			class="mx-8 mb-10 mt-10 flex flex-col justify-center rounded-md bg-white/60 p-2 md:mx-0 md:mb-0 md:mt-0 md:p-4"
		>
			<div class="flex items-center justify-center">
				<img src={bg} class="h-26 w-auto rounded-full bg-gray-200/40 p-3" alt="" />
			</div>
			<div class="text center mx-32 mt-4">
				<p class="text-3xl font-[500]">Masuk</p>
			</div>
			<div class="flex w-full flex-col">
				<form action="" class="w-full">
					<div class="mt-3 flex min-w-full flex-col justify-start">
						<div class="flex text-start">
							<p>Username</p>
						</div>
						<div class="flex w-full">
							<input
								type="text"
								class="w-full rounded-md border bg-white py-2 pe-2 ps-2"
								required
								bind:value={username}
							/>
						</div>
					</div>
					<div class="mt-3 flex flex-col justify-start">
						<div class="flex text-start">
							<p>Kata Sandi</p>
						</div>
						<div class="flex w-full">
							<input
								type="password"
								class="w-full rounded-md border bg-white py-2 pe-2 ps-2"
								required
								bind:value={pass}
							/>
						</div>
					</div>
				</form>
			</div>
			<div class="mb-3 mt-3 flex flex-col items-center justify-start text-left">
				{#each temp as t}
					<p class="block text-left text-xl text-red-500">{t}</p>
				{/each}
			</div>
			<div class="flex w-full items-center justify-center">
				<button class="bg-badran-bt w-full rounded-full py-2 text-white" onclick={cek}>Masuk</button
				>
			</div>
			<div class="flex items-center justify-center">
				<p class="me-2">Belum punya akun?</p>
				<a href="/signup" class=" text-badran-bt">Daftar</a>
			</div>
		</div>
	</div>
	<Footer></Footer>
</div>

<style>
	.bg {
		background-image: url('../../lib/assets/image.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>
