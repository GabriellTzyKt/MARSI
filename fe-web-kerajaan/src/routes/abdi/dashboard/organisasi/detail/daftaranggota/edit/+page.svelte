<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';

	let namalengkap = $state('');
	let tempatlahir = $state('');
	let tanggallahir = $state('');
	let jeniskelamin = $state('');
	let alamat = $state('');
	let notelepon = $state('');
	let hobi = $state('');
	let jabatan = $state('');
	let radioayah = $state('');
	let radioibu = $state('');
	let inputayah = $state('');
	let inputibu = $state('');
	let email = $state('');
	let wongso = $state('');
	let pekerjaan = $state('');
	let agama = $state('');
	let deskripsitugas = $state('');

	let error: any = $state('');

	let { form } = $props();
	console.log('form data', form);

	if (form?.formData) {
		namalengkap = form.formData.namalengkap;
		tempatlahir = form.formData.tempatlahir;
		tanggallahir = form.formData.tanggallahir;
		notelepon = form.formData.notelepon;
		hobi = form.formData.hobi;
		jabatan = form.formData.jabatan;
		radioayah = form.formData.radioayah;
		radioibu = form.formData.radioibu;
		inputayah = form.formData.inputayah;
		inputibu = form.formData.inputibu;
		email = form.formData.email;
		wongso = form.formData.wongso;
		pekerjaan = form.formData.pekerjaan;
		agama = form.formData.agama;
		deskripsitugas = form.formData.deskripsitugas;
		jeniskelamin = form.formData.jeniskelamin;
	}

	let open = $state(false);
	let timer: number;
</script>

<div class="min-h-full w-full">
	<form
		method="post"
		action="?/edit"
		use:enhance={() => {
			return async ({ result }) => {
				console.log(result);
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
						goto('/abdi/dashboard/organisasi/daftaranggota');
					}, 3000);
				} else if (result.type === 'failure') {
					error = result?.data?.errors;
				}
			};
		}}
	>
		<div class="mt-10 grid grid-cols-2 gap-4">
			<!-- 1 -->
			<div>
				<div>
					<p>Nama Lengkap / Asma Timur*:</p>
					<div class="relative">
						<input
							type="text"
							bind:value={namalengkap}
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
						<p>Tempat Lahir :</p>
						<input
							type="text"
							bind:value={tempatlahir}
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
						<p>Tanggal Lahir :</p>
						<input
							type="date"
							bind:value={tanggallahir}
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
					<p class="mt-5">Alamat:</p>
					<div class="relative">
						<input
							type="text"
							bind:value={alamat}
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
						<p>No telepon :</p>
						<input
							type="text"
							name="notelepon"
							bind:value={notelepon}
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
						<p>Jenis Kelamin :</p>
						<input
							type="text"
							name="jeniskelamin"
							bind:value={jeniskelamin}
							placeholder="Masukkan nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if error}
							{#each error.jeniskelamin as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div>
					<p class="mt-5">Hobi (Opsional):</p>
					<div class="relative">
						<input
							type="text"
							name="hobi"
							bind:value={hobi}
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
					<p>Jabatan:</p>
					<div class="relative">
						<input
							type="text"
							name="jabatan"
							bind:value={jabatan}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						{#if error}
							{#each error.jabatan as a}
								<p class="text-left text-red-500">{a}</p>
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
							name="inputayah"
							bind:value={inputayah}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
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
							name="inputibu"
							bind:value={inputibu}
							placeholder="Masukkan Nama"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						{#if error}
							{#each error.inputibu as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5">
					<p>Email(Opsional):</p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Nama"
							bind:value={email}
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
						<p>Wongso:</p>
						<div class="relative">
							<input
								name="wongso"
								type="text"
								bind:value={wongso}
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

					<div class="mt-5 w-full">
						<p>Pekerjaan(Opsional):</p>
						<div class="relative">
							<input
								type="text"
								name="pekerjaan"
								bind:value={pekerjaan}
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
				</div>

				<div class="flex">
					<div class="mt-5 w-[100%] lg:w-[50%]">
						<p>Agama(Opsional):</p>
						<div class="relative">
							<input
								type="text"
								name="agama"
								bind:value={agama}
								placeholder="Masukkan Nama"
								class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
							/>
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
							{#if error}
								{#each error.agama as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>
				</div>

				<div class="mt-3">
					<p>Deskripsi Tugas:</p>
					<div class="relative">
						<div class="relative w-full">
							<textarea
								name="deskripsitugas"
								bind:value={deskripsitugas}
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
