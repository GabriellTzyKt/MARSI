<script lang="ts">
	import gambar from '$lib/asset/kerajaan/image.svg';
	import Footer from '$lib/footer/Footer.svelte';
	import gambar2 from '$lib/asset/kerajaan/temp_login.png';
	import Navbar from '$lib/navbarLogin/Navbar.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';

	let success = $state(false);

	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};
</script>

<!-- Navbar -->
<Navbar></Navbar>

<!-- Singup Page -->
<section class="flex min-h-screen w-full overflow-hidden">
	<div class="relative">
		<img src={gambar} alt="" class="h-full w-full object-cover" />
		<div class="absolute left-0 top-0 flex h-full w-full items-center justify-center p-4">
			<div
				class="max-h-[98vh] w-full max-w-[450px] rounded-lg border border-gray-500 bg-gray-200 p-6 opacity-90 lg:h-fit"
			>
				<div class="mt-6 inline-flex w-full justify-center">
					<div class="relative">
						<div class="absolute inset-0 rounded-full bg-gray-600 opacity-80"></div>
						<img
							src={gambar2}
							alt=""
							class="relative lg:h-auto lg:w-auto h-[100%] w-[100px] justify-center rounded-xl"
						/>
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
						class="mb-3 mt-2 w-full rounded-md border border-black bg-white p-2"
					/>
				</div>
				<div class="mt-4 flex flex-col">
					<label for="passwordconfirm" class="text-md">Konfirmasi Kata Sandi</label>
					<input
						type="password"
						id="passwordconfirm"
						class="mb-3 mt-2 w-full rounded-md border border-black bg-white p-2"
					/>
				</div>
				<div class="mt-6 flex flex-col">
					<button class="w-full rounded-lg bg-blue-600 p-2 text-center text-white" onclick={toggle}
						>Lanjut</button
					>
					<p class="mt-3 pb-3 text-center">
						Sudah punya akun? <span class="cursor-pointer text-blue-500 underline">Masuk</span>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

{#if success}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SuccessModal open={success} text="Akun Sudah Aktif!" to="/login" on:close={toggle}
		></SuccessModal>
	</div>
{/if}

<!-- Footer -->
<section class="flex h-fit min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
</style>
