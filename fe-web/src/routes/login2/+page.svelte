<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { scaleUtc, timeout } from 'd3';
	import image from '../../asset/Logo_MARSI_login.png';
	import SModal from '$lib/popup/SModal.svelte';

	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';

	let { form, data } = $props();
	let errorMessage = $state('');

	// Check for error parameter in URL
	$effect(() => {
		const error = $page.url.searchParams.get('error');
		if (error === 'inactive') {
			errorMessage = 'Akun admin tidak aktif. Silahkan hubungi administrator.';
		}
		console.log("Error message : ", errorMessage)
	});

	let open = $state(false);
	onMount(() => {
		if (form?.success) {
			open = true;
			setTimeout(() => {
				open = false;
				goto('/admin/beranda');
			}, 2000);
		}
	});
	let error = $state();

	let inputt = $state('');
	if (form?.username) {
		inputt = form.username.toString();
	}
	let tipe = $state('password');
	let trans = $state(false);
	let loading = $state(false);
	let errB = $state();
</script>

{#if open}
	<SModal text="Berhasil Login"></SModal>
{/if}
{#if navigating.to}
	<Loader text="Navigating.."></Loader>
{:else if loading}
	<Loader text="Loading.."></Loader>
{/if}
<div class="bg-login flex items-center justify-center">
	<div class="rounded-lg border bg-white px-2 py-3 sm:px-10 sm:py-8 md:px-16 md:py-8">
		<div class="flex flex-col gap-4">
			<div class="flex justify-center text-center">
				<img src={image} alt="" class="w-26 h-auto" />
			</div>
			<div class="sm:px-10 md:px-32">
				<p class="text-center text-4xl font-[600]">Selamat Datang!</p>
				<p class="text-md mt-4 text-center">Silahkan Sign in dibawah Untuk Melanjutkan</p>
			</div>
			<form
				method="post"
				action="?/register"
				use:enhance={() => {
					loading = true;
					return async ({ result }) => {
						loading = false;
						console.log("Form submission result:", result);
						
						if (result.type === 'success') {
							let timer: number;
							open = true;
							
							// Check admin type from the result
							const adminType : any = result.data?.adminType;
							const id : any = result.data?.id_kerajaan
							console.log("Admin type from result:", adminType);
							console.log("Admin dat : ", result.data?.id_kerajaan);
							
							// Redirect based on admin type
							timer = setTimeout(() => {
								open = false;
								
								// If admin type is "admin kerajaan", redirect to a specific page
								if (adminType && adminType.toLowerCase() === 'admin kerajaan') {
									console.log("Redirecting to admin kerajaan page");
									goto(`/admin/aplikasiKerajaan/${id}`);
								} else {
									// Default redirect for super admin or other types
									console.log("Redirecting to default admin page");
									goto('/admin/beranda');
								}
							}, 3000);
						}
						
						if (result.type === 'failure') {
							error = result.data?.errors;
							errB = result.data?.errorB;
							
							// If account is inactive, redirect to error page or show specific message
							if (result.data?.inactive) {
								errorMessage = "Akun tidak aktif. Silahkan hubungi administrator.";
							}
						}
					};
				}}
			>
				<div class="mt-3">
					<!-- Display error message for inactive account -->
					{#if errB}
						{console.log("ya")}
						<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
							<strong class="font-bold">Error!</strong>
							<span class="block sm:inline">{errB}</span>
						</div>
					{/if}
					
					
					<div class="flex flex-col">
						<p class="mb-2">Masukkan Username</p>

						<input
							type="text"
							name="username"
							id="username"
							placeholder="Masukkan Userame Anda"
							class="bg-input border-none py-2"
							bind:value={inputt}
						/>
						{#if error}
							{#each error.username as e}
								<p class="my-2 text-red-500">{e}</p>
							{/each}
						{/if}
					</div>
					<div class="mt-4 flex flex-col">
						<div>
							<p class="mb-2">Password</p>
						</div>
						<div class="bg-input flex items-center justify-between">
							<div class="flex-grow">
								<input
									type={tipe}
									name="pass"
									id="pass"
									placeholder="password"
									class="bg-input w-full border-none focus:outline-none"
								/>
							</div>
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<div
								class="p-2"
								onclick={() => {
									if (!trans) {
										trans = true;
										tipe = 'text';
									} else {
										trans = false;
										tipe = 'password';
									}
								}}
							>
								{#if trans}
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
											d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
										/>
									</svg>
								{/if}
							</div>
						</div>
						<div>
							<p class="text-xs">
								It must be a combination of minimum 8 letters, numbers & symbols
							</p>
							{#if error}
								{#each error.pass as p}
									<p class="my-1 text-red-500">{p}</p>
								{/each}
							{/if}
						</div>
						<div class="mb-3 flex items-center justify-between">
							<div class="mb-2 mt-2 flex items-center gap-2">
								<input type="checkbox" id="rm" value="yes" name="remember_me" />
								<label for="rm">Remember Me</label>
							</div>
							<div>
								<a href="/forgotPassword" class="txt-pass">Forgot Password?</a>
							</div>
						</div>
						<div class="flex items-center justify-center text-center">
							<button class="bg-bt w-full py-3 font-[650] text-white" type="submit">Log In</button>
						</div>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
					</div>
				</div>
			</form>
		</div>
	</div>
</div>

<style>
	.bg-login {
		background-attachment: fixed;
		background-image: url('../../asset/gambar-login.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		min-height: 100vh;
	}
	.bg-input {
		background-color: #f2f4f8;
	}
	.txt-pass {
		color: #0000ff;
	}
	.bg-bt {
		background-color: #c1a411;
	}
	.batas {
		background-color: #dde1e6;
		padding-top: 0.25%;
	}
	.bg-sc {
		background-color: #f9d48b;
	}
	.txt-pm {
		color: #c1a411;
	}
</style>

<!-- Display error message from URL parameter -->
{#if errorMessage}
	<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
		<strong class="font-bold">Error!</strong>
		<span class="block sm:inline">{errorMessage}</span>
	</div>
{/if}

<!-- Display error from form submission -->
{#if form?.errorB}
	<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
		<strong class="font-bold">Error!</strong>
		<span class="block sm:inline">{form.errorB}</span>
	</div>
{/if}
