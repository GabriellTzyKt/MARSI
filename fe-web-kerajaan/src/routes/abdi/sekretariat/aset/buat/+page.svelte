<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	let { data } = $props();
	// import { error } from '@sveltejs/kit';
	let loading = $state(false);
	let errors = $state();
	let fileinput = $state<File[]>([]);
	let preview = $state<string[]>([]);
	let keyword = $state('');
	let dropdown = $state(false);
	let selectedItem = $state('');
	console.log(data.data);
	let success = $state(false);
	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files?.length > 0) {
			const file = Array.from(input.files);
			fileinput = [...fileinput, ...file];
			const newurl = file.map((file) => URL.createObjectURL(file));
			preview = [...preview, ...newurl];
		}
	}
	function removeFile(index: number) {
		URL.revokeObjectURL(preview[index]);

		fileinput = fileinput.filter((_, i) => i !== index);
		preview = preview.filter((_, i) => i !== index);
	}
	function filter() {
		if (!keyword.trim()) return [];
		return data.data.filter((item) =>
			item.nama_jenis.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function select(item: any) {
		selectedItem = item.nama_jenis;
		keyword = item.nama_jenis;
		dropdown = false;
	}
	$effect(() => {
		if (keyword !== selectedItem) {
			selectedItem = '';
		}
	});
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
{#if success}
	<SuccessModal text="berhasil ditambahkan"></SuccessModal>
{/if}
<div class="flex w-full flex-col">
	<form
		action="?/buat"
		method="post"
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					success = true;
					preview = [];
					fileinput = [];
					keyword = '';
					selectedItem = '';
					errors = null;
					setTimeout(() => {
						success = false;
						goto('/abdi/sekretariat/aset');
					}, 3000);
				}
				if (result.type === 'failure') {
					errors = result?.data?.errors;
					console.log(errors);
				}
			};
		}}
	>
		<div class="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
			<!-- Nama Aset -->
			<div class="flex w-full flex-col gap-1">
				<div>
					<p>Nama Aset</p>
				</div>
				<div class="flex">
					<input
						type="text"
						placeholder="Nama Aset"
						class="w-full rounded-xl border bg-white px-2 py-2 shadow-sm focus:outline-none"
						name="nama_aset"
					/>
				</div>
				{#if errors}
					{#each errors.nama_aset as e}
						<p class="text-sm text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
			<!-- Jenis Aset -->
			<div class="relative flex w-full flex-col gap-1">
				<div>
					<p>Jenis Aset</p>
				</div>
				<div class="flex justify-between rounded-xl border bg-white px-2 py-2 shadow-sm">
					<input
						type="text"
						placeholder="Jenis Aset"
						bind:value={keyword}
						onfocus={() => {
							dropdown = true;
						}}
						oninput={() => {
							dropdown = true;
						}}
						class=" grow focus:outline-none"
						name="jenis_aset"
					/>

					<div class="flex items-center justify-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</div>
				</div>
				{#if dropdown && keyword.trim()}
					<div
						class="absolute top-full z-10 mt-1 max-h-[100px] w-full rounded-lg border bg-white shadow-sm"
					>
						{#if filter().length > 0}
							{#each filter() as item}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									class="cursor-pointer px-4 py-2 hover:bg-gray-100"
									onclick={() => select(item)}
								>
									{item.nama_jenis}
								</div>
							{/each}
						{:else}
							<div class="px-4 py-2 text-gray-500">Tidak Ada Hasil yang cocok</div>
						{/if}
					</div>
				{/if}
				{#if errors}
					{#each errors.jenis_aset as e}
						<p class="text-sm text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
			<div class=" col-span-full flex flex-col gap-1">
				<div>
					<p>Deskripsi Aset</p>
				</div>
				<div class="flex">
					<textarea
						name="deskripsi_aset"
						placeholder="Masukkan Deskripsi Aset"
						class="w-full rounded-xl border bg-white px-2 py-2 shadow-sm focus:outline-none"
						rows="5"
						id=""
					></textarea>
				</div>
				{#if errors}
					{#each errors.deskripsi_aset as e}
						<p class="text-sm text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
		</div>

		<div class="my-4 h-[0.5px] w-full bg-black"></div>

		<div class="mb-4 flex justify-between">
			<div class="hidden lg:flex"></div>
			<div>
				<p class="text-xl font-[500]">Dokumentasi</p>
			</div>
			<div class="">
				<label
					class="hover:bg-badran-btn-hover bg-badran-bt relative flex cursor-pointer rounded-lg px-4 py-2 text-white"
				>
					Tambah Gambar
					<input
						type="file"
						class="hidden"
						accept="image/*"
						multiple
						onchange={handleFileSelect}
						name="dokumentasi"
					/>
				</label>
			</div>
		</div>
		<div class="grid w-full grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
			{#each preview as url, index}
				<div class="relative h-[200px] w-auto">
					<img src={url} class="h-full w-full rounded-lg object-cover" alt="" />
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button
						type="button"
						class="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
						onclick={() => removeFile(index)}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="white"
							class="size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
							/>
						</svg>
					</button>
					<!-- Hidden input to send file data to server -->
					<input type="hidden" name="dokumentasi_preview[]" value={url} />
				</div>
			{/each}
		</div>
		{#each fileinput as file, index}
			<input hidden value={file} id="file-{index}" />
		{/each}
		<div>
			{#if errors}
				{#each errors.dokumentasi as e}
					<p class="text-sm text-red-500">{e}</p>
				{/each}
			{/if}
		</div>
		<div class="flex justify-center lg:justify-end">
			<button class="bg-badran-bdg w-full rounded-lg px-6 py-2 text-white lg:w-auto"
				>Tambah Data</button
			>
		</div>
	</form>
</div>
