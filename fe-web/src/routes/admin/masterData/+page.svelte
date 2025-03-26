<script lang="ts">
	import { enhance } from '$app/forms';
	import { dummyGelar, dummyJenisKerajaan, dummyDokumen, dummyRoleAdmin } from '$lib/dummy';
	import Table from '$lib/table/Table.svelte';
	import CustomBtn from './CustomBtn.svelte';
	let opt = ['Gelar', 'Jenis Kerajaan', 'Dokumen', 'Role Admin'];
	let { data } = $props();
	const data_role = data.role;
	let success = $state(false);
	let namagelar = $state('');
	let timer: number;
	let error: any = $state('');

	let namagelartemp: any = $state('');
	let daftarGelar: any = $state([]);

	function tambahGelar() {
		if (namagelar.trim() !== '') {
			daftarGelar = [...daftarGelar, namagelar.trim()];
			namagelar = ''; // Reset input setelah ditambahkan
		}
	}

	function hapusGelar(index: number) {
		daftarGelar = daftarGelar.filter((_: any, i: number) => i !== index);
	}

	let select = $state('Gelar');
	let openmodaltambah = $state(false);
	let openmodaledit = $state(false);
	function change(p: string) {
		select = p;
	}

	function closeModal() {
		if (openmodaltambah === true) {
			openmodaltambah = false;
		}
		if (openmodaledit === true) {
			openmodaledit = false;
		}
	}
</script>

<div class="flex w-full flex-col gap-4 xl:mx-4">
	<div class="flex flex-col justify-center gap-2 xl:flex-row xl:justify-between xl:gap-0">
		<div class="flex flex-col justify-center gap-4 xl:flex-row xl:justify-start">
			{#each opt as o}
				<div class="flex flex-col">
					<button
						class=" w-full min-w-[200px] rounded-md border border-[#FFA600] py-2 font-[700] transition-colors duration-100 ease-in-out hover:bg-[#FFA600] hover:text-white"
						class:bg-[#FFA600]={select === o}
						class:text-white={select === o}
						onclick={() => change(o)}
						>{o}
					</button>
				</div>
			{/each}

			<!-- <div class="flex flex-row gap-4">
				<button
					class=" w-full min-w-[200px] rounded-md border border-[#FFA600] py-2 font-[700] transition-colors duration-100 ease-in-out hover:bg-[#FFA600] hover:text-white"
					>Jenis Kerajaan</button
				>
			</div>
			<div class="flex flex-row gap-4">
				<button
					class="  w-full min-w-[200px] rounded-md border border-[#FFA600] py-2 font-[700] transition-colors duration-100 ease-in-out hover:bg-[#FFA600] hover:text-white"
					>Dokumen</button
				>
			</div>
			<div class="flex flex-row gap-4">
				<button
					class="  w-full min-w-[200px] rounded-md border border-[#FFA600] py-2 font-[700] transition-colors duration-100 ease-in-out hover:bg-[#FFA600] hover:text-white"
					>Role Admin</button
				>
			</div> -->
		</div>
		<div class="flex items-center justify-center">
			<button
				class="border-md w-full rounded-md border bg-[#FFA600] px-6 py-2 font-[700] text-white xl:w-auto"
				type="button"
				onclick={() => (openmodaltambah = true)}>+ Tambah Data</button
			>
		</div>
	</div>
	<div class="h-[2px] w-full bg-[#949494]"></div>
	<div class="flex flex-col items-center justify-center gap-3 xl:flex-row xl:justify-end">
		<div class="flex justify-between gap-3 rounded-lg border border-[#818181] bg-white">
			<div class="ms-2 flex grow">
				<input
					type="text"
					class="border-none focus:outline-none focus:ring-0"
					placeholder={`cari ${select}`}
					name=""
					id=""
				/>
			</div>
			<div class="me-2 flex items-center">
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
			</div>
		</div>
		<div class="flex items-center gap-3">
			<p>Show</p>
			<input
				type="number"
				class="flex w-16 justify-center rounded-lg border border-[#818181] bg-white focus:outline-none"
				name=""
				id=""
			/>
			<p>entries</p>
		</div>
	</div>
	<div>
		{#if select === 'Gelar'}
			<Table
				table_header={[
					['gelar', 'Gelar', 'justify-start flex grow'],
					['children', 'Aksi', 'text-right pe-48']
				]}
				table_data={dummyGelar}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<CustomBtn></CustomBtn>
					{/if}
				{/snippet}
			</Table>
		{:else if select === 'Jenis Kerajaan'}
			<Table
				table_header={[
					['jenis', 'Jenis Kerajaan', 'justify-start flex grow'],
					['children', 'Aksi', 'text-right pe-48']
				]}
				table_data={dummyJenisKerajaan}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<CustomBtn></CustomBtn>
					{/if}
				{/snippet}
			</Table>
		{:else if select === 'Dokumen'}
			<Table
				table_header={[
					['nama', 'Nama Dokumen', 'justify-start flex grow'],
					['children', 'Aksi', 'text-right pe-48']
				]}
				table_data={dummyDokumen}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<CustomBtn></CustomBtn>
					{/if}
				{/snippet}
			</Table>
		{:else if select === 'Role Admin'}
			{#if !data_role}
				<p>Loading...</p>
			{:else}
				<Table
					table_header={[
						['nama_role', 'Role', 'justify-start flex grow'],
						['children', 'Aksi', 'text-right pe-48']
					]}
					table_data={data_role}
				>
					{#snippet children({ header, data, index })}
						{#if header === 'Aksi'}
							<CustomBtn></CustomBtn>
						{/if}
					{/snippet}
				</Table>
			{/if}
		{/if}
	</div>
</div>

{#if openmodaltambah}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-[70%] overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
			<form
				method="post"
				action="?/tambah"
				use:enhance={() => {
					return async ({ result }) => {
						console.log(result);
						if (result.type === 'success') {
							success = true;
							clearTimeout(timer);
							timer = setTimeout(() => {
								success = false;
								openmodaltambah = false;
							}, 3000);
						} else if (result.type === 'failure') {
							error = result?.data?.errors;
						}
					};
				}}
			>
				<div class="flex justify-between">
					<h2 class="font-bold lg:text-xl">Tambah Data</h2>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button onclick={closeModal}>
						<span class="carbon--close-outline items-center"></span>
					</button>
				</div>
				<div class="h-1 bg-gray-300"></div>
				<div class="mt-5 flex flex-col">
					<label for="gelar">Nama Gelar:</label>
					<div class="relative w-full">
						<input
							id="gelar"
							name="namagelar"
							bind:value={namagelar}
							class="w-full rounded-lg border px-3 py-2 pr-12"
							placeholder="Masukkan Gelar"
						/>
						<button
							class="absolute bottom-0 right-0 top-0 h-full rounded-r-lg bg-yellow-500 px-8 text-white"
							onclick={tambahGelar}
							type="button"
						>
							Add
						</button>
					</div>

					{#if daftarGelar.length > 0}
						<div class="w-full overflow-x-auto">
							<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
								{#each daftarGelar as gelar, index}
									<div class="mt-3 flex items-center justify-between rounded-lg border p-3">
										<p class="w-full max-w-[200px] truncate break-words">
											{gelar}
										</p>
										<!-- svelte-ignore a11y_consider_explicit_label -->
										<button class="text-red-500" onclick={() => hapusGelar(index)}>
											<span class="carbon--close-outline2 ml-2 items-center"></span>
										</button>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<div class="flex w-full justify-end">
						<button class="mt-12 w-fit rounded-lg bg-yellow-600 px-5 py-3 text-white">
							Simpan data
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if openmodaledit}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-[70%] overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
			<form
				method="post"
				action="?/tambah"
				use:enhance={() => {
					return async ({ result }) => {
						console.log(result);
						if (result.type === 'success') {
							success = true;
							clearTimeout(timer);
							timer = setTimeout(() => {
								success = false;
								openmodaltambah = false;
							}, 3000);
						} else if (result.type === 'failure') {
							error = result?.data?.errors;
						}
					};
				}}
			>
				<div class="flex justify-between">
					<h2 class="font-bold lg:text-xl">Edit Anggota</h2>
					<!-- svelte-ignore a11y_consider_explicit_label -->
					<button onclick={closeModal}>
						<span class="carbon--close-outline items-center"></span>
					</button>
				</div>
				<div class="h-1 bg-gray-300"></div>
				<div class="mt-5 flex flex-col">
					<label for="gelar"> Nama Gelar : </label>
					<div class="relative w-full">
						<input
							id="gelar"
							class="w-full rounded-lg border px-3 py-2 pr-12"
							placeholder="Masukkan Gelar"
						/>
					</div>
					<div class="flex w-full justify-end">
						<button class="mt-12 w-fit rounded-lg bg-yellow-600 px-5 py-3 text-white">
							Simpan data
						</button>
					</div>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.carbon--close-outline {
		display: inline-block;
		width: 24px;
		height: 24px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23bba5a5' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12'/%3E%3Cpath fill='%23bba5a5' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");
	}

	.carbon--close-outline2 {
		display: inline-block;
		width: 12px;
		height: 12px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23bba5a5' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12'/%3E%3Cpath fill='%23bba5a5' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");
	}
</style>
