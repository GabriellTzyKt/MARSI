<script lang="ts">
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	const anggota = data.detil_anggota;
	let nama = $state(anggota.nama);
	let nomor_telepon = $state(anggota.telepon);
	let email = $state(anggota.email);
	let nama_kerajaan = $state(anggota.kerajaan);
	let jenis_kerajaan = $state(anggota.jenis_kerajaan);
	let gelar = $state(anggota.gelar);

	let success = $state(false);

	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};

	console.log(data);
</script>

<div class="test flex w-full flex-col">
	<div class="flex flex-row">
		<a href="/admin/keanggotaan/daftaranggota"
			><button class="custom-button bg-customRed">⭠ Kembali</button></a
		>
		<p class="ml-5 mt-6 text-3xl font-bold underline">Ubah Anggota</p>
	</div>
	<div class="form-container m-5 mt-6 flex flex-col">
		<form>
			<div class="input-group flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Anggota</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					bind:value={nama}
					placeholder="Upacara bendera"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nomor_telepon">Nomer Telepon</label>
				<input
					class="input-field rounded-lg border p-2"
					type="phone"
					id="nomor_telepon"
					bind:value={nomor_telepon}
					placeholder="22-12-2025"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="email">Email</label>
				<input
					class="input-field rounded-lg border p-2"
					type="email"
					id="email"
					bind:value={email}
					placeholder="Surabaya"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="namak">Nama Kerajaan</label>
				<input
					class="input-field rounded-lg border p-2"
					id="namak"
					type="text"
					bind:value={nama_kerajaan}
					placeholder="Halo"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="jenisk">Jenis Kerajaan</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="jenisk"
					bind:value={jenis_kerajaan}
					placeholder="Upacara Adat"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="gelar">Gelas</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="gelar"
					bind:value={gelar}
					placeholder="10000"
				/>
				<button class="custom-button bg-customYellow w-40 self-end text-right" onclick={toggle}>
					Tambah
				</button>
			</div>
		</form>
	</div>
</div>
{#if success}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SucessModal
			open={success}
			text="Data Anggota Berhasil Diganti!"
			to="/admin/keanggotaan/daftaranggota"
			on:close={toggle}
		></SucessModal>
	</div>
{/if}

<style>
	.custom-button {
		border: none;
		padding: 10px;
		margin-left: 20px;
		margin-top: 20px;
		text-align: center;
		color: white;
		font-size: 16px;
		border-radius: 5px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
</style>
