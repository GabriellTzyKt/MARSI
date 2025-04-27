<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	// import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { fade } from 'svelte/transition';
	import { tuple } from 'zod';
	let { data } = $props();
	let total = $state(8);
	let activeTab = $state('upcoming');
	let showDropdown = $state(false);
	let res = $state();
	let isLocationSelected = $state(false);

	function setActive(tab: string) {
		activeTab = tab;
	}
	let errors = $state();
	let success = $state(false);
	let lokasi_acara = $state('');
	let id_alamat = $state();
	let lokasi = $state();
	function filter(data: any[]) {
		return data.filter((item) =>
			item.nama_situs.toLowerCase().includes(lokasi_acara.toLowerCase())
		);
	}
	function bindId(item: any) {
		if (lokasi_acara) {
			id_alamat = item.nama_situs;
			lokasi = item.alamat;
			isLocationSelected = true;
		}
	}
	function handleLocationInput() {
		showDropdown = true;
		// If user manually types, allow alamat editing
		if (isLocationSelected && !resData.includes((item) => item.nama_situs === lokasi_acara)) {
			isLocationSelected = false;
		}
	}
	function toggleDropdown() {
		showDropdown = !showDropdown;
	}
	const toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};
	function select(item: any) {
		lokasi_acara = item.nama_situs;
		lokasi = item.alamat;
		isLocationSelected = true;
		showDropdown = false;
	}
	console.log(data.data);
	// let resData = $derived(data?.data ? filter(data.data) : []);
	let resData = $derived(data?.data ? filter(data.data) : []);
	let open = $state(false);
	let timer: number;
	let loading = $state(false);
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}

<div class="min-h-screen w-full">
	<form
		action="?/tambah"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				console.log(result);
				loading = false;
				if (result.type === 'success') {
					success = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						success = false;
						goto('/abdi/sekretariat/acara');
					}, 3000);
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
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
					{#if errors}
						{#each errors.nama_acara as e}
							<p class="texxt-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<!-- <div class="mt-3 w-full">
					<p>Penanggung Jawab Acara:</p>
					<input
						type="text"
						name="penanggungjawab_acara"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div> -->
				<!-- <div class="mt-3 w-full">
					<p>Penyelenggara Acara:</p>
					<input
						type="text"
						name="penyelenggara_acara"
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div> -->
				<div class="relative mt-3 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						autocomplete="off"
						onfocus={toggleDropdown}
						oninput={handleLocationInput}
						name="lokasi_acara"
						bind:value={lokasi_acara}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
					/>
					<!-- Location dropdown -->
					{#if showDropdown && data?.data}
						<ul
							class="dropdown absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white"
						>
							{#if resData.length > 0}
								{#each resData as item}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
									<li
										onclick={() => select(item)}
										class="cursor-pointer px-3 py-2 hover:bg-gray-100"
									>
										{item.nama_situs}
									</li>
								{/each}
							{:else}
								<li class="px-3 py-2 text-gray-500">No locations found</li>
							{/if}
						</ul>
					{/if}
				</div>
				<div class="mt-3 w-full">
					<p>Alamat Acara:</p>
					<input
						type="text"
						name="alamat_acara"
						bind:value={lokasi}
						disabled={isLocationSelected}
						placeholder="Masukkan Nama"
						class=" w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<!-- <div class="mt-3 w-full">
					<p>Tujuan Acara:</p>
					<input
						type="text"
						name="alamat_acara"
						placeholder="Masukkan Alamat Acara"
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div> -->
				<div class="mt-2 w-full">
					<p>Deskripsi Acara:</p>
					<textarea
						placeholder="Masukkan Deskripsi Acara"
						name="deskripsi_acara"
						class="h-20 w-full resize-none rounded-md border px-3 py-1 text-lg"
					></textarea>
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
									<label for="default-radio-2" class="mx-5 ms-2 text-sm font-medium text-black"
										>Public</label
									>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="mt-3 w-full">
					<p>Tujuan Acara:</p>
					<input
						type="text"
						name="alamat_acara"
						placeholder="Masukkan Alamat Acara"
						class="w-full rounded-lg border px-2 py-1"
					/>
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
						</div>
					</div>
				</div>
				<div class="flexcoba mt-2 flex w-full">
					<div class="mt-2 lg:flex-1">
						<p>Waktu Mulai:</p>
						<input
							type="text"
							name="waktu_mulai"
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
						/>
					</div>
					<div class="flex-1 lg:ml-10">
						<div class="mt-2 w-full">
							<p>Waktu Selesai:</p>
							<input
								type="text"
								name="waktu_selesai"
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
							/>
						</div>
					</div>
				</div>
				<!-- <div class="mt-2 w-full">
					<p>Deskripsi Acara:</p>
					<textarea
						placeholder="Masukkan Deskripsi Acara"
						name="deskripsi_acara"
						class="h-20 w-full resize-none rounded-md border px-3 py-1 text-lg"
					></textarea>
				</div> -->
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
