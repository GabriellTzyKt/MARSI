<script lang="ts">
	import gambartemp from '$lib/asset/kerajaan/gambar_temp.jpg';
	import gambardefault from '$lib/asset/kerajaan/default.jpg';
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { enhance } from '$app/forms';
	import Loader from '$lib/loader/Loader.svelte';
	import { navigating } from '$app/state';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';
	import { Item } from '@radix-ui/react-dropdown-menu';
	// Get data from server
	let { data } = $props();
	let users = data?.users || [];
	let situsTypes = data?.situsTypes || [];
	let wisata = data?.wisata || [];
	let situs = data?.situs || {};
	console.log('data situs : ', situs);
	console.log('Data jenis_situs', situsTypes);
	let open = $state(false);
	let timer: number;
	let errors = $state();
	let loading = $state(false);
	let success = $state(false);

	// Profile picture handling
	let pictUrl = $state(
		situs.imageUrls && situs.imageUrls.length > 0 ? situs.imageUrls[0] : gambardefault
	);
	let pictUrlFiles = $state(null);

	function handleFiles(event) {
		const input = event.target;
		if (input.files && input.files[0]) {
			const file = input.files[0];
			pictUrlFiles = file;
			pictUrl = URL.createObjectURL(file);
		}
	}
	function searchUser(searchTerm: string) {
		return users.filter((item) => item?.name.toLowerCase().includes(searchTerm.toLowerCase()));
	}
	// User selection for pembina and pelindung
	let pembinaSearchTerm = $state(situs?.pembina || '');
	let pelindungSearchTerm = $state(situs?.pelindung || '');
	let selectedPembina = $state(searchUser(situs?.pembina) || null);
	let selectedPelindung = $state(searchUser(situs?.pelindung) || null);
	let showPembinaDropdown = $state(false);
	let showPelindungDropdown = $state(false);
	let showJuruKunciDropdown = $state(false);
	let selectedJuruKunci = $state(searchUser(situs?.juru_kunci) || null);
	let juruKunciSearchTerm = $state(situs?.juru_kunci || '');
	let find = situsTypes.find((item) => item.id === situs?.id_jenis_situs);
	let situsSearchTerm = $state(find?.name || '');
	console.log('find', find);
	let selectedSitus = $state(find || null);
	let showSitusDropdown = $state(false);

	// Filter users based on search term
	function filterUser(searchTerm: string) {
		return users.filter(
			(item) => item?.name.toLowerCase().includes(searchTerm.toLowerCase()) || ''
		);
	}

	function filterSitus(searchTerm: string) {
		return situsTypes.filter(
			(item) => item?.name.toLowerCase().includes(searchTerm.toLowerCase()) || ''
		);
	}
	let wisataSearchTerm = $state(wisata.find((item) => item.id == situs.id_wisata)?.name || '');
	let selectedWisata = $state(wisata.find((item) => item.id == situs.id_wisata) || null);
	let filteredWisata = $derived(filterWisata(wisataSearchTerm));
	let showWisataDropdown = $state(false);

	function filterWisata(searchTerm: string) {
		return wisata.filter(
			(item) => item?.name.toLowerCase().includes(searchTerm.toLowerCase()) || ''
		);
	}

	function selectWisata(wisata: any) {
		selectedWisata = wisata;
		wisataSearchTerm = wisata.name;
		showWisataDropdown = false;
	}
	let filteredPelindungUsers = $derived(filterUser(pelindungSearchTerm));
	let filteredPembinaUsers = $derived(filterUser(pembinaSearchTerm));
	let filteredJuruKunciUsers = $derived(filterUser(juruKunciSearchTerm));
	let filteredSitus = $derived(filterSitus(situsSearchTerm));

	// Select user functions
	function selectPembina(user: any) {
		selectedPembina = user;
		pembinaSearchTerm = user.name;
		showPembinaDropdown = false;
	}

	function selectPelindung(user: any) {
		selectedPelindung = user;
		pelindungSearchTerm = user.name;
		showPelindungDropdown = false;
	}

	function selectJuruKunci(user: any) {
		selectedJuruKunci = user;
		juruKunciSearchTerm = user.name;
		showJuruKunciDropdown = false;
	}

	function selectSitus(situs: any) {
		selectedSitus = situs;
		situsSearchTerm = situs.name;
		showSitusDropdown = false;
	}

	// Form submission handler
	function handleSubmit(event) {
		// Add form data validation here if needed
		const form = event.target;
		const formData = new FormData(form);

		// Ensure pembina and pelindung IDs are set
		if (selectedPembina) {
			formData.set('pembina', selectedPembina.id);
		}

		if (selectedPelindung) {
			formData.set('pelindung', selectedPelindung.id);
		}

		if (selectedJuruKunci) {
			formData.set('juru_kunci', selectedJuruKunci.id);
		}

		if (selectedSitus) {
			formData.set('jenis_situs', selectedSitus.id);
		}

		// Add profile picture if selected
		if (pictUrlFiles) {
			formData.set('profile_picture', pictUrlFiles);
		}

		// Continue with form submission
		return true;
	}

	// Location search functionality
	let results = writable<string[]>([]);
	let showDropdown = writable(false);
	let alamat = $state(situs.alamat || '');
	let locationsData: any[] = [];
	let lat = $state(situs.latitude || '');
	let long = $state(situs.longitude || '');
	let selectedLocation: any = $state('');
	let isSearching = $state(false);
	const API_KEY = 'pk.def50126ee21d7c7b667386e05fc8bcb'; // LocationIQ API key

	async function searchLocations() {
		if (!alamat.trim() || alamat.length < 3) {
			results.set([]);
			showDropdown.set(false);
			return;
		}

		isSearching = true;
		const url = `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(alamat)}&format=json&limit=5`;

		try {
			const res = await fetch(url);
			const data = await res.json();

			if (data && Array.isArray(data)) {
				locationsData = data; // Store all location data
				const extractedNames = data.map((item: any) => item.display_name);

				results.set(extractedNames);
				showDropdown.set(extractedNames.length > 0);
			}
		} catch (error) {
			console.error('Error fetching location data:', error);
		} finally {
			isSearching = false;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault(); // Prevent form submission
			searchLocations();
		}
	}

	function selectLocation(name: string) {
		alamat = name;
		results.set([]);
		showDropdown.set(false);

		// Find latitude and longitude based on selected location name
		selectedLocation = locationsData.find((item) => item.display_name === name);
		if (selectedLocation) {
			lat = selectedLocation.lat;
			long = selectedLocation.lon;
			console.log('Latitude:', lat, 'Longitude:', long);
		} else {
			console.log('Coordinates not found.');
		}
	}

	// Clean up object URLs when component is destroyed
	onMount(() => {
		return () => {
			if (pictUrl && pictUrl !== gambardefault) {
				URL.revokeObjectURL(pictUrl);
			}
		};
	});
</script>

{#if loading}
	<Loader></Loader>
{/if}
{#if navigating.to}
	<Loader text="Navigating..."></Loader>
{/if}
<div class="h-full w-full">
	<form
		action="?/editSitus"
		method="post"
		enctype="multipart/form-data"
		use:enhance={() => {
			loading = true;
			return async ({ result, update }) => {
				loading = false;
				if (result.type === 'success') {
					open = true;
					clearTimeout(timer);
					timer = setTimeout(() => {
						open = false;
						goto('/abdi/sekretariat/situs');
					}, 3000);
				}
				if (result.type === 'failure') {
					errors = result.data?.errors;
				}
			};
		}}
	>
		<input type="text" hidden name="id_situs" id="" value={situs.id_situs} />
		<div class="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2">
			<!-- 1 -->
			<div>
				<div class="relative mx-auto mb-4 flex w-full items-center justify-center">
					<div class="relative flex">
						<img
							src={pictUrl}
							class="h-24 w-24 rounded-full sm:h-28 sm:w-28 md:h-36 md:w-36"
							alt="Profile"
						/>
						<!-- Tombol Edit Foto -->
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label
							class="absolute bottom-0 right-0 cursor-pointer rounded-xl bg-white p-2 shadow-md hover:bg-gray-100"
						>
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
									d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
								/>
							</svg>
							<input
								type="file"
								hidden
								name="profile_picture"
								accept="image/*"
								onchange={handleFiles}
							/>
						</label>
					</div>
				</div>

				<div>
					<p>Nama Situs:</p>
					<div class="relative">
						<input
							type="text"
							name="nama_situs"
							value={situs.nama_situs || '-'}
							placeholder="Masukkan Nama Situs"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
					</div>
					{#if errors}
						{#each errors.nama_situs as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>

				<div>
					<p class="mt-5">Alamat:</p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Alamat"
							name="alamat"
							bind:value={alamat}
							onkeydown={handleKeyDown}
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
						/>
						<!-- svelte-ignore a11y_consider_explicit_label -->
						<button
							type="button"
							onclick={searchLocations}
							class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								class="size-5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
								/>
							</svg>
						</button>

						<!-- Hidden inputs for latitude and longitude -->
						<input type="hidden" name="latitude" bind:value={lat} />
						<input type="hidden" name="longitude" bind:value={long} />
					</div>
					<!-- Location dropdown -->
					{#if $showDropdown}
						<div class="relative">
							<ul
								class="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg"
							>
								{#each $results as location}
									<!-- svelte-ignore a11y_click_events_have_key_events -->
									<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
									<li
										class="cursor-pointer px-3 py-2 hover:bg-gray-100"
										onclick={() => selectLocation(location)}
									>
										{location}
									</li>
								{/each}
							</ul>
						</div>
					{/if}

					<p class="mt-1 text-xs text-gray-500">
						Ketik alamat dan tekan Enter atau klik ikon pencarian untuk mencari
					</p>
					{#if errors}
						{#if errors.alamat}
							{#each errors.alamat as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
						{#if errors.latitude}
							{#each errors.latitude as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
						{#if errors.longitude}
							{#each errors.longitude as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					{/if}
				</div>
				{#if lat && long}
					<div class="mt-2 overflow-hidden rounded-lg border border-gray-300">
						<div
							class="flex items-center justify-between bg-gray-100 px-3 py-2 text-sm font-medium"
						>
							<span>Lokasi Terpilih</span>
							<!-- svelte-ignore a11y_consider_explicit_label -->
							<button
								type="button"
								class="text-gray-500 hover:text-red-500"
								onclick={() => {
									lat = '';
									long = '';
									selectedLocation = '';
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="size-4"
								>
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
						<div class="p-3">
							<p class="text-sm text-gray-700">
								<span class="font-medium">Koordinat:</span>
								{lat}, {long}
							</p>
							<div
								class="mt-2 flex h-40 w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50"
							>
								<a
									href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${long}&zoom=15`}
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center gap-2 text-blue-600 hover:text-blue-800"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										class="size-5"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
										/>
									</svg>
									Lihat di OpenStreetMap
								</a>
							</div>
						</div>
					</div>
				{/if}

				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>No telepon :</p>
						<input
							type="text"
							name="phone"
							value={situs.no_telp || '-'}
							placeholder="Masukkan Nomer Telepon"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.phone as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Kepemilikan :</p>
						<input
							type="text"
							name="kepemilikan"
							value={situs.pemilik_situs || '-'}
							placeholder="Masukkan Kepemilikan"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.kepemilikan as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div>
					<p class="mt-5">Deskripsi Situs:</p>
					<div class="relative w-full">
						<textarea
							placeholder="Masukkan Deskripsi Situs"
							name="deskripsi_situs"
							value={situs.deskripsi_situs || '-'}
							class="mt-2 h-32 w-full resize-none rounded-md border-2 px-3 py-3 text-lg"
						></textarea>
						<div class="h-full">
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
					</div>
					{#if errors}
						{#each errors.deskripsi_situs as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
			</div>

			<!-- 2 -->
			<div>
				<div class="mt-5">
					<p>Juru Kunci:</p>
					<div class="relative">
						<input
							type="text"
							placeholder="Masukkan Juru Kunci"
							bind:value={juruKunciSearchTerm}
							onfocus={() => (showJuruKunciDropdown = true)}
							onblur={() => {
								// Delay hiding dropdown to allow for click
								setTimeout(() => {
									showJuruKunciDropdown = false;
								}, 200);
							}}
							class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
						/>
						<input type="hidden" name="juru_kunci" value={selectedJuruKunci?.name || ''} />

						{#if showJuruKunciDropdown && filteredJuruKunciUsers.length > 0}
							<div class="absolute z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
								<ul class="max-h-60 overflow-y-auto">
									{#each filteredJuruKunciUsers as user}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
										<li
											class="cursor-pointer px-3 py-2 hover:bg-gray-100"
											onclick={() => selectJuruKunci(user)}
										>
											<div class="flex flex-col">
												<span class="font-medium">{user.name}</span>
												<span class="text-sm text-gray-500">{user.email}</span>
											</div>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
					{#if errors}
						{#each errors.juru_kunci as e}
							<p class="text-left text-red-500">- {e}</p>
						{/each}
					{/if}
				</div>
				<div class="flexcoba mt-5 flex gap-6">
					<div class="w-full">
						<p>Dibangun Oleh :</p>
						<input
							type="text"
							value={situs.nama_pendiri || '-'}
							placeholder="Masukkan nama"
							name="dibangun_oleh"
							class="border-blackpx-2 mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.dibangun_oleh as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Tahun Berdiri :</p>
						<input
							value={situs.tahun_berdiri || '-'}
							type="text"
							placeholder="Masukkan Tahun"
							name="tahun_berdiri"
							class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
						/>
						{#if errors}
							{#each errors.tahun_berdiri as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
				</div>

				<div class="mt-5 flex w-full gap-6">
					<div class="w-full">
						<p>Pembina :</p>
						<input
							type="text"
							placeholder="Cari pembina..."
							bind:value={pembinaSearchTerm}
							onfocus={() => (showPembinaDropdown = true)}
							onblur={() => {
								// Delay hiding dropdown to allow for click
								setTimeout(() => {
									showPembinaDropdown = false;
								}, 200);
							}}
							class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
						/>
						<input type="hidden" name="pembina" value={selectedPembina?.name || ''} />

						{#if showPembinaDropdown && filteredPembinaUsers.length > 0}
							<div class="absolute z-10 mt-1 rounded-lg border bg-white shadow-lg">
								<ul class="max-h-60 overflow-y-auto">
									{#each filteredPembinaUsers as user}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
										<li
											class="cursor-pointer px-3 py-2 hover:bg-gray-100"
											onclick={() => selectPembina(user)}
										>
											<div class="flex flex-col">
												<span class="font-medium">{user.name}</span>
												<span class="text-sm text-gray-500">{user.email}</span>
											</div>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
						{#if errors}
							{#each errors.pembina as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="w-full">
						<p>Pelindung :</p>
						<input
							type="text"
							placeholder="Cari pelindung..."
							bind:value={pelindungSearchTerm}
							onfocus={() => (showPelindungDropdown = true)}
							onblur={() => {
								// Delay hiding dropdown to allow for click
								setTimeout(() => {
									showPelindungDropdown = false;
								}, 200);
							}}
							class="mt-2 w-full rounded-lg border-2 px-2 py-2 text-start"
						/>
						<input type="hidden" name="pelindung" value={selectedPelindung?.name || ''} />

						{#if showPelindungDropdown && filteredPelindungUsers.length > 0}
							<div class="absolute z-10 mt-1 rounded-lg border bg-white shadow-lg">
								<ul class="max-h-60 overflow-y-auto">
									{#each filteredPelindungUsers as user}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
										<li
											class="cursor-pointer px-3 py-2 hover:bg-gray-100"
											onclick={() => selectPelindung(user)}
										>
											<div class="flex flex-col">
												<span class="font-medium">{user.name}</span>
												<span class="text-sm text-gray-500">{user.email}</span>
											</div>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
						{#if errors}
							{#each errors.pelindung as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
				</div>
				<div class="mt-5 grid w-full grid-cols-1 flex-col gap-4 lg:grid-cols-2">
					<div class="relative col-span-full w-full">
						<p>Jenis Situs:</p>
						<input
							type="text"
							placeholder="Masukkan Jenis Situs"
							bind:value={situsSearchTerm}
							class="mt-2 flex w-full rounded-lg border-2 px-2 py-2 text-start"
							onfocus={() => (showSitusDropdown = true)}
							onblur={() => {
								// Delay hiding dropdown to allow for click
								setTimeout(() => {
									showSitusDropdown = false;
								}, 200);
							}}
						/>

						<input type="hidden" name="jenis_situs" value={selectedSitus?.id || ''} />
						{#if showSitusDropdown && filteredSitus.length > 0}
							<div class="absolute z-10 mt-1 rounded-lg border bg-white shadow-lg">
								<ul class="max-h-60 overflow-y-auto">
									{#each filteredSitus as situs}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
										<li
											class="cursor-pointer px-3 py-2 hover:bg-gray-100"
											onclick={() => selectSitus(situs)}
										>
											<div class="flex flex-col">
												<span class="font-medium">{situs.name}</span>
												<span class="text-sm text-gray-500">{situs.email}</span>
											</div>
										</li>
									{/each}
								</ul>
							</div>
						{/if}

						{#if errors}
							{#each errors.jenis_situs as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
				</div>
				<div class="mt-5">
					<div class="flexcoba mt-5 flex gap-6">
						<div class="w-full">
							<p>Jam Buka :</p>
							<input
								type="time"
								name="jam_buka"
								value={situs.jam_buka || '-'}
								placeholder=""
								class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
							/>
							{#if errors}
								{#each errors.jam_buka as e}
									<p class="text-left text-red-500">- {e}</p>
								{/each}
							{/if}
						</div>
						<div class="w-full">
							<p>Jam Tutup :</p>
							<input
								type="time"
								name="jam_tutup"
								placeholder=""
								value={situs.jam_tutup || '-'}
								class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
							/>
							{#if errors}
								{#each errors.jam_tutup as e}
									<p class="text-left text-red-500">- {e}</p>
								{/each}
							{/if}
						</div>
						<div class="w-full">
							<p>Jumlah Anggota :</p>
							<input
								type="number"
								name="jumlah_anggota"
								value={situs.jumlah_anggota || '0'}
								placeholder="Masukkan Jumlah anggota"
								class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
							/>
							{#if errors}
								{#each errors.jumlah_anggota as e}
									<p class="text-left text-red-500">- {e}</p>
								{/each}
							{/if}
						</div>
					</div>

					<div>
						<p>Email:</p>
						<div class="relative">
							<input
								type="email"
								name="email"
								value={situs.email || '-'}
								placeholder="Masukkan Email"
								class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2"
							/>
							<span class="raphael--edit absolute right-2 top-1 mt-2.5 opacity-45"></span>
						</div>
						{#if errors}
							{#each errors.email as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
					<div class="mt-3">
						<p>Wisata:</p>
						<div class="relative">
							<input
								type="text"
								name="wisata"
								bind:value={wisataSearchTerm}
								onfocus={() => (showWisataDropdown = true)}
								onblur={() => {
									// Delay hiding dropdown to allow for click
									setTimeout(() => {
										showWisataDropdown = false;
									}, 200);
								}}
								placeholder="Masukkan Pembina"
								class="mt-2 w-full rounded-lg border-2 border-black px-2 py-2 text-start"
							/>
						</div>
						<input type="text" hidden name="id_wisata" value={selectedWisata?.id || ''} />
						{#if showWisataDropdown && filteredWisata.length > 0}
							<div class="absolute z-10 mt-1 rounded-lg border bg-white shadow-lg">
								<ul class="max-h-60 overflow-y-auto">
									{#each filteredWisata as wisataItem}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
										<li
											class="cursor-pointer px-3 py-2 hover:bg-gray-100"
											onclick={() => selectWisata(wisataItem)}
										>
											<div class="flex flex-col">
												<span class="font-medium">{wisataItem.name}</span>
												<span class="text-sm text-gray-500">{wisataItem.email}</span>
											</div>
										</li>
									{/each}
								</ul>
							</div>
						{/if}
						{#if errors}
							{#each errors.wisata as e}
								<p class="text-left text-red-500">- {e}</p>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<div class="relative flex w-full justify-center lg:justify-end">
				<button
					class="w-50 t-0 mt-10 rounded-lg border-2 border-black bg-green-500 px-2 py-2 text-white"
					type="submit">Simpan Data</button
				>
			</div>
		</div>
	</form>
</div>
{#if open}
	<SuccessModal text="Situs Berhasil Diedit"></SuccessModal>
{/if}

<style>
	@media (max-width: 768px) {
		.flexcoba {
			flex-direction: column;
		}
	}

	.raphael--edit {
		display: inline-block;
		width: 28px;
		height: 28px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23a59494' d='M27.87 7.863L23.024 4.82l-7.89 12.566l4.843 3.04zM14.395 21.25l-.107 2.855l2.527-1.337l2.35-1.24l-4.673-2.936zM29.163 3.24L26.63 1.647a1.364 1.364 0 0 0-1.88.43l-1 1.588l4.843 3.042l1-1.586c.4-.64.21-1.483-.43-1.883zm-3.965 23.82c0 .275-.225.5-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5h13.244l1.884-3H5.698c-1.93 0-3.5 1.57-3.5 3.5v19c0 1.93 1.57 3.5 3.5 3.5h19c1.93 0 3.5-1.57 3.5-3.5V11.097l-3 4.776v11.19z'/%3E%3C/svg%3E");
	}

	.mdi--edit {
		display: inline-block;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z'/%3E%3C/svg%3E");
	}
</style>
