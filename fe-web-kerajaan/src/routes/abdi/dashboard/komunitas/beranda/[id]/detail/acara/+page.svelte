<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import DropDown from '$lib/dropdown/DropDown.svelte';

	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';

	let { data } = $props();

	let idAktif = $state("")
	$effect(() => {
		idAktif = page.params.id;
	});
	
	// Transformasi data untuk format yang dibutuhkan Table
	let dataambil = $state(
		data.allAcara.map((item : any) => {
			// Jika data memiliki struktur nested dengan Acara
			if (item.Acara) {
				return {
					...item.Acara,
					alamats : item.alamat,
					id_komunitas: item.id_komunitas
				};
			}
			// Jika data sudah dalam format yang benar
			return item;
		})
	);
	
	console.log("Data yang diproses:", dataambil);
</script>

<div class="flex w-full flex-col">
	<div class="mx-10 flex justify-between">
		<button
			class="bg-badran-bt rounded-lg px-3 py-2 text-white"
			onclick={() => goto('/abdi/dashboard/komunitas/detail/acara/buat')}>+Tambah Data</button
		>
		<div class="flex items-center gap-2">
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
	<div class="mx-10 flex">
		<Table
			table_header={[
				['id_acara', 'Id Acara'],
				['nama_acara', 'Nama Acara'],
				['waktu_mulai', 'Tanggal Acara'],
				['alamats', 'Lokasi'],
				['id_penanggung_jawab', 'Penanggung Jawab'],
				['jenis_acara', 'Jenis Acara'],
				['kapasitas_acara', 'Kapasitas'],
				['children', 'Status'],
				['children', 'Aksi']
			]}
			table_data={dataambil}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text=" apa yakin mau menghapus acara ini?"
						successText="berhasil diarsip"
						link="/abdi/dashboard/komunitas/detail/acara"
						items={[
							['Detail', '/abdi/dashboard/komunitas/detail/acara/detail'],
							['Ubah', '/abdi/dashboard/komunitas/detail/acara/edit'],
							['Laporan', '/abdi/dashboard/komunitas/detail/acara/laporan'],
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
		</Table>
	</div>
</div>
