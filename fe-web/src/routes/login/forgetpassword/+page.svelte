<script lang="ts">
	import image from '../../../asset/Logo_MARSI_login.png';
	let email = $state('Masukkan Email Anda');
	let tipe = $state('password');
	let password = $state('password');

	let notelp = $state('08963333333333');

	let tipelogin = $state('email');
	let txtlogin = $state('Email');
	let trans = $state(false);
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
					Silahkan masukkan alamat Email dan kami akan mengirim kode untuk mengatur ulang password
					anda.
				</p>
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
						<div class="flex flex-col items-center justify-center text-center">
							<a href="" class="bg-bt mt-10 w-full py-3 font-[650] text-white">Selanjutnya</a>
						</div>
						<p class=" items-start text-center text-xl text-red-700 md:text-start">
							(Temp) Email mu gabener rek!
						</p>
						<div class="batas mb-3 mt-3"></div>
						<div class="mt-5 flex flex-row items-center justify-center text-center">
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
