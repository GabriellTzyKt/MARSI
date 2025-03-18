<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { fade } from 'svelte/transition';
	let total = $state(0);
	let activeTab = $state('upcoming');
	let { form, data } = $props();
	let formData = null;
	let error = $state();

	function setActive(tab: string) {
		activeTab = tab;
	}

	let success = $state(false);

	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};

	let open = $state(false);
	let timer: number;
	// function setTimer() {
	// 	open = true;
	// 	if (timer) {
	// 		clearTimeout(timer);
	// 	}
	// 	if (open)
	// 		timer = setTimeout(() => {
	// 			open = false;
	// 			goto('/abdi/sekretariat/acara');
	// 		}, 3000);
	// }
</script>

<div class="min-h-screen w-full">
	<form
		action="?/tambah"
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				console.log(result.data?.errors);
				if (result.type === 'success') {
				}
				if (result.type === 'failure') {
					error = result.data?.errors;
				}
			};
		}}
	>
		<div class="mt-5 grid grid-cols-1 gap-12 lg:grid-cols-4">
			<div class="col-span-2">
				<div class="mt-2 w-full">
					<p>Nama Acara:</p>
					<input
						type="text"
						name="nama_acara"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
					{#if error}
						{#each error.nama_acara as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-3 w-full">
					<p>Penanggung Jawab Acara:</p>
					<input
						type="text"
						name="penanggungjawab_acara"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
					{#if error}
						{#each error.penanggungjawab_acara as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
				<div class="mt-3 w-full">
					<p>Penyelenggara Acara:</p>
					<input
						type="text"
						name="penyelenggara_acara"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
					{#if error}
						{#each error.penyelenggara_acara as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
				<div class="mt-3 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						name="lokasi_acara"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
					{#if error}
						{#each error.lokasi_acara as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
				<div class="mt-3 w-full">
					<p>Tujuan Acara:</p>
					<input
						type="text"
						name="tujuan_acara"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
					{#if error}
						{#each error.tujuan_acara as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
			</div>

			<div class="col-span-2">
				<div class="flexcoba mt-2 flex w-full">
					<div class="flex-1">
						<p>Kapasitas Acara:</p>
						<input
							type="text"
							name="kapasitas_acara"
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
						/>
						{#if error}
							{#each error.kapasitas_acara as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="ml-10 flex">
						<div class="mr-10 w-full items-center text-center">
							<p class="mb-3 mt-3 lg:mb-0 lg:mt-0">Jenis Acara</p>
							<div class="mt-2 flex justify-center">
								<div class="mx-2 flex items-center justify-center">
									<input
										id="jenis_acara-1"
										type="radio"
										value="private"
										name="jenis_acara"
										class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
									/>
									<label for="jenis_acara-1" class="mx-5 ms-2 text-sm font-medium text-gray-900"
										>Private</label
									>
								</div>
								<div class="mx-2 flex items-center justify-center">
									<input
										checked
										id="jenis_acara-2"
										type="radio"
										value=""
										name="jenis_acara"
										class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
									/>
									<label for="jenis_acara-2" class="mx-5 ms-2 text-sm font-medium text-black"
										>Public</label
									>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="flexcoba mt-2 flex w-full">
					<div class="mt-2 lg:flex-1">
						<p>Tanggal Mulai:</p>
						<input
							type="date"
							name="tanggal_mulai"
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
						/>
						{#if error}
							{#each error.tanggal_mulai as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="flex-1 lg:ml-10">
						<div class="mt-2 w-full">
							<p>Tanggal Selesai:</p>
							<input
								type="date"
								name="tanggal_selesai"
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
							/>
							{#if error}
								{#each error.tanggal_selesai as e}
									<p class="text-left text-red-500">- {e}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>
				<div class="flexcoba mt-2 flex w-full">
					<div class="mt-2 lg:flex-1">
						<p>Waktu Mulai:</p>
						<input
							type="time"
							name="waktu_mulai"
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
						/>
						{#if error}
							{#each error.waktu_mulai as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="flex-1 lg:ml-10">
						<div class="mt-2 w-full">
							<p>Waktu Selesai:</p>
							<input
								type="time"
								name="waktu_selesai"
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
							/>
							{#if error}
								{#each error.waktu_selesai as e}
									<p class="text-left text-red-500">- {e}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>
				<div class="mt-2 w-full">
					<p>Deskripsi Acara:</p>
					<textarea
						placeholder="Masukkan Deskripsi Acara"
						name="deskripsi_acara"
						class="h-20 w-full resize-none rounded-md border px-3 py-1 text-lg"
					></textarea>
					{#if error}
						{#each error.deskripsi_acara as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
			</div>
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<div class="mt-8 flex w-full">
			<p class="my-auto ml-10 w-full text-center font-bold">Undangan</p>
			<button
				class="w-60 justify-end text-nowrap rounded-lg bg-blue-400 px-2 py-2 text-white"
				onclick={() => total++}
			>
				Tambah Undangan
			</button>
		</div>

		<!-- bawah -->

		<div class="mt-10 grid grid-cols-9 gap-2">
			{#each Array(total) as _, i}
				<div class="col-span-1 w-full">{i + 1}</div>
				<div class="col-span-2 flex w-full flex-col rounded-lg border px-2 py-1">
					<select name="panggilan" id="panggilan" class="mt-1 w-full">
						<option value="Tuan">Tn</option>
						<option value="Nyonya">Ny</option>
					</select>
				</div>
				<div class="col-span-3 flex flex-col">
					<input class=" w-full rounded-lg border px-2 py-1" name="nama_lengkap" type="phone" />
				</div>
				<div class="col-span-2 flex flex-col">
					<input class=" w-full rounded-lg border px-2 py-1" type="text" name="no_telp" />
				</div>
				<div class="col-span-1 flex">
					<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
						<i class="gg--trash z-10 items-center text-2xl"></i>
					</span>
				</div>
			{/each}
			<div class="col-span-full">
				{#if error}
					{#each error.panggilan as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
					{#each error.no_telp as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
					{#each error.nama_lengkap as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>

		<div class="mt-8 flex w-full justify-center lg:justify-end">
			<button class="w-50 text-nowrap rounded-lg bg-green-400 px-2 py-2 text-white" type="submit">
				Buat acara
			</button>
		</div>
	</form>
</div>

{#if success}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SucessModal
			open={success}
			text="Tamu Berhasil Di Undang!"
			to="/abdi/sekretariat/acara"
			on:close={toggle}
		></SucessModal>
	</div>
{/if}

<style>
	.gg--trash {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fff6f6'%3E%3Cpath fill-rule='evenodd' d='M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2zm-2-1H9v1h6zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z' clip-rule='evenodd'/%3E%3Cpath d='M9 9h2v8H9zm4 0h2v8h-2z'/%3E%3C/g%3E%3C/svg%3E");
	}

	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}
</style>
