<script lang="ts">
	import { page } from '$app/state';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { fade } from 'svelte/transition';

	const { data } = $props();
	const acara = data.acara;
	let nama = $state(acara.nama_acara);
	let tanggal_acara = $state(acara.tanggal);
	let lokasi_acara = $state(acara.lokasi);
	let penanggungjawab = $state(acara.penanggungjawab);
	let jenis_acara = $state(acara.jenis_acara);
	let kapasitas = $state(acara.kapasitas);
	let pdummy = $state([
		acara.penanggungjawab,
		'Kerjaaan Mataram',
		'Eric',
		'Adam',
		'Justin',
		'Gabriel'
	]);
	console.log(data);
	let success = $state(false);
	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};
</script>

<div class="test flex w-full flex-col">
	<div class="flex flex-row">
		<a href="/admin/acara"><button class="custom-button bg-customRed">⭠ Kembali</button></a>
		<p class="ml-5 mt-6 text-3xl font-bold underline">Tambah Acara</p>
	</div>
	<div class="form-container m-5 mt-6 flex flex-col">
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
				<label class="text-md self-start text-left" for="tgl_acara">Tanggal Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="tgl_acara"
					bind:value={tanggal_acara}
					placeholder="22-12-2025"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="lokasi_acara">Lokasi Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="lokasi_acara"
					bind:value={lokasi_acara}
					placeholder="Surabaya"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="pngjwb">Penanggung Jawab</label>
				<select
					class="input-field rounded-lg border p-2"
					id="pngjwb"
					bind:value={penanggungjawab}
					placeholder="Halo"
				>
					{#each pdummy as p}
						<option value={p}>{p}</option>
					{/each}
				</select>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="jenis_acara">Jenis Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="jenis_acara"
					bind:value={jenis_acara}
					placeholder="Upacara Adat"
				/>
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="kapasitas">Kapasitas</label>
				<input
					class="input-field rounded-lg border p-2"
					type="number"
					id="kapasitas"
					bind:value={kapasitas}
					placeholder="10000"
				/>
				<button class="custom-button bg-customYellow w-40 self-end text-right" onclick={toggle}>
					Ubah
				</button>
			</div>
		</form>
	</div>
</div>
{#if success}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SucessModal
			open={success}
			text="Data Acara berhasil diubah!"
			to="/admin/acara"
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
