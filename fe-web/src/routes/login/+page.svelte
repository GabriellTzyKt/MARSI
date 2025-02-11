<script lang="ts">
	import image from '../../asset/Logo_MARSI_login.png';
	let nomortelp = $state('');
	let password = $state('');
	let passwords = $state('password');

	let show = $state('lineicons--eye');

	function click() {
		if (show.includes('lineicons--eye')) {
			show = 'mdi-light--eye-off';
			passwords = 'text';
		} else {
			show = 'lineicons--eye';
			passwords = 'password';
		}
	}
</script>

<div class="bg-image flex min-h-screen items-center justify-center p-4">
	<div
		class="form-container w-full max-w-md rounded-lg bg-white p-6 shadow-lg sm:max-w-lg md:max-w-xl lg:max-w-3xl"
	>
		<div class="content-wrapper flex flex-col-reverse items-center justify-between md:flex-row">
			<div class="text-content w-full text-center md:w-1/2 md:text-left">
				<p class="text-3xl font-semibold">Selamat Datang!</p>
				<p class="text-md mt-3">Silahkan login terlebih dahulu untuk melanjutkan</p>
			</div>

			<div class="order-last flex w-full justify-center md:order-none md:w-1/2 md:justify-end">
				<img class="mt-5 w-32 md:mt-0 md:w-40" src={image} alt="Logo" />
			</div>
		</div>

		<div class="mt-6 space-y-4">
			<div>
				<label class="text-md block font-medium">Nomor Telepon</label>
				<input
					class="input-field mt-1 w-full rounded-lg border p-2"
					type="text"
					bind:value={nomortelp}
					placeholder="John Doe"
				/>
			</div>

			<div>
				<label class="text-md block font-medium">Password</label>
				<div class="relative">
					<input
						class="input-field mt-1 w-full rounded-lg border p-2 pr-10"
						type={passwords}
						bind:value={password}
						placeholder="Password"
					/>
					<span class={`${show} absolute right-3 top-3 cursor-pointer`} onclick={click}></span>
				</div>
			</div>

			<p class="text-sm font-bold text-gray-600">
				It must be a combination of at least 8 letters, numbers, and symbols.
			</p>
		</div>

		<div class="mt-6 flex items-center justify-between">
			<div class="flex items-center">
				<input type="checkbox" id="rememberMe" class="mr-2" />
				<label for="rememberMe" class="text-md">Remember me</label>
			</div>
			<a href="login/forgetpassword" class="cursor-pointer text-blue-600 underline"
				>Forget Password?</a
			>
			<!-- <p class="text-blue-600 underline cursor-pointer">Forget Password?</p> -->
		</div>

		<div class="mt-6">
			<button
				class="w-full rounded-lg bg-yellow-500 py-2 font-semibold text-white transition hover:bg-yellow-600"
				>Log in</button
			>
		</div>

		<div class="mt-6 items-center justify-center">
			<div class="h-px w-full bg-gray-300"></div>
			<p class="mx-3 mb-3 mt-3 text-center text-gray-500">Or Login with:</p>
			<div class="h-px w-full bg-gray-300"></div>
		</div>

		<div class="mt-6">
			<button
				class="w-full rounded-lg bg-orange-500 py-2 font-semibold text-white transition hover:bg-orange-600"
				>Email</button
			>
		</div>

		<p class="mt-4 text-center text-gray-600">
			Belum ada akun? <a href="/" class="text-blue-600 underline">Daftar disini</a>
		</p>
	</div>
</div>

<style>
	.bg-image {
		background: url('../../asset/gambar-login.png') no-repeat center center;
		background-size: cover;
		background-color: azure;
	}

	.lineicons--eye,
	.mdi-light--eye-off {
		width: 24px;
		height: 24px;
		color: black;
		display: inline-block;
	}
</style>
