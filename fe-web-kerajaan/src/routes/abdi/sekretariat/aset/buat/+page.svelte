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
	let fileTypes = $state<Record<number, string>>({});
	console.log(data.data);
	let success = $state(false);
	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files?.length > 0) {
			const file = Array.from(input.files);
			const newIndex = fileinput.length;

			// Track file types
			file.forEach((f, i) => {
				if (f.type.startsWith('video/')) {
					fileTypes[newIndex + i] = 'video';
				} else if (f.type.startsWith('audio/')) {
					fileTypes[newIndex + i] = 'audio';
				} else {
					fileTypes[newIndex + i] = 'image';
				}
			});

			fileinput = [...fileinput, ...file];
			const newurl = file.map((file) => URL.createObjectURL(file));
			preview = [...preview, ...newurl];
		}
	}
	function removeFile(index: number) {
		URL.revokeObjectURL(preview[index]);

		// Also remove from fileTypes
		const newFileTypes = { ...fileTypes };
		delete newFileTypes[index];

		// Reindex remaining files
		const updatedFileTypes: Record<number, string> = {};
		fileinput
			.filter((_, i) => i !== index)
			.forEach((_, i) => {
				if (newFileTypes[i < index ? i : i + 1]) {
					updatedFileTypes[i] = newFileTypes[i < index ? i : i + 1];
				}
			});

		fileTypes = updatedFileTypes;
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
						class="absolute top-full z-10 mt-1 max-h-[100px] w-full overflow-auto rounded-lg border bg-white shadow-sm"
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
					Tambah File
					<input
						type="file"
						class="hidden"
						accept="image/*,video/*,audio/*"
						onchange={handleFileSelect}
						multiple
						name="dokumentasi"
					/>
				</label>
			</div>
		</div>
		{#if preview.length > 0}
			<div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{#each preview as url, i}
					<div class="relative h-40 w-full overflow-hidden rounded-lg border">
						{#if fileTypes[i] === 'video'}
							<video class="h-full w-full object-cover" controls>
								<source src={url} type={fileinput[i].type} />
								Browser tidak mendukung video.
							</video>
						{:else if fileTypes[i] === 'audio'}
							<div class="flex h-full w-full flex-col items-center justify-center bg-gray-100 p-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-12 w-12 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
									/>
								</svg>
								<audio controls class="mt-2 w-full">
									<source src={url} type={fileinput[i].type} />
									Browser tidak mendukung audio.
								</audio>
							</div>
						{:else}
							<img src={url} alt="preview" class="h-full w-full object-cover" />
						{/if}
						<button
							type="button"
							class="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
							onclick={() => removeFile(i)}
						>
							×
						</button>
					</div>
				{/each}
			</div>
		{/if}
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
