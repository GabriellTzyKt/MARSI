<script lang="ts">
	import DropDown from '$lib/dropdown/DropDown.svelte';
	import { dummyAcara, dummyAnggota, dummyBukuTamu } from '$lib/dummy';
	import TambahKunjungan from '$lib/popup/TambahKunjungan.svelte';
	import Search from '$lib/table/Search.svelte';
	import Status from '$lib/table/Status.svelte';
	import Table from '$lib/table/Table.svelte';

	let count = $state(1);
	let id = $state(1);
	let showModal = $state(false);

	function increment() {
		count += 1;
		id += 1;
		showModal = true;
	}

	function OpenModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		count = 1;
	}

	function hapus() {
		count -= 1;
	}
</script>

<div class="flex w-full flex-col">
	<div class=" flex flex-col xl:flex-row xl:justify-between">
		<button class="bg-badran-bt rounded-lg px-3 py-2 text-white" onclick={OpenModal}
			>+Tambah Kunjungan</button
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
				['id_kunjungan', 'Id Kunjungan'],
				['nama_pengunjung', 'Nama Pengunjung'],
				['tanggal', 'Tanggal'],
				['no_telepon', 'Nomer Telepon'],
				['keterangan', 'Keterangan'],
				['children', 'Status'],
				['children', 'Aksi']
			]}
			table_data={dummyBukuTamu}
		>
			{#snippet children({ header, data, index })}
				{#if header === 'Aksi'}
					<DropDown
						text={`Apakah yakin ingin mengarsipkan ${data.nama_acara}?`}
						successText={`Berhasil mengarsipkan ${data.nama_acara}!`}
						link="/abdi/dashboard/situs/bukutamu"
						items={[['Detail', `/abdi/dashboard/situs/detail`]]}
						id={`id-${index}`}
						{data}
					></DropDown>
				{:else if header === 'Status'}
					<Status status={data.status}></Status>
				{/if}
			{/snippet}
		</Table>
	</div>
</div>
{#if showModal}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="max-h-[90vh] w-[70%] overflow-y-auto rounded-lg bg-white p-5 shadow-lg">
			<div class="flex justify-between">
				<h2 class="text-xl font-bold">Tambah Kunjungan</h2>
				<!-- svelte-ignore a11y_consider_explicit_label -->
				<button onclick={closeModal}>
					<span class="carbon--close-outline"></span>
				</button>
			</div>
			<button
				class="ml-auto mt-4 flex w-fit items-end justify-end rounded-lg bg-blue-600 p-2 px-3 text-white"
				onclick={increment}
			>
				Tambah Kunjungan
			</button>

			{#each Array(count) as _, id}
				<div class="relative flex lg:h-fit h-full flex-col justify-between">
					<TambahKunjungan id={id + 1}></TambahKunjungan>
					<div class="mx-auto mb-5 flex h-full items-center">
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button onclick={hapus}>
							<span
								class="absolute flex h-10 w-10 items-center justify-center rounded-lg bg-red-400 p-2 bottom-8 right-2 lg:right-12 lg:top-1/2"
							>
								<i class="gg--trash z-10 items-center text-2xl text-white"></i>
							</span>
						</button>
					</div>
				</div>
			{/each}

			<button
				class="ml-auto mt-3 flex w-fit items-end rounded-lg bg-green-500 p-2 px-8 py-2 text-white"
				onclick={closeModal}
			>
				Tambah Data
			</button>
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

	.gg--trash {
		display: inline-block;
		width: 48px;
		height: 48px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cg fill='%23fff6f6'%3E%3Cpath fill-rule='evenodd' d='M17 5V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1H4a1 1 0 0 0 0 2h1v11a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V7h1a1 1 0 1 0 0-2zm-2-1H9v1h6zm2 3H7v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1z' clip-rule='evenodd'/%3E%3Cpath d='M9 9h2v8H9zm4 0h2v8h-2z'/%3E%3C/g%3E%3C/svg%3E");
	}
</style>
