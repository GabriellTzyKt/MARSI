<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import DeleteModal from '$lib/popup/DeleteModal.svelte';
	import SModal from '$lib/popup/SModal.svelte';
	import gambartemp from '../../../../asset/gambarsementara.jpg';
	import { writable } from 'svelte/store';

	let success = $state(false);

	let nama = $state(' ');
	let lokasi = $state(' ');
	let tanggal = $state('');
	let jenis = $state(' ');
	let linkkerajaan = $state(' ');
	let promosi = $state(' ');
	let linkacara1 = $state(' ');
	let linkacara2 = $state(' ');
	let linkacara3 = $state(' ');
	let namaraja = $state(' ');
	let gelarraja = $state('');
	let tanggallahir = $state(' ');
	let kotalahir = $state(' ');
	let era = $state(' ');
	let rumpun = $state(' ');
	let agama = $state(' ');
	let wangsa = $state(' ');
	let namaayah = $state(' ');
	let namaibu = $state(' ');
	let tanggalawal = $state(' ');
	let tanggalakhir = $state(' ');
	let showModal = $state(false);
	let selectedLocation: any = $state(' ');
	let namafoto: any = $state('');
	let namabendera: any = $state('');
	let namalambang: any = $state('');
	let lat: any = $state('');
	let long: any = $state('');
	let error: any = $state('');
	let isChecked: any = $state('');

	let uploadedFiles: File[] = [];
	let uploadedFileUrls: string[] = $state([]);
	let sortOrder: string = $state('');
	let arrowDirection: string = $state('mingcute--arrow-down-fill');

	let benderaUrl: string | null = $state(null);
	let lambangUrl: string | null = $state(null);
	let videoName: string | null = $state(' No Video Selected ');

	let results = writable<string[]>([]);
	let showDropdown = writable(false);
	let locationsData: any[] = []; // Simpan data lokasi untuk referensi

	const API_KEY = 'pk.def50126ee21d7c7b667386e05fc8bcb';

	async function fetchLocations() {
		if (!lokasi.trim()) return; // Cegah pencarian kosong

		const url = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(lokasi)}&format=json&limit=5`;

		try {
			const res = await fetch(url);
			const data = await res.json();

			if (data && Array.isArray(data)) {
				locationsData = data; // Simpan semua data lokasi
				const extractedNames = data.map((item: any) => item.display_name);

				results.set(extractedNames);
				showDropdown.set(extractedNames.length > 0);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			fetchLocations();
		}
	}

	function selectLocation(name: string) {
		lokasi = name;
		results.set([]);
		showDropdown.set(false);

		// Cari latitude dan longitude berdasarkan nama lokasi yang dipilih
		selectedLocation = locationsData.find((item) => item.display_name === name);
		if (selectedLocation) {
			lat = selectedLocation.lat;
			long = selectedLocation.lon;
			console.log('Latitude:', lat, 'Longitude:', long);
		} else {
			console.log('Koordinat tidak ditemukan.');
		}
	}

	let open = $state(false);
	let timer: number;
	let value = $state(false);

	function setTimer(success: boolean) {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			open = false;
			if (success) {
				showModal = false; // Hanya tutup modal jika operasi berhasil
			}
		}, 3000);
	}

	let isExpand: boolean[] = $state([]);

	const { data } = $props();
	const dataGet = data.detil_kerajaan;
	let dataubah = $state(dataGet);

	function OpenModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function handleFileChange(event: Event, type: string) {
		const target = event.target as HTMLInputElement;

		if (target.files && target.files.length > 0) {
			const newFiles = Array.from(target.files);

			if (type === 'bendera') {
				benderaUrl = URL.createObjectURL(newFiles[0]);
				console.log('Bendera yang di upload : ', newFiles[0].name);
				namabendera = newFiles[0].name;
			} else if (type === 'lambang') {
				lambangUrl = URL.createObjectURL(newFiles[0]);
				console.log('Lambang yang di upload : ', newFiles[0].name);
				namalambang = newFiles[0].name;
			} else if (type === 'video') {
				videoName = newFiles[0].name;
			} else {
				uploadedFiles = [...uploadedFiles, ...newFiles];
				uploadedFileUrls = [
					...uploadedFileUrls,
					...newFiles.map((file) => URL.createObjectURL(file))
				];
				namafoto = uploadedFiles.map((file) => file.name);
				console.log('Nama file yang diupload:', namafoto);
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

	function updateFilteredData() {
		if (sortOrder === 'asc') {
			dataGet.sort((a, b) => Number(a.tahun_awal_jabatan) - Number(b.tahun_awal_jabatan));
		} else if (sortOrder === 'desc') {
			dataGet.sort((a, b) => Number(b.tahun_awal_jabatan) - Number(a.tahun_awal_jabatan));
		}
		dataubah = [...dataGet];
	}

	function toggleSort() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		arrowDirection = sortOrder === 'asc' ? 'mingcute--arrow-down-fill' : 'mingcute--arrow-up-fill';
		updateFilteredData();
	}

	function toggleExpand(index: number) {
		isExpand[index] = !isExpand[index];
		isExpand = [...isExpand];
	}
</script>

<div class="ml-2 flex h-fit w-full flex-col md:ml-6">
	<form
		method="post"
		action="?/selesai"
		enctype="multipart/form-data"
		use:enhance={() => {
			return async ({ result }) => {
				console.log(result);
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
						goto('/admin/biodata');
					}, 3000);
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
				}
			};
		}}
	>
		<p class="text-2xl font-semibold">Biodata Kerajaan A</p>

		<div class="flex flex-col gap-1">
			<label class="text-md mt-5 self-start text-left" for="nama">Nama Kerajaan</label>
			<input
				class="input-field rounded-lg border p-2 pr-8"
				type="text"
				id="nama"
				name="nama"
				bind:value={nama}
				placeholder="John Doe"
			/>

			<div class="flex flex-grow flex-col gap-4 lg:flex-row">
				<div class="relative w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="nama">Alamat Kerajaan</label>
					<input
						class="input-field w-full rounded-lg border p-2 pr-8"
						type="text"
						id="lokasi"
						name="lokasi"
						bind:value={lokasi}
						onkeydown={handleKeyDown}
						placeholder="Cari lokasi..."
					/>
					<input type="hidden" name="long" bind:value={long}>
					<input type="hidden" name="lat" bind:value={lat}>


					{#if $showDropdown && lokasi !== ''}
						<ul class="dropdown">
							{#each $results as name}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<li onclick={() => selectLocation(name)}>{name}</li>
							{/each}
						</ul>
					{/if}
				</div>

				<div class="w-full flex-col lg:w-1/4">
					<label class="text-md self-start text-left" for="rumpun">Jenis Kerajaan</label>
					<select
						bind:value={jenis}
						id="jenis"
						name="jenis"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Jenis Kerajaan</option>
						<option value="kasunanan">Kasunanan</option>
					</select>
				</div>

				<!-- <div class="w-full flex-col">
				<label class="text-md mt-5 self-start text-left" for="nama"> Tanggal Berdiri </label>
				<input
					class="input-field w-full rounded-lg border p-2 pr-8"
					type="date"
					id="nama"
					bind:value={tanggal}
					placeholder="John Doe"
				/>
			</div> -->
			</div>

			<div class="flex flex-grow flex-col gap-4 lg:flex-row">
				<div class="w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="tanggalberdiri">
						Tanggal Berdiri
					</label>
					<input
						class="input-field w-full rounded-lg border border-black p-2"
						name="tanggalberdiri"
						id="tanggalberdiri"
						bind:value={tanggal}
						placeholder="Masukkan Tahun (Contoh: 2021)"
						maxlength="4"
						oninput={(e: any) => {
							e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
							const errorMsg : any = document.getElementById('error-msg');
							if (e.target.value.length > 0 && e.target.value.length < 3) {
								errorMsg.textContent = 'Minimal 3 digit!';
							} else {
								errorMsg.textContent = '';
							}
						}}
					/>
					<p id="error-msg" class="text-red-500 text-sm"></p>
				</div>

				<div class="w-full flex-col">
					<label class="text-md self-start text-left" for="era">Era Kerajaan</label>
					<select
						bind:value={era}
						id="era"
						name="era"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Era</option>
						<option value="kolonial">Kolonial </option>
					</select>
				</div>

				<div class="w-full flex-col">
					<label class="text-md self-start text-left" for="rumpun">Rumpun Kerajaan</label>
					<select
						bind:value={rumpun}
						id="rumpun"
						name="rumpun"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Rumpun</option>
						<option value="mataram">Mataram</option>
					</select>
				</div>
			</div>

			<label class="text-md mt-5 self-start text-left" for="nama">Deskripsi Kerajaan : </label>
			<textarea
				class="input-field h-[100px] rounded-lg border p-2 pr-8"
				id="deskripsi"
				name="deskripsi"
				placeholder="John Doe"
			></textarea>

			<div class="mt-2 flex flex-grow flex-col gap-4 md:flex-row">
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
									name="dokumen"
									bind:value={namafoto}
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
					<p class="text-nowrap">Bendera Kerajaan</p>
					<div
						class="upload-container relative mt-4 h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
					>
						<input
							type="file"
							id="fileBendera"
							class="hidden"
							name="inputbendera"
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
					<p class="text-nowrap">Lambang Kerajaan</p>
					<div
						class="upload-container relative mt-4 h-[200px] w-[270px] flex-shrink-0 rounded-lg border bg-gray-200 hover:bg-black"
					>
						<input
							type="file"
							id="fileLambang"
							name="inputlambang"
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
						name="inputvideo"
						accept="video/*"
						onchange={(e) => handleFileChange(e, 'video')}
					/>
					<label
						for="fileVideo"
						class="absolute left-0 top-0 flex h-full w-full cursor-pointer flex-col items-center justify-center"
					>
					</label>
					<div class="flex w-full items-center justify-between">
						<p class="max-w-[40%] truncate px-2">{videoName}</p>
						<button
							class="bg-customGold h-fit w-fit rounded-lg px-2 py-2.5 font-semibold text-white"
						>
							Choose file
						</button>
					</div>
				</div>
				<p class="text-md mt-2 opacity-70">* Max Size Video : 20 MB</p>
			</div>

			<!-- Navigasi -->
			<p class="mt-5 text-lg font-semibold">Navigasi</p>

			<div class="flex flex-col gap-1">
				<label class="text-md mt-5 self-start text-left" for="nama">Link URL Web Kerajaan : </label>
				<input
					class="input-field rounded-lg border p-2 pr-8"
					type="text"
					id="linkkerajaan"
					name="linkkerajaan"
					bind:value={linkkerajaan}
					placeholder="John Doe"
				/>

				<div class="w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="nama">
						Hint Promosi Web Kerajaan
					</label>
					<input
						class="input-field w-full rounded-lg border p-2 pr-8"
						type="text"
						id="promosi"
						name="promosi"
						bind:value={promosi}
						placeholder="John Doe"
					/>
				</div>
			</div>

			<!-- URL Acara -->

			<p class="mt-5 text-lg font-semibold">Acara Sorotan Kerajaan</p>

			<div class="flex flex-col gap-1">
				<label class="text-md mt-5 self-start text-left" for="nama"
					>Link URL Acara Web Kerajaan 1 :
				</label>
				<input
					class="input-field rounded-lg border p-2 pr-8"
					type="text"
					id="linkacara1"
					name="linkacara1"
					bind:value={linkacara1}
					placeholder="John Doe"
				/>

				<label class="text-md mt-5 self-start text-left" for="nama"
					>Link URL Acara Web Kerajaan 2 :
				</label>
				<input
					class="input-field rounded-lg border p-2 pr-8"
					type="text"
					id="linkacara2"
					name="linkacara2"
					bind:value={linkacara2}
					placeholder="John Doe"
				/>

				<label class="text-md mt-5 self-start text-left" for="nama"
					>Link URL Acara Web Kerajaan 3 :
				</label>
				<input
					class="input-field rounded-lg border p-2 pr-8"
					type="text"
					id="linkacara3"
					name="linkacara3"
					bind:value={linkacara3}
					placeholder="John Doe"
				/>
			</div>

			<div class="mt-10 h-[2px] w-full bg-black"></div>

			<div class="w-full">
				<p class="mt-8 text-center text-2xl font-bold">History Raja</p>
				<div class="mt-2 flex items-center justify-between gap-2 lg:justify-end">
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<p class="flex cursor-pointer items-center" onclick={toggleSort}>
						Sort By: Date <span class={arrowDirection}></span>
					</p>
					<button
						class="bg-customKrem w-fit rounded-lg border px-3 py-2 font-semibold"
						onclick={OpenModal}
						type="button"
					>
						+Tambah Data
					</button>
				</div>
				<div class="mt-8 w-full">
					{#each dataubah as raja, index}
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<div
							class="mb-5 flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 bg-yellow-300 transition-all duration-300"
							onclick={() => toggleExpand(index)}
						>
							<div class="mr-5 flex h-[50px] w-full items-center justify-between gap-2 px-3">
								<p class="text-xs lg:text-lg">
									{raja.nama_lenkgap} ({raja.tahun_awal_jabatan} - {raja.tahun_akhir_jabatan})
								</p>
								<div
									class="flex h-[24px] w-[24px] items-center justify-center rounded-full border bg-red-500"
								>
									<span
										class="formkit--arrowdown transition-transform duration-300"
										class:rotate-180={isExpand[index]}
									></span>
								</div>
							</div>
							{#if isExpand[index]}
								<div class="border-t-2 border-black bg-white p-4">
									<div class="flex w-full flex-col gap-8 lg:flex-row">
										<img
											src={gambartemp}
											class="h-[70%] w-[70%] self-center lg:h-[25%] lg:w-[25%]"
											alt=""
										/>
										<div class="w-full flex-col">
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Nama Lengkap Raja : <span class="font-bold">{raja.nama_lenkgap}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Tanggal Lahir : <span class="font-bold">{raja.tanggal}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Kota Kelahiran : <span class="font-bold">{raja.kota_kelahiran}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Wangsa : <span class="font-bold">{raja.wangsa}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Nama Ayah : <span class="font-bold">{raja.nama_ayah}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Nama Ibu : <span class="font-bold">{raja.nama_ibu}</span>
												</p>
											</div>
											<div class="mt-2 h-fit w-full rounded-lg border bg-gray-300">
												<p class="text-md px-2 py-2">
													Agama : <span class="font-bold">{raja.agama}</span>
												</p>
											</div>
											<div class="mt-5 flex justify-end gap-4">
												<button
													class="flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2 text-white"
													onclick={() => (value = true)}
												>
													<span class="tabler--trash"></span> Hapus Data
												</button>
												<button
													class="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-2 text-white"
												>
													<span class="solar--pen-outline"></span> Edit Data
												</button>
											</div>
										</div>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
			<div class="flex w-full justify-end">
				<button
					class="w-fit rounded-lg bg-yellow-500 px-4 py-2 text-white"
					type="submit"
					formaction="?/selesai"
				>
					Simpan
				</button>
			</div>
		</div>
	</form>
</div>

{#if value}
	<DeleteModal
		bind:value
		choose="delete"
		text="Apakah Anda Ingin Menghapus Biodata Raja?"
		successText="Biodata Raja Berhasil Dihapus"
	></DeleteModal>
{/if}

{#if showModal}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-[70%] overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
			<form
				method="post"
				action="?/tambah"
				use:enhance={() => {
					return async ({ result }) => {
						console.log(result);
						if (result.type === 'success') {
							success = true;
							clearTimeout(timer);
							timer = setTimeout(() => {
								success = false;
								showModal = false;
							}, 3000);
						} else if (result.type === 'failure') {
							error = result?.data?.errors;
						}
					};
				}}
			>
				<div class="flex justify-between">
					<h2 class="font-bold lg:text-xl">Biodata Kerajaan</h2>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button onclick={closeModal}>
						<span class="carbon--close-outline items-center"></span>
					</button>
				</div>
				<div class="h-1 bg-gray-300"></div>
				<div class="flex flex-col gap-1">
					<label class="text-md mt-2 self-start text-left" for="nama">Nama Lengkap Raja</label>
					<input
						class="input-field rounded-lg border p-2 pr-8"
						type="text"
						id="nama"
						bind:value={namaraja}
						name="namaraja"
						placeholder="John Doe"
					/>
					{#if error}
						{#each error.namaraja as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}

					<label class="text-md mt-2 self-start text-left" for="nama">Gelar Raja</label>
					<input
						class="input-field rounded-lg border p-2 pr-8"
						type="text"
						id="nama"
						name="gelarraja"
						bind:value={gelarraja}
						placeholder="John Doe"
					/>
					{#if error}
						{#each error.gelarraja as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}

					<div class="flex flex-grow gap-4">
						<div class="flex w-1/3 flex-col">
							<label class="text-md mt-2 w-full self-start text-left" for="tanggalLahir">
								Tanggal Lahir:
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="tanggalLahir"
								name="tanggallahir"
								bind:value={tanggallahir}
							/>
							{#if error}
								{#each error.tanggallahir as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>

						<div class="flex w-2/3 flex-col">
							<label class="text-md mt-2 self-start text-left" for="kotaLahir">
								Kota Kelahiran:
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="text"
								id="kotaLahir"
								name="kotalahir"
								bind:value={kotalahir}
								placeholder="John Doe"
							/>
							{#if error}
								{#each error.kotalahir as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<div class="flex flex-grow gap-4">
						<div class="w-full flex-col">
							<label class="text-md mt-2 w-full self-start text-left" for="nama"> Agama : </label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="text"
								id="nama"
								name="agama"
								bind:value={agama}
							/>
							{#if error}
								{#each error.agama as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>

						<div class="w-full flex-col">
							<label class="text-md mt-2 self-start text-left" for="nama"> Wangsa : </label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="text"
								id="nama"
								name="wangsa"
								bind:value={wangsa}
								placeholder="John Doe"
							/>
							{#if error}
								{#each error.wangsa as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<label class="text-md mt-2 self-start text-left" for="nama">Nama Ayah</label>
					<input
						class="input-field mt-2 rounded-lg border p-2 pr-8"
						type="text"
						id="nama"
						name="namaayah"
						bind:value={namaayah}
						placeholder="John Doe"
					/>
					{#if error}
						{#each error.namaayah as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}

					<label class="text-md mt-2 self-start text-left" for="nama">Nama Ibu</label>
					<input
						class="input-field mt-2 rounded-lg border p-2 pr-8"
						type="text"
						id="nama"
						name="namaibu"
						bind:value={namaibu}
						placeholder="John Doe"
					/>
					{#if error}
						{#each error.namaibu as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}

					<div class="flex flex-grow gap-4">
						<div class="mt-2 w-full flex-col">
							<label class="text-md mt-4 w-full self-start text-left" for="nama">
								Tanggal Awal Berkuasa :
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="nama"
								name="tanggalawal"
								bind:value={tanggalawal}
							/>
							{#if error}
								{#each error.tanggalawal as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>

						<div class="mt-2 w-full flex-col">
							<label class="text-md mt-4 self-start text-left" for="nama">
								Tanggal Akhir Berkuasa :
							</label>
							<input
								class="input-field mt-2 w-full rounded-lg border p-2 pr-8"
								type="date"
								id="nama"
								name="tanggalakhir"
								bind:value={tanggalakhir}
								placeholder="John Doe"
							/>
							{#if error}
								{#each error.tanggalakhir as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<div class="mt-2 flex items-center">
						<input
							type="checkbox"
							id="textsamping"
							value="masih"
							name="inputcheckbox"
							bind:checked={isChecked}
						/>
						<label class="ml-2" for="textsamping">Masih Berkuasa Sampai Sekarang?</label>
					</div>

					<button
						class="bg-customGold w-fit self-end rounded-lg px-3 py-2 text-white"
						type="submit"
						formaction="?/tambah"
					>
						Tambah Data
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if open}
	<SModal text="Biodata kerajaan berhasil ditambah!"></SModal>
{/if}

{#if success}
	<SModal text="History Raja berhasil ditambah!"></SModal>
{/if}

<style>
	.dropdown {
		position: absolute;
		background: white;
		border: 1px solid #ccc;
		width: 100%;
		max-height: 150px;
		overflow-y: auto;
		border-radius: 5px;
	}
	.dropdown li {
		padding: 8px;
		cursor: pointer;
	}
	.dropdown li:hover {
		background: #f0f0f0;
	}
	.mingcute--arrow-up-fill {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23080808' d='M13.06 3.283a1.5 1.5 0 0 0-2.12 0L5.281 8.939a1.5 1.5 0 0 0 2.122 2.122L10.5 7.965V19.5a1.5 1.5 0 0 0 3 0V7.965l3.096 3.096a1.5 1.5 0 1 0 2.122-2.122z'/%3E%3C/g%3E%3C/svg%3E");
	}
	.mingcute--arrow-down-fill {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23080808' d='M10.5 16.035L7.404 12.94a1.5 1.5 0 1 0-2.122 2.121l5.657 5.657a1.5 1.5 0 0 0 2.122 0l5.657-5.656a1.5 1.5 0 1 0-2.122-2.122L13.5 16.035V4.5a1.5 1.5 0 0 0-3 0z'/%3E%3C/g%3E%3C/svg%3E");
	}
	.carbon--close-outline {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23bba5a5' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12'/%3E%3Cpath fill='%23bba5a5' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");
	}
	.pajamas--media {
		display: inline-block;
		width: 48px;
		height: 48px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M13 2.5H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5M3 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm9 9.857L9.5 8l-2.476 2.83L5.5 9L4 10.8V12h8zM6.5 8a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3' clip-rule='evenodd'/%3E%3C/svg%3E");
	}

	.solar--pen-outline {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' fill-rule='evenodd' d='M14.757 2.621a4.682 4.682 0 0 1 6.622 6.622l-9.486 9.486c-.542.542-.86.86-1.216 1.137q-.628.492-1.35.835c-.406.193-.834.336-1.56.578l-3.332 1.11l-.802.268a1.81 1.81 0 0 1-2.29-2.29l1.378-4.133c.242-.727.385-1.155.578-1.562q.344-.72.835-1.35c.276-.354.595-.673 1.137-1.215zM4.4 20.821l2.841-.948c.791-.264 1.127-.377 1.44-.526q.572-.274 1.073-.663c.273-.214.525-.463 1.115-1.053l7.57-7.57a7.36 7.36 0 0 1-2.757-1.744A7.36 7.36 0 0 1 13.94 5.56l-7.57 7.57c-.59.589-.84.84-1.053 1.114q-.39.5-.663 1.073c-.149.313-.262.649-.526 1.44L3.18 19.6zM15.155 4.343c.035.175.092.413.189.69a5.86 5.86 0 0 0 1.4 2.222a5.86 5.86 0 0 0 2.221 1.4c.278.097.516.154.691.189l.662-.662a3.182 3.182 0 0 0-4.5-4.5z' clip-rule='evenodd'/%3E%3C/svg%3E");
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

	.tabler--trash {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3'/%3E%3C/svg%3E");
	}
</style>
