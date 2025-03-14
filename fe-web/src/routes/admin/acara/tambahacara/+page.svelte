<script lang="ts">
	import { goto } from '$app/navigation';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { scaleUtc } from 'd3';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { form } = $props();
	let sucess = $state(false);
	let errors = $state(form?.errors);
	console.log(errors);
	const date = new Date();
	$inspect(date);
	function parseDate(d: Date) {
		const day = String(d.getDate()).padStart(2, '0');
		const month = String(d.getMonth()).padStart(2, '0');
		const year = String(d.getFullYear());
		return `${year}-${month}-${day}`;
	}
	let timer: Number;
	onMount(() => {
		if (form?.success) {
			sucess = true;
			if (timer) {
				clearTimeout(timer);
			}
			if (sucess)
				timer = setTimeout(() => {
					sucess = false;
					goto('/admin/acara');
				}, 3000);
		}
	});
	let nama = $state('');
	// format yyyy-mm-dd
	let tanggal_acara = $state(parseDate(date));

	let lokasi_acara = $state('');
	let nama_kerajaan = $state('');
	let jenis_acara = $state('');
	let kapasitas = $state('');

	if (form?.FormData) {
		nama = form.FormData.namaAcara;
		tanggal_acara = form.FormData.tanggal;
		lokasi_acara = form.FormData.lokasi;
		jenis_acara = form.FormData.jenisAcara;
		kapasitas = form.FormData.kapasitas;
	}
	let penanggungjawab = ['Kerajaan Kraton', 'Kerajaan Betawi', 'Kerajaan Sunda'];

	const toggle = () => {
		if (sucess) {
			sucess = false;
		} else {
			sucess = true;
		}
	};
</script>

<div class="test flex w-full flex-col">
	<a href="/admin/acara"><button class="custom-button bg-customRed">⭠ Kembali</button></a>
	<p class="ml-5 mt-6 text-3xl font-bold underline">Tambah Acara</p>
	<div class="form-container flex flex-col">
		<form action="?/submit" method="post">
			<div class="input-group flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					name="nama_acara"
					id="nama"
					bind:value={nama}
					placeholder="Upacara bendera"
				/>
				{#if errors}
					{#each errors.namaAcara as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nomor_telepon">Tanggal Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="date"
					name="tanggal"
					id="nomor_telepon"
					bind:value={tanggal_acara}
				/>
				{#if errors}
					{#each errors.tanggal as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Lokasi Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					name="lokasi_acara"
					id="nomor_telepon"
					bind:value={lokasi_acara}
					placeholder="Surabaya"
				/>
				{#if errors}
					{#each errors.lokasi as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Penanggung Jawab</label>
				<select
					class="input-field rounded-lg border p-2"
					id="nama"
					name="penanggungjawab"
					bind:value={penanggungjawab[0]}
					placeholder="azaza@gmail.com"
				>
					{#each penanggungjawab as p}
						<option value={p}>{p}</option>
					{/each}
				</select>
				{#if errors}
					{#each errors.penanggungjawab as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Jenis Acara</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					name="jenis_acara"
					id="nama"
					bind:value={jenis_acara}
					placeholder="Upacara Adat"
				/>
				{#if errors}
					{#each errors.jenisAcara as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Kapasitas</label>
				<input
					class="input-field rounded-lg border p-2"
					type="number"
					id="nama"
					name="kapasitas"
					bind:value={kapasitas}
					placeholder="10000"
				/>
				{#if errors}
					{#each errors.kapasitas as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
				<button type="submit" class="custom-button bg-customYellow w-40 self-end text-right">
					Tambah
				</button>
			</div>
		</form>
	</div>
</div>
{#if sucess}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SucessModal
			open={sucess}
			text="Acara Berhasil Ditambahkan!"
			to="/admin/acara"
			on:close={toggle}
		></SucessModal>
	</div>
{/if}

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
		height: auto;
		text-align: center;
	}

	@media (max-width: 768px) {
		.test {
			margin-top: 90px;
		}
	}
</style>
