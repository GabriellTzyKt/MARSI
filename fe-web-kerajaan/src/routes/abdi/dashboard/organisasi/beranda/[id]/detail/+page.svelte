<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { navigating, page } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';

	let { data } = $props();
	let dataambil = $state(data.organisasi);
	let datafotoprofile = $state(data?.profileUrl);
	let datasemuafoto = $state(data.fotoOrganisasiDetails?.map((detail: any) => detail.url));
	let dataanggota = $state(data.dataanggota.length);
	let uploadedFiles: (File | null)[] = $state([]);
	let uploadedFileUrls: string[] = $state([]);
	let uploadedFileIds: (number | null)[] = $state([]);
	let datagambar = data.files;
	let fileinput = $state<File[]>([]);
	let preview = $state<string[]>(data?.data?.gambarUrls || []);
	console.log('data ambil : ', dataambil);
	console.log('data foto profil : ', datafotoprofile);
	console.log('data all foto : ', datasemuafoto);
	console.log('data ', data.penanggungJawab);
	let loading = $state(false);
	let success = $state(false);
	let error = $state();

	let idAktif = $state(page.params.id);
	console.log('ID Aktif : ', idAktif);
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
					await invalidateAll().then(() => {
						setTimeout(() => {
							success = false;
							// goto('/abdi/sekretariat/aset');
						}, 3000);
					});
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
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="h-full w-full">
	<div class="block h-fit rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="relative mx-auto flex w-full items-center justify-center">
			<img
				src={datafotoprofile || gambardefault}
				class="h-25 w-25 relative ml-5 mr-5 rounded-full"
				alt=""
			/>
		</div>
		<div class="mt-5 flex w-full justify-center lg:mt-0 lg:justify-end">
			<a href="/abdi/dashboard/organisasi/beranda/{idAktif}/detail/edit"
				><button class="w-50 h-fit items-end rounded-lg bg-yellow-300 px-2 py-2 text-black">
					Ubah
				</button></a
			>
		</div>
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div
					class="flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Nama Komunitas:</p>
					<input
						type="text"
						bind:value={dataambil.nama_organisasi}
						readonly
						placeholder="Masukkan Nama"
					/>
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Alamat :</p>
					<input type="text" bind:value={dataambil.alamat} readonly placeholder="Masukkan Alamat" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Email :</p>
					<input type="text" bind:value={dataambil.email} readonly placeholder="Masukkan Email" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Deskripsi Organisasi :</p>
					<textarea
						placeholder="Masukkan nama"
						bind:value={dataambil.deskripsi_organisasi}
						readonly
						class="rounded-mdpx-3 h-32 w-full resize-none py-3 text-lg"
					></textarea>
				</div>
			</div>

			<!-- 2 -->
			<div>
				<div
					class="flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Penanggung Jawab :</p>
					<input
						type="text"
						value={data?.penanggungJawab?.nama_lengkap}
						readonly
						placeholder="Masukkan Penanggung Jawab"
					/>
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Pembina :</p>
					<input
						type="text"
						value={data?.pembina?.nama_lengkap}
						readonly
						placeholder="Masukkan Pembina"
					/>
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Pelindung :</p>
					<input
						type="text"
						value={data?.pelindung?.nama_lengkap || '-'}
						readonly
						placeholder="Masukkan Pelindung"
					/>
				</div>

				<!-- No Telp + Anggota -->
				<div class=" flexcoba flex gap-2">
					<div
						class="mt-5 flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>No telepon :</p>
						<input
							type="text"
							bind:value={dataambil.no_telp}
							readonly
							placeholder="Masukkan nama"
							class="h-full"
						/>
					</div>
					<div
						class="mt-5 flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>Jumlah Anggota :</p>
						<input
							type="text"
							bind:value={dataanggota}
							readonly
							placeholder="Masukkan nama"
							class="h-full"
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-5 h-1 w-full rounded-full bg-gray-300"></div>
		<form action="?/updateFoto" method="POST" onsubmit={handleSubmit}>
			<div class="mt-5 flex w-full justify-between">
				<div></div>
				<p class="ml-10 mt-2 text-start font-bold lg:text-center">Dokumentasi</p>
				<div>
					<label class="bg-badran-bt flex cursor-pointer rounded-lg px-4 py-2 text-white">
						Tambah Data
						<input
							type="file"
							class="hidden"
							accept=".jpg,.jpeg,.png"
							multiple
							onchange={handleFileChange}
							name="dokumentasi"
						/>
					</label>
				</div>
			</div>

			<div class=" flex gap-2 overflow-x-auto whitespace-nowrap py-2">
				{#each uploadedFileUrls as fileUrl, index}
					<div class="relative max-w-[800px] flex-shrink-0">
						<!-- <img
							src={imageUrl}
							class="h-full w-full rounded-lg object-cover"
							alt="Gambar Komunitas"
						/> -->
						<img
							src={fileUrl}
							alt={uploadedFiles[index]?.name || getFileNameFromUrl(fileUrl)}
							class="h-40 w-full rounded-lg border object-cover"
						/>
						<div class="absolute right-0 top-0 m-2 flex items-center justify-center">
							<!-- svelte-ignore a11y_consider_explicit_label -->
							<button
								type="button"
								class=" cursor-pointer rounded bg-red-500 p-1"
								onclick={() => removeImage(index)}
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
						</div>
					</div>
					<!-- Hidden input to store file ID if exists -->
					{#if uploadedFileIds[index]}
						<input type="hidden" name="existingFileId" value={uploadedFileIds[index]} />
					{/if}
				{/each}
			</div>
			<div class="mt-4 flex justify-end">
				<button class="bg-badran-bt cursor-pointer rounded-lg px-4 py-2 text-white">Simpan</button>
			</div>
		</form>
	</div>
</div>
{#if loading}
	<Loader></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if success}
	<SuccessModal text="Sukses!"></SuccessModal>
{/if}

<style>
	.gg--trash {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fff6f6'%3E%3Cpath fill-rule='evenodd' d='M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2zm-2-1H9v1h6zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z' clip-rule='evenodd'/%3E%3Cpath d='M9 9h2v8H9zm4 0h2v8h-2z'/%3E%3C/g%3E%3C/svg%3E");
	}

	.mdi--edit {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'/%3E%3C/svg%3E");
	}

	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}
</style>
