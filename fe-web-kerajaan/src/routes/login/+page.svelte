<script lang="ts">
	import Nav from '$lib/nav/Nav.svelte';
	import bg from '$lib/assets/icon/badran-logo-big.png';
	import Footer from '$lib/footer/Footer.svelte';
	import { enhance } from '$app/forms';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { goto } from '$app/navigation';
	let temp: string[] = $state([]);
	let username = $state('');
	let pass = $state('');
	let errors = $state();
	let loading = $state(false);
	let success = $state(false);
	let cek = $derived(() => {
		temp = [];
		// if (username.length < 8) {
		// 	temp.push('username harus minimal 8 kata');
		// }
		// if (pass.length < 8) {
		// 	temp.push('password harus minimal 8 kata');
		// }
	});
	let apierror = $state();
</script>

<Nav></Nav>

{#if loading || navigating.to}
	<Loader></Loader>
{/if}
<div class="flex min-h-screen w-screen flex-col">
	<div class="bg min-w-screen flex w-full grow flex-col items-center justify-center">
		<div
			class=" mb-10 mt-10 flex flex-col justify-center rounded-md bg-white/60 p-2 md:p-4 xl:mx-0 xl:mb-0 xl:mt-0"
		>
			<div class="flex items-center justify-center">
				<img src={bg} class="h-26 w-auto rounded-full bg-gray-200/40 p-3" alt="" />
			</div>
			<div class="text center mx-32 mt-4">
				<p class="text-3xl font-[500]">Masuk</p>
			</div>
			<div class="flex w-full flex-col">
				<form
					action="?/login"
					class="w-full"
					method="post"
					use:enhance={() => {
						loading = true;
						return async ({ result }) => {
							loading = false;
							if (result.type === 'success') {
								success = true;
								let timer: number;
								let admin: any = result.data?.userCookie;
								console.log('admin', admin);
								timer = setTimeout(() => {
									success = false;
									if (!admin?.id_admin) {
										goto('/beranda');
									} else {
										goto('/abdi/dashboard');
									}
								}, 3000);
							}
							if (result.type === 'failure') {
								errors = result.data?.errors;
								apierror = result?.data?.apierror;
								console.log(apierror);
							}
						};
					}}
				>
					<div class="mt-3 flex min-w-full flex-col justify-start">
						<div class="flex text-start">
							<p>Username</p>
						</div>
						<div class="flex w-full">
							<input
								type="text"
								name="username"
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
								name="password"
								class="w-full rounded-md border bg-white py-2 pe-2 ps-2"
								required
								bind:value={pass}
							/>
							<p></p>
						</div>
					</div>
					<div class="mt-3 flex w-full items-center justify-center">
						<button class="bg-badran-bt w-full rounded-full py-2 text-white">Masuk</button>
					</div>
				</form>
			</div>
			<div class="mb-3 mt-3 flex flex-col items-center justify-start text-left">
				{#each temp as t}
					<p class="block text-left text-xl text-red-500">{t}</p>
				{/each}
			</div>
			{#if apierror}
				<p class="block text-left text-xl text-red-500">{apierror}</p>
			{/if}
			<div class="flex items-center justify-center">
				<p class="me-2">Belum punya akun?</p>
				<a href="/signup" class=" text-badran-bt">Daftar</a>
			</div>
		</div>
	</div>
	<Footer></Footer>
</div>
{#if success}
	<SuccessModal text="Berhasil Login"></SuccessModal>
{/if}

<style>
	.bg {
		background-image: url('../../lib/assets/image.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		overflow-x: hidden;
	}
</style>
