<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { enhance } from '$app/forms';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import { onMount } from 'svelte';
	let { data } = $props();
	console.log(data);
	let open = $state(false);
	let timer: number;
	let errors = $state();
	let loading = $state(false);

	let pjKeyword = $state(
		data.allAnggota.find((user) => user.id_anggota == data.data.penanggung_jawab)?.nama_lengkap ||
			''
	);
	let selectedPj = $state(
		data.allAnggota.find((user) => user.id_anggota == data.data.penanggung_jawab) || null
	);
	let showPjDropdown = $state(false);
	let filteredPjUsers = $derived(filterUser(pjKeyword));

	let plKeyword = $state(
		data.allAnggota.find((user) => user.id_anggota == data.data.pelindung)?.nama_lengkap || ''
	);
	let selectedPl = $state(
		data.allAnggota.find((user) => user.id_anggota == data.data.pelindung) || null
	);
	let showPlDropdown = $state(false);
	let filteredPlUsers = $derived(filterUser(plKeyword));

	let pbKeyword = $state(
		data.allAnggota.find((user) => user.id_anggota == data.data.pembina)?.nama_lengkap || ''
	);
	let selectedPb = $state(
		data.allAnggota.find((user) => user.id_anggota == data.data.pembina) || null
	);
	let showPbDropdown = $state(false);
	let filteredPbUsers = $derived(filterUser(pbKeyword));

	// let situsKeyword = $state(
	// 	data.allSitus.find((situs) => situs.id == data.data.lokasi)?.name || ''
	// );

	function filterUser(searchTerm: string) {
		return data.allAnggota.filter((item) =>
			item.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	function selectPj(user: any) {
		selectedPj = user;
		pjKeyword = user.nama_lengkap;
		showPjDropdown = false;
	}

	function selectPl(user: any) {
		selectedPl = user;
		plKeyword = user.nama_lengkap;
		showPlDropdown = false;
	}

	function selectPb(user: any) {
		selectedPb = user;
		pbKeyword = user.nama_lengkap;
		showPbDropdown = false;
	}
	// Tambahkan state untuk gambar
	let selectedImage = $state(null);
	let imagePreview = $state(data?.data?.profile_path || gambardefault);
	let namaimage = $state('');

	// Fungsi untuk menangani upload gambar
	function handleImageUpload(event: any) {
		const file = event.target.files[0];
		if (file) {
			selectedImage = file;
			// Buat URL untuk preview gambar
			imagePreview = URL.createObjectURL(file);
			namaimage = 'exist';
		}
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="h-full w-full">
	<form
		action="?/ubahOrganisasi"
		method="post"
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				loading = false;
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
						goto('/abdi/sekretariat/organisasi/daftarOrganisasi');
					}, 3000);
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
					console.log(errors);
				}
			};
		}}
	>
		<div class="relative mx-auto flex w-full items-center justify-center">
			<div class="group relative h-[100px] w-[100px]">
				<img src={imagePreview} class="h-full w-full rounded-full" alt="" />

				<div
					class="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
				>
					<label for="profileImage" class="cursor-pointer">
						<p class="font-semibold text-white">Ganti Foto</p>
					</label>
					<input
						type="file"
						id="profileImage"
						name="profile_image"
						accept="image/*"
						onchange={handleImageUpload}
						class="hidden"
					/>
				</div>
			</div>
		</div>
		<span class="flex justify-center text-red-500">*</span>
		<input type="text" name="profile" value={data?.data?.profile} hidden />
		<input type="text" name="id_organisasi" value={data?.data.id_organisasi} hidden />
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div>
					<p>Nama Organisasi<span class="text-red-500">*</span></p>
					<div class="relative">
						<input
							type="text"
							name="nama_organisasi"
							value={data?.data.nama_organisasi || ''}
							placeholder="Masukkan Nama Organisasi"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 pr-10"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if errors}
						{#each errors.nama_organisasi as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Alamat<span class="text-red-500">*</span></p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Alamat"
							name="alamat"
							value={data?.data.alamat || ''}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 pr-10"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if errors}
						{#each errors.alamat as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Email<span class="text-red-500">*</span></p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Email"
							name="email"
							value={data?.data.email || ''}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 pr-10"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if errors}
						{#each errors.email as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Deskripsi Organisasi<span class="text-red-500">*</span></p>
					<div class="relative w-full">
						<textarea
							placeholder="Masukkan Deskripsi Organisasi"
							name="deskripsi_organisasi"
							value={data?.data.deskripsi_organisasi || ''}
							class="mt-2 h-32 w-full resize-none rounded-md border-2 px-3 py-3 pr-10 text-lg"
						></textarea>
						<div class="h-full">
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
					</div>
					{#if errors}
						{#each errors.deskripsi_organisasi as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
			</div>

			<!-- 2 -->
			<div>
				<div>
					<p>Penanggung Jawab<span class="text-red-500">*</span></p>
					<div class="relative">
						<input
							type="text"
							name="penanggungjawab_nama"
							bind:value={pjKeyword}
							autocomplete="off"
							onfocus={() => (showPjDropdown = true)}
							onblur={() => {
								// Delay hiding dropdown to allow for click
								setTimeout(() => {
									showPjDropdown = false;
								}, 200);
							}}
							placeholder="Masukkan Penanggung Jawab"
							class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
						/>
					</div>
					<input type="hidden" name="penanggungjawab_id" value={selectedPj?.id_anggota || ''} />
					{#if showPjDropdown && filteredPjUsers.length > 0}
						<div class="absolute z-10 mt-1 rounded-lg border bg-white shadow-lg">
							<ul class="max-h-60 overflow-y-auto">
								{#each filteredPjUsers as user}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
									<li
										class="cursor-pointer px-3 py-2 hover:bg-gray-100"
										onclick={() => selectPj(user)}
									>
										<div class="flex flex-col">
											<span class="font-medium">{user.nama_lengkap}</span>
											<span class="text-sm text-gray-500">{user.email}</span>
										</div>
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					{#if errors}
						{#each errors.penanggungjawab as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-5 flex items-center gap-3">
					<div class="w-full">
						<p>Pembina<span class="text-red-500">*</span></p>
						<div class="relative">
							<input
								type="text"
								name="pembina_nama"
								bind:value={pbKeyword}
								autocomplete="off"
								onfocus={() => (showPbDropdown = true)}
								onblur={() => {
									// Delay hiding dropdown to allow for click
									setTimeout(() => {
										showPbDropdown = false;
									}, 200);
								}}
								placeholder="Masukkan Pembina"
								class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
							/>
						</div>
						<input type="hidden" name="pembina_id" value={selectedPb?.id_anggota || ''} />
						{#if showPbDropdown && filteredPbUsers.length > 0}
							<div class="absolute z-10 mt-1 rounded-lg border bg-white shadow-lg">
								<ul class="max-h-60 overflow-y-auto">
									{#each filteredPbUsers as user}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
										<li
											class="cursor-pointer px-3 py-2 hover:bg-gray-100"
											onclick={() => selectPb(user)}
										>
											<div class="flex flex-col">
												<span class="font-medium">{user.nama_lengkap}</span>
												<span class="text-sm text-gray-500">{user.email}</span>
											</div>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						{#if errors}
							{#each errors.pembina as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5 flex items-center gap-3">
					<div class="w-full">
						<p>Pelindung<span class="text-red-500">*</span></p>
						<div class="relative">
							<input
								type="text"
								name="pelindung_nama"
								bind:value={plKeyword}
								autocomplete="off"
								onfocus={() => (showPlDropdown = true)}
								onblur={() => {
									// Delay hiding dropdown to allow for click
									setTimeout(() => {
										showPlDropdown = false;
									}, 200);
								}}
								placeholder="Masukkan Pelindung"
								class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
							/>
						</div>
						<input type="hidden" name="pelindung_id" value={selectedPl?.id_anggota || ''} />
						{#if showPlDropdown && filteredPlUsers.length > 0}
							<div class="absolute z-10 mt-1 rounded-lg border bg-white shadow-lg">
								<ul class="max-h-60 overflow-y-auto">
									{#each filteredPlUsers as user}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
										<li
											class="cursor-pointer px-3 py-2 hover:bg-gray-100"
											onclick={() => selectPl(user)}
										>
											<div class="flex flex-col">
												<span class="font-medium">{user.nama_lengkap}</span>
												<span class="text-sm text-gray-500">{user.email}</span>
											</div>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				</div>
				{#if errors}
					{#each errors.pelindung as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
				<div class="mt-2">
					<p>Tanggal Berdiri<span class="text-red-500">*</span></p>
					<div class="relative">
						<input
							type="date"
							name="tanggal_berdiri"
							value={data.data?.tanggal_berdiri || ''}
							placeholder="Masukkan Tanggal Berdiri"
							class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
						/>
					</div>
					{#if errors}
						{#each errors.tangal_berdiri as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
				<div class="mt-5 flex gap-12">
					<div class="w-full lg:w-[50%]">
						<p>No telepon<span class="text-red-500">*</span></p>
						<input
							type="text"
							name="phone"
							value={data.data?.no_telp || ''}
							placeholder="Masukkan No Telp"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
					</div>
					<div class="hidden w-[50%]"></div>
				</div>
				{#if errors}
					{#each errors.phone as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>

		<div class="relative flex w-full justify-center lg:justify-end">
			<button
				class="w-50 t-0 mt-10 rounded-lg border-2 border-black bg-green-500 px-2 py-2 text-white"
				type="submit">Simpan Data</button
			>
		</div>
	</form>
</div>

{#if open}
	<SuccessModal text="Organisasi Berhasil Diubah"></SuccessModal>
{/if}

<style>
	.raphael--edit {
		display: inline-block;
		width: 28px;
		height: 28px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23a59494' d='M27.87 7.863L23.024 4.82l-7.89 12.566l4.843 3.04zM14.395 21.25l-.107 2.855l2.527-1.337l2.35-1.24l-4.673-2.936zM29.163 3.24L26.63 1.647a1.364 1.364 0 0 0-1.88.43l-1 1.588l4.843 3.042l1-1.586c.4-.64.21-1.483-.43-1.883zm-3.965 23.82c0 .275-.225.5-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5h13.244l1.884-3H5.698c-1.93 0-3.5 1.57-3.5 3.5v19c0 1.93 1.57 3.5 3.5 3.5h19c1.93 0 3.5-1.57 3.5-3.5V11.097l-3 4.776v11.19z'/%3E%3C/svg%3E");
	}
</style>
