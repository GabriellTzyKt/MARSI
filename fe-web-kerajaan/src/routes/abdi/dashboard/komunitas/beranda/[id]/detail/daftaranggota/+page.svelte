<script lang="ts">
	import { enhance } from '$app/forms';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyAnggota } from '$lib/dummy';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import TambahAnggota from '$lib/popup/TambahAnggota.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import { fade } from 'svelte/transition';
	let { data } = $props();
	let dataambil = data.komunitasList;
	console.log("komunitas : ", dataambil);
	let dataanggota = data.allAnggota;
	console.log("anggota : ", dataanggota)

	let open = $state(false);
	let valo = $state(false);
	let error = $state();
	let data2 = $state();

	let timer : any;

	let toggle = () => {
		if (!open) {
			open = true;
		} else open = false;
		console.log(open);
	};
</script>

<div class="flex w-full flex-col">
	<div class="flex flex-col xl:flex-row xl:justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white hover:cursor-pointer"
			onclick={toggle}>+Tambah Data</button
		>
		<div class="mt-4 flex items-center justify-center gap-2 xl:mt-0 xl:justify-start">
			<!-- select -->
			<select
				name="Organisasi"
				id=""
				value="Organisasi"
				placeholder="cari organisasi"
				class="rounded-md border px-3 py-2 focus:outline-none"
			>
				<option value="organisasi">Organisasi</option>
				<option value="Komunitas">Komunitas</option>
				<option value="Abdi">Abdi</option>
				<option value="organisasi">Organisasi</option>
			</select>
			<!-- cari -->
			<div class="flex items-center rounded-lg border px-2">
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
			<div><p>Show</p></div>
			<div>
				<input
					type="number"
					class="w-12 rounded-md border py-2 text-center focus:outline-none"
					value="8"
					name=""
					id=""
				/>
			</div>
			<div>
				<p>entries</p>
			</div>
		</div>
	</div>
	<div class="flex w-full">
		<Table
			table_header={[
				['id_user', 'Id Anggota'],
				['nama_anggota', 'Nama Anggota'], // blom
				['tanggal_bergabung', 'Tanggal Bergabung'],
				['jabatan_anggota', 'Jabatan Organisasi'],
				['nomor_telepon', 'Nomer Telpon'], // blom
				['email', 'Email'], // blom
				['children', 'Aksi']
			]}
			table_data={dataanggota}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text="Apakah yakin ingin di arsip?"
						successText=""
						link="/abdi/dashboard/komunitas/detail/daftaranggota"
						id={`id-${index}`}
						{data}
						items={[
							['Ubah', '/abdi/dashboard/komunitas/detail/daftaranggota/edit'],
							['children', 'non-aktifkan', '/abdi/dashboard/komunitas/daftaranggota']
						]}
					></DropDown>
				{/if}
			{/snippet}
		</Table>
	</div>
</div>
{#if open}
	<form
		action="?/tambah"
		method="post"
		use:enhance={() => {
			return async ({ result }) => {
				console.log(result)
				if (result.type === 'success') {
					valo = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						valo = false;
					}, 3000);
					open = false;
				} else if (result.type === 'failure') {
					error = result.data?.errors || '';
				}
			};
		}}
	>
		<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
			<TambahAnggota bind:value={open} bind:open={valo} errors={error} {data2} {dataambil}
			></TambahAnggota>
		</div>
	</form>
{/if}
{#if valo}
	<SuccessModal text="Anggota berhasil Ditambah!"></SuccessModal>
{/if}
