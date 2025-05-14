<script lang="ts">
	import { enhance } from '$app/forms';
	import Loader from '$lib/loader/Loader.svelte';
	import { error } from '@sveltejs/kit';
	import image from '../../asset/Logo_MARSI_login.png';
	import SModal from '$lib/popup/SModal.svelte';
	import { goto } from '$app/navigation';
	let errors = $state();
	let loading = $state(false);
	let success = $state(false);
	let otpmode = $state(false);
	let timer: number;
</script>

{#if loading}
	<Loader></Loader>
{/if}
{#if success}
	<SModal text="Berhasil mengirim OTP"></SModal>
{/if}
<div class="bg-login flex items-center justify-center">
	<div class="m-4 flex flex-col justify-center bg-white p-4">
		<div class="flex justify-center p-6 text-center">
			<img src={image} alt="" />
		</div>
		<div class="mb-2 mt-2 flex justify-center">
			<p class="text-center text-4xl font-[700] md:px-[100px]">Forgot Password</p>
		</div>
		{#if otpmode}
			<div class=" flex justify-center px-4">
				<p class=" text-center text-lg">
					Silahkan masukkan kode OTP yang telah dikirim ke email anda.
				</p>
			</div>
			<form
				action="?/sendOTP"
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
								otpmode = false;
								goto('/forgotPassword/changePassword');
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
						<p>OTP</p>
					</div>
					<div>
						<input
							type="text"
							placeholder="Masukkan 6-digit kode anda"
							name="input"
							class="flex w-full"
							id=""
						/>
					</div>
					{#if errors}
						<div>
							<p class="text-left text-red-500">
								{errors.input ? errors.input[0] : errors}
							</p>
						</div>
					{/if}
				</div>
				<div class="mt-4 flex">
					<button class="w-full bg-[#C1A411] py-2 text-center text-white">Verifikasi</button>
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
		{:else}
			<div class=" flex justify-center">
				<p class=" text-center text-lg">
					Silahkan masukkan alamat Email dan kami akan mengirim kode untuk mengatur ulang password
					anda.
				</p>
			</div>
			<form
				action="?/otp"
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
								otpmode = true;
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
						<p>Username/Email</p>
					</div>
					<div>
						<input
							type="text"
							placeholder="username/email"
							name="input"
							class="flex w-full"
							id=""
						/>
					</div>
					{#if errors}
						<div>
							<p class="text-left text-red-500">
								{errors.input[0] ? errors.input[0] : errors}
							</p>
						</div>
					{/if}
				</div>
				<div class="mt-4 flex">
					<button class="w-full bg-[#C1A411] py-2 text-center text-white">Selanjutnya</button>
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
		{/if}
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
</style>
