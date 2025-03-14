<script lang="ts">
	import { goto } from '$app/navigation';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	let { form } = $props();
	let success = $state(false);
	let timer: Number;
	onMount(() => {
		if (form?.success) {
			success = true;
			if (timer) {
				clearTimeout(timer);
			}
			timer = setTimeout(() => {
				success = false;
				goto('/admin/keanggotaan/daftaranggota');
			}, 3000);
		}
	});
	let nama = $state('');
	let nomortelp = $state('');
	let email = $state('');
	let nama_kerajaan = $state('');
	let jenis_kerajaan = $state('');
	let gelar = $state('');

	if (form?.formData) {
		nama = form.formData.nama_anggota;
		nomortelp = form.formData.no_telp;
		email = form.formData.email;
		jenis_kerajaan = form.formData.jenis_kerajaan;
		nama_kerajaan = form.formData.nama_kerajaan;
		gelar = form.formData.gelar;
	}
	let toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};
</script>

<div class="test flex w-full flex-col">
	<div class="flex flex-row">
		<a href="/admin/keanggotaan/daftaranggota"
			><button class="custom-button bg-customRed">⭠ Kembali</button></a
		>
		<p class="ml-5 mt-6 text-3xl font-bold underline">Tambah Anggota</p>
	</div>

	<div class="form-container flex flex-col">
		<form method="post" action="?/tambah">
			<div class="input-group flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Anggota</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					name="nama_anggota"
					bind:value={nama}
					placeholder="John Doe"
				/>
				{#if form?.errors}
					{#each form.errors.nama_anggota as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nomor_telepon">Nomor Telepon</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					name="no_telp"
					id="nomor_telepon"
					bind:value={nomortelp}
					placeholder="911"
				/>
				{#if form?.errors}
					{#each form.errors.no_telp as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Email</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					name="email"
					bind:value={email}
					placeholder="azaza@gmail.com"
				/>
				{#if form?.errors}
					{#each form.errors.email as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Jenis Kerajaan</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					name="jenis_kerajaan"
					bind:value={jenis_kerajaan}
					placeholder="Kerajaan A"
				/>
				{#if form?.errors}
					{#each form.errors.jenis_kerajaan as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Kerajaan</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					name="nama_kerajaan"
					bind:value={nama_kerajaan}
					placeholder="Kerajaan A"
				/>
				{#if form?.errors}
					{#each form.errors.nama_kerajaan as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Gelar</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					name="gelar"
					bind:value={gelar}
					placeholder="Radja"
				/>
				{#if form?.errors}
					{#each form.errors.gelar as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
				<button class="custom-button bg-customYellow w-40 self-end text-right" type="submit">
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
			text="Anggota Berhasil Ditambahkan"
			to="/admin/keanggotaan/daftaranggota"
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
