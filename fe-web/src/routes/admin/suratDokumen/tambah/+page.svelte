<script lang="ts">
	import { enhance } from '$app/forms';
	import { env } from '$env/dynamic/public';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { fade } from 'svelte/transition';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import Search from '$lib/table/Search.svelte';

	const { data } = $props();
	console.log('data kerajaan : ', data.kerajaanData);
	let showDropdown = $state(false);

	let nama = $state('');
	let jenisDokumen = $state(' ');
	let kategori = $state(' ');
	let keterkaitan = $state('');
	let subkategori = $state('');

	let loading = $state(false);
	let error: any = $state('');
	let success = $state(false);
	let showModal = $state(false);
	let timer: any;
	let selectedId : any = $state("");

	// File handling variables
	let uploadedFiles: File[] = [];
	let uploadedFileUrls: string[] = $state([]);
	let uploadedFileIds: (number | null)[] = $state([]);

	$effect(() => {
		if (keterkaitan === '') {
			showDropdown = false;
		} else {
			showDropdown = true;
		}
	});

	function selectKeterkaitan(value: string, id: number) {
		keterkaitan = value;
		showDropdown = false;
		selectedId = id;
		console.log("select id : ", selectedId)
	}

	function filter(data: any[]) {
		return data.filter((item) =>
			item?.nama_kerajaan?.toLowerCase().includes(keterkaitan.toLowerCase())
		);
	}
	let searchRes = $derived(filter(data.kerajaanData));

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

	$effect(() => {
		if (!keterkaitan || data.kerajaanData.some((item : any) => item.nama_kerajaan === keterkaitan)) {
			showDropdown = false;
		} else {
			showDropdown = true;
		}
	});

	// Handle form submission
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		loading = true;
		error = null; // Reset error state

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
				clearTimeout(timer);
				timer = setTimeout(() => {
					success = false;
				}, 3000);
			} else if (result.type === 'failure' && result.data?.errors) {
				// Handle SvelteKit formatted errors
				console.error('Form submission error:', result.data.errors);
				error = result.data.errors;
				success = false;
			} else if (result.errors) {
				// Handle direct API errors
				console.error('Form submission error:', result.errors);
				error = result.errors;
				success = false;
			} else if (!response.ok) {
				// Handle HTTP errors
				console.error('Form submission HTTP error:', response.status);
				error = { general: [`Error: ${response.status} - ${result.message || 'Unknown error'}`] };
				success = false;
			}
		} catch (err) {
			console.error('Error submitting form:', err);
			error = { general: ['Terjadi kesalahan saat mengirim data'] };
			loading = false;
			success = false;
		}
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}

<div class="test flex w-full flex-col">
	<div class="flex flex-row">
		<a href="/admin/suratDokumen"><button class="custom-button bg-customRed">⭠ Kembali</button></a>
		<p class="ml-5 mt-6 text-3xl font-bold underline">Tambah Dokumen</p>
	</div>

	<div class="form-container flex flex-col">
		<form method="post" action="?/submit" enctype="multipart/form-data" onsubmit={handleSubmit}>
			{#if error && error.general}
				<div class="mb-4 rounded-md bg-red-50 p-4">
					<div class="flex">
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">Error:</h3>
							<div class="mt-2 text-sm text-red-700">
								<ul class="list-disc space-y-1 pl-5">
									{#each error.general as message}
										<li>{message}</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				</div>
			{/if}

			<div class="flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Dokumen</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					name="nama"
					bind:value={nama}
					placeholder="Nama Dokumen"
					required
				/>
				{#if error && error.namaDokumen}
					{#each error.namaDokumen as errorMsg}
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
									onmousedown={() => selectKeterkaitan(item.nama_kerajaan, item.id_kerajaan)}
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

			<input type="hidden" name="id_kerajaan" value={selectedId}>

			<div class="mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="jenisDokumen">Jenis Dokumen</label>
				<select
					bind:value={jenisDokumen}
					name="jenisDokumen"
					class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					required
				>
					<option value="" disabled>None</option>
					<option value="1">1 </option>
					<option value="2">2</option>
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
					bind:value={kategori}
					name="kategori"
					class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					required
				>
					<option value="" disabled>None</option>
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
						bind:value={subkategori}
						name="subkategori"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						required
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
								accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.mp3,.mp4,.wav,.txt,.zip,.rar"
							/>
							<label
								for="fileInput"
								class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
							>
								<span class="pajamas--media"></span>
								<p class="mt-3 text-center">Upload Dokumentasi</p>
							</label>
						</div>

						{#each uploadedFileUrls as url, index}
							<div class="relative flex-shrink-0">
								{#if uploadedFiles[index]?.type.startsWith('image/')}
									<!-- Display image preview for image files -->
									<img
										src={url}
										alt="Uploaded file"
										class="h-[200px] w-[270px] rounded-lg border object-cover"
									/>
								{:else}
									<!-- Display file icon for non-image files -->
									<div
										class="flex h-[200px] w-[270px] flex-col items-center justify-center rounded-lg border bg-gray-100"
									>
										<div class="mb-2 text-4xl">
											{#if uploadedFiles[index]?.type.includes('pdf')}
												📄
											{:else if uploadedFiles[index]?.type.includes('word') || uploadedFiles[index]?.type.includes('doc')}
												📝
											{:else if uploadedFiles[index]?.type.includes('sheet') || uploadedFiles[index]?.type.includes('excel') || uploadedFiles[index]?.type.includes('xls')}
												📊
											{:else}
												📁
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
								<button type="button" class="remove-btn" onclick={() => removeImage(index)}
									>✕</button
								>
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
					Tambah
				</button>
			</div>
		</form>
	</div>
</div>

{#if success}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SucessModal open={success} text="Dokumen berhasil ditambahkan!" to="/admin/suratDokumen"
		></SucessModal>
	</div>
{/if}

{#if loading}
	<Loader></Loader>
{/if}

<style>
	.cil--magnifying-glass {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23150000' d='m479.6 399.716l-81.084-81.084l-62.368-25.767A175 175 0 0 0 368 192c0-97.047-78.953-176-176-176S16 94.953 16 192s78.953 176 176 176a175.03 175.03 0 0 0 101.619-32.377l25.7 62.2l81.081 81.088a56 56 0 1 0 79.2-79.195M48 192c0-79.4 64.6-144 144-144s144 64.6 144 144s-64.6 144-144 144S48 271.4 48 192m408.971 264.284a24.03 24.03 0 0 1-33.942 0l-76.572-76.572l-23.894-57.835l57.837 23.894l76.573 76.572a24.03 24.03 0 0 1-.002 33.941'/%3E%3C/svg%3E");
	}
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
