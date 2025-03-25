<script lang="ts">
	import { goto } from '$app/navigation';
	import SModal from '$lib/popup/SModal.svelte';

	let nama = $state('');
	let alamat = $state('');
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
				name="nama"
				bind:value={nama}
				placeholder="John Doe"
			/>

			<div class="flex flex-grow flex-col gap-2 lg:flex-row">
				<div class="w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="lokasi"> Alamat Kerajaan </label>
					<div class="relative flex">
						<input
							class="input-field w-full rounded-lg border p-2 pr-10"
							type="text"
							id="lokasi"
							name="alamat"
							bind:value={alamat}
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
						name="tanggalberdiri"
						id="tanggalberdiri"
						bind:value={tanggal}
						placeholder="John Doe"
					/>
				</div>

				<div class="w-full flex-col">
					<label class="text-md self-start text-left" for="era">Era Kerajaan</label>
					<select
						bind:value={era} id="era" name="era"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Era</option>
						<option value="kolonial">Kolonial </option>
					</select>
				</div>

				<div class="w-full flex-col">
					<label class="text-md self-start text-left" for="rumpun">Rumpun Kerajaan</label>
					<select
						bind:value={rumpun} id="rumpun" name="rumpun"
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
						bind:value={jenis_kerajaan} id="jenis" name="jenis"
						class="h-[40px] w-full rounded-lg border-2 border-gray-400 bg-white py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					>
						<option value="" selected disabled>Pilih Jenis Kerajaan</option>
						<option value="kasunanan">Kasunanan </option>
					</select>
				</div>

				<div class="w-full flex-col">
					<label class="text-md mt-5 self-start text-left" for="namaRaja"> Nama Raja Sekarang </label>
					<div class="relative flex">
						<input
							class="input-field w-full rounded-lg border p-2 pr-8"
							type="search"
							id="namaraja"
							name="namaraja"
							bind:value={nama_raja}
							placeholder="John Doe"
						/>
					</div>
				</div>
			</div>

			<label class="text-md self-start text-left" for="deskripsi">Deskripsi Kerajaan : </label>
			<textarea
				bind:value={deskripsi}
				name="deskripsi"
				class="input-field h-[100px] rounded-lg border p-2 pr-8"
				id="deskripsi"
				placeholder="John Doe"
			></textarea>

			<button
				class="bg-customGold mt-5 self-center rounded-lg px-5 py-2 font-bold text-white lg:mt-0 lg:self-end"
				onclick={setTimer} type="submit"
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

</style>
