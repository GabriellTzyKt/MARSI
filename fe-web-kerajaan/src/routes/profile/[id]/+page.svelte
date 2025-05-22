<script lang="ts">
	import { navigating, page } from '$app/state';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import jd from '$lib/asset/profile/jdpp.jpg';
	import Input from '../Input.svelte';
	import { accounts } from '$lib/dummy';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import { goto } from '$app/navigation';
	import DropDownRunes from '$lib/dropdown/dropdownrunes.svelte';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import Loader from '$lib/loader/Loader.svelte';
	import Bracode from '$lib/popup/Bracode.svelte';

	let { form, data } = $props();

	console.log(data);
	onMount(() => {});
	let open = $state(false);
	let timer: number;
	let ayahAbdi = $state('ayah_no');
	let ibuAbdi = $state('ibu_no');
	let errMsgA = $state('');
	let errMsgB = $state('');
	let err = form?.errors;

	// Profile picture handling
	let pictUrl = $state(data.data.profileUrl || jd);
	let pictUrlFiles = $state(null);

	function handleFiles(event) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			const file = input.files[0];

			// Check file size (limit to 5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert('File terlalu besar. Maksimal ukuran file adalah 5MB.');
				input.value = '';
				return;
			}

			// Check file type
			if (!file.type.match('image.*')) {
				alert('Hanya file gambar yang diperbolehkan.');
				input.value = '';
				return;
			}

			pictUrlFiles = file;
			pictUrl = URL.createObjectURL(file);
		}
	}

	// Clean up object URLs when component is destroyed
	onMount(() => {
		return () => {
			if (pictUrl && pictUrl !== jd && pictUrl !== data.data.profileUrl) {
				URL.revokeObjectURL(pictUrl);
			}
		};
	});

	let toggle = () => {
		if (!open) {
			open = true;
		} else open = false;
	};

	const akun = data.akun;
	let loading = $state(false);

	// Tambahkan state untuk kontrol popup
	let showBarcode = $state(false);
	let barcodeData = $state('');

	// Fungsi untuk menampilkan barcode
	function openBarcode() {
		// Gunakan ID pengguna atau data lain yang relevan
		barcodeData = data?.data?.id_user?.toString() || 'User ID';
		showBarcode = true;
	}
</script>

<Navbar></Navbar>
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<form
	action="?/ubah"
	method="post"
	enctype="multipart/form-data"
	use:enhance={() => {
		loading = true;
		return async ({ result }) => {
			loading = false;
			console.log(result.data.errors);
			if (result.type === 'success') {
			} else if (result.type === 'failure') {
			}
		};
	}}
>
	<div class=" mt-18 flex justify-center">
		<p class=" text-2xl font-[500]">Ubah Profil</p>
	</div>
	<div
		class="mx-4 mt-6 flex flex-col items-center gap-4 md:mx-10 md:mt-8 md:flex-row md:justify-between"
	>
		<!-- Tombol Kembali -->
		<div class="hidden w-full md:flex md:w-auto">
			<button
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:cursor-pointer md:w-auto"
				onclick={() => goto('/profile')}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
					/>
				</svg>
				Kembali
			</button>
		</div>

		<!-- Profile Picture Section -->
		<div class="relative">
			<img
				src={pictUrl}
				class="h-24 w-24 rounded-full sm:h-28 sm:w-28 md:h-36 md:w-36"
				alt="Profile"
			/>
			<!-- Tombol Edit Foto -->
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<!-- svelte-ignore a11y_label_has_associated_control -->
			<label
				class="absolute bottom-0 right-0 cursor-pointer rounded-xl bg-white p-2 shadow-md hover:bg-gray-100"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
					/>
				</svg>
				<input type="file" hidden name="profile_picture" accept="image/*" onchange={handleFiles} />
			</label>
		</div>

		<!-- Tombol Simpan Data -->
		<div class="w-full md:w-auto">
			<button
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:cursor-pointer md:w-auto"
				type="submit"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 3.75H6.912a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859M12 3v8.25m0 0-3-3m3 3 3-3"
					/>
				</svg>
				Simpan Data
			</button>
		</div>

		<!-- Tombol Kembali -->
		<div class="flex w-full md:hidden">
			<button
				class="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:cursor-pointer md:w-auto"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
					/>
				</svg>
				Kembali
			</button>
		</div>
	</div>

	<!-- jujur edit profile harus e isa dijaiin komponen karena ngulang terus, tp ak males :D -->
	<!-- edit profile -->
	<div class="mx-10 mt-8 grid grid-cols-1 gap-4 xl:grid-cols-5">
		<!-- nama lengkap -->
		<div class="flex flex-col xl:col-span-2">
			<div>
				<p class="text-xl">Nama Lengkap</p>
			</div>
			<div class="mt-2">
				<Input type="text" name="nama_lengkap" value={data.data.nama_lengkap || '-'}></Input>
				{#if form?.errors}
					{#each form?.errors.nama_lengkap as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>
		<!-- tempat Lahir -->
		<div class=" flex flex-col">
			<div>
				<p class="text-xl">Tempat Lahir</p>
			</div>
			<div class="mt-2">
				<Input type="text" name="tempat_lahir" value={data.data.nama_lengkap || '-'}></Input>
				{#if form?.errors}
					{#each form?.errors.tempat_lahir as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>
		<!-- tanggal lahir -->
		<div class="flex w-full flex-col">
			<div>
				<p class="text-lg">Tanggal Lahir</p>
			</div>
			<div class="relative mt-2">
				<input
					type="date"
					name="tanggal_lahir"
					class="w-full rounded-lg border border-gray-500 bg-white py-2 ps-2 text-gray-500 focus:outline-none"
					id="tanggal_lahir"
					value={data.data.tanggal_lahir_UI || '-'}
				/>
				{#if form?.errors}
					{#each form?.errors.tanggal_lahir as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>
		<!-- jenis kelamin -->
		<div class="flex flex-col">
			<div>
				<p class="text-xl">Jenis Kelamin</p>
			</div>
			<div class=" mt-2">
				<select
					name="jenis_kelamin"
					class="w-full rounded-lg border border-gray-500 py-2 pe-2 ps-2"
					value={data.data.jenis_kelamin || '-'}
					id=""
				>
					<option value="Perempuan">Perempuan</option>
					<option value="Laki_Laki">Laki - Laki</option>
				</select>
				{#if form?.errors}
					{#each form?.errors.jenis_kelamin as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>
		<!-- alamat -->
		<div class="flex flex-col xl:col-span-2">
			<div>
				<p class="text-xl">Alamat</p>
			</div>
			<div class="mt-2">
				<Input type="text" name="alamat" value={data.data.alamat || '-'}></Input>
				{#if form?.errors}
					{#each form?.errors.alamat as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>
		<!-- no telpon -->
		<div class="flex flex-col">
			<div>
				<p class="text-xl">No Telpon</p>
			</div>
			<div class="mt-2">
				<Input type="phone" name="no_telp" value={data.data.no_telp || '-'}></Input>
				{#if form?.errors}
					{#each form?.errors.no_telp as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>

		<!-- pekerjaan -->
		<div class="flex flex-col">
			<div>
				<p class="text-xl">Pekerjaan</p>
			</div>
			<div class="mt-2">
				<Input type="text" name="pekerjaan" value={data.data.pekerjaan || '-'}></Input>
				{#if form?.errors}
					{#each form?.errors.pekerjaan as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>
		<!-- wongso -->
		<div class="flex flex-col">
			<div>
				<p class="text-xl">Wongso</p>
			</div>
			<div class="mt-2">
				<Input type="text" name="wongso" value={data.data.wongso || '-'}></Input>
				{#if form?.errors}
					{#each form?.errors.wongso as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>

		<!-- email -->
		<div class="flex flex-col xl:col-span-2">
			<div>
				<p class="text-xl">Email</p>
			</div>
			<div class="mt-2">
				<Input type="email" name="email" value={data.data.email || '-'}></Input>
				{#if form?.errors}
					{#each form?.errors.email as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>
		<!-- hobi -->
		<div class="flex flex-col xl:col-span-2">
			<div>
				<p class="text-xl">Hobi</p>
			</div>
			<div class="mt-2">
				<Input type="text" name="hobi" value={data.data.hobi || '-'}></Input>
				{#if form?.errors}
					{#each form?.errors.hobi as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Agama-->
		<div class="flex flex-col">
			<div>
				<p class="text-xl">Agama</p>
			</div>
			<div class="mt-2">
				<Input type="text" name="agama" value={data.data.agama || '-'}></Input>
				{#if form?.errors}
					{#each form?.errors.agama as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>
	</div>
	<div class="mx-10 mb-4 mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
		<!-- asma dalem -->
		<div class="flex flex-col">
			<div>
				<p class="text-xl">Asma Dalem</p>
			</div>
			<div class="mt-2">
				<Input type="text" name="asma_dalem" value={data.data.panggilan || '-'}></Input>
				{#if form?.errors}
					{#each form?.errors.asma_dalem as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
			</div>
		</div>
		<!-- ayah -->
		<div class="flex flex-col">
			<div class="grid grid-cols-1 xl:grid-cols-3">
				<div>
					<p class="text-xl">Ayah</p>
				</div>
				<div class="col-span-2 flex gap-2 xl:justify-end">
					<div class=" me-2 flex items-center justify-center">
						<p class="text-sm">Ayah Seorang Abdi?</p>
					</div>

					<div class=" flex items-center justify-center gap-1">
						<input type="radio" name="ayah_abdi" bind:group={ayahAbdi} id="" value="ayah_yes" />
						<p>Yes</p>
					</div>
					<div class="flex items-center justify-center gap-1">
						<input type="radio" name="ayah_abdi" bind:group={ayahAbdi} id="" value="ayah_no" />
						<p>No</p>
					</div>
				</div>
			</div>
			<div class="mt-2">
				<Input type="text" name="nama_ayah" value={accounts[0].ayah}></Input>
				{#if form?.errors}
					{#each form?.errors.nama_ayah as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
				{#if errMsgA}
					<p class="text-red-500">{errMsgA}</p>
				{/if}
			</div>
		</div>
		<!-- ibu -->
		<div class="flex flex-col">
			<div class="grid grid-cols-1 xl:grid-cols-3">
				<div>
					<p class="text-xl">Ibu</p>
				</div>
				<div class="col-span-2 flex gap-2 xl:justify-end">
					<div class=" me-2 flex items-center justify-center">
						<p class="text-sm">Ibu Seorang Abdi?</p>
					</div>

					<div class=" flex items-center justify-center gap-1">
						<input type="radio" name="ibu_abdi" bind:group={ibuAbdi} id="" value="ibu_yes" />
						<p>Yes</p>
					</div>
					<div class="flex items-center justify-center gap-1">
						<input type="radio" name="ibu_abdi" bind:group={ibuAbdi} id="" value="ibu_no" />
						<p>No</p>
					</div>
				</div>
			</div>
			<div class="mt-2">
				<Input type="text" name="nama_ibu" value={accounts[0].ibu}></Input>
				{#if form?.errors}
					{#each form?.errors.nama_ibu as e}
						<p class="text-left text-red-500">- {e}</p>
					{/each}
				{/if}
				{#if errMsgB}
					<p class="text-red-500">{errMsgB}</p>
				{/if}
			</div>
		</div>
	</div>
</form>

<Footer></Footer>
{#if open}
	<SuccessModal text="Akun Sudah Aktif!"></SuccessModal>
{/if}

<!-- Tambahkan tombol untuk menampilkan barcode -->
<button class="rounded-lg border border-gray-500 px-3 py-2 shadow-2xl" onclick={openBarcode}>
	Tampilkan Barcode
</button>

<!-- Tambahkan komponen Bracode -->
{#if showBarcode}
	<Bracode bind:value={showBarcode} data={barcodeData} />
{/if}
