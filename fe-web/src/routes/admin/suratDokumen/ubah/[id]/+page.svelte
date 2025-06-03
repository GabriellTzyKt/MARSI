<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import Loader from '$lib/loader/Loader.svelte';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let success = $state(false);
	let uploadedFiles: (File | null)[] = [];
	let uploadedFileUrls: string[] = $state([]);
	let uploadedFileIds: (number | null)[] = $state([]);
	let timer: Number;
	let loading = $state(false);
	let error: any = $state('');

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

	// Load existing images and convert to File objects
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

	let { data } = $props();
	console.log('data 1: ', data);
	let dataaarsip = data.arsipKerajaan;
	let dataambil = data.document;
	let datagambar = data.files;
	let dataarsipdropdown = data.filteredjenisarsip2

	// Debug URL gambar
	console.log('Data gambar:', datagambar);
	if (datagambar && datagambar.length > 0) {
		console.log('URL gambar:', datagambar[0].url);
	}

	let namadokumen = $state(dataambil.nama_arsip);
	let jenisdokumen = $state(dataambil.jenis_arsip);
	let sub_kategori_arsip = $state(dataambil.sub_kategori_arsip);
	let kategori_arsip = $state(dataambil.kategori_arsip.toLowerCase());
	let keterkaitan = $state(data && data.namaKerajaan ? data.namaKerajaan : ' ');
	let showDropdown = $state(false);

	let id_arsip_kerajaan = $state(dataaarsip ? dataaarsip.id_arsip_kerajaan : '');
	let id_kerajaan = $state(dataaarsip ? dataaarsip.id_kerajaan : '');

	function filter(data: any[]) {
		return data.filter((item) =>
			item?.nama_kerajaan?.toLowerCase().includes(keterkaitan.toLowerCase())
		);
	}
	let searchRes = $derived(filter(data.kerajaanData));

	function selectKeterkaitan(value: string, id: number) {
		keterkaitan = value;
		showDropdown = false;
		id_kerajaan = id;
		console.log('ID : ', id_kerajaan);
	}

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

	$effect(() => {
		if (!keterkaitan || data.kerajaanData.some((item: any) => item.nama_kerajaan === keterkaitan)) {
			showDropdown = false;
		} else {
			showDropdown = true;
		}
	});

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

	// Custom form submission to handle multiple files
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

			console.log("Form data : ", formData)

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
				clearTimeout(timer);
				invalidateAll();
				timer = setTimeout(() => {
					success = false;
					goto('/admin/suratDokumen');
				}, 3000);
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
</script>

<div class="test flex w-full flex-col">
	<div class="ml-5 mt-6 flex flex-row gap-3">
		<a href="/admin/suratDokumen" class="mt-2">⭠ Kembali</a>
		<p class="text-3xl font-bold underline">Ubah Dokumen</p>
	</div>

	<div class="form-container flex flex-col">
		<form method="post" action="?/submit" enctype="multipart/form-data" onsubmit={handleSubmit}>
			<div class="flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Dokumen</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					name="nama"
					bind:value={namadokumen}
					placeholder="Nama Dokumen"
				/>
				{#if error && error.nama}
					{#each error.nama as errorMsg}
						<p class="text-left text-red-500">{errorMsg}</p>
					{/each}
				{/if}
			</div>

			<div class="text-md mt-2 text-start">
				<label for="keterkaitan">Keterkaitan</label>
				<div class="relative flex flex-col gap-1">
					<input
						class="input-field rounded-lg border p-2 pr-10"
						name="keterkaitan"
						bind:value={keterkaitan}
						required
					/>

					<span class="cil--magnifying-glass absolute right-2 top-2.5"></span>
					{#if showDropdown && searchRes.length > 0}
						<ul class="bordeer z-10 max-h-40 w-full overflow-y-auto rounded-lg bg-white shadow-lg">
							<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
							{#each searchRes as item}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<li
									class="cursor-pointer p-2 hover:bg-gray-300"
									onclick={() => selectKeterkaitan(item.nama_kerajaan, item.id_kerajaan)}
								>
									{item.nama_kerajaan}
								</li>
							{/each}
						</ul>
					{/if}
					{#if error && error.keterkaitan}
						{#each error.keterkaitan as errorMsg}
							<p class="text-left text-red-500">{errorMsg}</p>
						{/each}
					{/if}
				</div>
			</div>

			{#if dataaarsip}
				<input type="hidden" name="id_arsip_kerajaan" value={dataaarsip.id_arsip_kerajaan || ''} />
			{/if}
				<input type="hidden" name="id_kerajaan" value={id_kerajaan} />

			<div class="mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="jenisDokumen">Jenis Dokumen</label>
				<select
					bind:value={jenisdokumen}
					name="jenisDokumen"
					class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
				<option value="" disabled>None</option>
				{#each dataarsipdropdown as jenis}
					<option value={jenis.id_jenis_arsip}>{jenis.nama_jenis}</option>
				{/each}
				</select>
				{#if error && error.jenisDokumen}
					{#each error.jenisDokumen as errorMsg}
						<p class="text-left text-red-500">{errorMsg}</p>
					{/each}
				{/if}
			</div>

			<div class="mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="kategori">Kategori</label>
				<select
					bind:value={kategori_arsip}
					name="kategori"
					class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value="masuk">Masuk </option>
					<option value="keluar">Keluar</option>
				</select>
				{#if error && error.kategori}
					{#each error.kategori as errorMsg}
						<p class="text-left text-red-500">{errorMsg}</p>
					{/each}
				{/if}
			</div>

			<div class="text-md mt-2 text-start">
				<label for="subkategori">Sub Kategori</label>
				<div class="relative flex flex-col gap-1">
					<select
						bind:value={sub_kategori_arsip}
						name="subkategori"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" disabled>None</option>
						{#each data.arsipData as item}
							<option value={item.id_arsip}>{item.nama_arsip}</option>
						{/each}
					</select>
					{#if error && error.subkategori}
						{#each error.subkategori as errorMsg}
							<p class="text-left text-red-500">{errorMsg}</p>
						{/each}
					{/if}
				</div>
			</div>

			<div class="mt-2 flex w-full flex-col gap-1">
				<label class="text-md self-start text-left" for="fileInput">Dokumen</label>
				<div class="h-full w-full overflow-x-auto rounded-lg border-2 border-black px-2 py-2">
					<div class="flex flex-row gap-x-5">
						<!-- Upload container -->
						<div
							class="upload-container relative h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-gray-300"
						>
							<input
								type="file"
								id="fileInput"
								class="hidden"
								name="uploadfile"
								onchange={handleFileChange}
								multiple
								accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.mp3,.mp4,.wav"
							/>
							<label
								for="fileInput"
								class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
							>
								<span class="pajamas--media"></span>
								<p class="mt-3 text-center">Upload Dokumentasi</p>
							</label>
						</div>

						<!-- File previews -->
						{#each uploadedFileUrls as fileUrl, index}
							<div class="relative flex-shrink-0">
								{#if getFileType(uploadedFiles[index], fileUrl).startsWith('image/')}
									<!-- Image preview -->
									<img
										src={fileUrl}
										alt={uploadedFiles[index]?.name || getFileNameFromUrl(fileUrl)}
										class="h-[200px] w-[270px] rounded-lg border object-cover"
									/>
								{:else}
									<!-- Non-image file preview -->
									<div
										class="flex h-[200px] w-[270px] flex-col items-center justify-center rounded-lg border bg-gray-100"
									>
										<!-- File type icon -->
										<div class="text-5xl">{getFileIconForType(getFileTypeFromUrl(fileUrl))}</div>

										<!-- File name -->
										<p
											class="mt-2 max-w-[250px] overflow-hidden text-ellipsis px-3 text-center text-sm"
										>
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
				</div>
				{#if error && error.urlfoto}
					{#each error.urlfoto as errorMsg}
						<p class="text-left text-red-500">{errorMsg}</p>
					{/each}
				{/if}
			</div>

			<div class="flex w-full justify-end">
				<button class="bg-customGold mt-2 rounded-lg border px-6 py-2 text-white" type="submit">
					Simpan
				</button>
			</div>
		</form>
	</div>
</div>

{#if success}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SucessModal open={success} text="Dokumen berhasil diubah!" to="/admin/suratDokumen"
		></SucessModal>
	</div>
{/if}

{#if loading}
	<Loader></Loader>
{/if}

<style>
	.input-field {
		width: auto;
	}

	.custom-button {
		border: none;
		padding: 10px;
		margin-left: 20px;
		margin-top: 20px;
		text-align: center;
		color: white;
		font-size: 16px;
		border-radius: 10px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	.form-container {
		margin-top: 30px;
		margin-left: 20px;
		margin-right: 20px;
		background: #dddee4;
		padding: 20px;
		border-radius: 10px;
		width: auto;
		height: fit-content;
		text-align: center;
	}

	.pajamas--media {
		display: inline-block;
		width: 48px;
		height: 48px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M13 2.5H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm9 9.857L9.5 8l-2.476 2.83L5.5 9L4 10.8V12h8zM6.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

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
	}

	@media (max-width: 768px) {
		.test {
			margin-top: 90px;
		}
	}
</style>
