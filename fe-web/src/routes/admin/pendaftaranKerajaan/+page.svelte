<script lang="ts">
	import { goto } from '$app/navigation';
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyKerajaan } from '$lib/dummy';
	import Table from '$lib/table/Table.svelte';
</script>

<div class="mx-0 flex w-full flex-col xl:mx-3 xl:gap-4">
	<div
		class="flex flex-col items-center justify-center gap-3 xl:flex-row xl:justify-between xl:gap-0"
	>
		<div class="flex">
			<button
				class="font[600] rounded-md bg-[#F9D48B] px-3 py-2 shadow-lg"
				onclick={() => goto('pendaftaranKerajaan/tambah')}>+Tambah Data</button
			>
		</div>
		<div
			class="grid grid-cols-1 items-center justify-center gap-4 lg:grid-cols-2 xl:items-start xl:justify-start 2xl:grid-cols-4"
		>
			<div class="flex">
				<select
					name="Asal Kerajaan"
					class="flex w-64 rounded-lg border bg-white py-2 focus:outline-none"
					id=""
				>
					<option value="Asal Kerajaan">Asal Kerajaan</option>
				</select>
			</div>
			<div class="flex">
				<select
					name="Jenis Dokumen"
					class="flex w-64 rounded-lg border bg-white py-2 focus:outline-none"
					id=""
				>
					<option value="Jenis Dokumen">Jenis Dokumen</option>
				</select>
			</div>
			<div class="flex">
				<select
					name="Kategori"
					class="flex w-64 rounded-lg border bg-white py-2 focus:outline-none"
					id=""
				>
					<option value="Kategori">Kategori</option>
				</select>
			</div>
			<div class="flex">
				<div class="flex justify-between rounded-lg border border-gray-500 bg-white">
					<div class=" flex grow">
						<input
							type="text"
							placeholder="cari"
							class="rounded-lg border-none py-2 focus:outline-none focus:ring-0"
							name=""
							id=""
						/>
					</div>
					<div class=" me-2 flex items-center">
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
			</div>
		</div>
	</div>
	<div>
		<Table
			table_header={[
				['nama', 'Nama Kerajaan'],
				['lokasi', 'Lokasi Kerajaan'],
				['tanggal_berdiri', 'Tanggal Berdiri'],
				['era', 'Era'],
				['jenis', 'Jenis Kerajaan'],
				['nama_raja', 'Nama Raja Sekarang'],
				['children', 'Dokumentasi'],
				['children', 'Aksi']
			]}
			table_data={dummyKerajaan}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Dokumentasi'}
					<div class="flex max-w-[150px] overflow-x-auto whitespace-nowrap">
						{#each data.dokumentasi as d}
							<div class="flex shrink-0">
								<img src={d} class="h-14 w-auto rounded-xl" alt="" />
							</div>
						{/each}
					</div>
				{/if}
				{#if header === 'Aksi'}
					<DropDown></DropDown>
				{/if}
			{/snippet}
		</Table>
	</div>
</div>
