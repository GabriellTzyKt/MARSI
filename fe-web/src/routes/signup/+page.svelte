<script lang="ts">
	import image from '../../asset/Logo_MARSI_login.png';
	let email = $state('Masukkan Email Anda');
	let tipe = $state('password');
	let password = $state('password');

	let notelp = $state('08963333333333');

	let tipelogin = $state('email');
	let txtlogin = $state('Email');
	let trans = $state(false);
</script>

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
			<form action="">
				<div class="mt-3">
					<div class="flex flex-col">
						<p class="mb-2">{txtlogin}</p>
						{#if tipelogin === 'email'}
							<input
								type={tipelogin}
								name=""
								id=""
								class="bg-input border-none py-2"
								bind:value={email}
								onfocus={() => {
									if (email === 'Masukkan Email Anda' && tipelogin === 'email') {
										email = '';
									}
								}}
								onblur={() => {
									if (email === '') {
										email = 'Masukkan Email Anda';
									}
								}}
							/>
						{:else}
							<input
								type={tipelogin}
								name=""
								id=""
								class="bg-input border-none py-2"
								bind:value={notelp}
								onfocus={() => {
									if (notelp === '08963333333333' && tipelogin === 'phone') {
										notelp = '';
									}
								}}
								onblur={() => {
									if (notelp === '') {
										notelp = '08963333333333';
									}
								}}
							/>
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
									name=""
									id=""
									bind:value={password}
									class="bg-input w-full border-none focus:outline-none"
									onfocus={() => {
										if (password === 'password') {
											password = '';
										}
									}}
									onblur={() => {
										if (password === '') {
											password = 'password';
										}
									}}
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
						</div>
						<div class="mb-3 flex items-center justify-between">
							<div class="mb-2 mt-2 flex items-center gap-2">
								<input type="checkbox" id="rm" />
								<label for="rm">Remember Me</label>
							</div>
							<div>
								<a href="/login/forgetpassword" class="txt-pass">Forgot Password?</a>
							</div>
						</div>
						<div class="flex items-center justify-center text-center">
							<a href="" class="bg-bt w-full py-3 font-[650] text-white">Log In</a>
						</div>
						<div class="batas mb-3 mt-3"></div>
						<div class="flex items-center justify-center text-center">Or Login With:</div>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="mt-3 flex w-full items-center justify-center text-center"
							onclick={() => {
								if (txtlogin === 'Email') {
									txtlogin = 'Nomer Telepon';
									tipelogin = 'phone';
								} else {
									txtlogin = 'Email';
									tipelogin = 'email';
								}
							}}
						>
							<div class="flex w-full">
								<a
									href=""
									class="flex w-full items-center gap-2 text-center justify-center opacity-20 hover:opacity-100 bg-orange-500 px-4 py-3 font-[650] text-white"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="18"
										height="18"
										viewBox="0 0 48 48"
									>
										<path
											fill="#ffc107"
											d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"
										/>
										<path
											fill="#ff3d00"
											d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"
										/>
										<path
											fill="#4caf50"
											d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"
										/>
										<path
											fill="#1976d2"
											d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"
										/>
									</svg>
									Google
								</a>
							</div>
						</div>
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
