<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { navigating, page } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';

	let { data } = $props();
	console.log('detail : ', data.komunitas);
	let dataambil = $state(data.komunitas);
	let dataanggota = $state(data.dataanggota.length);
	let dataProfile = $state(data.profileUrl?.url);
	let uploadedFiles: (File | null)[] = $state([]);
	let uploadedFileUrls: string[] = $state([]);
	let uploadedFileIds: (number | null)[] = $state([]);
	let datagambar = data.files;
	let datafotokomunitas = $state(data.fotoKomunitasDetails?.map((detail: any) => detail.url));
	console.log(datafotokomunitas);
	let loading = $state(false);
	let success = $state(false);
	let error = $state();
	let idAktif = $state(page.params.id);
	$effect(() => {
		idAktif = page.params.id;
	});
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
			{#if dataProfile}
				<img src={dataProfile} class="h-25 w-25 relative ml-5 mr-5 rounded-full" alt="" />
			{:else}
				<img src={gambardefault} class="h-25 w-25 relative ml-5 mr-5 rounded-full" alt="" />
			{/if}
		</div>
		<div class="mt-5 flex w-full justify-center lg:mt-0 lg:justify-end">
			<a href="/abdi/dashboard/komunitas/beranda/{idAktif}/detail/edit"
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
						readonly
						bind:value={dataambil.nama_komunitas}
						placeholder="Masukkan Nama"
					/>
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Alamat :</p>
					<input type="text" readonly bind:value={dataambil.alamat} placeholder="Masukkan Alamat" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Email :</p>
					<input type="text" readonly bind:value={dataambil.email} placeholder="Masukkan Email" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Deskripsi Komunitas :</p>
					<textarea
						readonly
						bind:value={dataambil.deskripsi_komunitas}
						placeholder="Masukkan nama"
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
						readonly
						value={data?.penanggungjawab}
						placeholder="Masukkan Penanggung Jawab"
					/>
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Pembina :</p>
					<input type="text" readonly value={data?.pembina} placeholder="Masukkan Pembina" />
				</div>
				<div
					class="mt-5 flex h-fit flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
				>
					<p>Pelindung :</p>
					<input type="text" readonly value={data?.pelindung} placeholder="Masukkan Pelindung" />
				</div>

				<!-- No Telp + Anggota -->
				<div class=" flexcoba flex gap-2">
					<div
						class="mt-5 flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>No telepon :</p>
						<input
							type="text"
							readonly
							bind:value={dataambil.no_telp}
							placeholder="--"
							class="h-full"
						/>
					</div>
					<div
						class="mt-5 flex h-fit w-full flex-col rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
					>
						<p>Jumlah Anggota :</p>
						<input
							type="text"
							readonly
							bind:value={dataanggota}
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
	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}
</style>
