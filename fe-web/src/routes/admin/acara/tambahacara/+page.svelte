<script lang="ts">
	let nama = $state('');
	let tanggal_acara = $state('');
	let lokasi_acara = $state('');
	let nama_kerajaan = $state('');
	let jenis_acara = $state('');
	let kapasitas = $state('');
	let penanggungjawab = ['Kerajaan Kraton', 'Kerajaan Betawi', 'Kerajaan Sunda'];
</script>

<div class="test flex w-full flex-col">
	<a href="/admin/acara"><button class="custom-button bg-customRed">⭠ Kembali</button></a>
	<p class="ml-5 mt-6 text-3xl font-bold underline">Tambah Acara</p>
	<div class="form-container flex flex-col">
		<form>
			<div class="input-group flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					bind:value={nama}
					placeholder="Upacara bendera"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nomor_telepon">Tanggal Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nomor_telepon"
					bind:value={tanggal_acara}
					placeholder="22-12-2025"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Lokasi Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nomor_telepon"
					bind:value={lokasi_acara}
					placeholder="Surabaya"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Penanggung Jawab</label>
				<select
					class="input-field rounded-lg border p-2"
					id="nama"
					bind:value={penanggungjawab[0]}
					placeholder="azaza@gmail.com"
				>
					{#each penanggungjawab as p}
						<option value={p}>{p}</option>
					{/each}
				</select>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Jenis Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					bind:value={jenis_acara}
					placeholder="Upacara Adat"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Kapasitas</label>
				<input
					class="input-field rounded-lg border p-2"
					type="number"
					id="nama"
					bind:value={kapasitas}
					placeholder="10000"
				/>
				<button class="custom-button bg-customYellow w-40 self-end text-right"> Tambah </button>
			</div>
		</form>
	</div>
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
