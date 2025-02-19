<script lang="ts">
	import { page } from '$app/state';
	import Navbar from '$lib/navbar/Navbar.svelte';
	import jd from '$lib/asset/profile/jdpp.jpg';
	import Input from '../Input.svelte';
	import { accounts } from '$lib/dummy';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import Footer from '$lib/footer/Footer.svelte';
	import { goto } from '$app/navigation';
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
				goto('/profile');
			}, 3000);
	}

	let toggle = () => {
		if (!open) {
			open = true;
		} else open = false;
	};
	const { data } = $props();
	const akun = data.akun;
</script>

<Navbar></Navbar>
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

	<!-- Foto Profil -->
	<div class="relative">
		<img src={jd} class="h-24 w-24 rounded-full sm:h-28 sm:w-28 md:h-36 md:w-36" alt="Profile" />
		<!-- Tombol Edit Foto -->
		<!-- svelte-ignore a11y_consider_explicit_label -->
		<button class="absolute bottom-0 right-0 rounded-xl bg-white p-2 shadow-md">
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
		</button>
	</div>

	<!-- Tombol Simpan Data -->
	<div class="w-full md:w-auto">
		<button
			class="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:cursor-pointer md:w-auto"
			onclick={() => setTimer()}
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
			<Input type="text" value={akun.nama_lengkap}></Input>
		</div>
	</div>
	<!-- tempat Lahir -->
	<div class=" flex flex-col">
		<div>
			<p class="text-xl">Tempat Lahir</p>
		</div>
		<div class="mt-2">
			<Input type="text" value={akun.tempat_lahir}></Input>
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
				value={accounts[0].tanggal_lahir}
			/>
		</div>
	</div>
	<!-- jenis kelamin -->
	<div class="flex flex-col">
		<div>
			<p class="text-xl">Jenis Kelamin</p>
		</div>
		<div class="mt-2">
			<Input type="text" value={accounts[0].jenis_kelamin}></Input>
		</div>
	</div>
	<!-- alamat -->
	<div class="flex flex-col xl:col-span-2">
		<div>
			<p class="text-xl">Alamat</p>
		</div>
		<div class="mt-2">
			<Input type="text" value={accounts[0].alamat}></Input>
		</div>
	</div>
	<!-- no telpon -->
	<div class="flex flex-col">
		<div>
			<p class="text-xl">No Telpon</p>
		</div>
		<div class="mt-2">
			<Input type="phone" value={accounts[0].nomer_telpon}></Input>
		</div>
	</div>

	<!-- pekerjaan -->
	<div class="flex flex-col">
		<div>
			<p class="text-xl">Pekerjaan</p>
		</div>
		<div class="mt-2">
			<Input type="phone" value={accounts[0].pekerjaan}></Input>
		</div>
	</div>
	<!-- wongso -->
	<div class="flex flex-col">
		<div>
			<p class="text-xl">Wongso</p>
		</div>
		<div class="mt-2">
			<Input type="phone" value={accounts[0].wongso}></Input>
		</div>
	</div>

	<!-- email -->
	<div class="flex flex-col xl:col-span-2">
		<div>
			<p class="text-xl">Email</p>
		</div>
		<div class="mt-2">
			<Input type="text" value={accounts[0].email}></Input>
		</div>
	</div>
	<!-- hobi -->
	<div class="flex flex-col xl:col-span-2">
		<div>
			<p class="text-xl">Email</p>
		</div>
		<div class="mt-2">
			<Input type="text" value={accounts[0].hobi}></Input>
		</div>
	</div>

	<!-- Agama-->
	<div class="flex flex-col">
		<div>
			<p class="text-xl">Agama</p>
		</div>
		<div class="mt-2">
			<Input type="phone" value={accounts[0].agama}></Input>
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
			<Input type="text" value={accounts[0].asma_dalem}></Input>
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
					<input type="radio" name="" id="" value="yes" />
					<p>Yes</p>
				</div>
				<div class="flex items-center justify-center gap-1">
					<input type="radio" name="" id="" value="no" />
					<p>No</p>
				</div>
			</div>
		</div>
		<div class="mt-2">
			<Input type="text" value={accounts[0].ayah}></Input>
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
					<input type="radio" name="" id="" value="yes" />
					<p>Yes</p>
				</div>
				<div class="flex items-center justify-center gap-1">
					<input type="radio" name="" id="" value="no" />
					<p>No</p>
				</div>
			</div>
		</div>
		<div class="mt-2">
			<Input type="text" value={accounts[0].ibu}></Input>
		</div>
	</div>
</div>
<Footer></Footer>
{#if open}
	<SuccessModal text="Akun Sudah Aktif!"></SuccessModal>
{/if}
