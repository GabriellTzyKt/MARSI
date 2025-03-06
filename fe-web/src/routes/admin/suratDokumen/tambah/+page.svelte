<script lang="ts">
	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { fade } from 'svelte/transition';

	let nama = $state('');

	let success = $state(false);
	let uploadedFiles: File[] = [];
	let uploadedFileUrls: string[] = $state([]);

	let toggle = () => {
		if (!success) {
			success = true;
		} else success = false;
	};

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			const newFiles = Array.from(target.files);
			uploadedFiles = [...uploadedFiles, ...newFiles]; // Tambahkan file baru ke daftar lama
			uploadedFileUrls = [
				...uploadedFileUrls,
				...newFiles.map((file) => URL.createObjectURL(file))
			];
			console.log('Updated file list:', uploadedFiles);
		}
	}

	function removeImage(index: number) {
		uploadedFiles = uploadedFiles.slice(0, index).concat(uploadedFiles.slice(index + 1));
		uploadedFileUrls = uploadedFileUrls.slice(0, index).concat(uploadedFileUrls.slice(index + 1));
	}
</script>

<div class="test flex w-full flex-col">
	<div class="flex flex-row">
		<a href="/admin/keanggotaan/daftaranggota"
			><button class="custom-button bg-customRed">⭠ Kembali</button></a
		>
		<p class="ml-5 mt-6 text-3xl font-bold underline">Ubah Dokumen</p>
	</div>

	<div class="form-container flex flex-col">
		<form>
			<div class="input-group flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Dokumen</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					bind:value={nama}
					placeholder="John Doe"
				/>
			</div>

			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nomor_telepon">Asal Kerajaan</label>
				<select
					class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value=" " selected disabled>None</option>
					<option value="kerajaanA">Kerajaan A </option>
					<option value="kerajaanB">Kerajaan B</option>
				</select>
			</div>

			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nomor_telepon">Jenis Dokumen</label>
				<select
					class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value=" " selected disabled>None</option>
					<option value="dokumenA">Dokumen A </option>
					<option value="dokumenB">Dokumen B</option>
				</select>
			</div>

			<div class="input-group mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nomor_telepon">Kategori</label>
				<select
					class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value=" " selected disabled>None</option>
					<option value="kategoriA">Kategori A </option>
					<option value="kategoriB">Kategori B</option>
				</select>
			</div>

			<div class="input-group mt-2 flex w-full flex-col gap-1">
				<label class="text-md self-start text-left" for="fileInput">Dokumen</label>
				<div class="h-full w-full overflow-x-auto rounded-lg border-2 border-black px-2 py-2">
					<div class="flex flex-row gap-x-5">
						<div
							class="upload-container relative h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
						>
							<input
								type="file"
								id="fileInput"
								class="hidden"
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

						{#each uploadedFileUrls as url, index}
							<div class="relative flex-shrink-0">
								<img
									src={url}
									alt="Uploaded file"
									class="h-[200px] w-[270px] rounded-lg border object-cover"
								/>
								<button class="remove-btn" onclick={() => removeImage(index)}>✕</button>
							</div>
						{/each}
					</div>
				</div>
			</div>

			<div class="w-full justify-end flex">
				<button class="bg-customGold mt-2 rounded-lg border px-6 py-2 text-white">
					Tambah
				</button>
			</div>

		</form>
	</div>
</div>

{#if success}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 300 }}>
		<SucessModal
			open={success}
			text="Anggota Berhasil Ditambahkan"
			to="/admin/keanggotaan/daftaranggota"
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
