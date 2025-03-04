<script lang="ts">
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { fade } from 'svelte/transition';

	let total = $state(8);
	let activeTab = $state('upcoming');

	function setActive(tab: string) {
		activeTab = tab;
	}

	let success = $state(false);

	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};
</script>

<div class="min-h-screen w-full">
	<div class="mt-2 flex w-80 gap-2 rounded-full border-2 px-5 py-2">
		<button
			onclick={() => setActive('upcoming')}
			class="relative w-full overflow-hidden rounded-full border-2 px-5 py-1 font-semibold"
		>
			<span
				class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
				style:width={activeTab === 'upcoming' ? '100%' : '0%'}
			></span>
			<span
				class="relative z-10 transition-colors duration-300"
				class:text-white={activeTab === 'upcoming'}
				class:text-blue-600={activeTab !== 'upcoming'}
			>
				Baru
			</span>
		</button>

		<button
			onclick={() => setActive('completed')}
			class="relative w-full overflow-hidden rounded-full border-2 px-5 py-1 font-semibold"
		>
			<span
				class="absolute left-0 top-0 h-full bg-blue-600 transition-all duration-300"
				style:width={activeTab === 'completed' ? '100%' : '0%'}
			></span>
			<span
				class="relative z-10 transition-colors duration-300"
				class:text-white={activeTab === 'completed'}
				class:text-blue-600={activeTab !== 'completed'}
			>
				Lama
			</span>
		</button>
	</div>
	<div class="mt-5 grid grid-cols-1 gap-12 lg:grid-cols-4">
		<div class="col-span-2">
			<div class="mt-2 w-full">
				<p>Nama Acara:</p>
				<input type="text" placeholder="Masukkan Nama" class="w-full rounded-lg border px-2 py-1" />
			</div>

			<div class="mt-3 w-full">
				<p>Penanggung Jawab Acara:</p>
				<input type="text" placeholder="Masukkan Nama" class="w-full rounded-lg border px-2 py-1" />
			</div>
			<div class="mt-3 w-full">
				<p>Penyelenggara Acara:</p>
				<input type="text" placeholder="Masukkan Nama" class="w-full rounded-lg border px-2 py-1" />
			</div>
			<div class="mt-3 w-full">
				<p>Lokasi Acara:</p>
				<input type="text" placeholder="Masukkan Nama" class="w-full rounded-lg border px-2 py-1" />
			</div>
			<div class="mt-3 w-full">
				<p>Tujuan Acara:</p>
				<input type="text" placeholder="Masukkan Nama" class="w-full rounded-lg border px-2 py-1" />
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
						<div class="mt-2 flex justify-center">
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

			<div class="flexcoba mt-2 flex w-full">
				<div class="mt-2 lg:flex-1">
					<p>Tanggal Mulai:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="flex-1 lg:ml-10">
					<div class="mt-2 w-full">
						<p>Tanggal Selesai:</p>
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
					<p>Waktu Mulai:</p>
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="flex-1 lg:ml-10">
					<div class="mt-2 w-full">
						<p>Waktu Selesai:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
						/>
					</div>
				</div>
			</div>
			<div class="mt-2 w-full">
				<p>Deskripsi Acara:</p>
				<textarea
					placeholder="Masukkan Deskripsi Acara"
					class="h-20 w-full resize-none rounded-md border px-3 py-1 text-lg"
				></textarea>
			</div>
		</div>
	</div>

	<div class="mt-5 h-1 w-full bg-slate-300"></div>

	<div class="mt-8 flex w-full">
		<p class="my-auto ml-10 w-full text-center font-bold">Undangan</p>
		<button class="w-60 justify-end text-nowrap rounded-lg bg-blue-400 px-2 py-2 text-white">
			Tambah Undangan
		</button>
	</div>

	<!-- bawah -->

	<div class="mt-10 grid grid-cols-9 gap-2">
		{#each Array(total) as _, i}
			<div class="col-span-1 w-full">{i + 1}</div>
			<div class="col-span-2 w-full rounded-lg border px-2 py-1">
				<select name="panggilan" id="panggilan" class="mt-1 w-full">
					<option value="volvo">Tn</option>
					<option value="saab">Ny</option>
				</select>
			</div>
			<input class="col-span-3 w-full rounded-lg border px-2 py-1" type="text" />
			<input class="col-span-2 w-full rounded-lg border px-2 py-1" />
			<div class="col-span-1">
				<span class="flex h-10 w-10 items-center justify-center rounded-full bg-red-400 p-2">
					<i class="gg--trash z-10 items-center text-2xl"></i>
				</span>
			</div>
		{/each}
	</div>

	<div class="mt-8 flex w-full justify-center lg:justify-end">
		<button class="w-50 text-nowrap rounded-lg bg-green-400 px-2 py-2 text-white" onclick={toggle}>
			Buat acara
		</button>
	</div>
</div>
{#if success}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SucessModal
			open={success}
			text="Tamu Berhasil Di Undang!"
			to="/abdi/dashboard/situs/daftaracara"
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
