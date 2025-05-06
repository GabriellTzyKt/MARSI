<script lang="ts">
	import Navbar from '$lib/navbar/Navbar.svelte';
	import jd from '$lib/asset/profile/jdpp.jpg';
	import { slide } from 'svelte/transition';
	import Items from './Items.svelte';
	import { accounts, events } from '$lib/dummy';
	import Input from './Input.svelte';
	import { goto } from '$app/navigation';
	import Footer from '$lib/footer/Footer.svelte';
	import Bracode from '$lib/popup/Bracode.svelte';
	import { enhance } from '$app/forms';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	// import { load } from './[id]/proxy+page.server';
	let { data } = $props();
	let chose: number | null = $state(null);
	let open = $state(false);
	let timer: number;
	let success = $state(false);
	let loading = $state(false);
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

	const toggle = (id: number) => {
		chose = chose === id ? null : id;
	};
</script>

<Navbar></Navbar>
{#if loading || navigating.to}
	<Loader text="Loading..."></Loader>{/if}
<div class="relative">
	<div class="absolute">
		<form
			action="?/logout"
			method="post"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						let timer;
						success = true;
						timer = setTimeout(() => {
							(success = false), goto('/login');
						}, 3000);
					}
					if (result.type === 'failure') {
					}
				};
			}}
		>
			<button class="ms-6 mt-8 flex gap-2 rounded-xl bg-red-500 px-3 py-2 text-white shadow-2xl"
				><svg
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
						d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
					/>
				</svg>
				Logout</button
			>
		</form>
		<!-- <a href="">LogOut</a> -->
	</div>
</div>
<div class="flex items-center justify-center">
	<div class=" mt-8">
		<p class="text-xl font-[600]">Profile</p>
	</div>
</div>
<div class="mb-4 me-4 ms-4 grid grid-cols-1 justify-center gap-8 pt-8 xl:mx-10 xl:grid-cols-2">
	<!-- info profile -->
	<div class="flex w-full flex-col justify-center">
		<!-- profile pict -->
		<div class="flex items-center justify-center">
			<img src={jd} class="h-32 w-auto rounded-full" alt="" />
		</div>

		<!-- form nama lengkap -->
		<div class="flex w-full flex-col">
			<div>
				<p class="text-lg">Nama Lengkap</p>
			</div>
			<div class="mt-2 w-full">
				<Input value={data.data.nama_lengkap ? data.data.nama_lengkap : '-'} type="text"></Input>
			</div>
		</div>

		<!-- form tempat $ tanggal lahir-->
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			<!-- tempat lahir -->
			<div class="flex w-full flex-col">
				<div>
					<p class="text-lg">Tempat lahir</p>
				</div>
				<div class="mt-2">
					<Input value={data.data.tempat_lahir ? data.data.tempat_lahir : '-'} type="text"></Input>
				</div>
			</div>
			<!-- tanggal Lahir -->
			<div class="flex w-full flex-col">
				<div>
					<p class="text-lg">Tanggal Lahir</p>
				</div>
				<div class="relative mt-2">
					<input
						type="date"
						name=""
						class="w-full rounded-lg border border-gray-500 bg-white py-2 ps-2 text-gray-500 focus:outline-none"
						id=""
						value={data.data.tanggal_lahir}
						readonly
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="pointer-events-none absolute right-3 top-3 h-5 w-5 text-gray-500"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M8 7V3m8 4V3m-9 8h10m-10 4h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
						/>
					</svg>
				</div>
			</div>
		</div>
		<!-- alamat -->
		<div class=" mt-4 flex w-full flex-col">
			<div>
				<p class="text-lg">Alamat</p>
			</div>
			<div class="mt-2">
				<Input value={data.data.alamat ? data.data.alamat : '-'} type="text"></Input>
			</div>
		</div>

		<!-- Jenis Kelamin $ Wongso-->
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			<!-- Jenis Kelamin -->
			<div class="flex w-full flex-col">
				<div>
					<p class="text-lg">Jenis Kelamin</p>
				</div>
				<div class="mt-2">
					<Input value={data.data.jenis_kelamin ? data.data.jenis_kelamin : '-'} type="text"
					></Input>
				</div>
			</div>
			<!-- wongso -->
			<div class="flex w-full flex-col">
				<div>
					<p class="text-lg">Wongso</p>
				</div>
				<div class=" mt-2">
					<Input value={accounts[0].wongso} type="text"></Input>
				</div>
			</div>
		</div>
		<!-- email -->
		<div class=" mt-4 flex w-full flex-col">
			<div>
				<p class="text-lg">Email</p>
			</div>
			<div class="mt-2">
				<Input value={data.data.email} type="email"></Input>
			</div>
		</div>
		<!-- no telpon $ hobi -->
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			<!-- pekerjaan -->
			<div class="flex w-full flex-col">
				<div>
					<p class="text-lg">No Telpon</p>
				</div>
				<div class="mt-2">
					<Input value={data.data.no_telp ? data.data.no_telp : '-'} type="text"></Input>
				</div>
			</div>
			<!-- agama -->
			<div class="flex w-full flex-col">
				<div>
					<p class="text-lg">Hobi</p>
				</div>
				<div class=" mt-2">
					<Input value={data.data.hobi ? data.data.hobi : '-'} type="text"></Input>
				</div>
			</div>
		</div>
		<!-- Pekerjaan $ Agama -->
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			<!-- pekerjaan -->
			<div class="flex w-full flex-col">
				<div>
					<p class="text-lg">Pekerjaan</p>
				</div>
				<div class="mt-2">
					<Input value={data.data.pekerjaan ? data.data.pekerjaan : '-'} type="text"></Input>
				</div>
			</div>
			<!-- agama -->
			<div class="flex w-full flex-col">
				<div>
					<p class="text-lg">Agama</p>
				</div>
				<div class=" mt-2">
					<Input value={data.data.agama ? data.data.agama : '-'} type="text"></Input>
				</div>
			</div>
		</div>
		<!-- Asma Dalem -->
		<div class=" mt-4 flex w-full flex-col">
			<div>
				<p class="text-lg">Asma Dalem</p>
			</div>
			<div class="mt-2">
				<Input value={data.data.asma_dalem ? data.data.asma_dalem : '-'} type="text"></Input>
			</div>
		</div>
		<!-- Ayah $ Ibu -->
		<div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			<!-- ayah -->
			<div class="flex w-full flex-col">
				<div>
					<p class="text-lg">Ayah</p>
				</div>
				<div class="mt-2">
					<Input value={data.data.nama_ayah ? data.data.nama_ayah : '-'} type="text"></Input>
				</div>
			</div>
			<!-- ibu -->
			<div class="flex w-full flex-col">
				<div>
					<p class="text-lg">Ibu</p>
				</div>
				<div class=" mt-2">
					<Input value={data.data.nama_ibu ? data.data.nama_ibu : '-'} type="text"></Input>
				</div>
			</div>
		</div>
		<!-- Gelar -->
		<div class=" mt-4 flex w-full flex-col">
			<div>
				<p class="text-lg">Gelar</p>
			</div>
			<div class="mt-2">
				<Input value={data.data.gelar ? data.data.gelar : '-'} type="text"></Input>
			</div>
		</div>
		<div class="mt-4 flex flex-row justify-end">
			<div class="">
				<button
					class="rounded-lg border border-gray-500 px-3 py-2 shadow-2xl"
					onclick={() => {
						open = true;
					}}>Barcode</button
				>
			</div>
			<div class="ms-4">
				<button
					class="bg-badran-yellow rounded-lg border px-6 py-2 shadow-2xl"
					onclick={() => {
						goto(`/profile/${data.data.id_user}`);
					}}>Ubah</button
				>
			</div>
		</div>
	</div>
	<!-- Riwayat acara, organisasi, dan komunitas -->
	<div class=" flex flex-col pb-4">
		<div class="rounded-md border p-2">
			<!-- Riwayat Acara -->
			<div class="border-badran-bt flex flex-col rounded-md border px-4 py-2">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-badran-bt ms-2 text-xl font-[500]">Riwayat Acara</p>
					</div>
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
						<!-- cari -->
						<div class=" mx-2 flex items-center rounded-lg border px-2">
							<input
								type="text"
								placeholder="Cari.."
								class=" w-full bg-transparent px-2 py-2 focus:outline-none"
							/>

							<!-- svelte-ignore a11y_consider_explicit_label -->
							<button class="text-gray-600 hover:text-gray-800">
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
										d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
									/>
								</svg>
							</button>
						</div>
						<!-- Dropdown -->
						<div class="flex w-full items-center rounded-lg border px-3 py-1">
							<select
								name="Keterangan"
								id=""
								value="Keterangan"
								class="w-full bg-transparent p-2 focus:outline-none"
							>
								<option value="Keterangan">Keterangan</option>
								<option value="Sekarang">Sekarang</option>
								<option value="Bulan Lalu">Bulan Lalu</option>
								<option value="Minggu Ini">Minggu Ini</option>
							</select>
						</div>
					</div>
				</div>
				<div class=" mt-4 h-64 w-auto overflow-y-auto rounded-lg">
					{#each events as e}
						<Items {...e}></Items>
					{/each}
				</div>
			</div>

			<!-- Organisasi -->
			<div class="border-badran-bt mt-6 flex flex-col rounded-md border px-4 py-2">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-badran-bt ms-2 text-xl font-[500]">Organisasi</p>
					</div>
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
						<!-- cari -->
						<!-- cari -->
						<div class=" mx-2 flex items-center rounded-lg border px-2">
							<input
								type="text"
								placeholder="Cari.."
								class=" w-full bg-transparent px-2 py-2 focus:outline-none"
							/>

							<!-- svelte-ignore a11y_consider_explicit_label -->
							<button class="text-gray-600 hover:text-gray-800">
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
										d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
									/>
								</svg>
							</button>
						</div>
						<!-- Dropdown -->
						<div class="flex w-full items-center rounded-lg border px-3 py-1">
							<select
								name="Keterangan"
								id=""
								value="Keterangan"
								class="w-full bg-transparent p-2 focus:outline-none"
							>
								<option value="Keterangan">Keterangan</option>
								<option value="Sekarang">Sekarang</option>
								<option value="Bulan Lalu">Bulan Lalu</option>
								<option value="Minggu Ini">Minggu Ini</option>
							</select>
						</div>
					</div>
				</div>
				<div class=" mt-4 h-64 w-auto overflow-y-auto rounded-lg">
					{#each events as e}
						<Items {...e}></Items>
					{/each}
				</div>
			</div>

			<!-- Komunitas -->
			<div class="border-badran-bt mt-6 flex flex-col rounded-md border px-4 py-2">
				<div class="flex items-center justify-between">
					<div>
						<p class="text-badran-bt ms-2 text-xl font-[500]">Komunitas</p>
					</div>
					<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
						<!-- cari -->
						<div class=" mx-2 flex items-center rounded-lg border px-2">
							<input
								type="text"
								placeholder="Cari.."
								class=" w-full bg-transparent px-2 py-2 focus:outline-none"
							/>

							<!-- svelte-ignore a11y_consider_explicit_label -->
							<button class="text-gray-600 hover:text-gray-800">
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
										d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
									/>
								</svg>
							</button>
						</div>
						<!-- Dropdown -->
						<div class="flex w-full items-center rounded-lg border px-3 py-1">
							<select
								name="Keterangan"
								id=""
								value="Keterangan"
								class="w-full bg-transparent p-2 focus:outline-none"
							>
								<option value="Keterangan">Keterangan</option>
								<option value="Sekarang">Sekarang</option>
								<option value="Bulan Lalu">Bulan Lalu</option>
								<option value="Minggu Ini">Minggu Ini</option>
							</select>
						</div>
					</div>
				</div>
				<div class=" mt-4 h-64 w-auto overflow-y-auto rounded-lg">
					{#each events as e}
						<Items {...e}></Items>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
<Footer></Footer>
{#if open}
	<Bracode bind:value={open}></Bracode>
{/if}
{#if success}
	<SuccessModal text="Berhasil Logout!"></SuccessModal>
{/if}
