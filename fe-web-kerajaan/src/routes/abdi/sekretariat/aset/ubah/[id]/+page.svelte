<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { onMount } from 'svelte';
	let { data } = $props();
	// import { error } from '@sveltejs/kit';
	let loading = $state(false);
	let errors = $state();
	let error = $state();
	let uploadedFiles: (File | null)[] = $state([]);
	let uploadedFileUrls: string[] = $state([]);
	let uploadedFileIds: (number | null)[] = $state([]);
	let fileinput = $state<File[]>([]);
	let preview = $state<string[]>(data?.data?.gambarUrls || []);
	let keyword = $state(
		data?.jenisArsip?.find((item) => item?.id_jenis_aset === data?.dataAset?.id_jenis_aset)
			?.nama_jenis || ''
	);
	let dropdown = $state(false);
	let selectedItem = $state(
		data?.jenisArsip?.find((item) => item?.id_jenis_aset === data?.dataAset?.id_jenis_aset)
			.id_jenis_aset
	);

	console.log(data.data);
	let success = $state(false);
	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		console.log('File input changed:', target.files);

		if (target.files && target.files.length > 0) {
			const newFiles = Array.from(target.files);
			console.log('New files selected:', newFiles);

			// Add new files to the list
			uploadedFiles = [...uploadedFiles, ...newFiles];

			// Add URLs for preview
			const newUrls = newFiles.map((file) => URL.createObjectURL(file));
			uploadedFileUrls = [...uploadedFileUrls, ...newUrls];

			// Add null IDs for new files
			uploadedFileIds = [...uploadedFileIds, ...Array(newFiles.length).fill(null)];

			console.log('Updated file list:', uploadedFiles);
			console.log('Updated file id', uploadedFileIds);

			// Reset file input to allow selecting the same file again
			target.value = '';
		}
	}
	function removeImage(index: number) {
		// Simpan ID gambar yang dihapus untuk dikirim ke server
		const deletedId = uploadedFileIds[index];

		// Hapus dari array
		uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
		uploadedFileUrls = uploadedFileUrls.filter((_, i) => i !== index);
		uploadedFileIds = uploadedFileIds.filter((_, i) => i !== index);
	}

	// Function to get file type from URL or File object
	function getFileType(file: File | null, url: string): string {
		if (file) {
			return file.type;
		}

		// Try to determine type from URL extension
		const extension = url.toLowerCase().split('.').pop() || '';

		if (extension === 'pdf') return 'application/pdf';
		if (['doc', 'docx'].includes(extension)) return 'application/msword';
		if (['xls', 'xlsx'].includes(extension)) return 'application/vnd.ms-excel';
		if (['mp3'].includes(extension)) return 'audio/mpeg';
		if (['mp4'].includes(extension)) return 'video/mp4';
		if (['jpg', 'jpeg'].includes(extension)) return 'image/jpeg';
		if (['png'].includes(extension)) return 'image/png';

		return 'application/octet-stream';
	}
	// Add these helper functions to determine file type
	function getFileTypeFromUrl(url: string): string {
		const extension = url.toLowerCase().split('.').pop() || '';

		if (extension === 'pdf') return 'PDF';
		if (['doc', 'docx'].includes(extension)) return 'Word';
		if (['xls', 'xlsx'].includes(extension)) return 'Excel';
		if (['ppt', 'pptx'].includes(extension)) return 'PowerPoint';
		if (['mp3', 'wav', 'ogg'].includes(extension)) return 'Audio';
		if (['mp4', 'webm', 'mov'].includes(extension)) return 'Video';
		if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'Image';

		return 'Document';
	}
	function getFileIconForType(type: string): string {
		switch (type) {
			case 'PDF':
				return '📄';
			case 'Word':
				return '📝';
			case 'Excel':
				return '📊';
			case 'PowerPoint':
				return '📺';
			case 'Audio':
				return '🎵';
			case 'Video':
				return '🎬';
			case 'Image':
				return '🖼️';
			default:
				return '📁';
		}
	}
	function getFileNameFromUrl(url: string): string {
		const parts = url.split('/');
		return parts[parts.length - 1].split('?')[0];
	}
	async function handleSubmit(event: Event) {
		event.preventDefault();
		loading = true;

		try {
			const form = event.target as HTMLFormElement;
			const formData = new FormData(form);

			// Hapus input file kosong yang mungkin ada
			formData.delete('uploadfile');

			// Clear any existing existingFileId entries to avoid duplicates
			formData.delete('existingFileId');

			// Add each docId as an existingFileId
			uploadedFileIds.forEach((docId, index) => {
				if (docId) {
					console.log(`Adding existingFileId ${index}:`, docId);
					formData.append('existingFileId', docId.toString());
				}
			});

			// Add new files
			const newFiles = uploadedFiles.filter((file, index) => file && !uploadedFileIds[index]);
			console.log(`Adding ${newFiles.length} new files to form`);

			newFiles.forEach((file, index) => {
				if (file) {
					console.log(`Adding new file: ${file.name} (${file.size} bytes)`);
					formData.append('uploadfile', file);
				}
			});

			// Log all form data
			console.log('Form data to be submitted:');
			for (const [key, value] of formData.entries()) {
				if (value instanceof File) {
					console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
				} else {
					console.log(`${key}: ${value}`);
				}
			}

			// Send the form data
			const response = await fetch(form.action, {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			console.log('Server response:', result);

			if (response.ok) {
				loading = false;
				success = true;
				if (result.type === 'success') {
					setTimeout(() => {
						success = false;
						goto('/abdi/sekretariat/aset');
					}, 3000);
				} else {
					error = result.errors;
					loading = false;
				}
			} else {
				error = result.errors;
				loading = false;
			}
		} catch (err) {
			console.error('Error submitting form:', err);
			loading = false;
			error = { general: ['An unexpected error occurred'] };
		}
	}
	// Function to convert URL to File object
	async function urlToFile(url: string, filename: string): Promise<File | null> {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				console.error(`Failed to fetch image: ${response.statusText}`);
				return null;
			}

			const blob = await response.blob();
			// Determine file type from blob or URL
			const fileType = blob.type || 'image/jpeg';
			// Create a File object from the blob
			return new File([blob], filename, { type: fileType });
		} catch (error) {
			console.error('Error converting URL to File:', error);
			return null;
		}
	}
	let datagambar = data.files;
	let dataambil = data.dataAset;
	onMount(async () => {
		console.log('onMount: Starting to process datagambar:', datagambar);

		if (datagambar && datagambar.length > 0) {
			// Initialize arrays with the correct IDs
			uploadedFileUrls = datagambar.map((file: any) => file.url);

			// Use the docId from each file as the existingFileId
			uploadedFileIds = datagambar.map((file: any) => file.docId || null);

			console.log('onMount: Initial uploadedFileUrls:', uploadedFileUrls);
			console.log('onMount: Initial uploadedFileIds:', uploadedFileIds);

			// Convert URLs to File objects
			const filePromises = datagambar.map(async (file: any, index: any) => {
				const filename = file.name || `file-${index}.${file.url.split('.').pop()}`;
				return await urlToFile(file.url, filename);
			});

			// Wait for all conversions to complete
			uploadedFiles = await Promise.all(filePromises);
			console.log('onMount: Converted existing files to File objects:', uploadedFiles);
		} else {
			console.log('onMount: No datagambar found or empty array');
		}
	});
	function removeFile(index: number) {
		URL.revokeObjectURL(preview[index]);

		fileinput = fileinput.filter((_, i) => i !== index);
		preview = preview.filter((_, i) => i !== index);
	}
	function filter() {
		if (!keyword.trim()) return [];
		return data?.jenisArsip.filter((item) =>
			item.nama_jenis.toLowerCase().includes(keyword.toLowerCase())
		);
	}
	function select(item: any) {
		selectedItem = item.id_jenis_aset;
		keyword = item.nama_jenis;
		dropdown = false;
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
{#if success}
	<SuccessModal text="Berhasil!"></SuccessModal>
{/if}
<div class="flex w-full flex-col">
	<form action="?/edit" method="post" enctype="multipart/form-data" onsubmit={handleSubmit}>
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
						value={dataambil.nama_aset || ''}
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
				<input type="text" name="id_jenis_aset" hidden value={selectedItem} id="" />
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
						value={dataambil?.deskripsi || ''}
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
						accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.mp3,.mp4,.wav"
						multiple
						onchange={handleFileChange}
						name="dokumentasi"
					/>
				</label>
			</div>
		</div>
		<div class="grid w-full grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
			<!-- File previews -->
			{#each uploadedFileUrls as fileUrl, index}
				<div class="relative h-[250px] w-full">
					{#if getFileType(uploadedFiles[index], fileUrl).startsWith('image/')}
						<!-- Image preview -->
						<img
							src={fileUrl}
							alt={uploadedFiles[index]?.name || getFileNameFromUrl(fileUrl)}
							class="h-[200px] w-full rounded-lg border object-cover"
						/>
					{:else}
						<!-- Non-image file preview -->
						<div
							class="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border bg-gray-100"
						>
							<!-- File type icon -->
							<div class="text-5xl">{getFileIconForType(getFileTypeFromUrl(fileUrl))}</div>

							<!-- File name -->
							<p class="mt-2 max-w-[250px] overflow-hidden text-ellipsis px-3 text-center text-sm">
								{uploadedFiles[index]?.name || getFileNameFromUrl(fileUrl)}
							</p>

							<!-- File type label -->
							<div class="mt-2 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-800">
								{getFileTypeFromUrl(fileUrl)}
							</div>
						</div>
					{/if}

					<!-- Remove button -->
					<button
						type="button"
						class="remove-btn absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white"
						onclick={() => removeImage(index)}>✕</button
					>

					<!-- Hidden input to store file ID if exists -->
					{#if uploadedFileIds[index]}
						<input type="hidden" name="existingFileId" value={uploadedFileIds[index]} />
					{/if}
				</div>
			{/each}
		</div>
		{#each data?.data?.dokumentasi as f}
			<input type="text" name="gambar" hidden value={f} />
		{/each}
		{#each fileinput as file, index}
			<input hidden value={file} id="file-{index}" />
		{/each}
		<input type="text" hidden name="id_aset" value={dataambil?.id_aset} id="" />
		<!-- <input type="text" hidden name="id_kerajaan" value={data?.data?.id_kerajaan} id="" /> -->
		<div>
			{#if errors}
				{#each errors.dokumentasi as e}
					<p class="text-sm text-red-500">{e}</p>
				{/each}
			{/if}
		</div>
		<div class="flex justify-center lg:justify-end">
			<button class="bg-badran-bdg w-full rounded-lg px-6 py-2 text-white lg:w-auto"
				>Update Data</button
			>
		</div>
	</form>
</div>
