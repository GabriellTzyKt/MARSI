<script lang="ts">
	let nama = $state('');
	let lokasi = $state('');
	let tanggal = $state('');
	let linkkerajaan = $state('');
	let promosi = $state('');
	let linkacara1 = $state('');
	let linkacara2 = $state('');
	let linkacara3 = $state('');

	let uploadedFiles: File[] = [];
	let uploadedFileUrls: string[] = $state([]);

	let benderaUrl: string | null = $state(null);
	let lambangUrl: string | null = $state(null);
	let videoName: string | null = $state(' No Video Selected ');

	let isExpand = $state(false);

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

<div class="ml-6 flex h-fit w-full flex-col">
	<p class="text-2xl font-semibold">Biodata Kerajaan A</p>

	<div class="flex flex-col gap-1">
		<label class="text-md mt-5 self-start text-left" for="nama">Nama Dokumen</label>
		<input
			class="input-field rounded-lg border p-2 pr-8"
			type="text"
			id="nama"
			bind:value={nama}
			placeholder="John Doe"
		/>

		<div class="flex flex-grow gap-4">
			<div class="w-full flex-col">
				<label class="text-md mt-5 self-start text-left" for="nama"> Lokasi </label>
				<input
					class="input-field w-full rounded-lg border p-2 pr-8"
					type="text"
					id="nama"
					bind:value={lokasi}
				/>
			</div>

			<div class="w-full flex-col">
				<label class="text-md mt-5 self-start text-left" for="nama"> Tanggal Berdiri </label>
				<input
					class="input-field w-full rounded-lg border p-2 pr-8"
					type="date"
					id="nama"
					bind:value={tanggal}
					placeholder="John Doe"
				/>
			</div>
		</div>

		<label class="text-md mt-5 self-start text-left" for="nama">Deskripsi Kerajaan : </label>
		<textarea
			class="input-field h-[100px] rounded-lg border p-2 pr-8"
			id="deskripsi"
			placeholder="John Doe"
		></textarea>

		<div class="mt-2 flex flex-grow gap-4">
			<!-- Dokumen -->
			<div class="flex w-2/3 flex-col gap-1">
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
			<div class="w-1/3 flex-col">
				<p>Bendera Kerajaan</p>
				<div
					class="upload-container relative mt-4 h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
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
			<div class="w-1/3 flex-col">
				<p>Lambang Kerajaan</p>
				<div
					class="upload-container relative mt-4 h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
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

		<div class="w-full flex-col">
			<p>Vidio Singkat Kerajaan</p>
			<div
				class="upload-container relative mt-4 h-[44px] w-full flex-shrink-0 rounded-lg border bg-gray-200"
			>
				<input
					type="file"
					id="fileVideo"
					class="hidden"
					accept="video/*"
					onchange={(e) => handleFileChange(e, 'video')}
				/>
				<label
					for="fileVideo"
					class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
				>
				</label>
				<div class="flex w-full items-center justify-between">
					<p class="w-fit px-2">{videoName}</p>
					<button class="bg-customGold rounded-lg h-fit w-fit px-2 py-2.5 font-semibold text-white">
						Choose file
					</button>
				</div>
			</div>
			<p class="text-md mt-2 opacity-70"> * Max Size Video : 20 MB</p>
		</div>

		<!-- Navigasi -->
		<p class="mt-5 text-lg font-semibold">Navigasi</p>

		<div class="flex flex-col gap-1">
			<label class="text-md mt-5 self-start text-left" for="nama">Link URL Web Kerajaan : </label>
			<input
				class="input-field rounded-lg border p-2 pr-8"
				type="text"
				id="nama"
				bind:value={linkkerajaan}
				placeholder="John Doe"
			/>

			<div class="w-full flex-col">
				<label class="text-md mt-5 self-start text-left" for="nama"> Hint Promosi Web Kerajaan </label>
				<input
					class="input-field w-full rounded-lg border p-2 pr-8"
					type="text"
					id="nama"
					bind:value={promosi}
					placeholder="John Doe"
				/>
			</div>
		</div>

		<!-- URL Acara -->

		<p class="mt-5 text-lg font-semibold">Acara Sorotan Kerajaan</p>

		<div class="flex flex-col gap-1">
			<label class="text-md mt-5 self-start text-left" for="nama">Link URL Acara Web Kerajaan 1 : </label>
			<input
				class="input-field rounded-lg border p-2 pr-8"
				type="text"
				id="nama"
				bind:value={linkacara1}
				placeholder="John Doe"
			/>

			<label class="text-md mt-5 self-start text-left" for="nama">Link URL Acara Web Kerajaan 2 : </label>
			<input
				class="input-field rounded-lg border p-2 pr-8"
				type="text"
				id="nama"
				bind:value={linkacara2}
				placeholder="John Doe"
			/>

			<label class="text-md mt-5 self-start text-left" for="nama">Link URL Acara Web Kerajaan 3 : </label>
			<input
				class="input-field rounded-lg border p-2 pr-8"
				type="text"
				id="nama"
				bind:value={linkacara3}
				placeholder="John Doe"
			/>

		</div>

		<div class="mt-10 h-[2px] w-full bg-black"></div>

		<div class="w-full">
			<p class="mt-8 text-center text-2xl font-bold">History Raja</p>
			<div class="mt-8 w-full">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 bg-yellow-300 transition-all duration-300"
					onclick={() => (isExpand = !isExpand)}
				>
					<div class="mr-5 flex h-[50px] w-full items-center justify-between px-3">
						<p class="text-xs lg:text-lg">Sri Susuhunan Pakubuwana XIII (2004 - Sekarang)</p>
						<div
							class="flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-red-500"
						>
							<span
								class="formkit--arrowdown transition-transform duration-300"
								class:rotate-180={isExpand}
							></span>
						</div>
					</div>
					{#if isExpand}
						<div class="border-t-2 border-black p-4">
							<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
								<p class="text-md px-2 py-2">
									Nama Raja : <span class="font-bold">Sri Susuhunan Pakubawana XIII</span>
								</p>
							</div>
							<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
								<p class="text-md px-2 py-2">
									Masa Jabatan : <span class="font-bold">2004 - Sekarang</span>
								</p>
							</div>
							<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
								<p class="text-md px-2 py-2">
									Tanggal Lahir : <span class="font-bold"> 28 Juni 1948 </span>
								</p>
							</div>
							<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
								<p class="text-md px-2 py-2">TBA</p>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.pajamas--media {
		display: inline-block;
		width: 48px;
		height: 48px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M13 2.5H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm9 9.857L9.5 8l-2.476 2.83L5.5 9L4 10.8V12h8zM6.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

	.formkit--arrowdown {
		display: inline-block;
		width: 10.13px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9 16'%3E%3Cpath fill='%23fff' d='M4.5 13c-.28 0-.5-.22-.5-.5v-9c0-.28.22-.5.5-.5s.5.22.5.5v9c0 .28-.22.5-.5.5'/%3E%3Cpath fill='%23fff' d='M4.5 14a.47.47 0 0 1-.35-.15l-3.5-3.5c-.2-.2-.2-.51 0-.71s.51-.2.71 0l3.15 3.15l3.15-3.15c.2-.2.51-.2.71 0s.2.51 0 .71l-3.5 3.5c-.1.1-.23.15-.35.15Z'/%3E%3C/svg%3E");
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
