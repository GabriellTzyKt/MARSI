<script lang="ts">
	import { goto } from '$app/navigation';
	import SModal from '$lib/popup/SModal.svelte';

	let nama = $state('');
	let lokasi = $state('');
	let provinsi = $state('');
	let tanggal = $state('');
	let jenis_kerajaan = $state('');
	let nama_raja = $state('');
	let era = $state('');
	let rumpun = $state('');
	let deskripsi = $state('');
	let showModal = $state(false);

	let uploadedFiles: File[] = [];
	let uploadedFileUrls: string[] = $state([]);

	let benderaUrl: string | null = $state(null);
	let lambangUrl: string | null = $state(null);
	let videoName: string | null = $state(' No Video Selected ');

	let open = $state(false);
	let timer: number;

	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			open = false;
			goto('/admin/pendaftaranKerajaan');
			showModal = false;
		}, 3000);
	}

	function handleFileChange(event: Event, type: string) {
		console.log(event);
		const target = event.target as HTMLInputElement;
		console.log(target);
		// memastikan setidaknya ada 1 file yg sudah di upload
		if (target.files && target.files.length > 0) {
			const newFiles = Array.from(target.files); // mengambil semua file yg diupload
			console.log('files', newFiles);

			if (type === 'bendera') {
				// karena bendera hanya 1, jadi ambil di posisi pertama (0)
				benderaUrl = URL.createObjectURL(newFiles[0]);
			} else if (type === 'lambang') {
				lambangUrl = URL.createObjectURL(newFiles[0]);
			} else if (type === 'video') {
				videoName = newFiles[0].name;
			} else {
				// ... itu ngambil semua data ( ini kalo dokumen tipe nya )
				// ini gabungin data lama + data baru
				uploadedFiles = [...uploadedFiles, ...newFiles];
				uploadedFileUrls = [
					...uploadedFileUrls,
					// mengambil dari setiap File yang ada di newFiles lalu diberikan link sementara untuk ditampilkan pada UI
					...newFiles.map((file) => URL.createObjectURL(file))
				];
			}
		}
	}

	function ganti(type: string) {
		if (type === 'bendera') {
			benderaUrl = null;
		} else if (type === 'lambang') {
			lambangUrl = null;
		} else if (type === 'video') {
			videoName = 'No Video Selected';
		}
	}

	function removeImage(index: number) {
		uploadedFiles = uploadedFiles.slice(0, index).concat(uploadedFiles.slice(index + 1));
		uploadedFileUrls = uploadedFileUrls.slice(0, index).concat(uploadedFileUrls.slice(index + 1));
	}
</script>

<div class="ml-2 flex h-fit w-full flex-col md:ml-6">
	<p class="text-2xl font-semibold">Form Pendaftaran</p>

	<form method="post" action="?/tambahKerajaan">
		<div class="flex flex-col gap-1">
			<label class="text-md mt-5 self-start text-left" for="nama">Nama Kerajaan</label>
			<input
				class="input-field rounded-lg border p-2 pr-8"
				type="text"
				id="nama"
				bind:value={nama}
				placeholder="John Doe"
			/>

			<div class="flex flex-grow flex-col gap-2 lg:flex-row">
				<div class="w-full flex-col lg:w-2/4">
					<label class="text-md self-start text-left" for="provinsi">Provnsi Kerajaan</label>
					<select
						bind:value={provinsi}
						id="provinsi" class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Provinsi</option>
						<option value="jawatengah">Jawa Tengah </option>
						<option value="bali">Bali</option>
					</select>
				</div>

				<div class="w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="lokasi"> Lokasi Kerajaan </label>
					<div class="relative flex">
						<input
							class="input-field w-full rounded-lg border p-2 pr-10"
							type="text"
							id="lokasi"
							bind:value={lokasi}
							placeholder="John Doe"
						/>

						<div class="absolute right-3 top-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48"
								><defs
									><mask id="ipTSearch0"
										><g fill="none" stroke="#fff" stroke-linejoin="round" stroke-width="4"
											><path
												fill="#555555"
												d="M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z"
											/><path
												stroke-linecap="round"
												d="M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485"
											/></g
										></mask
									></defs
								><path fill="#909090" d="M0 0h48v48H0z" mask="url(#ipTSearch0)" /></svg
							>
						</div>
					</div>
				</div>
			</div>

			<div class="flex flex-grow flex-col gap-4 lg:flex-row">
				<div class="w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="tanggalberdiri"> Tanggal Berdiri </label>
					<input
						class="input-field w-full rounded-lg border p-2"
						type="date"
						id="tanggalberdiri"
						bind:value={tanggal}
						placeholder="John Doe"
					/>
				</div>

				<div class="w-full flex-col">
					<label class="text-md self-start text-left" for="era">Era Kerajaan</label>
					<select
						bind:value={era} id="era"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Era</option>
						<option value="kolonial">Kolonial </option>
					</select>
				</div>

				<div class="w-full flex-col">
					<label class="text-md self-start text-left" for="rumpun">Rumpun Kerajaan</label>
					<select
						bind:value={rumpun} id="rumpun"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Rumpun</option>
						<option value="mataram">Mataram</option>
					</select>
				</div>
			</div>

			<div class="flex flex-grow flex-col gap-2 lg:flex-row">
				<div class="w-full flex-col lg:w-2/4">
					<label class="text-md self-start text-left" for="jenis">Jenis Kerajaan</label>
					<select
						bind:value={jenis_kerajaan} id="jenis"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Jenis Kerajaan</option>
						<option value="kasunanan">Kasunanan </option>
					</select>
				</div>

				<div class="w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="nama"> Nama Raja Sekarang </label>
					<div class="relative flex">
						<input
							class="input-field w-full rounded-lg border p-2 pr-8"
							type="search"
							id="nama"
							bind:value={nama_raja}
							placeholder="John Doe"
						/>
					</div>
				</div>
			</div>

			<label class="text-md self-start text-left" for="deskripsi">Deskripsi Kerajaan : </label>
			<textarea
				bind:value={deskripsi}
				class="input-field h-[100px] rounded-lg border p-2 pr-8"
				id="deskripsi"
				placeholder="John Doe"
			></textarea>

			<div class="mt-2 flex flex-grow flex-col gap-4 md:flex-row">
				<!-- Dokumen -->
				<div class="flex w-full flex-col gap-1 lg:w-2/3">
					<label class="text-md self-start text-left" for="fileInput">Dokumentasi Kerajaan</label>
					<div class="h-full w-full overflow-x-auto rounded-lg border-2 border-black px-2 py-2">
						<div class="flex flex-row gap-x-5">
							<div
								class="upload-container relative h-[200px] w-[300px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
							>
								<input
									type="file"
									id="fileInput"
									class="hidden"
									onchange={(e) => handleFileChange(e, 'dokumen')}
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
										class="h-[200px] w-[300px] rounded-lg border object-cover"
									/>
									<button class="remove-btn" onclick={() => removeImage(index)}>✕</button>
								</div>
							{/each}
						</div>
					</div>
					<p class="text-md mb-10 opacity-70">
						* Foto di urutan pertama akan menjadi foto besar awalan
					</p>
				</div>

				<!-- Bendera -->
				<div class="w-full flex-col lg:w-1/3">
					<p class="text-nowrap text-center lg:text-start">Bendera Kerajaan</p>
					<div
						class="upload-container relative ml-6 mt-2 h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black lg:ml-0"
					>
						<input
							type="file"
							id="fileBendera"
							class="hidden"
							accept="image/*"
							onchange={(e) => handleFileChange(e, 'bendera')}
						/>
						<label
							for="fileBendera"
							class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
						>
							{#if benderaUrl}
								<img src={benderaUrl} alt="Bendera" class="h-full w-full rounded-lg object-cover" />
								<button class="remove-btn" onclick={() => ganti('bendera')}>✎</button>
							{:else}
								<span class="pajamas--media"></span>
								<p class="mt-3 text-center">Upload Bendera</p>
							{/if}
						</label>
					</div>
				</div>

				<!-- Lambang -->
				<div class="w-full flex-col lg:w-1/3">
					<p class="text-nowrap text-center">Lambang Kerajaan</p>
					<div
						class="upload-container relative ml-6 mt-2 h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black lg:ml-0"
					>
						<input
							type="file"
							id="fileLambang"
							class="hidden"
							accept="image/*"
							onchange={(e) => handleFileChange(e, 'lambang')}
						/>
						<label
							for="fileLambang"
							class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
						>
							{#if lambangUrl}
								<img src={lambangUrl} alt="Lambang" class="h-full w-full rounded-lg object-cover" />
								<button class="remove-btn" onclick={() => ganti('lambang')}>✎</button>
							{:else}
								<span class="pajamas--media"></span>
								<p class="mt-3 text-center">Upload Lambang</p>
							{/if}
						</label>
					</div>
				</div>
			</div>

			<button
				class="bg-customGold mt-5 self-center rounded-lg px-5 py-2 font-bold text-white lg:mt-0 lg:self-end"
				onclick={setTimer}
			>
				Daftarkan
			</button>
		</div>
	</form>
</div>

{#if open}
	<SModal text="Kerajaan berhasil ditambah!"></SModal>
{/if}

<style>
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
</style>
