<script lang="ts">
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyAnggota } from '$lib/dummy';
	import TambahAnggota from '$lib/popup/TambahAnggota.svelte';
	import Search from '$lib/table/Search.svelte';
	import Table from '$lib/table/Table.svelte';
	import { fade } from 'svelte/transition';
	let open = $state(false);
</script>

<div class="flex w-full flex-col">
	<div class=" flex flex-col xl:flex-row xl:justify-between">
		<button
			class="bg-badran-bt cursor-pointer rounded-lg px-3 py-2 text-white"
			onclick={() => {
				open = true;
			}}>+Tambah Data</button
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
				['id_anggota', 'Id Anggota'],
				['nama_anggota', 'Nama Anggota'],
				['tanggal_bergabung', 'Tanggal Bergabung'],
				['jabatan_organisasi', 'Jabatan Organisasi'],
				['nomor_telepon', 'Nomer Telpon'],
				['email', 'Email'],
				['children', 'Aksi']
			]}
			table_data={dummyAnggota}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text={`Apakah yakin ingin mengarsipkan ${data.nama_anggota}?`}
						successText={`Berhasil mengarsipkan ${data.nama_anggota}!`}
						link="/abdi/sekretariat/organisasi/daftaranggota"
						items={[
							['Edit', '/abdi/sekretariat/organisasi/daftaranggota/edit'],
							['children', 'Non Aktifkan', '']
						]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{/if}
			{/snippet}
		</Table>
	</div>
</div>
{#if open}
	<div in:fade={{ duration: 100 }} out:fade={{ duration: 100 }}>
		<TambahAnggota bind:value={open}></TambahAnggota>
	</div>
{/if}
