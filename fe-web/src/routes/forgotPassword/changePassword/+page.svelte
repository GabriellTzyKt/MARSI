<script lang="ts">
	import { enhance } from '$app/forms';
	import Loader from '$lib/loader/Loader.svelte';
	import { error } from '@sveltejs/kit';
	import image from '../../../asset/Logo_MARSI_login.png';
	import SModal from '$lib/popup/SModal.svelte';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import Loader1 from '$lib/loader/Loader1.svelte';

	let errors = $state();
	let loading = $state(false);
	let success = $state(false);
	let p1 = $state(true);
	let p2 = $state(true);
</script>

{#if loading}
	<Loader></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if success}
	<SModal text="Berhasil mengganti password"></SModal>
{/if}
<div class="bg-login flex items-center justify-center">
	<div class="m-4 flex flex-col justify-center bg-white p-6">
		<div class="flex justify-center p-6 text-center">
			<img src={image} alt="" />
		</div>
		<div class="mb-2 mt-2 flex justify-center">
			<p class="text-center text-4xl font-[700] md:px-[100px]">Change Password</p>
		</div>
		<div class=" flex justify-center px-4">
			<p class=" text-center text-lg">Silahkan masukkan password baru anda.</p>
		</div>
		<form
			action="?/changePassword"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						errors = null;
						success = true;
						setTimeout(() => {
							success = false;
							goto('/login2');
						}, 2500);
					}
					if (result.type === 'failure') {
						errors = result.data?.errors;
						console.log(errors);
					}
				};
			}}
		>
			<div class="mt-4 flex flex-col gap-1">
				<div>
					<p>Password</p>
				</div>
				<div class="flex items-center justify-between border border-black px-1">
					<div class="flex grow">
						<input
							type={p1 ? 'password' : 'text'}
							placeholder="Masukkan password baru anda"
							name="password"
							class="flex w-full border-none outline-none focus:outline-none focus:ring-0"
							id=""
						/>
					</div>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class=" cursor-pointer"
						onclick={() => {
							p1 = !p1;
						}}
					>
						{#if p1}
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
						{:else if !p1}
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
				{#if errors}
					<div>
						<p class="text-left text-red-500">
							{#each errors.password as r}
								<p class="text-left text-red-500">{r}</p>
							{/each}
						</p>
					</div>
				{/if}
			</div>
			<div class="mt-4 flex flex-col gap-1">
				<div>
					<p>Confirm Password</p>
				</div>
				<div class="flex items-center justify-between border border-black px-1">
					<div class="flex grow">
						<input
							type={p2 ? 'password' : 'text'}
							placeholder="Masukkan password baru anda"
							name="confirmPassword"
							class="flex w-full border-none outline-none focus:outline-none focus:ring-0"
							id=""
						/>
					</div>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="cursor-pointer"
						onclick={() => {
							p2 = !p2;
						}}
					>
						{#if p2}
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
						{:else if !p2}
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
				{#if errors}
					<div>
						{#each errors.confirmPassword as r}
							<p class="text-left text-red-500">{r}</p>
						{/each}
					</div>
				{/if}
			</div>
			<div class="mt-4 flex">
				<button class="w-full bg-[#C1A411] py-2 text-center text-white">Change Password</button>
			</div>
			<div class="mb-6 mt-6 flex flex-auto items-center justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="#C1A411"
					class="size-4"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
				</svg>

				<p class="text-center text-[#C1A411]">Kembali ke</p>
				<a href="/login2" class="ms-2 text-center text-blue-600 underline">sign in</a>
			</div>
		</form>
	</div>
</div>

<style>
	.bg-login {
		background-attachment: fixed;
		background-image: url('../../../asset/gambar-login.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		min-height: 100vh;
	}
</style>
