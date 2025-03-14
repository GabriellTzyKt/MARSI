<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let success = $state(false);
	let timer: number;
	const { data, form } = $props();
	onMount(() => {
		clearTimeout(timer);
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

	// $effect(() => {
	// 	if (form?.success) {
	// 		success = true;
	// 		if (timer) {
	// 			clearTimeout(timer);
	// 		}
	// 		if (success)
	// 			timer = setTimeout(() => {
	// 				success = false;
	// 				goto('/admin/keanggotaan/daftaranggota');
	// 			}, 3000);
	// 	}
	// 	clearTimeout(timer);
	// });

	const anggota = data.detil_anggota;
	let nama = $state(anggota.nama);
	let nomor_telepon = $state(anggota.telepon);
	let email = $state(anggota.email);
	let nama_kerajaan = $state(anggota.kerajaan);
	let jenis_kerajaan = $state(anggota.jenis_kerajaan);
	let gelar = $state(anggota.gelar);
	if (form?.FormData) {
		nama = form.formData.nama_anggota;
		nomortelp = form.formData.no_telp;
		email = form.formData.email;
		jenis_kerajaan = form.formData.jenis_kerajaan;
		nama_kerajaan = form.formData.nama_kerajaan;
		gelar = form.formData.gelar;
	}
	const toggle = () => {
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
		<p class="ml-5 mt-6 text-3xl font-bold underline">Ubah Anggota</p>
	</div>
	<div class="form-container m-5 mt-6 flex flex-col">
		<form action="?/ubah" method="post">
			<div class="input-group flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Anggota</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					name="nama_anggota"
					id="nama"
					bind:value={nama}
					placeholder="Upacara bendera"
				/>
				{#if form?.errors}
					{#each form.errors.nama_anggota as n}
						<p class="text-left text-red-500">{n}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nomor_telepon">Nomer Telepon</label>
				<input
					class="input-field rounded-lg border p-2"
					type="phone"
					name="no_telp"
					id="nomor_telepon"
					bind:value={nomor_telepon}
					placeholder="22-12-2025"
				/>
				{#if form?.errors}
					{#each form.errors.no_telp as n}
						<p class="text-left text-red-500">{n}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="email">Email</label>
				<input
					class="input-field rounded-lg border p-2"
					type="email"
					id="email"
					name="email"
					bind:value={email}
					placeholder="Surabaya"
				/>
				{#if form?.errors}
					{#each form.errors.email as n}
						<p class="text-left text-red-500">{n}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="namak">Nama Kerajaan</label>
				<input
					class="input-field rounded-lg border p-2"
					id="namak"
					type="text"
					name="nama_kerajaan"
					bind:value={nama_kerajaan}
					placeholder="Halo"
				/>
				{#if form?.errors}
					{#each form.errors.nama_kerajaan as n}
						<p class="text-left text-red-500">{n}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="jenisk">Jenis Kerajaan</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="jenisk"
					name="jenis_kerajaan"
					bind:value={jenis_kerajaan}
					placeholder="Upacara Adat"
				/>
				{#if form?.errors}
					{#each form.errors.jenis_kerajaan as n}
						<p class="text-left text-red-500">{n}</p>
					{/each}
				{/if}
			</div>
			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="gelar">Gelar</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					name="gelar"
					id="gelar"
					bind:value={gelar}
					placeholder="hoohoo"
				/>
				{#if form?.errors}
					{#each form.errors.gelar as n}
						<p class="text-left text-red-500">{n}</p>
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
