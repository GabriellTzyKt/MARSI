<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';
	// import { load } from '../../../../dashboard/organisasi/daftarorganisasi/proxy+page.server';
	let { data } = $props();
	console.log(data);
	let abdi = data?.combinedDataUser;
	let open = $state(false);
	let timer: number;
	let rAyah = $state('ayah_tidak');
	let rIbu = $state('ibu_tidak');
	let errors = $state();
	let loading = $state(false);

	let selectedAyah = $state('');
	let ayahKeyword = $state(abdi?.nama_ayah || '');
	let showAyahDropdown = $state(false);
	let filteredAyahUsers = $derived(filterUser(ayahKeyword));

	function selectAyah(user: any) {
		selectedAyah = user;
		ayahKeyword = user.nama_lengkap;
		showAyahDropdown = false;
	}

	let selectedIbu = $state('');
	let ibuKeyword = $state(abdi?.nama_ibu || '');
	let showIbuDropdown = $state(false);
	let filteredIbuUsers = $derived(filterUser(ibuKeyword));
	let type = $state('password');

	function selectIbu(user: any) {
		selectedIbu = user;
		ibuKeyword = user.nama_lengkap;
		showIbuDropdown = false;
	}

	function filterUser(searchTerm: string) {
		return data.userData.filter((item) =>
			item.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}

	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		if (open)
			timer = setTimeout(() => {
				open = false;
				goto('/abdi/sekretariat/anggota/daftaranggota');
			}, 3000);
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="min-h-full w-full">
	<form
		action="?/ubahAbdi"
		method="post"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					clearTimeout(timer);
					open = true;
					timer = setTimeout(() => {
						open = false;
						goto('/abdi/sekretariat/anggota/daftaranggota');
					}, 3000);
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
				}
			};
		}}
	>
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div>
					<p>Nama Lengkap / Asma Timur*:</p>
					<div class="relative">
						<input
							type="text"
							name="nama_lengkap"
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
							value={abdi?.nama_lengkap}
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					<div>
						{#if errors}
							{#each errors.nama_lengkap as e}
								<p class="text-left text-red-500">-{e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5 flex gap-12">
					<div class="w-full">
						<p>Tempat Lahir :</p>
						<input
							type="text"
							name="tempat_lahir"
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
							value={abdi?.tempat_lahir}
						/>
						<div>
							{#if errors}
								{#each errors.tempat_lahir as e}
									<p class="text-left text-red-500">-{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					<div class="w-full">
						<p>Tanggal Lahir :</p>
						<input
							type="date"
							name="tanggal_lahir"
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
							value={abdi?.tanggal_lahir}
						/>
						<div>
							{#if errors}
								{#each errors.tanggal_lahir as e}
									<p class="text-left text-red-500">-{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					<!-- <span class="bx--calendar"></span> -->
				</div>

				<div>
					<p class="mt-5">Alamat:</p>
					<div class="relative">
						<input
							type="text"
							name="alamat"
							placeholder="Masukkan Nama"
							value={abdi?.alamat}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					<div>
						{#if errors}
							{#each errors.alamat as e}
								<p class="text-left text-red-500">-{e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5 flex gap-12">
					<div class="w-full">
						<p>No telepon :</p>
						<input
							type="phone"
							name="no_telp"
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
							value={abdi?.no_telp}
						/>
						<div>
							{#if errors}
								{#each errors.no_telp as e}
									<p class="text-left text-red-500">-{e}</p>
								{/each}
							{/if}
						</div>
					</div>
					<div class="w-full">
						<p>Jenis Kelamin :</p>
						<select
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
							name="jenis_kelamin"
							value="Laki-Laki"
						>
							<option value="Laki-Laki">Laki-Laki</option>
							<option value="Perempuan">Perempuan</option>
						</select>
						<div>
							{#if errors}
								{#each errors.jenis_kelamin as e}
									<p class="text-left text-red-500">-{e}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>

				<div>
					<p class="mt-5">Hobi (Opsional):</p>
					<div class="relative">
						<input
							type="text"
							name="hobi"
							placeholder="Masukkan Nama"
							value={abdi?.hobi}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					<div>
						{#if errors}
							{#each errors.hobi as e}
								<p class="text-left text-red-500">-{e}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<!-- 2 -->
			<div>
				<div>
					<div class="flex justify-between">
						<p>(Nama Ayah)</p>
						<p>Ayah seorang abdi?</p>
						<div class="flex">
							<div class="mx-2 flex items-center justify-center">
								<input
									id="radio_ayah-ya"
									type="radio"
									bind:group={rAyah}
									value="ayah_ya"
									name="radioayah"
									class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="radio_ayah-ya" class="mx-2 text-sm font-medium text-gray-900">Ya</label>
							</div>
							<div class="mx-2 flex items-center justify-center">
								<input
									id="radio_ayah-tidak"
									type="radio"
									bind:group={rAyah}
									value="ayah_tidak"
									name="radioayah"
									class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="radio_ayah-tidak" class="mx-2 text-sm font-medium text-black"
									>Tidak</label
								>
							</div>

							{#if errors}
								{#each errors.radio_ayah as e}
									<p class="text-left text-red-500">-{e}</p>
								{/each}
							{/if}
						</div>
					</div>

					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Nama"
							bind:value={ayahKeyword}
							autocomplete="off"
							onfocus={() => (showAyahDropdown = true)}
							onblur={() => {
								// Delay hiding dropdown to allow for click
								setTimeout(() => {
									showAyahDropdown = false;
								}, 200);
							}}
							name="nama_ayah"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if showAyahDropdown && filteredAyahUsers.length > 0 && rAyah === 'ayah_ya'}
						<div class="absolute z-10 mt-1 rounded-lg border bg-white shadow-lg">
							<ul class="max-h-60 overflow-y-auto">
								{#each filteredAyahUsers as user}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
									<li
										class="cursor-pointer px-3 py-2 hover:bg-gray-100"
										onclick={() => selectAyah(user)}
									>
										<div class="flex flex-col">
											<span class="font-medium">{user.nama_lengkap}</span>
											<span class="text-sm text-gray-500">{user.email}</span>
										</div>
									</li>
								{/each}
							</ul>
						</div>
					{:else if showAyahDropdown && filteredAyahUsers.length === 0 && rAyah === 'ayah_ya'}
						<p class="text-left text-red-500">Ayah Tidak Ditemukan</p>
					{/if}
					<div>
						{#if errors}
							{#each errors.nama_ayah as e}
								<p class="text-left text-red-500">-{e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div>
					<div class="mt-5 flex justify-between">
						<p>(Nama Ibu)</p>
						<p>Ibu seorang abdi?</p>
						<div class="flex">
							<div class="mx-2 flex items-center justify-center">
								<input
									id="radio_ibu-ya"
									type="radio"
									bind:group={rIbu}
									name="radioibu"
									value="ibu_ya"
									class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="radio_ibu-ya" class="mx-2 text-sm font-medium text-gray-900">Ya</label>
							</div>
							<div class="mx-2 flex items-center justify-center">
								<input
									id="radio_ibu-tidak"
									type="radio"
									value="ibu_tidak"
									bind:group={rIbu}
									name="radioibu"
									class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="radio_ibu-tidak" class="mx-2 text-sm font-medium text-black"
									>Tidak</label
								>
							</div>
							<div>
								{#if errors}
									{#each errors.radio_ibu as e}
										<p class="text-left text-red-500">-{e}</p>
									{/each}
								{/if}
							</div>
						</div>
					</div>
					<div class="relative">
						<input
							type="text"
							name="nama_ibu"
							placeholder="Masukkan Nama"
							bind:value={ibuKeyword}
							autocomplete="off"
							onfocus={() => (showIbuDropdown = true)}
							onblur={() => {
								// Delay hiding dropdown to allow for click
								setTimeout(() => {
									showIbuDropdown = false;
								}, 200);
							}}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if showIbuDropdown && filteredIbuUsers.length > 0 && rIbu === 'ibu_ya'}
						<div class="absolute z-10 mt-1 rounded-lg border bg-white shadow-lg">
							<ul class="max-h-60 overflow-y-auto">
								{#each filteredIbuUsers as user}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
									<li
										class="cursor-pointer px-3 py-2 hover:bg-gray-100"
										onclick={() => selectIbu(user)}
									>
										<div class="flex flex-col">
											<span class="font-medium">{user.nama_lengkap}</span>
											<span class="text-sm text-gray-500">{user.email}</span>
										</div>
									</li>
								{/each}
							</ul>
						</div>
					{:else if showIbuDropdown && filteredIbuUsers.length === 0 && rIbu === 'ibu_ya'}
						<p class="text-left text-red-500">Ibu Tidak Ditemukan</p>
					{/if}
					<div>
						{#if errors}
							{#each errors.nama_ibu as e}
								<p class="text-left text-red-500">-{e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5">
					<p>Email:</p>
					<div class="relative">
						<input
							type="email"
							name="email"
							placeholder="Masukkan Nama"
							value={abdi?.email}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					<div>
						{#if errors}
							{#each errors.email as e}
								<p class="text-left text-red-500">-{e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="flex gap-2">
					<div class="mt-5 w-[50%]">
						<p>Wongso:</p>
						<div class="relative">
							<input
								type="text"
								value={abdi?.keturunan}
								name="wongso"
								placeholder="Masukkan Wongso"
								class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
							/>
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
						<div>
							{#if errors}
								{#each errors.wongso as e}
									<p class="text-left text-red-500">-{e}</p>
								{/each}
							{/if}
						</div>
					</div>

					<div class="mt-5 w-[50%]">
						<p>Pekerjaan(Opsional):</p>
						<div class="relative">
							<input
								type="text"
								placeholder="Masukkan Pekerjaan"
								value={abdi?.pekerjaan}
								name="pekerjaan"
								class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
							/>
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
						<div>
							{#if errors}
								{#each errors.pekerjaan as e}
									<p class="text-left text-red-500">-{e}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>
				<div class="mt-5">
					<p>Jabatan:</p>
					<div class="relative">
						<select
							name="jabatan"
							value={abdi?.jabatan}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
							id=""
						>
							<option value="" disabled selected>Silahkan Pilih!</option>
							<option value="Raja">Raja</option>
							<option value="Wakil Raja">Wakil Raja</option>
							<option value="Ratu">Ratu</option>
							<option value="Hokage">Hokage</option>
							<option value="Pangeran">Pangeran</option>
							<option value="Putri">Putri</option>
							<option value="Bangsawan">Bangsawan</option>
							<option value="Abdi">Abdi</option>
							<option value="Anggota">Anggota</option>
							{#each data.jabatanData as item}
								<option value={item.id_jabatan}>{item.nama_jabatan}</option>
							{/each}
						</select>
						<!-- <span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span> -->
					</div>
					<div>
						{#if errors}
							{#each errors.jabatan as e}
								<p class="text-left text-red-500">-{e}</p>
							{/each}
						{/if}
					</div>
				</div>
				<div class="mt-5">
					<p>Agama(Opsional):</p>
					<div class="relative w-full lg:w-[50%]">
						<select
							placeholder="Masukkan Agama"
							name="agama"
							value={abdi?.agama}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						>
							<option value="Islam">Islam</option>
							<option value="Kristen">Kristen</option>
							<option value="Katolik">Katolik</option>
							<option value="Hindu">Hindu</option>
							<option value="Buddha">Buddha</option>
							<option value="Kong Hu Cu">Kong Hu Cu</option>
							<option value="Prefer Not To Say">Prefer Not To Say</option>
						</select>
						<!-- <span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span> -->
					</div>
					<div>
						{#if errors}
							{#each errors.agama as e}
								<p class="text-left text-red-500">-{e}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="flex w-full justify-end">
			<button
				class="w-50 t-0 mt-10 rounded-lg border-2 border-black bg-green-500 px-2 py-2 {loading
					? 'disabled'
					: ''} text-white"
				type="submit">{loading ? 'Loading...' : '+Tambah Data'}</button
			>
		</div>
		{#if errors?.api}
			<p class="text-red-500">{errors?.api}</p>
		{/if}
	</form>
</div>

{#if open}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
		<SuccessModal text="Berhasil menambah abdi"></SuccessModal>
	</div>
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

	.bx--calendar {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23a59494' d='M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z'/%3E%3Cpath fill='%23a59494' d='M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2M19 8l.001 12H5V8z'/%3E%3C/svg%3E");
	}
</style>
