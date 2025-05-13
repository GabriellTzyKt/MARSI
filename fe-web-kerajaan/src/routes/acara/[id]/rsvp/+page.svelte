<script lang="ts">
	import { enhance } from '$app/forms';
	import { navigating, page } from '$app/state';
	import Footer from '$lib/footer/Footer.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import Rsvp from '$lib/rsvp/Rsvp.svelte';

	let selectedUserId = $state('');
	let selectedPhone = $state('');
	let jenis_kelamin = $state('');

	function handleUserSelect(e: any) {
		const selectedName = e.target.value;
		const user = datauser.find((u: any) => u.nama_lengkap === selectedName);
		if (user) {
			selectedUserId = user.id_user;
			selectedPhone = user.no_telp;
			jenis_kelamin = user.jenis_kelamin.toLowerCase(); // ubah ke lowercase
			console.log('jenis kelamin : ', jenis_kelamin);
		}
	}

	let open = $state(false);
	let valo = $state(false);
	let error = $state({});
	let loading = $state(false);

	let timer: any;

	let { data } = $props();
	let datauser = data.allUsers;
	console.log('Data user : ', datauser);

	let value = $state('');
	let number = $state(1);
	let show = $state(false);

	let idAktif = $state(' ');
	let hasTamu = $state(false);

	$effect(() => {
		idAktif = page.params.id;
		console.log('ID : ', idAktif);
	});

	function showdaftar() {
		show = true;
		hasTamu = true;
	}

	function closedaftar() {
		show = false;
		hasTamu = false;
		// Reset number of guests when choosing "No"
		number = 1;
	}

	function increase(e: any) {
		e.preventDefault(); // Prevent form submission
		number += 1;
	}

	function decrease(e: any) {
		e.preventDefault(); // Prevent form submission
		if (number > 1) {
			number -= 1;
		}
	}

	function validateForm(formElement: any) {
		// Get all required fields
		const requiredFields = formElement.querySelectorAll('[required]');
		let isValid = true;
		let newErrors = {};

		// Check each required field
		requiredFields.forEach((field: any) => {
			if (!field.value.trim()) {
				isValid = false;
				newErrors[field.name] = `${field.placeholder || 'Field'} harus diisi`;
			}
		});

		// Update error state
		error = newErrors;
		return isValid;
	}
</script>

<div class="relative">
	<Navbar></Navbar>
</div>
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
{#if loading}
	<Loader></Loader>
{/if}
<section class="min-h-screen w-full bg-gray-100 pb-10 pt-10">
	<div class="relative flex items-center justify-between self-center pt-10 text-center">
		<a href="/acara"><span class="solar--arrow-left-outline absolute ml-8"></span></a>
		<p class="mx-auto items-center justify-center text-center text-xl font-semibold">RSVP</p>
	</div>
	<form
		action="?/tambah"
		method="post"
		use:enhance={({ formElement }) => {
			// Validate form before submission
			if (!validateForm(formElement)) {
				return () => {}; // Prevent submission if validation fails
			}

			loading = true;
			return async ({ result }) => {
				loading = false;
				console.log('Form submission result:', result);
				if (result.type === 'success') {
					valo = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						valo = false;
					}, 3000);
					error = {};
					open = false;
				} else if (result.type === 'failure') {
					console.log('Form submission failed:', result);
					error = result.data?.errors || {};
					console.log('Form errors:', error);
				}
			};
		}}
	>
		<p class="mx-auto mt-10 items-center justify-center text-center text-xl font-semibold">
			Nama Acara
		</p>
		<div class="grid grid-cols-1 gap-8 px-10 py-10 md:grid-cols-2">
			<div>
				<div class="flex flex-col">
					<p>Jenis Kelamin</p>
					<div>
						<select
							bind:value={jenis_kelamin}
							name="jeniskelamin"
							class="border-full block w-full rounded border border-gray-300 bg-white px-5 py-2 text-left text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							disabled={true}
						>
							<option value="" disabled selected>Jenis Kelamin</option>
							<option value="laki-laki" selected={jenis_kelamin === 'laki-laki'}>Laki-Laki</option>
							<option value="perempuan" selected={jenis_kelamin === 'perempuan'}>Perempuan</option>
						</select>
					</div>
					{#if error?.jeniskelamin}
						<p class="text-left text-red-500">- {error.jeniskelamin}</p>
					{/if}
				</div>

				<input type="hidden" name="id_url" bind:value={idAktif} />
				<input type="hidden" name="has_tamu" bind:value={hasTamu} />
				<input type="hidden" name="tamu_count" value={number} />

				<div class="mt-4 flex flex-col">
					<p>Pilih Nama</p>
					<select
						class="rounded-lg border-2 px-2 py-2"
						placeholder="Pilih nama"
						onchange={handleUserSelect}
					>
						<option value="">-- Pilih Nama --</option>
						{#each datauser as user}
							<option value={user.nama_lengkap}>{user.nama_lengkap}</option>
						{/each}
					</select>
				</div>

				<input type="hidden" name="id_user" bind:value={selectedUserId} />

				<div class="mt-4 flex flex-col">
					<p>Nomor telepon</p>
					<input
						type="text"
						name="nomortelepon"
						class="rounded-lg border-2 px-2 py-2"
						placeholder="Masukkan nomor telepon"
						bind:value={selectedPhone}
					/>
					{#if error?.nomortelepon}
						<p class="text-left text-red-500">- {error.nomortelepon}</p>
					{/if}
				</div>
			</div>

			<div>
				<div class="mb-2 flex items-center justify-between">
					<p>Apakah ada tamu lain?</p>
					<div class="flex">
						<div class="mx-2 flex items-center justify-center">
							<input
								id="default-radio-1"
								type="radio"
								value="ya"
								name="default-radio"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
								onclick={showdaftar}
							/>
							<label for="default-radio-1" class="ms-2 text-sm font-medium text-gray-900">Ya</label>
						</div>
						<div class="mx-2 flex items-center justify-center">
							<input
								checked
								id="default-radio-2"
								type="radio"
								value="tidak"
								name="default-radio"
								class="h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
								onclick={closedaftar}
							/>
							<label for="default-radio-2" class="ms-2 text-sm font-medium text-black">Tidak</label>
						</div>
					</div>
					{#if show}
						<div class="flex items-center">
							<button
								type="button"
								class="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white"
								onclick={decrease}
							>
								-
							</button>
							<span class="mx-2">{number}</span>
							<button
								type="button"
								class="ml-2 flex h-8 w-8 items-center justify-center rounded-lg bg-green-700 text-white"
								onclick={increase}
							>
								+
							</button>
						</div>
					{/if}
				</div>

				{#if show}
					<div class="mb-4">
						<h3 class="mb-2 font-medium">Daftar Tamu Tambahan</h3>
						{#if error?._tamu}
							<p class="mb-2 text-left text-red-500">- {error._tamu}</p>
						{/if}
					</div>

					{#each Array(number) as _, i}
						<Rsvp {datauser} index={i} errors={error}></Rsvp>
					{/each}
				{/if}

				<div class="mt-12 flex w-full justify-end">
					<button class="rounded-lg bg-blue-600 px-4 py-2 text-white" type="submit">
						Simpan
					</button>
				</div>
			</div>
		</div>
	</form>
</section>

<section class="h-fot flex min-w-full overflow-hidden">
	<Footer></Footer>
</section>

{#if valo}
	<SuccessModal text="Anggota berhasil Ditambah!"></SuccessModal>
{/if}

<style>
	.solar--arrow-left-outline {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M10.53 5.47a.75.75 0 0 1 0 1.06l-4.72 4.72H20a.75.75 0 0 1 0 1.5H5.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0' clip-rule='evenodd'/%3E%3C/svg%3E");
	}
</style>
