<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { resolveRoute } from '$app/paths';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';

	let namaOrganisasi = $state('');
	let alamat = $state('');
	let email = $state('');
	let deskripsiOrganisasi = $state('');
	let notelepon = $state('');
	let error: any = $state('');

	let { form, data } = $props();
	console.log('form data', form);
	let dataambil = data.organisasi;
	console.log('Data : ', dataambil);
	let datafoto = data.profileUrl || gambardefault;
	console.log('data foto : ', datafoto);
	let usersList = data.usersList || [];
	console.log('User list : ', usersList);
	let existingfotoId = data.profileId;
	console.log('Existing foto id : ', existingfotoId);

	let pembina = $state(Number(dataambil.pembina));
	let penanggungjawab = $state(Number(dataambil.penanggung_jawab));
	let pelindung = $state(Number(dataambil.pelindung));
	let jumlahanggota = $state(data.memberCount);
	let tanggal_berdiri = $state(dataambil.tanggal_berdiri.split('T')[0]);
	let loading = $state(false)

	let datafotoexist = data.profileId;
	let showEditIcon = $state(true);

	let selectedFile = $state<File | null>(null);

	function previewImage(event: any) {
		const file = event.target.files[0];
		const preview = document.getElementById('preview-image') as HTMLImageElement;
		if (file && preview) {
			selectedFile = file; // Store the file for submission
			preview.src = URL.createObjectURL(file);
			showEditIcon = false; // Sembunyikan icon edit setelah file dipilih
		}
	}

	if (form?.formData) {
		namaOrganisasi = form.formData.namaOrganisasi;
		notelepon = form.formData.notelepon;
		email = form.formData.email;
		deskripsiOrganisasi = form.formData.deskripsiOrganisasi;
		penanggungjawab = form.formData.penanggungjawab;
		pembina = form.formData.pembina;
		pelindung = form.formData.pelindung;
		alamat = form.formData.alamat;
		jumlahanggota = form.formData.jumlahanggota;
	}

	let success = $state(false);
	let timer: any;
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}

{#if loading}
	<Loader text="processing..."></Loader>
{/if}

<div class="h-full w-full">
	<form
		method="post"
		action="?/edit"
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				console.log('Form submission result:', result);
				if (result.type === 'success') {
					success = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						success = false;
						goto('/abdi/dashboard/organisasi/beranda');
					}, 3000);
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
				}
			};
		}}
	>
		<div class="relative mx-auto flex w-full items-center justify-center">
			<div class="relative mx-auto mb-9 flex w-full items-center justify-center">
				<!-- Image yang bisa diklik -->
				<label for="profile_picture" class="relative cursor-pointer">
					<div class="relative">
						<img
							id="preview-image"
							src={datafoto || ''}
							class="h-20 w-20 rounded-full object-cover"
							alt="Profile"
						/>
						{#if showEditIcon}
							<span
								class="mdi--edit absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
							></span>
						{/if}
					</div>
				</label>

				<!-- Input file yang disembunyikan - fixed the ID to match the label -->
				<input
					type="file"
					id="profile_picture"
					name="profile_picture"
					accept="image/*"
					class="hidden"
					onchange={previewImage}
				/>

				<!-- Add a hidden input to store the existing photo ID -->
				<input type="hidden" name="existing_profile_id" value={existingfotoId || ''} />

				<input
					type="hidden"
					name="existing_foto_organisasi"
					value={dataambil.foto_organisasi || ''}
				/>
			</div>
		</div>
		<div class="mt-10 grid grid-cols-1 gap-2 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div>
					<p>Nama Organisasi:</p>
					<div class="relative">
						<input
							type="text"
							name="namaorganisasi"
							id="namaorganisasi"
							bind:value={dataambil.nama_organisasi}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.namaOrganisasi as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Alamat:</p>
					<div class="relative">
						<input
							type="text"
							name="alamat"
							id="alamat"
							bind:value={dataambil.alamat}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.alamat as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Email:</p>
					<div class="relative">
						<input
							type="text"
							name="email"
							id="email"
							bind:value={dataambil.email}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.email as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Tanggal Berdiri:</p>
					<div class="relative">
						<input
							type="date"
							name="tanggal_berdiri"
							id="tanggal_berdiri"
							bind:value={tanggal_berdiri}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
					</div>
					{#if error}
						{#each error.tanggalBerdiri as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Deskripsi Organisasi:</p>
					<div class="relative w-full">
						<textarea
							placeholder="Masukkan nama"
							name="deskripsiorganisasi"
							bind:value={dataambil.deskripsi_organisasi}
							id="deskripsiorganisasi"
							class="mt-2 h-32 w-full resize-none rounded-md border-2 px-5 py-3 text-lg"
						></textarea>
						<div class="h-full">
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
					</div>
					{#if error}
						{#each error.deskripsiOrganisasi as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			</div>

			<!-- 2 -->
			<div>
				<div>
					<p>Penanggung Jawab:</p>
					<select
						name="penanggungjawab"
						bind:value={penanggungjawab}
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
					>
						<option value="" disabled>Pilih Penanggung Jawab</option>
						{#each usersList as user}
							<option value={user.id}>
								{user.nama_lengkap || 'Unnamed'}
							</option>
						{/each}
					</select>
					{#if error}
						{#each error.penanggungjawab as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-5">
					<p>Pembina :</p>
					<select
						name="pembina"
						bind:value={pembina}
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
					>
						<option value="" disabled>Pilih Pembina</option>
						{#each usersList as user}
							<option value={user.id}>
								{user.nama_lengkap || 'Unnamed'}
							</option>
						{/each}
					</select>
					{#if error}
						{#each error.pembina as a}
							<p class="text-center text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-5">
					<p>Pelindung :</p>
					<select
						name="pelindung"
						bind:value={pelindung}
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
					>
						<option value="" disabled selected={!dataambil.pelindung}>Pilih Pelindung</option>
						{#each usersList as user}
							<option value={user.id}>
								{user.nama_lengkap || 'Unnamed'}
							</option>
						{/each}
					</select>
					{#if error}
						{#each error.pelindung as a}
							<p class="text-center text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-5 flex gap-12">
					<div class="w-full">
						<p>No telepon :</p>
						<input
							type="text"
							bind:value={dataambil.no_telp}
							name="notelepon"
							id="notelepon"
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.notelepon as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<div class="w-full">
						<p>Jumlah Anggota :</p>
						<input
							type="text"
							placeholder="Masukkan nama"
							bind:value={jumlahanggota}
							name="jumlahanggota"
							id="jumlahanggota"
							disabled
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.jumlahanggota as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="relative flex w-full justify-center lg:justify-end">
			<button
				type="submit"
				class="w-50 t-0 mt-10 rounded-lg border-2 border-black bg-green-500 px-2 py-2 text-white"
				>Simpan Data</button
			>
		</div>
	</form>
</div>
{#if success}
	<SuccessModal text="Organisasi Berhasail Dirubah"></SuccessModal>
{/if}

<style>
	.raphael--edit {
		display: inline-block;
		width: 28px;
		height: 28px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23a59494' d='M27.87 7.863L23.024 4.82l-7.89 12.566l4.843 3.04zM14.395 21.25l-.107 2.855l2.527-1.337l2.35-1.24l-4.673-2.936zM29.163 3.24L26.63 1.647a1.364 1.364 0 0 0-1.88.43l-1 1.588l4.843 3.042l1-1.586c.4-.64.21-1.483-.43-1.883zm-3.965 23.82c0 .275-.225.5-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5h13.244l1.884-3H5.698c-1.93 0-3.5 1.57-3.5 3.5v19c0 1.93 1.57 3.5 3.5 3.5h19c1.93 0 3.5-1.57 3.5-3.5V11.097l-3 4.776v11.19z'/%3E%3C/svg%3E");
	}

	.mdi--edit {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'/%3E%3C/svg%3E");
	}
</style>
