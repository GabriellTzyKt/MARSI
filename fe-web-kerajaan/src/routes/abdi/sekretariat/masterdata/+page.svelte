<script lang="ts">
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import {
		dummyGelar,
		dummyBintangJasa,
		dummyJenisSitus,
		dummyPenghargaan,
		dummyKategoriSitus
	} from '$lib/store';

	import TambahKunjungan from '$lib/popup/TambahKunjungan.svelte';
	import TambahMasterData from '$lib/popup/TambahMasterData.svelte';
	import TambahTugas from '$lib/popup/TambahTugas.svelte';

	import Search from '$lib/table/Search.svelte';
	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';
	let open = $state(false);
	let selected = $state('Gelar');
	let button = ['Gelar', 'Bintang Jasa', 'Jenis Situs', 'Kategori Situs', 'Penghargaan'];
	function select(item) {
		selected = item;
	}
	let loading = $state(false);
</script>

{#if loading}
	<Loader></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="flex w-full flex-col">
	<div class="mx-10 my-4 flex flex-col flex-wrap gap-1 md:flex-row">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		{#each button as b}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				class="border-badran-bt flex min-w-40 cursor-pointer justify-center rounded-full border px-4 py-2 text-center transition-all duration-300 ease-in-out hover:text-white {selected ===
				b
					? 'bg-badran-bt text-white'
					: 'hover:bg-badran-bt hover:text-white'}"
				onclick={() => select(b)}
			>
				<p class="">{b}</p>
			</div>
		{/each}
	</div>
	<div class="mx-4 flex flex-col justify-center gap-4 lg:mx-10 lg:flex-row lg:justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white"
			onclick={() => {
				open = true;
			}}>+Tambah Data</button
		>
		<div class="flex flex-col items-center justify-center gap-2 lg:flex-row lg:justify-start">
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
	<div class="mx-4 flex lg:mx-10">
		{#if selected === 'Gelar'}
			<Table
				table_header={[
					['gelar', 'Gelar'],
					['children', 'Aksi']
				]}
				table_data={$dummyGelar}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<DropDown
							text=" apa yakin mau menghapus acara ini?"
							successText="berhasil diarsip"
							link="/abdi/sekretariat/masterdata"
							ubahm="Gelar"
							items={[
								['children', 'Ubah'],
								['children', 'Arsip', '']
							]}
							id={`id-${index}`}
							{data}
						></DropDown>
					{/if}
				{/snippet}
			</Table>
		{:else if selected === 'Bintang Jasa'}
			<Table
				table_header={[
					['nama', 'Bintang Jasa'],
					['children', 'Aksi']
				]}
				table_data={$dummyBintangJasa}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<DropDown
							text=" apa yakin mau mengarsip Bintang Jasa ini?"
							successText="berhasil diarsip"
							ubahm="Bintang Jasa"
							link="/abdi/sekretariat/masterdata"
							items={[
								['children', 'Ubah'],
								['children', 'Arsip', '']
							]}
							id={`id-${index}`}
							{data}
						></DropDown>
					{/if}
				{/snippet}
			</Table>
		{:else if selected === 'Jenis Situs'}
			<Table
				table_header={[
					['jenis', 'Jenis Situs'],
					['children', 'Aksi']
				]}
				table_data={$dummyJenisSitus}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<DropDown
							text=" apa yakin mau mengarsip Bintang Jasa ini?"
							successText="berhasil diarsip"
							ubahm="Jenis Situs"
							link="/abdi/sekretariat/masterdata"
							items={[
								['children', 'Ubah'],
								['children', 'Arsip', '']
							]}
							id={`id-${index}`}
							{data}
						></DropDown>
					{/if}
				{/snippet}
			</Table>
		{:else if selected === 'Kategori Situs'}
			<Table
				table_header={[
					['kategori', 'Kategori Situs'],
					['children', 'Aksi']
				]}
				table_data={$dummyKategoriSitus}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<DropDown
							text=" apa yakin mau mengarsip Bintang Jasa ini?"
							successText="berhasil diarsip"
							ubahm="Kategori Situs"
							link="/abdi/sekretariat/masterdata"
							items={[
								['children', 'Ubah'],
								['children', 'Arsip', '']
							]}
							id={`id-${index}`}
							{data}
						></DropDown>
					{/if}
				{/snippet}
			</Table>
		{:else if selected === 'Penghargaan'}
			<Table
				table_header={[
					['penghargaan', 'Pengharagaan'],
					['children', 'Aksi']
				]}
				table_data={$dummyPenghargaan}
			>
				{#snippet children({ header, data, index })}
					{#if header === 'Aksi'}
						<DropDown
							text=" apa yakin mau mengarsip Bintang Jasa ini?"
							successText="berhasil diarsip"
							link="/abdi/sekretariat/masterdata"
							ubahm="Penghargaan"
							items={[
								['children', 'Ubah'],
								['children', 'Arsip', '']
							]}
							id={`id-${index}`}
							{data}
						></DropDown>
					{/if}
				{/snippet}
			</Table>{/if}
		<!-- <Table
			table_header={[
				['id_tugas', 'Id Tugas'],
				['nama_tugas', 'Nama Tugas'],
				['pemberi_tugas', 'Pemberi Tugas'],
				['anggota_yang_ditugaskan', 'Anggota yang Ditugaskan'],
				['tanggal_pemberian', 'Tanggal Pemberian'],
				['deskripsi_tugas', 'Deskripsi Tugas'],

				['children', 'Status'],
				['children', 'Aksi']
			]}
			table_data={dummyTugas}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text=" apa yakin mau menghapus acara ini?"
						successText="berhasil diarsip"
						link="/abdi/sekretariat/tugas"
						items={[
							['children', 'Bukti', 'Bukti Laporan'],
							['children', 'Ubah', 'Ubah Tugas'],

							['children', 'Arsip', '']
						]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{/if}
				{#if header === 'Status'}
					<Status status={data.status}></Status>
				{/if}
			{/snippet}
		</Table> -->
	</div>
</div>
{#if open}
	<TambahMasterData bind:value={open} text="Tambah Master Data" selectm={selected}
	></TambahMasterData>
{/if}
