<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { enhance } from '$app/forms';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';
	let open = $state(false);
	let timer: number;
	let errors = $state();
	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		if (open)
			timer = setTimeout(() => {
				open = false;
				goto('/abdi/sekretariat/situs');
			}, 3000);
	}
	let loading = $state(false);
</script>

{#if loading}
	<Loader></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="h-full w-full">
	<form
		action="?/editSitus"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				loading = false;
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
						goto('/abdi/sekretariat/situs');
					}, 3000);
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
				}
			};
		}}
	>
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div class="relative mx-auto mb-4 flex w-full items-center justify-center">
					<div class="group relative h-[100px] w-[100px]">
						<!-- svelte-ignore a11y_img_redundant_alt -->
						<img src={gambardefault} class="h-full w-full rounded-full" alt="Profile Picture" />

						<div
							class="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
						>
							<p class="font-semibold text-white">Ganti Foto</p>
						</div>
					</div>
				</div>

				<div>
					<p>Nama Situs:</p>
					<div class="relative">
						<input
							type="text"
							name="nama_situs"
							placeholder="Masukkan Nama Situs"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if errors}
						{#each errors.nama_situs as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Alamat:</p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Alamat"
							name="alamat"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if errors}
						{#each errors.alamat as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>No telepon :</p>
						<input
							type="text"
							name="phone"
							placeholder="Masukkan Nomer Telepon"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.phone as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Kepemilikan :</p>
						<input
							type="text"
							name="kepemilikan"
							placeholder="Masukkan Kepemilikan"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.kepemilikan as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div>
					<p class="mt-5">Deskripsi Situs:</p>
					<div class="relative w-full">
						<textarea
							placeholder="Masukkan Deskripsi Situs"
							name="deskripsi_situs"
							class="mt-2 h-32 w-full resize-none rounded-md border-2 px-3 py-3 text-lg"
						></textarea>
						<div class="h-full">
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
					</div>
					{#if errors}
						{#each errors.deskripsi_situs as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
			</div>

			<!-- 2 -->
			<div>
				<div class="mt-5">
					<p>Juru Kunci:</p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Juru Kunci"
							name="juru_kunci"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
					</div>
					{#if errors}
						{#each errors.juru_kunci as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Dibangun Oleh :</p>
						<input
							type="text"
							placeholder="Masukkan nama"
							name="dibangun_oleh"
							class="border-blackpx-2 mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.dibangun_oleh as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Tahun Berdiri :</p>
						<input
							type="text"
							placeholder="Masukkan Tahun"
							name="tahun_berdiri"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.tahun_berdiri as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Pembina :</p>
						<input
							type="text"
							placeholder="Masukkan Nama Pembina"
							name="pembina"
							class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.pembina as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Pelindung :</p>
						<input
							type="text"
							placeholder="Masukkan Nama Pelindung"
							name="pelindung"
							class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.pelindung as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5">
					<p>Pelindung:</p>
					<div class="relative">
						<input
							type="text"
							name="pelindungg"
							placeholder="Masukkan Nama Pelindung"
							class="mt-2 w-full rounded-lg border-2 border-black bg-slate-500 px-2 py-2 text-start"
						/>
					</div>
					{#if errors}
						{#each errors.pelindung as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Jam Buka :</p>
						<input
							type="time"
							name="jam_buka"
							placeholder=""
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.jam_buka as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Jam Tutup :</p>
						<input
							type="time"
							name="jam_tutup"
							placeholder=""
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.jam_tutup as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Jumlah Anggota :</p>
						<input
							type="number"
							name="jumlah_anggota"
							placeholder="Masukkan Jumlah anggota"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.jumlah_anggota as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-3">
					<p>Wisata:</p>
					<div class="relative">
						<input
							type="text"
							name="wisata"
							placeholder="Masukkan Pembina"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
					</div>
					{#if errors}
						{#each errors.wisata as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
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
	<SuccessModal text="Situs Berhasil Diedit"></SuccessModal>
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
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'/%3E%3C/svg%3E");
	}
</style>
