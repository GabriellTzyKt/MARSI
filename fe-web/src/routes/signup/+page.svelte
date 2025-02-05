<script lang="ts">
	import image from '../../asset/Logo_MARSI_login.png';
	let nomortelp = $state('');
	let password = $state('');
</script>

<div class="bg-image">
	<div class="form-container">
		<div class="content-wrapper">
			<div class="text-content mt-10 text-left font-semibold">
				<p class="text-3xl">Selamat Datang!</p>
				<p class="text-md mt-5">Silahkan login terlebih dahulu untuk melanjutkan</p>
			</div>
			<img class="image" src={image} alt="" />
		</div>
		<div class="mr-10 flex flex-col">
			<div class="text-content input-group mt-6 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nomor Telepon</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					bind:value={nomortelp}
					placeholder="John Doe"
				/>
			</div>
			<div class="text-content input-group mt-6 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="password">Password</label>
				<input
					class="input-field rounded-lg border p-2"
					type="password"
					id="password"
					bind:value={password}
					placeholder="Password"
				/>
			</div>
			<p class="text-content mt-2 self-start text-sm font-bold">
				It must be a combination of minimum 8 letters, numbers, and symbols.
			</p>
		</div>

		<div class="content-wrapper1 text-content mt-6 flex items-center justify-between">
			<div class="flex items-center">
				<input type="checkbox" id="rememberMe" class="mr-2" />
				<label for="rememberMe" class="text-md">Remember me</label>
			</div>
			<p class="text-blue-custom mr-10 underline">Forget Password?</p>
		</div>

		<div class="text-content input-group mr-10 mt-6 flex flex flex-col flex-col gap-1">
			<button class="input-field bg-customDarkYellow rounded-lg border p-2" placeholder="John Doe">
				Log in
			</button>
			<p>
				--------------------------------------------------------------------------------------------------------
			</p>
			<p>Or Login with</p>
		</div>
	</div>
</div>

<style>
	.text-blue-custom {
		color: blue;
	}

	.content-wrapper {
		display: grid;
		grid-template-columns: 2fr 1fr;
		justify-content: space-between;
		align-items: center;
		gap: 20px;
	}

	.content-wrapper1 {
		display: flex;
		align-items: center;
		gap: 20px;
		justify-content: space-between;
	}

	.text-content {
		padding-left: 40px;
	}

	.image {
		justify-self: end;
		margin-top: 20px;
		padding-right: 50px;
	}

	.bg-image {
		background: url('../../asset/gambar-login.png') no-repeat center center;
		background-size: cover;
		background-color: azure;
		width: 100%;
		height: 100vh;
		position: absolute;
	}

	.form-container {
		margin-top: 60px;
		margin-left: 20px;
		margin-right: 20px;
		justify-self: center;
		background: whitesmoke;
		padding: 20px;
		border-radius: 10px;
		width: 50rem;
		height: 50rem;
		text-align: center;
	}
</style>
