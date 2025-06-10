<script lang="ts">
	import Navbar from '$lib/navbar/Navbar.svelte';
	import jd from '$lib/asset/profile/jdpp.jpg';
	import { accounts, dummyOrganisasi } from '$lib/dummy';
	import Footer from '$lib/footer/Footer.svelte';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import ListOrganisasi from '$lib/input/ListOrganisasi.svelte';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	let { data } = $props();
	let search = $state('');
	let result = $state<any[]>([]);
	let pointer = $state(0); // index of the first visible profile

	function searchAbdi() {
		if (search) {
			result = data.data.filter((item) =>
				item.nama_lengkap.toLowerCase().includes(search.toLowerCase())
			);
			pointer = 0; // reset to first page
		} else {
			alert('Masukkan ID Abdi');
		}
	}

	function slideLeft() {
		if (pointer > 0) pointer -= 1;
	}
	function slideRight() {
		if (pointer < result.length - 3) pointer += 1;
	}
</script>

<Navbar />
{#if navigating.to}
	<Loader text="Navigating..." />
{/if}
<div class="mt-10 text-center">
	<p class="text-2xl font-[500]">Cari Abdi</p>
</div>

<div class="mx-6 mt-8 flex items-center gap-3">
	<div>
		<p>ID Abdi</p>
	</div>
	<div>
		<input
			type="text"
			class="rounded-md border px-3 py-2 shadow-2xl focus:outline-none"
			placeholder="ID abdi"
			bind:value={search}
		/>
	</div>
	<button
		class="bg-badran-bt rounded-xl px-8 py-2 text-white hover:cursor-pointer"
		onclick={searchAbdi}
	>
		Cari
	</button>
</div>

{#if result.length > 0}
	<div class="bg-badran/25 mx-6 mb-6 mt-4 flex rounded-lg p-8">
		{#if result.length > 3 && pointer > 0}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="me-2 flex items-center justify-center hover:cursor-pointer" onclick={slideLeft}>
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
						d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
					/>
				</svg>
			</div>
		{/if}
		<div class="grid w-full grid-cols-1 gap-4 xl:grid-cols-3">
			{#each result.slice(pointer, pointer + 3) as abdi}
				<div class="flex w-full flex-col gap-y-4 rounded-xl bg-white py-4">
					<div class="my-8 flex items-center justify-center">
						<img
							src={abdi?.foto_profile || gambardefault}
							class="h-24 w-auto rounded-full"
							alt=""
						/>
					</div>
					<div class="ms-6 flex flex-col">
						<p class="font-[450] text-gray-400">Nama</p>
						<p class="text-badran/75 text-lg font-[500]">{abdi.nama_lengkap}</p>
					</div>
					<div class="ms-6 flex flex-col">
						<p class="font-[450] text-gray-400">Asma Dalem</p>
						<p class="text-badran/75 text-lg font-[500]">{abdi.panggilan}</p>
					</div>
					<div class="ms-6 flex flex-col">
						<p class="font-[450] text-gray-400">Jenis Kelamin</p>
						<p class="text-badran/75 text-lg font-[500]">{abdi.jenis_kelamin}</p>
					</div>
					<div class="ms-6 flex flex-col">
						<p class="font-[450] text-gray-400">Nomer Telepon</p>
						<p class="text-badran text-lg font-[600]">{abdi.no_telp}</p>
					</div>
					<div class="ms-6 flex flex-col">
						<p class="font-[450] text-gray-400">Jabatan</p>
						<p class="text-badran/75 text-lg font-[500]">{abdi.jabatan}</p>
					</div>
					<div class="ms-6 flex flex-col">
						<p class="font-[450] text-gray-400">Gelar</p>
						<p class="text-badran/75 text-lg font-[500]">{abdi.gelar}</p>
					</div>
				</div>
			{/each}
		</div>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		{#if result.length > 3 && pointer < result.length - 3}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div class="ms-2 flex items-center justify-center hover:cursor-pointer" onclick={slideRight}>
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
						d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
					/>
				</svg>
			</div>
		{/if}
	</div>
{:else}
	<div class="mx-6 mt-8 text-center text-gray-400">Silakan cari Abdi dengan nama atau ID.</div>
{/if}

<Footer />
