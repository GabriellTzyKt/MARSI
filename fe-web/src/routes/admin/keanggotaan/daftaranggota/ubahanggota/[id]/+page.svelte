<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { onMount } from 'svelte';

	// import { fade } from 'svelte/transition';
	// import { load } from './proxy+page.server.js';

	let success = $state(false);
	let timer: number;
	const { data, form } = $props();

	const dataKerajaan = $state(data.kerajaan);

	let loading = $state(false);

	let errors = $state();
	let request = $state();
	let nama_kerajaan = $state(dataKerajaan.nama_kerajaan ? dataKerajaan.nama_kerajaan : '');
	let raja_sekarang = $state(dataKerajaan.raja_sekarang ? dataKerajaan.raja_sekarang : '');
	let jenis_kerajaan = $state(dataKerajaan.jenis_kerajaan ? dataKerajaan.jenis_kerajaan : '');
	let tanggal_berdiri = $state(
		dataKerajaan.tanggal_berdiri ? dataKerajaan.tanggal_berdiri.split('T')[0] : ''
	);

	let deskripsi_kerajaan = $state(
		dataKerajaan.deskripsi_kerajaan ? dataKerajaan.deskripsi_kerajaan : ''
	);
	let era = $state(dataKerajaan.era ? dataKerajaan.era : '');
	let rumpun = $state(dataKerajaan.rumpun ? dataKerajaan.rumpun : '');
	let alamat_kerajaan = $state(dataKerajaan.alamat_kerajaan ? dataKerajaan.alamat_kerajaan : '');

	$effect(() => {
		if (!dataKerajaan) {
			loading = true;
		} else loading = false;
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

	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};
</script>

<div class="test mx-4 flex w-full flex-col">
	<div class=" flex flex-row items-center">
		<a href="/admin/keanggotaan/daftaranggota" class="flec self-end text-2xl underline">⭠ Kembali</a
		>
	</div>

	<div class="my-4 flex">
		<p class=" text-3xl font-[600]">Ubah Form Kerajaan</p>
	</div>
	<div class=" flex flex-col">
		<form
			method="post"
			action="?/ubah"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						errors = null;
						success = true;
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;
							goto('/admin/keanggotaan/daftaranggota');
						}, 3000);
					}
					if (result.type === 'failure') {
						errors = result.data?.errors;
						request = result.data?.request;
						console.log(errors);
					}
				};
			}}
		>
			<div class=" flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Kerajaan</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					bind:value={nama_kerajaan}
					name="nama_kerajaan"
					placeholder="John Doe"
				/>
				{#if errors}
					{#each errors.nama_kerajaan as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
			<div class=" mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="alamat_kerajaan">Alamat Kerajaan</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="alamat_kerajaan"
					name="alamat_kerajaan"
					bind:value={alamat_kerajaan}
					placeholder="alamat..."
				/>
				{#if errors}
					{#each errors.alamat_kerajaan as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
			<div class=" mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="flex flex-col">
					<p class="text-md mb-1 self-start text-left">Tanggal Berdiri</p>
					<input
						class="input-field rounded-lg border p-2"
						type="date"
						id="nama"
						name="tanggal_berdiri"
						bind:value={tanggal_berdiri}
						placeholder="azaza@gmail.com"
					/>
					{#if errors}
						{#each errors.tanggal_berdiri as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
				<div class="flex flex-col">
					<p class="text-md mb-1 self-start text-left">Era Kerajaan</p>
					<input
						class="input-field rounded-lg border p-2"
						type="text"
						id="nama"
						name="era_kerajaan"
						bind:value={era}
						placeholder="era.."
					/>
					{#if errors}
						{#each errors.era_kerajaan as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
				<div class="flex flex-col">
					<p class="text-md mb-1 self-start text-left">Rumpun Kerajaan</p>
					<input
						class="input-field rounded-lg border p-2"
						type="text"
						id="nama"
						name="rumpun_kerajaan"
						bind:value={rumpun}
						placeholder="rumpun..."
					/>
					{#if errors}
						{#each errors.rumpun_kerajaan as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
				<div class="flex flex-col">
					<p class="text-md mb-1 self-start text-left">Jenis Kerajaan</p>
					<input
						class="input-field rounded-lg border p-2"
						type="text"
						id="nama"
						name="jenis_kerajaan"
						bind:value={jenis_kerajaan}
						placeholder="jenis..."
					/>
					{#if errors}
						{#each errors.jenis_kerajaan as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
				<div class="flex flex-col md:col-span-2">
					<p class="text-md mb-1 self-start text-left">Nama Raja Sekarang</p>
					<input
						class="input-field rounded-lg border p-2"
						type="text"
						bind:value={raja_sekarang}
						id="nama"
						name="raja_sekarang"
						placeholder="raja..."
					/>
					{#if errors}
						{#each errors.raja_sekarang as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>

			<div class=" mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Deskripsi Kerajaan</label>
				<textarea
					class="input-field rounded-lg border p-2"
					id="nama"
					name="deskripsi_kerajaan"
					placeholder="deskripsi..."
					bind:value={deskripsi_kerajaan}
					rows="7"
				></textarea>
				{#if errors}
					{#each errors.deskripsi_kerajaan as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
			<div class=" mt-2 flex flex-col gap-1">
				<button
					class="custom-button bg-customYellow w-40 self-end text-right {loading ? 'disabled' : ''}"
					type="submit"
				>
					{loading ? 'Memuat...' : 'Tambah Data'}
				</button>
			</div>
			<div>
				{#if request}
					<p class="text-left text-red-500 underline">{request}</p>
				{/if}
			</div>
		</form>
	</div>
</div>
{#if loading}
	<Loader></Loader>
{/if}
{#if success}
	<SModal text="Berhasil ditambah"></SModal>
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
		border-radius: 10px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	@media (max-width: 768px) {
		.test {
			margin-top: 90px;
		}
	}
</style>
