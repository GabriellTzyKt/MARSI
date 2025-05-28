<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';

	let namakomunitas = $state('');
	let alamat = $state('');
	let email = $state('');
	let deskripsikomunitas = $state('');
	let notelepon = $state('');
	let jumlahanggota = $state('');

	let { form, data } = $props();
	console.log('form data', form?.formData);
	let dataambil = data.komunitas;
	console.log('Data : ', dataambil);
	let datafoto = data.profileUrl || gambardefault;
	console.log('data foto : ', datafoto);
	let usersList = data.usersList || [];
	console.log('User list : ', usersList);
	let existingfotoId = data.profileId;
	console.log('Existing foto id : ', existingfotoId);
	let tanggal_berdiri = $state(dataambil.tanggal_berdiri.split('T')[0]);
	let pembina = $state(Number(dataambil.pembina));
	let penanggungjawab = $state(Number(dataambil.penanggung_jawab));
	let pelindung = $state(Number(dataambil.pelindung));
	let loading = $state(false)

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
		namakomunitas = form.formData.namakomunitas;
		notelepon = form.formData.notelepon;
		email = form.formData.email;
		deskripsikomunitas = form.formData.deskripsikomunitas;
		penanggungjawab = form.formData.penanggungjawab;
		pembina = form.formData.pembina;
		pelindung = form.formData.pelindung;
		alamat = form.formData.alamat;
		jumlahanggota = form.formData.jumlahanggota;
	}

	let open = $state(false);
	let timer: any;
	let error: any = $state('');
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
				console.log(result);
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
						goto('/abdi/dashboard/komunitas/beranda');
					}, 3000);
				} else if (result.type === 'failure') {
					error = result.data?.errors;
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
					name="existing_foto_komunitas"
					value={dataambil.foto_komunitas || ''}
				/>
			</div>
		</div>
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div>
					<p>Nama Komunitas:</p>
					<div class="relative">
						<input
							type="text"
							name="namakomunitas"
							bind:value={dataambil.nama_komunitas}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.namakomunitas as a}
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
					<p class="mt-5">Deskripsi Komunitas:</p>
					<div class="relative w-full">
						<textarea
							placeholder="Masukkan nama"
							name="deskripsikomunitas"
							bind:value={dataambil.deskripsi_komunitas}
							class="mt-2 h-32 w-full resize-none rounded-md border-2 px-3 py-3 text-lg"
						></textarea>
						<div class="h-full">
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
					</div>
					{#if error}
						{#each error.deskripsikomunitas as a}
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

				<div class="mt-5 w-full">
					<p>Tempat Operasional :</p>
					<input
						type="text"
						name="tempat_operasional"
						bind:value={dataambil.tempat_operasional}
						placeholder="Masukkan nama"
						class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
					/>
					{#if error}
						{#each error.tempat_operasional as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-5 flex flex-col gap-4 lg:flex-row">
					<div class="w-full">
						<p>No telepon :</p>
						<input
							type="text"
							name="notelepon"
							bind:value={dataambil.no_telp}
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
							name="jumlahanggota"
							readonly
							bind:value={dataambil.jumlah_anggota}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
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
				class="w-50 t-0 mt-10 rounded-lg border-2 border-black bg-green-500 px-2 py-2 text-white"
				type="submit">Simpan Data</button
			>
		</div>
	</form>
</div>

{#if open}
	<div transition:fade={{ duration: 100 }}>
		<SuccessModal text="Komunitas Berhasil diedit"></SuccessModal>
	</div>
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
