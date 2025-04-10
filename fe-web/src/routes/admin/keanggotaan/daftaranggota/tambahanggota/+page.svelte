<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { navigating } from '$app/state';
	import Loader from '$lib/loader/Loader.svelte';
	import SModal from '$lib/popup/SModal.svelte';

	import SucessModal from '$lib/popup/SucessModal.svelte';
	import { writable } from 'svelte/store';

	let results = writable<string[]>([]);
	let showDropdown = writable(false);
	let lokasi = $state(' ');
	let locationsData: any[] = [];
	let lat: any = $state('');
	let long: any = $state('');
	let selectedLocation: any = $state('');
	const API_KEY = 'pk.def50126ee21d7c7b667386e05fc8bcb';
	async function fetchLocations() {
		if (!lokasi.trim()) return; // Cegah pencarian kosong

		const url = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(lokasi)}&format=json&limit=5`;

		try {
			const res = await fetch(url);
			const data = await res.json();

			if (data && Array.isArray(data)) {
				locationsData = data; // Simpan semua data lokasi
				const extractedNames = data.map((item: any) => item.display_name);

				results.set(extractedNames);
				showDropdown.set(extractedNames.length > 0);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		}
	}
	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			fetchLocations();
		}
	}

	function selectLocation(name: string) {
		lokasi = name;
		results.set([]);
		showDropdown.set(false);

		// Cari latitude dan longitude berdasarkan nama lokasi yang dipilih
		selectedLocation = locationsData.find((item) => item.display_name === name);
		if (selectedLocation) {
			lat = selectedLocation.lat;
			long = selectedLocation.lon;
			console.log('Latitude:', lat, 'Longitude:', long);
		} else {
			console.log('Koordinat tidak ditemukan.');
		}
	}

	let success = $state(false);
	let timer: number;
	let loading = $state(false);
	let errors = $state();
	let request = $state();
</script>

<div class="test mx-4 flex w-full flex-col">
	<div class=" flex flex-row items-center">
		<a href="/admin/keanggotaan/daftaranggota" class="flex self-end text-2xl underline">⭠ Kembali</a
		>
	</div>

	<div class="my-4 flex">
		<p class=" text-3xl font-[600]">Form Pendaftaran Kerajaan</p>
	</div>
	<div class=" flex flex-col">
		<form
			method="post"
			action="?/tambah"
			use:enhance={() => {
				loading = true;
				return async ({ result }) => {
					loading = false;
					if (result.type === 'success') {
						errors = null;
						invalidateAll();
						success = true;
						clearTimeout(timer);
						timer = setTimeout(() => {
							success = false;

							goto('/admin/keanggotaan/daftaranggota');
						}, 3000);
					}
					if (result.type === 'failure') {
						errors = result.data?.errors;
						request = result.data?.request;
						console.log(errors);
					}
				};
			}}
		>
			<div class=" flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Nama Kerajaan</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="nama"
					name="nama_kerajaan"
					placeholder="John Doe"
				/>
				{#if errors}
					{#each errors.nama_kerajaan as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
			<div class="relative mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="alamat_kerajaan">Alamat Kerajaan</label>
				<input
					class="input-field rounded-lg border p-2"
					type="text"
					id="alamat_kerajaan"
					name="alamat_kerajaan"
					placeholder="alamat..."
					bind:value={lokasi}
					onkeydown={handleKeyDown}
				/>
				<input type="hidden" name="long" bind:value={long} />
				<input type="hidden" name="lat" bind:value={lat} />
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				{#if $showDropdown && lokasi !== ''}
					<ul class="dropdown">
						{#each $results as name}
							<li onclick={() => selectLocation(name)}>{name}</li>
						{/each}
					</ul>
				{/if}
				{#if errors}
					{#each errors.alamat_kerajaan as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<div class=" mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="flex flex-col">
					<p class="text-md mb-1 self-start text-left">Tanggal Berdiri</p>
					<input
						class="input-field rounded-lg border p-2"
						type="date"
						id="nama"
						name="tanggal_berdiri"
						placeholder="azaza@gmail.com"
					/>
					{#if errors}
						{#each errors.tanggal_berdiri as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
				<div class="flex flex-col">
					<p class="text-md mb-1 self-start text-left">Era Kerajaan</p>
					<input
						class="input-field rounded-lg border p-2"
						type="text"
						id="nama"
						name="era_kerajaan"
						placeholder="era.."
					/>
					{#if errors}
						{#each errors.era_kerajaan as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
				<div class="flex flex-col">
					<p class="text-md mb-1 self-start text-left">Rumpun Kerajaan</p>
					<input
						class="input-field rounded-lg border p-2"
						type="text"
						id="nama"
						name="rumpun_kerajaan"
						placeholder="rumpun..."
					/>
					{#if errors}
						{#each errors.rumpun_kerajaan as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
				<div class="flex flex-col">
					<p class="text-md mb-1 self-start text-left">Jenis Kerajaan</p>
					<input
						class="input-field rounded-lg border p-2"
						type="text"
						id="nama"
						name="jenis_kerajaan"
						placeholder="jenis..."
					/>
					{#if errors}
						{#each errors.jenis_kerajaan as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>

				<div class="flex flex-col md:col-span-2">
					<p class="text-md mb-1 self-start text-left">Nama Raja Sekarang</p>
					<input
						class="input-field rounded-lg border p-2"
						type="text"
						id="nama"
						name="raja_sekarang"
						placeholder="raja..."
					/>
					{#if errors}
						{#each errors.raja_sekarang as e}
							<p class="text-left text-red-500">{e}</p>
						{/each}
					{/if}
				</div>
			</div>

			<div class=" mt-2 flex flex-col gap-1">
				<label class="text-md self-start text-left" for="nama">Deskripsi Kerajaan</label>
				<textarea
					class="input-field rounded-lg border p-2"
					id="nama"
					name="deskripsi_kerajaan"
					placeholder="deskripsi..."
					rows="7"
				></textarea>
				{#if errors}
					{#each errors.deskripsi_kerajaan as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
			<div class=" mt-2 flex flex-col gap-1">
				<button
					class="custom-button bg-customYellow w-40 self-end text-right {loading ? 'disabled' : ''}"
					type="submit"
				>
					{loading ? 'Memuat...' : 'Tambah Data'}
				</button>
			</div>
			<div>
				{#if request}
					<p class="text-left text-red-500 underline">{request}</p>
				{/if}
			</div>
		</form>
	</div>
</div>

{#if loading}
	<Loader></Loader>
{/if}
{#if success}
	<SModal text="Berhasil ditambah"></SModal>
{/if}

<style>
	.custom-button {
		border: none;
		padding: 10px;
		margin-left: 20px;
		margin-top: 20px;
		text-align: center;
		color: white;
		font-size: 16px;
		border-radius: 10px;
		box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}

	@media (max-width: 768px) {
		.test {
			margin-top: 90px;
		}
	}
	.dropdown {
		position: absolute;
		background: white;
		border: 1px solid #ccc;
		top: 100%;
		max-height: 150px;
		overflow-y: auto;
		border-radius: 5px;
	}
	.dropdown li {
		padding: 8px;
		cursor: pointer;
	}
	.dropdown li:hover {
		background: #f0f0f0;
	}
</style>
