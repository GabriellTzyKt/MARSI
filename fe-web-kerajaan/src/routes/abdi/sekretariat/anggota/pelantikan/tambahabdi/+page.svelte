<script lang="ts">
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';

	let open = $state(false);
	let timer: number;
	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		if (open)
			timer = setTimeout(() => {
				open = false;
				goto('/abdi/sekretariat/anggota/pelantikan');
			}, 3000);
	}
</script>

<div class="min-h-full w-full">
	<div class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4">
		<!-- 1 -->
		<div>
			<div>
				<p>Nama Lengkap / Asma Timur*:</p>
				<div class="relative">
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
					/>
					<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
				</div>
			</div>

			<div class="mt-5 flex lg:flex-row flex-col gap-12">
				<div class="w-full">
					<p>Tempat Lahir :</p>
					<input
						type="text"
						placeholder="Masukkan nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
					/>
				</div>
				<div class="w-full">
					<p>Tanggal Lahir :</p>
					<input
						type="text"
						placeholder="Masukkan nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
					/>
				</div>
				<!-- <span class="bx--calendar"></span> -->
			</div>

			<div>
				<p class="mt-5">Alamat:</p>
				<div class="relative">
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
					/>
					<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
				</div>
			</div>

			<div class="mt-5 flex lg:flex-row flex-col gap-12">
				<div class="w-full">
					<p>No telepon :</p>
					<input
						type="text"
						placeholder="Masukkan nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
					/>
				</div>
				<div class="w-full">
					<p>Jenis Kelamin :</p>
					<input
						type="text"
						placeholder="Masukkan nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
					/>
				</div>
			</div>

			<div>
				<p class="mt-5">Hobi (Opsional):</p>
				<div class="relative">
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
					/>
					<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
				</div>
			</div>

			<div>
				<p class="mt-5">Deskripsi Tugas:</p>
				<div class="relative w-full">
					<textarea
						placeholder="Masukkan nama"
						class="mt-2 h-32 w-full resize-none rounded-md border-2 px-3 py-3 text-lg"
					></textarea>
					<div class="h-full">
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
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
								id="default-radio-1"
								type="radio"
								value=""
								name="default-radio"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
							/>
							<label for="default-radio-1" class="mx-5 ms-2 text-sm font-medium text-gray-900"
								>Ya</label
							>
						</div>
						<div class="mx-2 flex items-center justify-center">
							<input
								checked
								id="default-radio-2"
								type="radio"
								value=""
								name="default-radio"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
							/>
							<label for="default-radio-2" class="mx-5 ms-2 text-sm font-medium text-black"
								>Tidak</label
							>
						</div>
					</div>
				</div>
				<div class="relative">
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
					/>
					<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
				</div>
			</div>

			<div>
				<div class="mt-5 flex justify-between">
					<p>(Nama Ibu)</p>
					<p>Ibu seorang abdi?</p>
					<div class="flex">
						<div class="mx-2 flex items-center justify-center">
							<input
								id="default-radio-1"
								type="radio"
								value=""
								name="default-radio"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
							/>
							<label for="default-radio-1" class="mx-5 ms-2 text-sm font-medium text-gray-900"
								>Ya</label
							>
						</div>
						<div class="mx-2 flex items-center justify-center">
							<input
								checked
								id="default-radio-2"
								type="radio"
								value=""
								name="default-radio"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
							/>
							<label for="default-radio-2" class="mx-5 ms-2 text-sm font-medium text-black"
								>Tidak</label
							>
						</div>
					</div>
				</div>
				<div class="relative">
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
					/>
					<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
				</div>
			</div>

			<div class="mt-5">
				<p>Email(Opsional):</p>
				<div class="relative">
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
					/>
					<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
				</div>
			</div>

			<div class="mt-5">
				<p>Wongso:</p>
				<div class="relative">
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
					/>
					<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
				</div>
			</div>

			<div class="mt-5">
				<p>Pekerjaan(Opsional):</p>
				<div class="relative">
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
					/>
					<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
				</div>
			</div>

			<div class="mt-5">
				<p>Agama(Opsional):</p>
				<div class="relative">
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
					/>
					<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
				</div>
			</div>

			<div class="mt-3">
				<p>Jabatan:</p>
				<div class="relative">
					<input
						type="text"
						placeholder="Masukkan Nama"
						class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
					/>
					<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
				</div>
			</div>
		</div>
	</div>
	<div class="flex w-full justify-end">
		<button
			class="w-50 t-0 mt-10 rounded-lg border-2 border-black bg-green-500 px-2 py-2 text-white"
			onclick={setTimer}>Simpan Data</button
		>
	</div>
</div>
{#if open}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
		<SuccessModal text="Berhasil di Tambah"></SuccessModal>
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
