<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { enhance } from '$app/forms';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';

	let open = $state(false);
	let timer: number;
	let errors = $state();
	let loading = $state(false);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="h-full w-full">
	<div class="relative mx-auto flex w-full items-center justify-center">
		<div class="group relative h-[100px] w-[100px]">
			<img src={gambardefault} class="h-full w-full rounded-full" alt="" />

			<div
				class="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			>
				<p class="font-semibold text-white">Ganti Foto</p>
			</div>
		</div>
	</div>
	<form
		action="?/tambahSitus"
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
				<div>
					<p>Nama Situs:</p>
					<div class="relative">
						<input
							type="text"
							name="nama_situs"
							placeholder="Masukkan Nama Situs"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 pr-10"
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
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 pr-10"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if errors}
						{#each errors.alamat as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Email:</p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Email"
							name="email"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 pr-10"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if errors}
						{#each errors.email as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Deskripsi Situs:</p>
					<div class="relative w-full">
						<textarea
							placeholder="Masukkan Deskripsi Situs"
							name="deskripsi_situs"
							class="mt-2 h-32 w-full resize-none rounded-md border-2 px-3 py-3 pr-10 text-lg"
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
				<div>
					<p>Penanggung Jawab:</p>
					<div class="relative">
						<input
							type="text"
							name="penanggungjawab"
							placeholder="Masukkan Penanggung Jawab"
							class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
						/>
					</div>
					{#if errors}
						{#each errors.penanggungjawab as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-5 flex items-center gap-3">
					<div class="w-full">
						<p>Pembina:</p>
						<div class="relative">
							<input
								type="text"
								name="pembina"
								placeholder="Masukkan Pembina"
								class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
							/>
						</div>
						{#if errors}
							{#each errors.pembina as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<button class="mt-8 h-fit w-fit rounded-lg border bg-blue-600 px-4 py-2.5 text-white">
						Permohonan
					</button>
				</div>

				<div class="mt-5 flex items-center gap-3">
					<div class="w-full">
						<p>Pelindung:</p>
						<div class="relative">
							<input
								type="text"
								name="pelindung"
								placeholder="Masukkan Pelindung"
								class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
							/>
						</div>
					</div>
					<button class="mt-8 h-fit w-fit rounded-lg border bg-blue-600 px-4 py-2.5 text-white">
						Permohonan
					</button>
				</div>
				{#if errors}
					{#each errors.pelindung as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}

				<div class="mt-5 flex gap-12">
					<div class="w-full lg:w-[50%]">
						<p>No telepon :</p>
						<input
							type="text"
							name="phone"
							placeholder="Masukkan No Telp"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
					</div>
					<div class="hidden w-[50%]"></div>
				</div>
				{#if errors}
					{#each errors.phone as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
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
	<SuccessModal text="Situs Berhasil Diubah"></SuccessModal>
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
</style>
