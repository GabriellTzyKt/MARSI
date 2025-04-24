<script lang="ts">
	import gambar from '$lib/asset/kerajaan/image.svg';
	import Footer from '$lib/footer/Footer.svelte';
	import gambar2 from '$lib/asset/kerajaan/temp_login.png';
	import Navbar from '$lib/navbarLogin/Navbar.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	// import { error } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';

	let success = $state(false);
	let lanjut = $state(false);
	let closed = $state(false);
	let username = $state('');
	let closedC = $state(false);
	let type = $state('password');
	let loading = $state(false);
	let typeC = $state('password');
	let resError = $state();
	let valP = $state('');
	let valPC = $state('');
	let errors = $state([]);
	let errors2 = $state();
	console.log();
	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};
	function validatePass(pass: string) {
		const reg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
		return reg.test(pass);
	}
	function validateSamePass() {
		return valP === valPC;
	}
	function check() {
		errors = [];
		if (!validatePass(valP)) {
			errors.push(
				'Password harus minimal 8 karakter, mengandung angka, simbol, dan huruf kapital.'
			);
		}
		if (!validateSamePass()) {
			errors.push('Konfirmasi password tidak sama dengan password.');
		}
		if (username.trim().length === 0) {
			errors.push('Username Harus Diisi');
		}
		if (errors.length > 0) {
			return false;
		}
		lanjut = true;
		return true;
	}
</script>

<!-- Navbar -->
<Navbar></Navbar>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<form
	action="?/signin"
	method="post"
	use:enhance={() => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			if (result.type === 'success') {
				let timer;
				success = true;
				timer = setTimeout(() => {
					success = false;
					goto('/beranda');
				}, 3000);
			}
			if (result.type === 'failure') {
				errors2 = result.data?.errors;
				resError = result.data?.resError;
			}
		};
	}}
>
	<!-- Singup Page -->
	{#if !lanjut}
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
									class="relative h-[100%] w-[100px] justify-center rounded-xl lg:h-auto lg:w-auto"
								/>
							</div>
						</div>

						<div class="mt-4 flex flex-col">
							<label for="username" class="text-md">Username</label>
							<input
								type="text"
								id="username"
								bind:value={username}
								class="mt-2 w-full rounded-md border border-black bg-white p-2"
							/>
						</div>
						<div class="mt-4 flex flex-col">
							<label for="password" class="text-md">Kata Sandi</label>
							<div
								class=" flex w-full justify-between rounded-md border border-black bg-white py-2"
							>
								<input
									{type}
									id="password"
									bind:value={valP}
									class="grow ps-2 focus:outline-none"
								/>
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									class="mx-2 flex items-center justify-center"
									onclick={() => {
										if (!closed) {
											closed = true;
											type = 'text';
										} else {
											closed = false;
											type = 'password';
										}
									}}
								>
									{#if !closed}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-6"
										>
											<!-- svelte-ignore a11y_click_events_have_key_events -->
											<!-- svelte-ignore a11y_no_static_element_interactions -->
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
											/>
										</svg>
									{:else}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke-width="1.5"
											stroke="currentColor"
											class="size-6"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
											/>
										</svg>
									{/if}
								</div>
							</div>
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div class="mt-4 flex flex-col">
								<label for="passwordconfirm" class="text-md">Konfirmasi Kata Sandi</label>
								<div class="flex w-full justify-between rounded-md border border-black bg-white">
									<input
										type={typeC}
										id="passwordconfirm"
										class="grow py-2 ps-2 focus:outline-none"
										bind:value={valPC}
									/>
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<div
										class="me-2 ms-2 flex items-center justify-center"
										onclick={() => {
											if (!closedC) {
												closedC = true;
												typeC = 'text';
											} else {
												closedC = false;
												typeC = 'password';
											}
										}}
									>
										{#if !closedC}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="size-6"
											>
												<!-- svelte-ignore a11y_click_events_have_key_events -->
												<!-- svelte-ignore a11y_no_static_element_interactions -->
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
												/>
											</svg>
										{:else if closedC}
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												class="size-6"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
												/>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
												/>
											</svg>
										{/if}
									</div>
								</div>
								{#if errors}
									{#each errors as e}
										<p class="text-left text-red-500">{e}</p>
									{/each}
								{/if}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
							</div>
							<div class="mt-6 flex flex-col">
								<button
									type="button"
									class="w-full rounded-lg bg-blue-600 p-2 text-center text-white"
									onclick={() => {
										check();
									}}>Lanjut</button
								>
								<p class="mt-3 pb-3 text-center">
									Sudah punya akun? <span class="cursor-pointer text-blue-500 underline">Masuk</span
									>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	{:else}
		<section class="bg flex min-h-screen w-full items-center justify-center">
			<div
				class="flex w-[1000px] flex-col items-center justify-center gap-4 rounded-lg border border-gray-500 bg-gray-200/80 p-4"
			>
				<input type="text" hidden name="password" value={valP} />
				<input type="text" hidden name="username" value={username} />

				<div class="flex w-full justify-center">
					<p class=" text-5xl font-[700]">DAFTAR</p>
				</div>
				<div class="flex">
					<img src={gambar} class="h-32 w-auto" alt="" />
				</div>
				<div class="grid w-full grid-cols-1 md:grid-cols-2">
					<!-- nama lengkap -->
					<div class="flex w-full flex-col gap-2 p-2">
						<div>
							<p>Nama Lengkap</p>
						</div>
						<div>
							<input
								type="text"
								name="nama_lengkap"
								class="w-full rounded-lg border bg-white px-2 py-2 focus:outline-none"
								id=""
								placeholder="nama lengkap..."
							/>
						</div>
						<div>
							{#if errors2}
								{#each errors2.nama_lengkap as e}
									<p class="text-left text-red-500">{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					<!-- No HP -->
					<div class="flex w-full flex-col gap-2 p-2">
						<div>
							<p>No HP</p>
						</div>
						<div>
							<input
								type="phone"
								name="no_hp"
								class="w-full rounded-lg border bg-white px-2 py-2 focus:outline-none"
								id=""
								placeholder="0887...."
							/>
						</div>
						<div>
							{#if errors2}
								{#each errors2.no_hp as e}
									<p class="text-left text-red-500">{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					<!-- jenis_kelamin -->
					<div class="flex w-full flex-col gap-2 p-2">
						<div>
							<p>Jenis Kelamin</p>
						</div>
						<div>
							<select
								name="jenis_kelamin"
								class="w-full rounded-lg border bg-white px-2 py-2 focus:outline-none"
								id=""
								placeholder="Jenis Kelamin"
							>
								<option value="Laki-Laki">Laki-Laki</option>
								<option value="Perempuan">Perempuan</option>
							</select>
						</div>
						<div>
							{#if errors2}
								{#each errors2.jenis_kelamin as e}
									<p class="text-left text-red-500">{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					<!-- Wongso -->
					<div class="flex w-full flex-col gap-2 p-2">
						<div>
							<p>Wongso</p>
						</div>
						<div>
							<input
								type="text"
								name="wongso"
								class="w-full rounded-lg border bg-white px-2 py-2 focus:outline-none"
								id=""
								placeholder="wongso.."
							/>
						</div>
						<div>
							{#if errors2}
								{#each errors2.wongso as e}
									<p class="text-left text-red-500">{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					<!--  tempat lahir -->
					<div class="flex w-full flex-col gap-2 p-2">
						<div>
							<p>Tempat Lahir</p>
						</div>
						<div>
							<input
								type="text"
								name="tempat_lahir"
								class="w-full rounded-lg border bg-white px-2 py-2 focus:outline-none"
								id=""
								placeholder="tempat lahir..."
							/>
						</div>
						<div>
							{#if errors2}
								{#each errors2.tempat_lahir as e}
									<p class="text-left text-red-500">{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					<!-- Tanggal Lahir -->
					<div class="flex w-full flex-col gap-2 p-2">
						<div>
							<p>Tanggal Lahir</p>
						</div>
						<div>
							<input
								type="date"
								name="tanggal_lahir"
								class="w-full rounded-lg border bg-white px-2 py-2 focus:outline-none"
								id=""
							/>
						</div>
						<div>
							{#if errors2}
								{#each errors2.tanggal_lahir as e}
									<p class="text-left text-red-500">{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					<!-- Alamat -->
					<div class="flex w-full flex-col gap-2 p-2">
						<div>
							<p>Alamat</p>
						</div>
						<div>
							<input
								type="text"
								name="alamat"
								class="w-full rounded-lg border bg-white px-2 py-2 focus:outline-none"
								id=""
								placeholder="jl..."
							/>
						</div>
						<div>
							{#if errors2}
								{#each errors2.alamat as e}
									<p class="text-left text-red-500">{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					<!-- Email -->
					<div class="flex w-full flex-col gap-2 p-2">
						<div>
							<p>Email</p>
						</div>
						<div>
							<input
								type="email"
								name="email"
								class="w-full rounded-lg border bg-white px-2 py-2 focus:outline-none"
								id=""
								placeholder="...@gmail.com.."
							/>
						</div>
						<div>
							{#if errors2}
								{#each errors2.email as e}
									<p class="text-left text-red-500">{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					{#if resError}
						<div class="col-span-full flex w-full p-2">
							<p class="text-red-500">{resError}</p>
						</div>
					{/if}
					<div class="col-span-full flex w-full p-2">
						<button
							class="bg-badran-bt w-full cursor-pointer rounded-lg py-2 text-white"
							type="submit"
							onclick={() => {}}>Submit</button
						>
					</div>
					<div class="col-span-full flex w-full p-2">
						<button
							class="bg-badran-bt w-full cursor-pointer rounded-lg py-2 text-white"
							type="button"
							onclick={() => {
								lanjut = false;
							}}>Back To 1st Page</button
						>
					</div>
				</div>
				<div></div>
			</div>
		</section>
	{/if}
</form>
{#if loading}
	<Loader></Loader>
{/if}
{#if success}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SuccessModal text="Success!"></SuccessModal>
	</div>
{/if}

<!-- Footer -->
<section class="flex h-fit min-w-full overflow-hidden">
	<Footer></Footer>
</section>

<style>
	.bg {
		background-image: url('$lib/asset/kerajaan/image.svg');
	}
</style>
