<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let success = $state(false);
	let uploadedFiles: File[] = [];
	let uploadedFileUrls: string[] = $state([]);
	let uploadedFileIds: (number | null)[] = $state([]);
	let timer: Number;

	    onMount(() => {
        if (datagambar && datagambar.length > 0) {
            // Langsung masukkan URL gambar ke array
            uploadedFileUrls = datagambar.map(file => file.url);
            uploadedFileIds = datagambar.map(file => file.id);
            uploadedFiles = Array(datagambar.length).fill(null);
            
            console.log('Loaded existing images:', uploadedFileUrls);
        }
    });
	// 	if (form?.success) {
	// 		success = true;
	// 		if (timer) {
	// 			clearTimeout(timer);
	// 		}
	// 		if (success)
	// 			timer = setTimeout(() => {
	// 				success = false;
	// 				goto('/admin/suratDokumen');
	// 			}, 3000);
	// 	} else {
	// 		if (form?.values) {
	// 			nama = String(form?.values?.namaDokumen);
	// 			jenisDokumen = String(form?.values?.jenisDokumen);
	// 			asalKerajaan = String(form?.values?.asalKerajaan);
	// 			kategori = String(form?.values?.kategori);
	// 			// uploadedFileUrls = form?.values?.urlfoto
	// 			// 	? Array.isArray(form.values.urlfoto)
	// 			// 		? form.values.urlfoto.map(String)
	// 			// 		: [String(form.values.urlfoto)]
	// 			// 	: [];
	// 		}
	// 	}
	// 	// Tambahkan: Inisialisasi gambar yang sudah ada ke uploadedFiles dan uploadedFileUrls
	// 	if (data.files && data.files.length > 0) {
	// 		// Untuk gambar yang sudah ada, kita tidak memiliki File object
	// 		// tapi kita bisa menyimpan URL dan ID-nya
	// 		uploadedFileUrls = data.files.map((file) => file.url);
	// 		uploadedFileIds = data.files.map((file) => file.id);
	// 		// uploadedFiles tetap kosong untuk gambar yang sudah ada
	// 		uploadedFiles = Array(data.files.length).fill(null);
	// 	}
	// });

	let { form, data } = $props();
	console.log('data 1: ', data);
	let dataambil = data.document;
	let datagambar = data.files;

	// Debug URL gambar
	console.log('Data gambar:', datagambar);
	if (datagambar && datagambar.length > 0) {
		console.log('URL gambar:', datagambar[0].url);
	}

	let namadokumen = $state(dataambil.nama_arsip);
	let jenisdokumen = $state(dataambil.jenis_arsip);
	let sub_kategori_arsip = $state(dataambil.sub_kategori_arsip);
	let kategori_arsip = $state(dataambil.kategori_arsip.toLowerCase());
	let keterkaitan = $state('');
	let showDropdown = $state(false);
	let loading = $state(false);
	function filter(data: any[]) {
		return data.filter((item) =>
			item?.nama_kerajaan?.toLowerCase().includes(keterkaitan.toLowerCase())
		);
	}
	let searchRes = $derived(filter(data.data));


	function selectKeterkaitan(value: string) {
		keterkaitan = value;
		showDropdown = false;
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		console.log('File input changed:', target.files); // Tambahkan log di sini

		if (target.files && target.files.length > 0) {
			const newFiles = Array.from(target.files);
			console.log('New files selected:', newFiles); // Tambahkan log di sini

			// Tambahkan file baru ke daftar lama
			uploadedFiles = [...uploadedFiles, ...newFiles];

			// Tambahkan URL untuk preview
			uploadedFileUrls = [
				...uploadedFileUrls,
				...newFiles.map((file) => URL.createObjectURL(file))
			];

			// Tambahkan null untuk ID file baru
			uploadedFileIds = [...uploadedFileIds, ...Array(newFiles.length).fill(null)];

			console.log('Updated file list:', uploadedFiles);
		}
	}

	let error: any = $state('');


	function removeImage(index: number) {
		// Simpan ID gambar yang dihapus untuk dikirim ke server
		const deletedId = uploadedFileIds[index];

		// Hapus dari array
		uploadedFiles = uploadedFiles.filter((_, i) => i !== index);
		uploadedFileUrls = uploadedFileUrls.filter((_, i) => i !== index);
		uploadedFileIds = uploadedFileIds.filter((_, i) => i !== index);
	}
</script>

<div class="test flex w-full flex-col">
	<div class="flex flex-row">
		<a href="/admin/suratDokumen"><button class="custom-button bg-customRed">⭠ Kembali</button></a>
		<p class="ml-5 mt-6 text-3xl font-bold underline">Ubah Dokumen</p>
	</div>

	<div class="form-container flex flex-col">
		<form
			method="post"
			action="?/submit"
			enctype="multipart/form-data"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					console.log(result);
					if (result.type === 'success') {
						loading = false;
						success = true;
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;
						}, 3000);
					} else if (result.type === 'failure') {
						error = result?.data?.errors;
					}
				};
			}}
		>
			<div class="flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Dokumen</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					name="nama"
					bind:value={namadokumen}
					placeholder="John Doe"
				/>
				{#if error}
					{#each error.namaDokumen as error1}
						<p class="text-left text-red-500">{error1}</p>
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
					/>

					<span class="cil--magnifying-glass absolute right-2 top-2.5"></span>
					{#if showDropdown && searchRes.length > 0}
						<ul class="bordeer z-10 max-h-40 w-full overflow-y-auto rounded-lg bg-white shadow-lg">
							<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
							{#each searchRes as item}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<li
									class="cursor-pointer hover:bg-gray-300"
									onclick={() => selectKeterkaitan(item.nama_kerajaan)}
								>
									{item.nama_kerajaan}
								</li>
							{/each}
						</ul>
					{/if}
					{#if error}
						{#each error.keterkaitan as error1}
							<p class="text-left text-red-500">{error1}</p>
						{/each}
					{/if}
				</div>
			</div>

			<div class="mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nomor_telepon">Jenis Dokumen</label>
				<select
					bind:value={jenisdokumen}
					name="jenisDokumen"
					class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value=" " disabled>None</option>
					<option value={1}>1 </option>
					<option value={2}>2</option>
				</select>
			
			</div>

			<div class=" mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nomor_telepon">Kategori</label>
				<select
					bind:value={kategori_arsip}
					name="kategori"
					class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value=" " disabled>None</option>
					<option value="masuk">Masuk </option>
					<option value="keluar">Keluar</option>
				</select>
				
			</div>

			<div class="text-md mt-2 text-start">
				<label for="subkategori">Sub Kategori</label>
				<div class="relative flex flex-col gap-1">
					<input
						class="input-field rounded-lg border p-2 pr-10"
						name="subkategori"
						bind:value={sub_kategori_arsip}
					/>

					<span class="cil--magnifying-glass absolute right-2 top-2.5"></span>
				</div>
			</div>

			<div class="mt-2 flex w-full flex-col gap-1">
				<label class="text-md self-start text-left" for="fileInput">Dokumen</label>
				<div class="h-full w-full overflow-x-auto rounded-lg border-2 border-black px-2 py-2">
					<div class="flex flex-row gap-x-5">
						<!-- Upload container -->
						<div
							class="upload-container relative h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
						>
							<input
								type="file"
								id="fileInput"
								class="hidden"
								name="uploadfile"
								onchange={handleFileChange}
								multiple
								accept="image/*"
							/>
							<label
								for="fileInput"
								class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
							>
								<span class="pajamas--media"></span>
								<p class="mt-3 text-center">Upload Dokumentasi</p>
							</label>
						</div>

						<!-- Tampilkan gambar yang baru diupload -->
						{#each uploadedFileUrls as url, index}
							<div class="relative flex-shrink-0">
								<img
									src={url}
									alt="Uploaded file"
									class="h-[200px] w-[270px] rounded-lg border object-cover"
								/>
								<button type="button" class="remove-btn" onclick={() => removeImage(index)}
									>✕</button
								>
							</div>
						{/each}
					</div>
				</div>
				
			</div>

			<div class="flex w-full justify-end">
				<button class="bg-customGold mt-2 rounded-lg border px-6 py-2 text-white" type="submit">
					Tambah
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
