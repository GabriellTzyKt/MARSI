<script lang="ts">
	import Input from '$lib/input/Input.svelte';
	import g1 from '$lib/asset/kerajaan/aboutUs1.png';
	import { goto } from '$app/navigation';
	import { enhance } from '$app/forms';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';
	let { data } = $props();
	let error = $state();
	let timer: number;
	let dataHeader = $state(data?.beranda[0] || {});
	let dataCard1 = $state(data?.beranda[1] || {});
	let dataCard2 = $state(data?.beranda[2] || {});
	let dataCard3 = $state(data?.beranda[3] || {});
	let open = $state(false);
	let loading = $state(false);
	// Untuk setiap gambar section
	let selectedImageHeader = $state<File | null>(null);
	let imagePreviewHeader = $state<string | undefined>(dataHeader.dokumentasi_url || g1);

	let selectedImageCard1 = $state<File | null>(null);
	let imagePreviewCard1 = $state<string | undefined>(dataCard1.dokumentasi_url || g1);

	let selectedImageCard2 = $state<File | null>(null);
	let imagePreviewCard2 = $state<string | undefined>(dataCard2.dokumentasi_url || g1);

	let selectedImageCard3 = $state<File | null>(null);
	let imagePreviewCard3 = $state<string | undefined>(dataCard3.dokumentasi_url || g1);

	function handleImageUploadHeader(event: any) {
		const file = event.target.files[0];
		if (file) {
			selectedImageHeader = file;
			imagePreviewHeader = URL.createObjectURL(file);
		}
	}
	function handleImageUploadCard1(event: any) {
		const file = event.target.files[0];
		if (file) {
			selectedImageCard1 = file;
			imagePreviewCard1 = URL.createObjectURL(file);
		}
	}
	function handleImageUploadCard2(event: any) {
		const file = event.target.files[0];
		if (file) {
			selectedImageCard2 = file;
			imagePreviewCard2 = URL.createObjectURL(file);
		}
	}
	function handleImageUploadCard3(event: any) {
		const file = event.target.files[0];
		if (file) {
			selectedImageCard3 = file;
			imagePreviewCard3 = URL.createObjectURL(file);
		}
	}
</script>

{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<div class="my-6 me-6 ms-6 flex w-full flex-col">
	<div class="flex gap-4">
		<div class="my-2">
			<button
				onclick={() => goto('/abdi/sekretariat/landingpage/mobile')}
				class="bg-badran-bt cursor-pointer rounded-full px-8 py-2 text-white">Setting Mobile</button
			>
		</div>
		<div class="my-2">
			<button
				onclick={() => goto('/abdi/sekretariat/landingpage/aset')}
				class="bg-badran-bt cursor-pointer rounded-full px-8 py-2 text-white"
				>Setting CMS Situs</button
			>
		</div>
	</div>

	<div class="mb-3 mt-2">
		<p class="text-2xl">Bagian 1 - Halaman Landasan</p>
	</div>
	<form
		action="?/tambahLanding"
		method="post"
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ result }) => {
				loading = false;
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
					}, 3000);
				}
				if (result.type === 'failure') {
					error = result.data?.errors;
				}
			};
		}}
	>
		<div class="grid w-full grid-cols-1 gap-4 xl:grid-cols-4">
			<!-- judul halaman -->
			<div class=" flex flex-col xl:col-span-3">
				<div>
					<p>Judul Halaman</p>
				</div>
				<div class="mt-1">
					<input
						type="text"
						name="judul_header"
						class="w-full rounded-lg border border-gray-500 bg-white py-2 ps-2 text-gray-500 focus:outline-none"
						value={dataHeader.judul_section}
					/>
					{#if error?.judul_halaman}
						{#each error.judul_halaman as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>
			<div></div>
			<!-- deskripsi halaman -->
			<div class="flex flex-col xl:col-span-3">
				<div>
					<p>Deskripsi Halaman</p>
				</div>
				<div class="mt-1">
					<textarea
						name="deskripsi_header"
						value={dataHeader.isi_section}
						class="min-h-[200px] w-full rounded-lg border border-gray-500 bg-white focus:outline-none"
						placeholder="Deskripsi singkat"
						rows="5"
						id=""
					></textarea>
					{#if error}
						{#each error.deskripsi_halaman as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>
			<!-- isi halaman 1 -->
			<div class="relative flex flex-col justify-center">
				<div>
					<p>Gambar Background</p>
				</div>

				<img src={imagePreviewHeader} alt="" class="min-h-[200px] w-full rounded-lg" />
				<div class="bg-badran-yellow right-26 absolute top-14 rounded-lg p-1 xl:right-10 xl:top-10">
					<label for="header">
						<input
							type="file"
							id="header"
							name="header"
							accept="image/*"
							onchange={handleImageUploadHeader}
							class="hidden"
						/>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="white"
							class="size-6 xl:size-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
							/>
						</svg>
					</label>
				</div>
				<div class="bg-badran-bdr absolute right-10 top-14 rounded-lg p-1 xl:right-2 xl:top-10">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</div>
			</div>
		</div>
		<div class="mb-4 mt-4 flex">
			<p class="text-2xl">Bagian 2 - Tentang Kami</p>
		</div>

		<div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
			<!-- card 1 -->
			<!--  -->
			<div class="flex flex-col xl:col-span-3">
				<div>
					<p class="text-xl">Card 1</p>
					<p class="text-md">Deskripsi Kartu</p>
				</div>
				<div class="mt-1">
					<textarea
						name="deskripsi_1"
						value={dataCard1.isi_section}
						class="min-h-[200px] w-full rounded-lg border border-gray-500 bg-white focus:outline-none"
						placeholder="Deskripsi singkat"
						rows="5"
						id=""
					></textarea>
					{#if error}
						{#each error.deskripsi_1 as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>
			<!-- isi halaman 1 -->
			<div class="relative flex flex-col justify-end">
				<img src={imagePreviewCard1} alt="" class="mb-1 min-h-[200px] w-full rounded-lg" />
				<div class="bg-badran-yellow right-26 xl:top-18 absolute top-14 rounded-lg p-1 xl:right-10">
					<label for="card1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="white"
							class="size-6 xl:size-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
							/>
						</svg>
						<input
							type="file"
							id="card1"
							name="card1"
							accept="image/*"
							onchange={handleImageUploadCard1}
							class="hidden"
						/>
					</label>
				</div>
				<div class="bg-badran-bdr xl:top-18 absolute right-10 top-14 rounded-lg p-1 xl:right-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</div>
			</div>
			<!-- card 2 -->
			<!--  -->
			<div class="flex flex-col xl:col-span-3">
				<div>
					<p class="text-xl">Card 2</p>
					<p class="text-md">Deskripsi Kartu</p>
				</div>
				<div class="mt-1">
					<textarea
						name="deskripsi_2"
						value={dataCard2.isi_section}
						class="min-h-[200px] w-full rounded-lg border border-gray-500 bg-white focus:outline-none"
						placeholder="Deskripsi singkat"
						rows="5"
						id=""
					></textarea>
					{#if error?.deskripsi_2}
						{#each error.deskripsi_2 as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>
			<!-- isi halaman 2 -->
			<div class="relative flex flex-col justify-end">
				<img src={imagePreviewCard2} alt="" class="mb-1 min-h-[200px] w-full rounded-lg" />
				<div class="bg-badran-yellow right-26 xl:top-18 absolute top-14 rounded-lg p-1 xl:right-10">
					<label for="card2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="white"
							class="size-6 xl:size-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
							/>
						</svg>
						<input
							type="file"
							id="card2"
							name="card2"
							accept="image/*"
							onchange={handleImageUploadCard2}
							class="hidden"
						/>
					</label>
				</div>
				<div class="bg-badran-bdr xl:top-18 absolute right-10 top-14 rounded-lg p-1 xl:right-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</div>
			</div>
			<!-- card 3 -->
			<!--  -->
			<div class="flex flex-col xl:col-span-3">
				<div>
					<p class="text-xl">Card 3</p>
					<p class="text-md">Deskripsi Kartu</p>
				</div>
				<div class="mt-1">
					<textarea
						name="deskripsi_3"
						value={dataCard3.isi_section}
						class="min-h-[200px] w-full rounded-lg border border-gray-500 bg-white focus:outline-none"
						placeholder="Deskripsi singkat"
						rows="5"
						id=""
					></textarea>
					{#if error?.deskripsi_3}
						{#each error.deskripsi_3 as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>
			<!-- isi halaman 3-->
			<div class="relative flex flex-col justify-end">
				<img src={imagePreviewCard3} alt="" class="mb-1 min-h-[200px] w-full rounded-lg" />
				<div class="bg-badran-yellow right-26 xl:top-18 absolute top-14 rounded-lg p-1 xl:right-10">
					<label for="card3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="white"
							class="size-6 xl:size-4"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
							/>
						</svg>
						<input
							type="file"
							id="card3"
							name="card3"
							accept="image/*"
							onchange={handleImageUploadCard3}
							class="hidden"
						/>
					</label>
				</div>
				<div class="bg-badran-bdr xl:top-18 absolute right-10 top-14 rounded-lg p-1 xl:right-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="white"
						class="size-6 xl:size-4"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
						/>
					</svg>
				</div>
			</div>
		</div>
		<div class="mt-2 flex w-full justify-center lg:justify-end">
			<button
				type="submit"
				class=" bg-badran-bdg w-full rounded-lg py-2 text-white lg:w-auto lg:px-6"
				>Simpan Data</button
			>
		</div>
	</form>
</div>
{#if open}
	<SuccessModal text="Landing Page Berhasil Diubah"></SuccessModal>
{/if}
