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

	let uploadedFiles: File[] = $state([]);
	let uploadedFileUrls: string[] = $state([]);
	let uploadedFileIds: (number | null)[] = $state([]);

	// Handle file selection
	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const newFiles = Array.from(target.files);

			// Add new files to our arrays
			uploadedFiles = [...uploadedFiles, ...newFiles];

			// Create URLs for preview
			const newUrls = newFiles.map((file) => URL.createObjectURL(file));
			uploadedFileUrls = [...uploadedFileUrls, ...newUrls];

			// Add null IDs for new files (they don't have IDs yet)
			uploadedFileIds = [...uploadedFileIds, ...newFiles.map(() => null)];

			console.log(
				'Updated files:',
				uploadedFiles.map((f) => f.name)
			);

			// Reset input to allow selecting the same file again
			target.value = '';
		}
	}

	// Remove a file from the list
	function removeImage(index: number) {
		// Release object URL to prevent memory leaks
		URL.revokeObjectURL(uploadedFileUrls[index]);

		// Remove file from all arrays
		uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
		uploadedFileUrls = uploadedFileUrls.filter((_, i) => i !== index);
		uploadedFileIds = uploadedFileIds.filter((_, i) => i !== index);
	}
	let previewModal = $state(false);
	let previewType = $state('');
	let previewUrl = $state('');
	let previewName = $state('');

	function openPreview(file: File, url: string) {
		previewType = file.type;
		previewUrl = url;
		previewName = file.name;
		previewModal = true;
	}
	function closePreview() {
		previewModal = false;
		previewType = '';
		previewUrl = '';
		previewName = '';
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
	// Handle form submission
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		loading = true;
		errors = null; // Reset error state

		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);

			// Remove any existing file inputs
			formData.delete('uploadfile');

			// Add each file to the form data
			uploadedFiles.forEach((file, index) => {
				if (file) {
					console.log(`Adding file: ${file.name} (${file.size} bytes)`);
					formData.append('uploadfile', file);
				}
			});

			// Send the form data
			const response = await fetch(form.action, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			console.log('Response:', result);

			// Set loading to false after getting a response
			loading = false;

			// Check for success in various formats
			if (
				result.type === 'success' ||
				(result.data && result.data.success) ||
				result.success === true ||
				(result.message && result.message.includes('success'))
			) {
				console.log('Form submission successful, showing modal');
				success = true;

				// Set a timer to hide the success message after 3 seconds

				setTimeout(() => {
					success = false;
					goto('/abdi/sekretariat/aset');
				}, 3000);
			} else if (result.type === 'failure' && result.data?.errors) {
				// Handle SvelteKit formatted errors
				console.error('Form submission error:', result.data.errors);
				errors = result.data.errors;
				success = false;
			} else if (result.errors) {
				// Handle direct API errors
				console.error('Form submission error:', result.errors);
				errors = result.errors;
				success = false;
			} else if (!response.ok) {
				// Handle HTTP errors
				console.error('Form submission HTTP error:', response.status);
				errors = { general: [`Error: ${response.status} - ${result.message || 'Unknown error'}`] };
				success = false;
			}
		} catch (err) {
			console.error('Error submitting form:', err);
			errors = { general: ['Terjadi kesalahan saat mengirim data'] };
			loading = false;
			success = false;
		}
	}
	// $inspect();
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
	<form action="?/buat" method="post" enctype="multipart/form-data" onsubmit={handleSubmit}>
		<div class="grid w-full grid-cols-1 gap-2 lg:grid-cols-2">
			<!-- Nama Aset -->
			<div class="flex w-full flex-col gap-1">
				<div>
					<p>Nama Aset<span class="text-red-500">*</span></p>
				</div>
				<div class="flex">
					<input
						type="text"
						required
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
					<p>Jenis Aset<span class="text-red-500">*</span></p>
				</div>
				<div class="flex justify-between rounded-xl border bg-white px-2 py-2 shadow-sm">
					<input
						type="text"
						placeholder="Jenis Aset"
						required
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
						required
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
						onchange={handleFileChange}
						multiple
						name="dokumentasi"
					/>
				</label>
			</div>
		</div>
		{#if uploadedFileUrls.length > 0}
			<div class="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
				{#each uploadedFileUrls as url, index}
					<div class="relative w-full flex-shrink-0">
						{#if uploadedFiles[index]?.type.startsWith('image/')}
							<!-- Display image preview for image files -->
							<img
								src={url}
								alt="Uploaded file"
								class="h-[250px] w-full rounded-lg border object-cover"
							/>
						{:else}
							<!-- Display file icon for non-image files -->
							<div
								class=" flex h-auto w-full flex-col items-center justify-center rounded-lg border bg-gray-100"
							>
								<div class="mb-2 text-4xl">
									{#if uploadedFiles[index]?.type.includes('pdf')}
										📄
									{:else if uploadedFiles[index]?.type.includes('word') || uploadedFiles[index]?.type.includes('doc')}
										<a href={url}> 📝 </a>
									{:else if uploadedFiles[index]?.type.includes('sheet') || uploadedFiles[index]?.type.includes('excel') || uploadedFiles[index]?.type.includes('xls')}
										<a href={url}> 📊 </a>
									{:else if uploadedFiles[index]?.type.startsWith('audio/') || uploadedFiles[index]?.type.includes('mp3')}
										<div class="flex w-full flex-col items-center justify-between p-2">
											<audio src={url} controls class="w-30 mx-4 lg:w-60"> 📁 </audio>
										</div>
									{:else if uploadedFiles[index]?.type.startsWith('video/') || uploadedFiles[index]?.type.includes('mp3')}
										<div class="flex w-full flex-col items-center justify-between p-2">
											<video src={url} controls class=""></video>
										</div>
									{/if}
								</div>
								<p class="w-full truncate px-2 text-center text-sm">
									{uploadedFiles[index]?.name || 'File'}
								</p>
								<div class="mt-2 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
									{uploadedFiles[index]?.type.split('/')[1] || 'File'}
								</div>
							</div>
						{/if}
						<button type="button" class="remove-btn" onclick={() => removeImage(index)}>✕</button>
					</div>
				{/each}
			</div>
		{/if}
		{#if errors && errors.urlfoto}
			{#each errors.urlfoto as errorMsg}
				<p class="text-left text-red-500">{errorMsg}</p>
			{/each}
		{/if}

		<div class="flex justify-center lg:justify-end">
			<button class="bg-badran-bdg w-full rounded-lg px-6 py-2 text-white lg:w-auto"
				>Tambah Data</button
			>
		</div>
	</form>
</div>

<style>
	.remove-btn {
		position: absolute;
		top: 5px;
		right: 5px;
		background: red;
		color: white;
		border: none;
		border-radius: 50%;
		width: 25px;
		height: 25px;
		cursor: pointer;
		z-index: 10;
	}
</style>
