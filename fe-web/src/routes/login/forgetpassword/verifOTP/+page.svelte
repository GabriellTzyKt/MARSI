<script lang="ts">
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { ssrModuleExportsKey } from 'vite/module-runner';
	import image from '../../../../asset/Logo_MARSI_login.png';
	import { subset } from 'd3';
	import { fade, fly } from 'svelte/transition';

	let email = $state('Masukkan Email Anda');
	let tipe = $state('password');
	let password = $state('password');

	let notelp = $state('08963333333333');

	let tipelogin = $state('email');
	let txtlogin = $state('Email');
	let trans = $state(false);

	let sucess = $state(false);
	const toggle = () => {
		if (sucess) {
			sucess = false;
		} else {
			sucess = true;
		}
	};
</script>

<div class="bg-login flex items-center justify-center">
	<div class="mx-4 rounded-lg border bg-white px-2 py-3 sm:px-10 sm:py-8 md:px-16 md:py-8">
		<div class="flex flex-col gap-4">
			<div class="flex justify-center text-center">
				<img src={image} alt="" class="w-26 h-auto" />
			</div>
			<div class="sm:px-10 md:px-32">
				<p class="text-center text-4xl font-[600]">Forgot Password</p>
				<p class="text-md mt-4 text-center">
					Masukkan 6-digit kode yang telah dikirim ke email anda.
				</p>
			</div>
			<form action="">
				<div class="mt-3">
					<div class="flex flex-col">
						<input
							type="text"
							class="bg-input border-none py-2"
							placeholder="Masukkan 6 digit kode anda"
						/>
					</div>
					<div class="mt-4 flex flex-col">
						<div class="flex flex-col items-center justify-center text-center">
							<!-- <a href="/login" class="bg-bt mt-5 w-full py-3 font-[650] text-white">Selanjutnya</a> -->
							<!-- svelte-ignore a11y_consider_explicit_label -->
							<button onclick={toggle} class="bg-bt mt-5 w-full py-3 font-[650] text-white"
								>Selanjutnya</button
							>
						</div>
						<div class="batas mb-3 mt-3"></div>
						<div class="flex flex-row items-center justify-center text-center">
							<div>
								<p class="txt-pm text-sm font-[600]">⬅️ Kembali ke</p>
							</div>
							<div class="ms-2">
								<a href="/signup" class="txt-pass text-sm font-[600] underline">Sign In</a>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>

{#if sucess}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SucessModal text="Password Berhasil Diganti!" to="/login" open={sucess} on:close={toggle}
		></SucessModal>
	</div>
{/if}

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
