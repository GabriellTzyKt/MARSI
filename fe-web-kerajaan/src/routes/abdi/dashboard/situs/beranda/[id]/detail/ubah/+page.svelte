<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { page } from '$app/stores';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';

	let namasitus = $state('');
	let email = $state('');
	let notelepon = $state('');
	let kepemilikan = $state('');
	let deskripsi = $state('');
	let dibangunoleh = $state('');
	let tanggalberdiri = $state('');
	let alamat = $state('');
	let jurukunci = $state('');
	let jenissitus = $state('');
	let pembina = $state('');
	let pelindung = $state('');
	let jambuka = $state('');
	let jamtutup = $state('');
	let wisata = $state('');
	let showEditIcon = $state(true);

	let { form } = $props();
	console.log('form data', form?.formData);

	if (form?.formData) {
		namasitus = form.formData.namasitus;
		notelepon = form.formData.notelepon;
		email = form.formData.email;
		kepemilikan = form.formData.kepemilikan;
		dibangunoleh = form.formData.dibangunoleh;
		tanggalberdiri = form.formData.tanggalberdiri;
		alamat = form.formData.alamat;
		jurukunci = form.formData.jurukunci;
		jenissitus = form.formData.jenissitus;
		pembina = form.formData.pembina;
		pelindung = form.formData.pelindung;
		jambuka = form.formData.jambuka;
		jamtutup = form.formData.jamtutup;
		wisata = form.formData.wisata;
	}

	let currentID = $state();

	$effect(() => {
		currentID = $page.params.id;
		console.log('ID: ', currentID);
	});

	let open = $state(false);
	let timer: any;
	let loading = $state(false);
	let error: any = $state('');

	function previewImage(event: any) {
		const file = event.target.files[0];
		const preview = document.getElementById('preview-image') as HTMLImageElement;
		if (file && preview) {
			preview.src = URL.createObjectURL(file);
			showEditIcon = false; // Sembunyikan icon edit setelah file dipilih
		}
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="h-full w-full">
	<form
		method="post"
		action="?/edit"
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
						goto('/abdi/dashboard/situs/detail');
					}, 3000);
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
				}
			};
		}}
	>
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div class="relative mx-auto mb-9 flex w-full items-center justify-center">
					<!-- Image yang bisa diklik -->
					<label for="upload-photo" class="relative ml-5 mr-5 cursor-pointer hover:opacity-25">
						<img
							id="preview-image"
							src={gambardefault}
							class="h-20 w-20 rounded-full object-cover"
							alt="Profile"
						/>
						{#if showEditIcon}
							<span class="mdi--edit absolute"></span>
						{/if}
					</label>

					<!-- Input file yang disembunyikan -->
					<input
						type="file"
						id="upload-photo"
						accept="image/*"
						class="hidden"
						onchange={previewImage}
					/>
				</div>
				<div>
					<p>Nama Situs:</p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Nama"
							name="namasitus"
							bind:value={namasitus}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.namasitus as a}
							<p class="text-center text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Email:</p>
					<div class="relative">
						<input
							type="text"
							name="email"
							bind:value={email}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.email as a}
							<p class="text-center text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>No telepon :</p>
						<input
							type="text"
							name="notelepon"
							bind:value={notelepon}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.notelepon as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Kepemilikan :</p>
						<input
							type="text"
							placeholder="Masukkan nama"
							name="kepemilikan"
							bind:value={kepemilikan}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.kepemilikan as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div>
					<p class="mt-5">Deskripsi Situs:</p>
					<div class="relative w-full">
						<textarea
							placeholder="Masukkan nama"
							name="deskripsi"
							bind:value={deskripsi}
							class="mt-2 h-32 w-full resize-none rounded-md border-2 px-3 py-3 text-lg"
						></textarea>
						<div class="h-full">
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
						{#if error}
							{#each error.deskripsi as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<!-- 2 -->
			<div>
				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Dibangun Oleh :</p>
						<input
							type="text"
							name="dibangunoleh"
							bind:value={dibangunoleh}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.dibangunoleh as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Tanggal Berdiri :</p>
						<input
							type="date"
							name="tanggalberdiri"
							bind:value={tanggalberdiri}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.tanggalberdiri as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5">
					<p>Alamat:</p>
					<div class="relative">
						<input
							type="text"
							name="alamat"
							bind:value={alamat}
							placeholder="Masukkan Pembina"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
					</div>
					{#if error}
						{#each error.alamat as a}
							<p class="text-center text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Juru Kunci :</p>
						<input
							type="text"
							name="jurukunci"
							bind:value={jurukunci}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.jurukunci as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Jenis Situs :</p>
						<input
							type="text"
							name="jenissitus"
							bind:value={jenissitus}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.jenissitus as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Pembina :</p>
						<input
							type="text"
							name="pembina"
							bind:value={pembina}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.pembina as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Pelindung :</p>
						<input
							type="text"
							name="pelindung"
							bind:value={pelindung}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.pelindung as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Jam Buka :</p>
						<input
							type="time"
							bind:value={jambuka}
							name="jambuka"
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.jambuka as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Jam Tutup :</p>
						<input
							type="time"
							bind:value={jamtutup}
							name="jamtutup"
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.jamtutup as a}
								<p class="text-center text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-3">
					<p>Wisata:</p>
					<div class="relative">
						<input
							type="text"
							bind:value={wisata}
							name="wisata"
							placeholder="Masukkan Pembina"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
					</div>
					{#if error}
						{#each error.wisata as a}
							<p class="text-center text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="relative flex w-full items-end justify-center lg:justify-end">
					<button
						class="w-50 t-0 mt-10 rounded-lg border-2 border-black bg-green-500 px-2 py-2 text-white"
						type="submit">Simpan Data</button
					>
				</div>
			</div>
		</div>
	</form>
</div>

{#if open}
	<div transition:fade={{ duration: 100 }}>
		<SuccessModal text="Acara berhasil diubah!"></SuccessModal>
	</div>
{/if}

<style>
	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}

	.raphael--edit {
		display: inline-block;
		width: 28px;
		height: 28px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23a59494' d='M27.87 7.863L23.024 4.82l-7.89 12.566l4.843 3.04zM14.395 21.25l-.107 2.855l2.527-1.337l2.35-1.24l-4.673-2.936zM29.163 3.24L26.63 1.647a1.364 1.364 0 0 0-1.88.43l-1 1.588l4.843 3.042l1-1.586c.4-.64.21-1.483-.43-1.883zm-3.965 23.82c0 .275-.225.5-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5h13.244l1.884-3H5.698c-1.93 0-3.5 1.57-3.5 3.5v19c0 1.93 1.57 3.5 3.5 3.5h19c1.93 0 3.5-1.57 3.5-3.5V11.097l-3 4.776v11.19z'/%3E%3C/svg%3E");
	}

	.mdi--edit {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'/%3E%3C/svg%3E");
	}
</style>
