<script lang="ts">
	let nama = $state('');
	let nomortelp = $state('');
	let email = $state('');
	let nama_kerajaan = $state('');
	let jenis_kerajaan = $state('');
	let gelar = $state('');
</script>

<div class="flex w-full test">
	<a href="/admin/keanggotaan/daftaranggota"
		><button class="custom-button bg-customRed">⭠ Kembali</button></a
	>
	<p class="ml-5 mt-6 text-3xl font-bold underline">Tambah Anggota</p>
</div>

<div class="form-container">
	<form>
		<div class="input-group flex flex-col gap-1">
			<label class="text-md self-start text-left" for="nama">Nama Anggota</label>
			<input
				class="input-field rounded-lg border p-2"
				type="text"
				id="nama"
				bind:value={nama}
				placeholder="John Doe"
			/>
		</div>
		<div class="input-group mt-2 flex flex-col gap-1">
			<label class="text-md self-start text-left" for="nomor_telepon">Nomor Telepon</label>
			<input
				class="input-field rounded-lg border p-2"
				type="text"
				id="nomor_telepon"
				bind:value={nomortelp}
				placeholder="911"
			/>
		</div>
		<div class="input-group mt-2 flex flex-col gap-1">
			<label class="text-md self-start text-left" for="nama">Email</label>
			<input
				class="input-field rounded-lg border p-2"
				type="text"
				id="nama"
				bind:value={email}
				placeholder="azaza@gmail.com"
			/>
		</div>
		<div class="input-group mt-2 flex flex-col gap-1">
			<label class="text-md self-start text-left" for="nama">Jenis Kerajaan</label>
			<input
				class="input-field rounded-lg border p-2"
				type="text"
				id="nama"
				bind:value={jenis_kerajaan}
				placeholder="Kerajaan A"
			/>
		</div>
		<div class="input-group mt-2 flex flex-col gap-1">
			<label class="text-md self-start text-left" for="nama">Nama Kerajaan</label>
			<input
				class="input-field rounded-lg border p-2"
				type="text"
				id="nama"
				bind:value={nama_kerajaan}
				placeholder="Kerajaan A"
			/>
		</div>
		<div class="input-group mt-2 flex flex-col gap-1">
			<label class="text-md self-start text-left" for="nama">Gelar</label>
			<input
				class="input-field rounded-lg border p-2"
				type="text"
				id="nama"
				bind:value={gelar}
				placeholder="Radja"
			/>
			<button class="custom-button w-40 self-end bg-customYellow text-right"> Tambah </button>
		</div>
	</form>
</div>

<style>
	.input-field {
		width: auto;
	}

	.custom-button {
		border: none;
		padding: 10px;
		margin-left: 20px;
		margin-top: 20px;
		text-align: center;
		color: white;
		font-size: 16px;
		border-radius: 10px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	.form-container {
		margin-top: 30px;
		margin-left: 20px;
		margin-right: 20px;
		background: #dddee4;
		padding: 20px;
		border-radius: 10px;
		width: auto;
		height: 600px;
		text-align: center;
	}

	@media (max-width: 768px) {
		.test {
			margin-top: 90px;
		}
	}
</style>
