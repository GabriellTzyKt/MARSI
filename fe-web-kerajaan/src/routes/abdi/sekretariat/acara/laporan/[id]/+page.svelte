<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	let { data } = $props();
	let total = $state(8);
	let error = $state();
	let uploadedFiles: (File | null)[] = $state([]);
	let uploadedFileUrls: string[] = $state([]);
	let uploadedFileIds: (number | null)[] = $state([]);
	let fileinput = $state<File[]>([]);
	let loading = $state(false);
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
						goto('/abdi/sekretariat/acara');
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
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="min-h-full w-full">
	<div class="block min-h-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
		<div class="flex w-full justify-between">
			<p class="mt-2">Informasi Acara</p>
		</div>

		<div class="mt-5 grid grid-cols-1 gap-12 lg:grid-cols-2">
			<div class="col-span-1">
				<div class="mt-2 w-full">
					<p>Nama Acara:</p>
					<input
						type="text"
						value={data?.data?.nama_acara || '-'}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Penanggung Jawab:</p>
					<input
						type="text"
						value={data?.data?.nama_penanggungjawab}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						value={data?.data?.alamat_acara}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Tujuan Acara:</p>
					<input
						type="text"
						value={data?.data?.tujuan_acara}
						placeholder="Masukkan Nama"
						disabled
						class="w-full rounded-lg border px-2 py-1"
					/>
				</div>
				<div class="mt-2 w-full">
					<p>Deskripsi Acara:</p>
					<textarea
						placeholder="Masukkan Deskripsi Acara"
						disabled
						value={data?.data?.deskripsi_acara}
						class="h-32 w-full resize-none rounded-md border px-3 py-3 text-lg"
					></textarea>
				</div>
			</div>

			<div class="col-span-1">
				<div class="flexcoba flex gap-2">
					<div class="mt-2 w-full">
						<p>Jenis Acara:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							value={data?.data?.jenis_acara}
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Kapasitas Acara:</p>
						<input
							type="text"
							placeholder="Masukkan Nama"
							value={data?.data?.kapasitas_acara}
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
				</div>

				<div class="mt-2 w-full">
					<p>Lokasi Acara:</p>
					<input
						type="text"
						value={data?.data?.alamat_acara}
						placeholder="Masukkan Nama"
						class="w-full rounded-lg border px-2 py-1"
						disabled
					/>
				</div>

				<div class="flexcoba flex gap-2">
					<div class="mt-2 w-full">
						<p>Tanggal Mulai:</p>
						<input
							type="text"
							value={data?.data?.tanggal_mulai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Tanggal Selesai:</p>
						<input
							type="text"
							value={data?.data?.tanggal_selesai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
				</div>

				<div class="flexcoba flex gap-2">
					<div class="mt-2 w-full">
						<p>Jam Mulai:</p>
						<input
							type="text"
							value={data?.data?.waktu_mulai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Jam Selesai:</p>
						<input
							type="text"
							value={data?.data?.waktu_selesai}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							disabled
						/>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<!-- bawah -->

		<p class="mb-5 mt-5 text-start text-xl font-bold text-blue-600">Daftar Undangan</p>
		<div class="mt-10 grid grid-cols-9 gap-2">
			{#each data?.undangan as undangan, i}
				<div class="col-span-1 w-full">{i + 1}</div>
				<div class="col-span-2 w-full rounded-lg border px-2 py-1">
					<p class="w-full py-2 text-center">{undangan?.jenis_kelamin || 'No Data'}</p>
				</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">
					<p class="w-full py-2 text-center">{undangan?.nama_penerima}</p>
				</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">
					<p class="w-full py-2 text-center">{undangan?.nomer_telepon || 'No Phone'}</p>
				</div>
			{/each}
			{#if data?.undangan?.length === 0}
				<div class="col-span-full items-center justify-center py-2">
					<p>No Panitia Yet</p>
				</div>
			{/if}
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<!-- bawah -->

		<p class="mb-5 mt-5 text-start text-xl font-bold text-blue-600">Panitia Acara</p>
		<div class="grid grid-cols-8 gap-2">
			{#each Array(total) as _, i}
				<div class="col-span-1 w-full">{i + 1}</div>
				<div class="col-span-4 w-full rounded-lg border px-2 py-1">Nama Lengkap</div>
				<div class="col-span-3 w-full rounded-lg border px-2 py-1">Jabatan</div>
			{/each}
		</div>

		<div class="mt-5 h-1 w-full bg-slate-300"></div>

		<div class="flex flex-col">
			<div>
				<p class="mt-5 text-start text-2xl font-bold text-blue-700">Laporan Acara</p>
			</div>
			<div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
				<div class="col-span-1 mt-5 h-full w-full rounded-lg border-2 border-gray-500">
					<p class="ml-5 mt-5 text-xl font-bold text-blue-700">Peserta</p>
					<p class="ml-5 mt-5">Jumlah Orang Hadir</p>
					<input
						type="text"
						placeholder="Masukkan Jumlah"
						class="ml-3 w-[90%] rounded-lg border-2 border-gray-400 px-2 py-2"
					/>
					<p class="ml-5 mt-5">Perkiraan Jumlah Orang Hadir</p>
					<input
						type="text"
						placeholder="Masukkan Jumlah"
						class="ml-3 w-[90%] rounded-lg border-2 border-gray-400 px-2 py-2"
					/>
					<p class="ml-5 mt-5">Bukti Foto</p>
					<div class="relative ml-3 w-[90%]">
						<input
							type="text"
							placeholder="Unggah Bukti Foto"
							class="w-full rounded-lg border-2 border-gray-400 px-2 py-2"
						/>
						<span class="pajamas--media absolute right-2 mt-2.5 opacity-55"> </span>
					</div>
				</div>

				<!-- 2 -->
				<div
					class="col-span-1 mt-5 h-full w-full rounded-lg border-2 border-gray-500 lg:col-span-2"
				>
					<div class="flex items-center justify-between">
						<p class="ml-5 text-xl font-bold text-blue-700">RAB</p>
						<button
							class="px-15 mb-6 ml-7 mr-10 mt-5 rounded-lg border bg-blue-500 py-2 text-white lg:ml-0"
						>
							Tambah
						</button>
					</div>
					<div class="h-13 mx-auto w-[95%] rounded-lg border-2 border-gray-400">
						<p class="px-3 py-2 text-xl">
							Total Biaya : <span class="text-green-600">1.000.000</span>
						</p>
					</div>
					<!-- Component Kotak Bawah -->
					<div class="mx-auto mt-4 h-fit w-[95%] rounded-lg border-2 border-gray-400 py-3">
						<div
							class="mx-auto mt-4 grid h-fit w-[95%] grid-cols-3 gap-2 rounded-lg border-2 border-gray-400 px-3 py-2"
						>
							<input
								class="col-span-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Keterangan"
							/>
							<input
								class="col-span-1 mb-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Jumlah Uang"
							/>
						</div>
						<div
							class="mx-auto mt-4 grid h-fit w-[95%] grid-cols-3 gap-2 rounded-lg border-2 border-gray-400 px-3 py-2"
						>
							<input
								class="col-span-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Keterangan"
							/>
							<input
								class="col-span-1 mb-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Jumlah Uang"
							/>
						</div>
						<div
							class="mx-auto mt-4 grid h-fit w-[95%] grid-cols-3 gap-2 rounded-lg border-2 border-gray-400 px-3 py-2"
						>
							<input
								class="col-span-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Keterangan"
							/>
							<input
								class="col-span-1 mb-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Jumlah Uang"
							/>
						</div>
						<div
							class="mx-auto mt-4 grid h-fit w-[95%] grid-cols-3 gap-2 rounded-lg border-2 border-gray-400 px-3 py-2"
						>
							<input
								class="col-span-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Keterangan"
							/>
							<input
								class="col-span-1 mb-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
								type="text"
								placeholder="Jumlah Uang"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-12 h-1 w-full bg-slate-500"></div>

		<div class="mt-5 flex w-full justify-between">
			<p class="mt-2 w-full font-bold text-blue-600">Bukti Dokumentasi Acara</p>
			<button class="w-60 justify-end text-nowrap rounded-lg bg-blue-400 px-2 py-2 text-white">
				Tambah Gambar
			</button>
		</div>

		<div class="mx-auto mt-5 flex gap-4 overflow-x-auto">
			{#each Array(4) as _, index}
				<div class="relative flex-shrink-0">
					<img src={gambartemp} class="rounded-lg" alt="Gambar {index}" />
					<span
						class="absolute bottom-0.5 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-400 p-2"
					>
						<i class="gg--trash absolute bottom-0.5 right-0.5 z-10 items-center text-2xl text-white"
						></i>
					</span>
				</div>
			{/each}
		</div>

		<div class="mt-12 h-1 w-full bg-slate-500"></div>

		<div class="mt-5 flex w-full justify-between">
			<p class="mt-2 w-full font-bold text-blue-600">Illustrasi Acara</p>
			<button class="w-60 justify-end text-nowrap rounded-lg bg-blue-400 px-2 py-2 text-white">
				Tambah Gambar
			</button>
		</div>

		<div class="mx-auto mt-5 flex gap-4 overflow-x-auto">
			{#each Array(4) as _, index}
				<div class="relative flex-shrink-0">
					<img src={gambartemp} class="rounded-lg" alt="Gambar {index}" />
					<span
						class="absolute bottom-0.5 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-400 p-2"
					>
						<i class="gg--trash absolute bottom-0.5 right-0.5 z-10 items-center text-2xl text-white"
						></i>
					</span>
				</div>
			{/each}
		</div>

		<div class="mt-3 flex w-full justify-end">
			<button class="mt-8 w-fit rounded-lg bg-green-500 px-8 py-2 text-white">
				Simpan Laporan
			</button>
		</div>
	</div>
</div>

<style>
	.pajamas--media {
		display: inline-block;
		width: 22px;
		height: 22px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23101010' fill-rule='evenodd' d='M13 2.5H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm9 9.857L9.5 8l-2.476 2.83L5.5 9L4 10.8V12h8zM6.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

	.gg--trash {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fff6f6'%3E%3Cpath fill-rule='evenodd' d='M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2zm-2-1H9v1h6zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z' clip-rule='evenodd'/%3E%3Cpath d='M9 9h2v8H9zm4 0h2v8h-2z'/%3E%3C/g%3E%3C/svg%3E");
	}
</style>
