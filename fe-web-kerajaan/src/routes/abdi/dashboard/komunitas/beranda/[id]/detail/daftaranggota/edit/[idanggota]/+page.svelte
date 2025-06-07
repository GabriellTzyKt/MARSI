<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { navigating } from '$app/state';
	import { formatDate } from '$lib';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	let { data } = $props();
	console.log("Data : ", data)

	let namalengkap = $state('');
	let user = $state(data?.user);
	let anggota = $state(data?.selectedAnggota);
	let tempatlahir = $state('');
	let tanggallahir = $state('');
	let jeniskelamin = $state('');
	let alamat = $state('');
	let notelepon = $state('');
	let hobi = $state('');
	let jabatan = $state('');
	let radioayah = $state('tidak');
	let radioibu = $state('tidak');
	let ayahAbdiNama = $state('');
	let ayahSearch = $state(user?.nama_ayah || '');
	let showAyahDropdown = $state(false);
	let filteredAyah = $derived(searchUser(ayahSearch));

	function searchUser(keyword: string) {
		return data?.alluserData.filter((u) =>
			u.nama_lengkap.toLowerCase().includes(keyword.toLowerCase())
		);
	}

	let ibuAbdiNama = $state('');
	let ibuSearch = $state(user?.nama_ibu || '');
	let showIbuDropdown = $state(false);
	let filteredIbu = $derived(searchUser(ibuSearch));
	let email = $state('');
	let wongso = $state('');
	let pekerjaan = $state('');
	let agama = $state('');
	let deskripsitugas = $state('');

	let error: any = $state('');
	let loading = $state(false);
	let success = $state(false);
	let open = $state(false);
	let timer: number;
</script>

{#if loading}
	<Loader></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="min-h-full w-full">
	<form
		method="post"
		action="?/edit"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				console.log(result);
				loading = false;
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
						goto(`/abdi/dashboard/komunitas/beranda/${data?.id_komunitas}/detail/daftaranggota`);
					}, 3000);
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
				}
			};
		}}
	>
		<input type="text" hidden name="id_user" value={anggota?.id_user} id="" />
		<input type="text" hidden name="tanggal_bergabung" value={anggota?.tanggal_bergabung} id="" />
		<input type="text" hidden name="id_komunitas" value={data?.id_komunitas} id="" />

		<div class="mt-10 grid grid-cols-2 gap-4">
			<!-- 1 -->
			<div>
				<div>
					<p>Nama Lengkap / Asma Timur<span class="text-red-500">*</span></p>
					<div class="relative">
						<input
							type="text"
							value={user?.nama_lengkap}
							name="namalengkap"
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if error}
						{#each error.namalengkap as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div class="mt-5 flex flex-col gap-2 lg:flex-row">
					<div class="w-full">
						<p>Tempat Lahir<span class="text-red-500">*</span></p>
						<input
							type="text"
							value={user?.tempat_lahir}
							name="tempatlahir"
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.tempatlahir as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Tanggal Lahir<span class="text-red-500">*</span></p>
						<input
							type="date"
							value={formatDate(user?.tanggal_lahir)}
							name="tanggallahir"
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.tanggallahir as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<!-- <span class="bx--calendar"></span> -->
				</div>

				<div>
					<p class="mt-5">Alamat<span class="text-red-500">*</span></p>
					<div class="relative">
						<input
							type="text"
							value={user?.alamat}
							name="alamat"
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 pr-9"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						{#if error}
							{#each error.alamat as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5 flex flex-col gap-2 lg:flex-row">
					<div class="w-full">
						<p>No telepon<span class="text-red-500">*</span></p>
						<input
							type="text"
							name="notelepon"
							value={user?.no_telp}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.notelepon as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Jenis Kelamin<span class="text-red-500">*</span></p>
						<select
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
							name="jeniskelamin"
							value={user?.jenis_kelamin}
						>
							<option value="Laki-Laki">Laki-Laki</option>
							<option value="Perempuan">Perempuan</option>
						</select>
						{#if error}
							{#each error.jeniskelamin as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div>
					<p class="mt-5">Hobi</p>
					<div class="relative">
						<input
							type="text"
							name="hobi"
							value={user?.hobi || '-'}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						{#if error}
							{#each error.hobi as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>
				<div class="mt-3">
					<p>Deskripsi Tugas<span class="text-red-500">*</span></p>
					<div class="relative">
						<div class="relative w-full">
							<textarea
								name="deskripsitugas"
								value={anggota?.deskripsi_tugas}
								placeholder="Masukkan nama"
								class="mt-2 h-32 w-full resize-none rounded-md border-2 px-3 py-3 text-lg"
							></textarea>
							<div class="h-full">
								<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
							</div>
							{#if error}
								{#each error.deskripsitugas as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
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
									id="radio-ayah-ya"
									type="radio"
									bind:group={radioayah}
									value="ya"
									name="radio-ayah"
									class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="radio-ayah-ya" class="mx-2 text-sm font-medium text-gray-900">Ya</label>
							</div>
							<div class="mx-2 flex items-center justify-center">
								<input
									id="radio-ayah-tidak"
									type="radio"
									value="tidak"
									bind:group={radioayah}
									name="radio-ayah"
									class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="radio-ayah-tidak" class="mx-2 text-sm font-medium text-black"
									>Tidak</label
								>
							</div>
							{#if error}
								{#each error.radioayah as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>
					<div class="relative">
						<input
							type="text"
							name="nama_ayah"
							bind:value={ayahSearch}
							onfocus={() => (showAyahDropdown = true)}
							onblur={() => {
								setTimeout(() => {
									showAyahDropdown = false;
								}, 200);
							}}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						{#if showAyahDropdown && ayahSearch && radioayah == 'ya'}
							<ul
								class="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded border bg-white shadow"
							>
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								{#each filteredAyah as user}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<li
										class="cursor-pointer px-3 py-2 hover:bg-blue-100"
										onclick={() => {
											ayahAbdiNama = user.nama_lengkap;
											ayahSearch = user.nama_lengkap;
											showAyahDropdown = false;
										}}
									>
										{user.nama_lengkap}
									</li>
								{/each}
								{#if filteredAyah.length === 0}
									<li class="px-3 py-2 text-gray-400">Tidak ditemukan</li>
								{/if}
							</ul>
						{/if}
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						{#if error}
							{#each error.inputayah as a}
								<p class="text-left text-red-500">{a}</p>
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
									id="radio-ibu-ya"
									type="radio"
									bind:group={radioibu}
									value="ya"
									name="radio-ibu"
									class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="radio-ibu-ya" class="mx-2 text-sm font-medium text-gray-900">Ya</label>
							</div>
							<div class="mx-2 flex items-center justify-center">
								<input
									id="radio-ibu-tidak"
									type="radio"
									bind:group={radioibu}
									value="tidak"
									name="radio-ibu"
									class="h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
								/>
								<label for="radio-ibu-tidak" class="mx-2 text-sm font-medium text-black"
									>Tidak</label
								>
							</div>
							{#if error}
								{#each error.radioibu as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>
					<div class="relative">
						<input
							type="text"
							name="nama_ibu"
							bind:value={ibuSearch}
							onfocus={() => (showIbuDropdown = true)}
							onblur={() => {
								setTimeout(() => {
									showIbuDropdown = false;
								}, 200);
							}}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						{#if showIbuDropdown && ibuSearch && radioibu == 'ya'}
							<ul
								class="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded border bg-white shadow"
							>
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								{#each filteredIbu as user}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<li
										class="cursor-pointer px-3 py-2 hover:bg-blue-100"
										onclick={() => {
											ibuAbdiNama = user.nama_lengkap;
											ibuSearch = user.nama_lengkap;
											showIbuDropdown = false;
										}}
									>
										{user.nama_lengkap}
									</li>
								{/each}
								{#if filteredIbu.length === 0}
									<li class="px-3 py-2 text-gray-400">Tidak ditemukan</li>
								{/if}
							</ul>
						{/if}
						{#if error}
							{#each error.inputibu as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5">
					<p>Email</p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Nama"
							value={user?.email}
							readonly={user?.email ? true : false}
							name="email"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						{#if error}
							{#each error.email as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="flex flex-col gap-2 lg:flex-row">
					<div class="mt-5 w-full">
						<p>Wongso<span class="text-red-500">*</span></p>
						<div class="relative">
							<input
								name="wongso"
								type="text"
								value={user?.panggilan || '-'}
								placeholder="Masukkan Nama"
								class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
							/>
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
							{#if error}
								{#each error.wongso as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>
				<div class="mt-5 w-full">
					<p>Pekerjaan</p>
					<div class="relative">
						<input
							type="text"
							name="pekerjaan"
							value={user?.pekerjaan || '-'}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						{#if error}
							{#each error.pekerjaan as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>
				<div class="flex">
					<div class="mt-5 w-full">
						<p>Agama<span class="text-red-500">*</span></p>
						<div class="relative">
							<select
								class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
								name="agama"
								value={user?.agama}
							>
								<option value="Kristen">Kristen</option>
								<option value="Katolik">Katolik</option>
								<option value="Islam">Islam</option>
								<option value="Hindu">Hindu</option>
								<option value="Budha">Budha</option>
								<option value="Konghucu">Konghucu</option>
							</select>
							{#if error}
								{#each error.agama as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>
				<div class="mt-3">
					<p>Jabatan<span class="text-red-500">*</span></p>
					<div class="relative w-full">
						<select
							id="jabatan"
							name="jabatan"
							value={anggota.jabatan_anggota}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						>
							<option selected disabled>Pilih Jabatan</option>
							<option value="Ketua">Ketua</option>
							<option value="Wakil Ketua">Wakil Ketua</option>
							<option value="Sekretaris">Sekretaris</option>
							<option value="Bendahara">Bendahara</option>
							<option value="Anggota">Anggota</option>
						</select>

						{#if error}
							{#each error.jabatan as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="flex w-full justify-end">
			<button
				class="w-50 t-0 mt-10 rounded-lg border-2 border-black bg-green-500 px-2 py-2 text-white"
				type="submit">Simpan Data</button
			>
		</div>
	</form>
</div>
{#if open}
	<SuccessModal text="Anggota Berhasil Diedit"></SuccessModal>
{/if}

<!-- {#if loading}
	<Loader></Loader>
{/if} -->

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
