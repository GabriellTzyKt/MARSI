<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { env } from '$env/dynamic/public';
	let { data } = $props();
	let total = $state(8);
	let error = $state();
	let uploadedFilesAcara: (File | null)[] = $state([]);
	let uploadedFileUrlsAcara: string[] = $state([]);
	let uploadedFileIdsAcara: (number | null)[] = $state([]);
	let uploadedFilesDokumentasi: (File | null)[] = $state([]);
	let uploadedFileUrlsDokumentasi: string[] = $state([]);
	let uploadedFileIdsDokumentasi: (number | null)[] = $state([]);
	let fileinput = $state<File[]>([]);
	let loading = $state(false);
	let success = $state(false);
	function handleFileChangeAcara(event: Event) {
		const target = event.target as HTMLInputElement;
		console.log('File input changed:', target.files);

		if (target.files && target.files?.length > 0) {
			const newFiles = Array.from(target.files);
			console.log('New files selected:', newFiles);

			// Add new files to the list
			uploadedFilesAcara = [...uploadedFilesAcara, ...newFiles];

			// Add URLs for preview
			const newUrls = newFiles.map((file) => URL.createObjectURL(file));
			uploadedFileUrlsAcara = [...uploadedFileUrlsAcara, ...newUrls];

			// Add null IDs for new files
			uploadedFileIdsAcara = [...uploadedFileIdsAcara, ...Array(newFiles.length).fill(null)];

			console.log('Updated file list:', uploadedFilesAcara);
			console.log('Updated file id', uploadedFileIdsAcara);

			// Reset file input to allow selecting the same file again
			target.value = '';
		}
	}
	let fileNamelpj = $state('');

	function handleFileChangeDokumentasi(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const newFiles = Array.from(target.files);
			uploadedFilesDokumentasi = [...uploadedFilesDokumentasi, ...newFiles];
			const newUrls = newFiles.map((file) => URL.createObjectURL(file));
			uploadedFileUrlsDokumentasi = [...uploadedFileUrlsDokumentasi, ...newUrls];
			uploadedFileIdsDokumentasi = [
				...uploadedFileIdsDokumentasi,
				...Array(newFiles.length).fill(null)
			];
			target.value = '';
		}
	}

	function removeImageDokumentasi(index: number) {
		uploadedFilesDokumentasi = uploadedFilesDokumentasi.filter((_, i) => i !== index);
		uploadedFileUrlsDokumentasi = uploadedFileUrlsDokumentasi.filter((_, i) => i !== index);
		uploadedFileIdsDokumentasi = uploadedFileIdsDokumentasi.filter((_, i) => i !== index);
	}
	function removeImageAcara(index: number) {
		// Simpan ID gambar yang dihapus untuk dikirim ke server
		const deletedId = uploadedFileIdsAcara[index];

		// Hapus dari array
		uploadedFilesAcara = uploadedFilesAcara.filter((_, i) => i !== index);
		uploadedFileUrlsAcara = uploadedFileUrlsAcara.filter((_, i) => i !== index);
		uploadedFileIdsAcara = uploadedFileIdsAcara.filter((_, i) => i !== index);
	}
	function formatError(parsed) {
		if (!Array.isArray(parsed)) return parsed;

		const fieldMap = parsed[1] || {};
		const messages = {};
		for (const [field, idx] of Object.entries(fieldMap)) {
			const arrIdx = parsed.findIndex((v) => Array.isArray(v) && v[0] === idx);
			if (arrIdx !== -1 && typeof parsed[arrIdx + 1] === 'string') {
				messages[field] = [parsed[arrIdx + 1]];
			}
		}
		return messages;
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
	function getFileNameFromUrlAcara(url: string): string {
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
			formData.delete('uploadfileAcara');
			formData.delete('uploadfileDokumentasi');

			// Clear any existing existingFileId entries to avoid duplicates
			formData.delete('existingFileIdAcara');
			formData.delete('existingFileIdDokumentasi');

			// Add each docId as an existingFileId
			uploadedFileIdsAcara.forEach((docId, index) => {
				if (docId) {
					console.log(`Adding existingFileId ${index}:`, docId);
					formData.append('existingFileIdAcara', docId.toString());
				}
			});
			uploadedFileIdsDokumentasi.forEach((docId, index) => {
				if (docId) {
					console.log(`Adding existingFileId ${index}:`, docId);
					formData.append('existingFileIdDokumentasi', docId.toString());
				}
			});

			// Add new files
			const newFilesAcara = uploadedFilesAcara.filter(
				(file, index) => file && !uploadedFileIdsAcara[index]
			);
			console.log(`Adding ${newFilesAcara.length} new files to form`);

			newFilesAcara.forEach((file, index) => {
				if (file) {
					console.log(`Adding new file: ${file.name} (${file.size} bytes)`);
					formData.append('uploadfileAcara', file);
				}
			});
			// Add new files
			const newFilesDokumentasi = uploadedFilesDokumentasi.filter(
				(file, index) => file && !uploadedFileIdsDokumentasi[index]
			);
			console.log(`Adding ${newFilesDokumentasi.length} new files to form`);

			newFilesDokumentasi.forEach((file, index) => {
				if (file) {
					console.log(`Adding new file: ${file.name} (${file.size} bytes)`);
					formData.append('uploadfileDokumentasi', file);
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
			console.log('Server response:', { result });

			if (response.ok) {
				loading = false;
				success = true;
				if (result.type === 'success') {
					setTimeout(() => {
						success = false;
						goto('/abdi/sekretariat/acara');
					}, 3000);
				} else {
					let parsed = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
					error = formatError(parsed);
					console.log('Type Error', error);
				}
			} else {
			}

			console.log('Error submitting form:', error);
		} catch (err) {
			console.error('Error submitting form:', err);
			loading = false;
			error = { general: ['An unexpected error occurred'] };
		}
	}
	$inspect(error);
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
	let datadokumentasi = data?.fileDetailsDoc;
	let dataambil = data.dataAset;
	let imagePreviewlpj: string | null = $state(null);
	onMount(async () => {
		console.log('onMount: Starting to process datagambar:', datagambar);

		if (datagambar && datagambar?.length > 0) {
			// Initialize arrays with the correct IDs
			uploadedFileUrlsAcara = datagambar.map((file: any) => file.url);

			// Use the docId from each file as the existingFileId
			uploadedFileIdsAcara = datagambar.map((file: any) => file.docId || null);

			console.log('onMount: Initial uploadedFileUrlsAcara:', uploadedFileUrlsAcara);
			console.log('onMount: Initial uploadedFileIdsAcara:', uploadedFileIdsAcara);

			// Convert URLs to File objects
			const filePromises = datagambar.map(async (file: any, index: any) => {
				const filename = file.name || `file-${index}.${file.url.split('.').pop()}`;
				return await urlToFile(file.url, filename);
			});

			// Wait for all conversions to complete
			uploadedFilesAcara = await Promise.all(filePromises);
			console.log('onMount: Converted existing files to File objects:', uploadedFilesAcara);
		} else {
			console.log('onMount: No datagambar found or empty array');
		}
		if (datadokumentasi && datadokumentasi?.length > 0) {
			// Initialize arrays with the correct IDs
			uploadedFileUrlsDokumentasi = datadokumentasi.map((file: any) => file.url);

			// Use the docId from each file as the existingFileId
			uploadedFileIdsDokumentasi = datadokumentasi.map((file: any) => file.docId || null);

			console.log('onMount: Initial uploadedFileUrlsDokumentasi:', uploadedFileUrlsDokumentasi);
			console.log('onMount: Initial uploadedFileIdsDokumentasi:', uploadedFileIdsDokumentasi);

			// Convert URLs to File objects
			const filePromises = datadokumentasi.map(async (file: any, index: any) => {
				const filename = file.name || `file-${index}.${file.url.split('.').pop()}`;
				return await urlToFile(file.url, filename);
			});

			// Wait for all conversions to complete
			uploadedFilesDokumentasi = await Promise.all(filePromises);
			console.log('onMount: Converted existing files to File objects:', uploadedFilesDokumentasi);
		} else {
			console.log('onMount: No datadokumentasi found or empty array');
		}
	});
	function handleFileChangelpj(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			fileNamelpj = file.name;

			if (file.type.startsWith('image/')) {
				imagePreviewlpj = URL.createObjectURL(file);
			} else {
				imagePreviewlpj = null;
			}
		}
	}
	let rabList = $state([{ keterangan: '', jumlah: '' }]);

	function tambahRAB() {
		rabList = [...rabList, { keterangan: '', jumlah: '' }];
	}

	function hapusRAB(index: number) {
		rabList = rabList.filter((_, i) => i !== index);
	}
	let rab = $state(data?.rabData);
	async function hapusRABAPI(rab: any) {
		console.log('Rab ini dihapus', rab);
	}
	async function simpanEditRABAPI(i) {
		const edited = rab[i]; // Sudah berisi value terbaru dari input!
		console.log('Yang diedit ', edited);
		try {
			loading = true;
			const res = await fetch(`${env.PUBLIC_URL_KERAJAAN}/lpj/rab`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					id_rab: Number(edited.id_rab),
					keterangan: edited.keterangan,
					jumlah_pengeluaran: Number(edited.jumlah_pengeluaran)
				})
			});
			let msg = await res.json();
			if (res.ok) {
				// rab[i] = {
				// 	...rab[i],
				// 	keterangan: edited.keterangan,
				// 	jumlah_pengeluaran: Number(edited.jumlah_pengeluaran)
				// };
				// rab = [...rab];
				console.log('Rab berhasil diubah', msg);
				success = true;
				// Optionally: tampilkan notifikasi sukses
			}
			await invalidateAll().then(() => {
				loading = false;
				setTimeout(() => {
					success = false;
				}, 1000);
			});
		} catch (error) {}
	}
	function getFileNameFromUrl(url: string): string {
		if (!url) return '';
		const parts = url.split('/');
		const lastPart = parts[parts.length - 1];
		return lastPart.split('?')[0]; // hapus query string jika ada
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}

<div class="min-h-full w-full">
	<form
		action="?/updateLaporan"
		method="POST"
		enctype="multipart/form-data"
		onsubmit={handleSubmit}
	>
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
							name="nama_acara"
							value={data?.data?.nama_acara || '-'}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							readonly
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Penanggung Jawab:</p>
						<input
							type="text"
							value={data?.data?.nama_penanggungjawab}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							readonly
						/>
						<input
							type="text"
							hidden
							name="penanggungjawab_id"
							value={data?.data.id_penanggung_jawab}
							id=""
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Lokasi Acara:</p>
						<input
							type="text"
							value={data?.data?.alamat_acara}
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							readonly
						/>
						<input type="text" hidden name="lokasi_acara" value={data?.data.id_lokasi} id="" />
					</div>
					<div class="mt-2 w-full">
						<p>Tujuan Acara:</p>
						<input
							type="text"
							value={data?.data?.tujuan_acara}
							placeholder="Masukkan Nama"
							name="tujuan_acara"
							readonly
							class="w-full rounded-lg border px-2 py-1"
						/>
					</div>
					<div class="mt-2 w-full">
						<p>Deskripsi Acara:</p>
						<textarea
							placeholder="Masukkan Deskripsi Acara"
							readonly
							name="deskripsi_acara"
							value={data?.data?.deskripsi_acara}
							class="h-32 w-full resize-none rounded-md border px-3 py-3 text-lg"
						></textarea>
					</div>
				</div>
				<input type="text" hidden name="status" value={data?.data.status_pengajuan} id="" />
				<div class="col-span-1">
					<div class="flexcoba flex gap-2">
						<div class="mt-2 w-full">
							<p>Jenis Acara:</p>
							<input
								type="text"
								placeholder="Masukkan Nama"
								value={data?.data?.jenis_acara}
								name="jenis_acara"
								class="w-full rounded-lg border px-2 py-1"
								readonly
							/>
						</div>
						<div class="mt-2 w-full">
							<p>Kapasitas Acara:</p>
							<input
								type="text"
								placeholder="Masukkan Nama"
								name="kapasitas_acara"
								value={data?.data?.kapasitas_acara}
								class="w-full rounded-lg border px-2 py-1"
								readonly
							/>
						</div>
					</div>

					<div class="mt-2 w-full">
						<p>Lokasi Acara:</p>
						<input
							type="text"
							value={data?.data?.alamat_acara}
							name="alamat_acara"
							placeholder="Masukkan Nama"
							class="w-full rounded-lg border px-2 py-1"
							readonly
						/>
					</div>

					<div class="flexcoba flex gap-2">
						<div class="mt-2 w-full">
							<p>Tanggal Mulai:</p>
							<input
								type="text"
								value={data?.data?.tanggal_mulai}
								name="tanggal_mulai"
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
								readonly
							/>
						</div>
						<div class="mt-2 w-full">
							<p>Tanggal Selesai:</p>
							<input
								type="text"
								value={data?.data?.tanggal_selesai}
								name="tanggal_selesai"
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
								readonly
							/>
						</div>
					</div>

					<div class="flexcoba flex gap-2">
						<div class="mt-2 w-full">
							<p>Jam Mulai:</p>
							<input
								type="text"
								value={data?.data?.waktu_mulai}
								name="jam_mulai"
								placeholder="Masukkan Nama"
								class="w-full rounded-lg border px-2 py-1"
								readonly
							/>
						</div>
						<div class="mt-2 w-full">
							<p>Jam Selesai:</p>
							<input
								type="text"
								value={data?.data?.waktu_selesai}
								placeholder="Masukkan Nama"
								name="jam_selesai"
								class="w-full rounded-lg border px-2 py-1"
								readonly
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
						<p>No Undangan Yet</p>
					</div>
				{/if}
			</div>

			<div class="mt-5 h-1 w-full bg-slate-300"></div>

			<!-- bawah -->

			<p class="mb-5 mt-5 text-start text-xl font-bold text-blue-600">Panitia Acara</p>
			<div class="grid grid-cols-8 gap-2">
				{#each data?.panit as panit, i}
					<div class="col-span-1 w-full">{i + 1}</div>
					<div class="col-span-4 w-full rounded-lg border px-2 py-1">{panit.nama_panit}</div>
					<div class="col-span-3 w-full rounded-lg border px-2 py-1">{panit.jabatan}</div>
				{/each}
				{#if data?.panit?.length === 0}
					<div class="col-span-full items-center justify-center py-2">
						<p>No Panitia Yet</p>
					</div>
				{/if}
			</div>

			<div class="mt-5 h-1 w-full bg-slate-300"></div>

			<div class="flex flex-col">
				<div>
					<p class="mt-5 text-start text-2xl font-bold text-blue-700">Laporan Acara</p>
				</div>

				<div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
					<div class="col-span-1 mt-5 h-full w-full rounded-lg border-2 border-gray-500">
						<p class="ml-5 mt-5 text-xl font-bold text-blue-700">Peserta</p>
						<p class="ml-5 mt-5">Jumlah Orang Hadir<span class="text-red-500">*</span></p>
						<input
							type="number"
							placeholder="Masukkan Jumlah"
							name="jumlah_peserta"
							required
							value={data?.data?.lpj.jumlah_peserta || ''}
							class="ml-3 w-[90%] rounded-lg border-2 border-gray-400 px-2 py-2"
						/>
						{#if error?.jumlah_peserta}
							<p class="ml-3 text-xs text-red-500">{error.jumlah_peserta[0]}</p>
						{/if}
						<p class="ml-5 mt-5">Perkiraan Jumlah Orang Hadir<span class="text-red-500">*</span></p>
						<input
							type="number"
							placeholder="Masukkan Jumlah"
							name="perkiraan_jumlah_peserta"
							required
							value={data?.data?.lpj.perkiraan_jumlah_peserta || ''}
							class="ml-3 w-[90%] rounded-lg border-2 border-gray-400 px-2 py-2"
						/>
						{#if error?.perkiraan_jumlah_peserta}
							<p class="ml-3 text-xs text-red-500">{error.perkiraan_jumlah_peserta[0]}</p>
						{/if}
						<p class="ml-5 mt-5">Bukti Foto<span class="text-red-500">*</span></p>
						<div class="relative ml-3 w-[90%]">
							<!-- <input
							type="text"
							readonly
							name="bukti_bintang_jasa"
							placeholder="Bukti Gelar"
							class="w-full rounded-lg py-2 pe-2 ps-2 focus:outline-none"
							bind:value={fileName}
						/> -->
							<input
								type="text"
								placeholder="Unggah Bukti Foto"
								name=""
								readonly
								value={uploadedFilesDokumentasi.length > 0
									? uploadedFilesDokumentasi[0]?.name
									: uploadedFileUrlsDokumentasi.length > 0
										? getFileNameFromUrl(uploadedFileUrlsDokumentasi[0])
										: ''}
								class="w-full rounded-lg border-2 border-gray-400 px-2 py-2"
							/>
							<label for="bukti_pelaksanaan" class="absolute cursor-pointer">
								<span class="pajamas--media absolute right-2 mt-2.5 opacity-55"> </span>

								<input
									type="file"
									name="bukti_pelaksanaan"
									id="bukti_pelaksanaan"
									accept="image/*"
									class="hidden"
									onchange={handleFileChangeDokumentasi}
								/>
							</label>
							<!-- <span class="pajamas--media absolute right-2 mt-2.5 opacity-55"> </span> -->
						</div>
						{#if uploadedFileUrlsDokumentasi?.length !== 0}
							<div class="mt-2 flex w-full justify-center">
								<img
									src={uploadedFileUrlsDokumentasi[0]}
									alt="preview"
									class="h-auto w-[200px] rounded object-fill text-center"
								/>
							</div>
						{/if}
					</div>

					<!-- 2 -->
					<div
						class="col-span-1 mt-5 h-full w-full rounded-lg border-2 border-gray-500 lg:col-span-2"
					>
						<div class="flex items-center justify-between">
							<p class="ml-5 text-xl font-bold text-blue-700">RAB</p>
							<button
								class="px-15 mb-6 ml-7 mr-10 mt-5 rounded-lg border bg-blue-500 py-2 text-white lg:ml-0"
								onclick={tambahRAB}
								type="button"
							>
								Tambah
							</button>
						</div>
						<div class="h-13 mx-auto w-[95%] rounded-lg border-2 border-gray-400">
							<p class="px-3 py-2 text-xl">
								Total Biaya : <span class="text-green-600"
									>{[...(rab || []), ...(rabList || [])]
										.reduce(
											(sum, item) => sum + (parseInt(item.jumlah_pengeluaran || item.jumlah) || 0),
											0
										)
										.toLocaleString()}</span
								>
							</p>
						</div>
						<!-- Looping RAB -->
						<div class="mx-auto mt-4 h-fit w-[95%] rounded-lg border-2 border-gray-400 py-3">
							{#each rab as rab, i}
								<div
									class="mx-auto mt-4 grid h-fit w-[95%] grid-cols-3 gap-2 rounded-lg border-2 border-gray-400 px-3 py-2"
								>
									<input
										class="col-span-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
										type="text"
										placeholder="Keterangan"
										bind:value={rab.keterangan}
									/>

									<input
										class="col-span-1 mb-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
										type="number"
										placeholder="Jumlah Uang"
										bind:value={rab.jumlah_pengeluaran}
									/>

									<!-- Tombol hapus baris -->

									<button
										type="button"
										class="rounded-lg bg-red-500 text-white"
										onclick={() => hapusRAB(rab)}
									>
										Hapus
									</button>

									<button
										type="button"
										class="rounded-lg bg-yellow-500 text-white"
										onclick={() => simpanEditRABAPI(i)}
									>
										Edit
									</button>
								</div>
							{/each}
							{#each rabList as rab, i (i)}
								<div
									class="mx-auto mt-4 grid h-fit w-[95%] grid-cols-3 gap-2 rounded-lg border-2 border-gray-400 px-3 py-2"
								>
									<input
										class="col-span-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
										type="text"
										placeholder="Keterangan"
										bind:value={rabList[i].keterangan}
										name={`rab_keterangan_${i}`}
									/>
									{#if error?.['rab'] && error.rab[i]?.keterangan}
										<p class="text-xs text-red-500">{error.rab[i].keterangan}</p>
									{/if}
									<input
										class="col-span-1 mb-2 mt-2 h-5 w-full rounded-lg border-2 border-black px-3 py-4"
										type="number"
										placeholder="Jumlah Uang"
										bind:value={rabList[i].jumlah}
										name={`rab_jumlah_${i}`}
									/>
									{#if error?.['rab'] && error.rab[i]?.jumlah}
										<p class="text-xs text-red-500">{error.rab[i].jumlah}</p>
									{/if}
									<!-- Tombol hapus baris -->
									{#if rabList?.length > 1}
										<button
											type="button"
											class="ml-2 rounded bg-red-400 px-2 py-1 text-white"
											onclick={() => hapusRAB(i)}
										>
											Hapus
										</button>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<div class="mt-12 h-1 w-full bg-slate-500"></div>

			<div class="mt-5 flex w-full justify-between">
				<p class="mt-2 font-bold text-blue-600">Bukti Dokumentasi Acara</p>
				<label
					class="hover:bg-badran-btn-hover bg-badran-bt cursor-pointer rounded-lg p-2 text-white"
				>
					Tambah Gambar
					<input
						type="file"
						class="hidden"
						accept=".jpg,.jpeg,.png"
						multiple
						onchange={handleFileChangeDokumentasi}
						name="dokumentasi"
					/>
				</label>
			</div>

			<div class="mx-auto mt-5 flex gap-4 overflow-x-auto">
				{#each uploadedFileUrlsDokumentasi as fileUrl, index}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="relative flex-shrink-0">
						<img
							src={fileUrl}
							alt={uploadedFilesDokumentasi[index]?.name || `Dokumentasi ${index + 1}`}
							class="h-[200px] w-full rounded-lg border object-cover"
						/>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<span
							class="absolute bottom-0.5 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-400 p-2"
							onclick={() => removeImageDokumentasi(index)}
						>
							<i
								class="gg--trash absolute bottom-0.5 right-0.5 z-10 items-center text-2xl text-white"
							></i>
						</span>
					</div>
					{#if uploadedFileIdsDokumentasi[index]}
						<input
							type="hidden"
							name="existingDokumentasiId"
							value={uploadedFileIdsDokumentasi[index]}
						/>
					{/if}
				{/each}
			</div>

			<div class="mt-12 h-1 w-full bg-slate-500"></div>

			<div class="mt-5 flex justify-between">
				<p class="mt-2 font-bold text-blue-600">Illustrasi Acara</p>
				<!-- <button class="w-60 justify-end text-nowrap rounded-lg bg-blue-400 px-2 py-2 text-white">
					Tambah Gambar
				</button> -->
				<label
					class="hover:bg-badran-btn-hover bg-badran-bt cursor-pointer rounded-lg p-2 text-white"
				>
					Tambah Gambar
					<input
						type="file"
						class="hidden"
						hidden
						accept=".jpg,.jpeg,.png"
						multiple
						onchange={handleFileChangeAcara}
						name="dokumentasiAcara"
					/>
				</label>
			</div>

			<div class="mx-auto mt-5 flex gap-4 overflow-x-auto">
				{#each uploadedFileUrlsAcara as fileUrl, index}
					<div class="relative flex-shrink-0">
						<img
							src={fileUrl}
							alt={uploadedFilesAcara[index]?.name || getFileNameFromUrlAcara(fileUrl)}
							class="h-[200px] w-full rounded-lg border object-cover"
						/>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span
							class="absolute bottom-0.5 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-red-400 p-2"
							onclick={() => removeImageAcara(index)}
						>
							<i
								class="gg--trash absolute bottom-0.5 right-0.5 z-10 items-center text-2xl text-white"
							></i>
						</span>
					</div>
					<!-- Hidden input to store file ID if exists -->
					{#if uploadedFileIdsAcara[index]}
						<input type="hidden" name="existingFileId" value={uploadedFileIdsAcara[index]} />
					{/if}
				{/each}
			</div>
			{#if data?.data?.rab?.length > 0}
				<input type="text" name="rab" value="ada" id="" />
			{/if}

			<div class="mt-3 flex w-full justify-end">
				<button class="mt-8 w-fit rounded-lg bg-green-500 px-8 py-2 text-white">
					Simpan Laporan
				</button>
			</div>
		</div>
	</form>
</div>
{#if loading}
	<Loader></Loader>
{/if}
{#if success}
	<SuccessModal text="Sukses!"></SuccessModal>
{/if}

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
