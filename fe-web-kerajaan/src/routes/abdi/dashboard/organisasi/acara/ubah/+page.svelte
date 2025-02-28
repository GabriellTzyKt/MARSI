<script lang="ts">
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';

	let total = $state(8);
	let open = $state(false);
	let timer: number;
	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		if (open)
			timer = setTimeout(() => {
				open = false;
				goto('/abdi/dashboard/organisasi/acara');
			}, 3000);
	}
</script>

<div class="min-h-full w-full">
	<div class="block min-h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="mt-5 grid grid-cols-1 gap-12 lg:grid-cols-4">
			<div class="col-span-2">
				<div class="mt-2 w-full">
					<p>Nama Acara:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>

				<div class="mt-2 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Tujuan Acara:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Deskripsi Acara:</p>
					<textarea
						placeholder="Masukkan Deskripsi Acara"
						class="h-32 w-full resize-none rounded-md border px-3 py-3 text-lg"
					></textarea>
				</div>
			</div>

			<div class="col-span-2">
				<div class="flexcoba mt-2 flex w-full">
					<div class="flex-1">
						<p>Kapasitas Acara:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
						/>
					</div>
					<div class="ml-10 flex">
						<div class="mr-10 w-full items-center text-center">
							<p class="mb-3 mt-3 lg:mb-0 lg:mt-0">Jenis Acara</p>
							<div class="mt-2 flex">
								<div class="mx-2 flex items-center justify-center">
									<input
										id="default-radio-1"
										type="radio"
										value=""
										name="default-radio"
										class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
									/>
									<label for="default-radio-1" class="mx-5 ms-2 text-sm font-medium text-gray-900"
										>Private</label
									>
								</div>
								<div class="mx-2 flex items-center justify-center">
									<input
										checked
										id="default-radio-2"
										type="radio"
										value=""
										name="default-radio"
										class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
									/>
									<label for="default-radio-2" class="mx-5 ms-2 text-sm font-medium text-black"
										>Public</label
									>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-span-2 mt-2 w-full">
					<p class="mt-2">Penanggung Jawab:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="flexcoba mt-2 flex w-full">
					<div class="mt-2 lg:flex-1">
						<p>Kapasitas Acara:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
						/>
					</div>
					<div class="flex-1 lg:ml-10">
						<div class="mt-2 w-full">
							<p>Penanggung Jawab:</p>
							<input
								type="text"
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
							/>
						</div>
					</div>
				</div>
				<div class="flexcoba mt-2 flex w-full">
					<div class="mt-2 lg:flex-1">
						<p>Kapasitas Acara:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
						/>
					</div>
					<div class="flex-1 lg:ml-10">
						<div class="mt-2 w-full">
							<p>Penanggung Jawab:</p>
							<input
								type="text"
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<div class="mt-8 flex w-full">
			<p class="my-auto ml-10 w-full text-start font-bold lg:text-center">Undangan</p>
			<button class="w-60 justify-end text-nowrap rounded-lg bg-blue-400 px-2 py-2 text-white">
				Tambah Undangan
			</button>
		</div>

		<!-- bawah -->

		<div class="mt-10 grid grid-cols-9 gap-2">
			{#each Array(total) as _, i}
				<div class="col-span-1 w-full">{i + 1}</div>
				<div class="col-span-2 w-full rounded-lg border px-2 py-1">
					<select name="panggilan" id="panggilan" class="w-full">
						<option value="volvo">Tn</option>
						<option value="saab">Ny</option>
					</select>
				</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">Tn</div>
				<div class="col-span-2 w-full rounded-lg border px-2 py-1">Tn</div>
				<div class="col-span-1">
					<span class="flex h-8 w-8 items-center justify-center rounded-full bg-red-400 p-2">
						<i class="gg--trash z-10 items-center text-2xl"></i>
					</span>
				</div>
			{/each}
		</div>

		<div class="mt-8 flex w-full justify-center lg:justify-end">
			<button
				class="w-50 text-nowrap rounded-lg bg-green-400 px-2 py-2 text-white"
				onclick={setTimer}
			>
				Ubah acara
			</button>
		</div>
	</div>
</div>

{#if open}
	<div transition:fade={{ duration: 100 }}>
		<SuccessModal text="Acara berhasil diubah!"></SuccessModal>
	</div>
{/if}

<style>
	.gg--trash {
		display: inline-block;
		width: 16px;
		height: 16px;
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
