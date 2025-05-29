<script lang="ts">
	import SekreAbdiInput from '$lib/input/SekreAbdiInput.svelte';
	import { slide } from 'svelte/transition';

	let { nama = null, anggotaData, penghargaanData, acara, index, errors = null } = $props();

	let drop = $state(false);
	const togle = () => {
		if (!drop) {
			drop = true;
		} else drop = false;
		console.log(drop);
	};
	console.log('Anggota : ', anggotaData);
	console.log('acara : ', acara);

	let abdiKeyword = $state('');
	let selectedAbdi = $state(null);
	let showAbdiDropdown = $state(false);
	let filteredAbdi = $derived(filterUser(abdiKeyword));

	let acaraKeyword = $state('');
	let selectedAcara = $state(null);
	let showAcaraDropdown = $state(false);
	let filteredAcara = $derived(filteracara(acaraKeyword));

	let pemberiKeyword = $state('');
	let selectedPemberi = $state(null); // Assuming Pemberi is also an Anggota type
	let showPemberiDropdown = $state(false);
	let filteredPemberi = $derived(filterUser(pemberiKeyword)); // Uses filterUser

	let penghargaanKeyword = $state('');
	let selectedPenghargaan = $state(null);
	let showPenghargaanDropdown = $state(false);
	let filteredPenghargaan = $derived(filterPenghargaan(penghargaanKeyword));

	function filterUser(key: string) {
		if (!anggotaData) return [];
		return anggotaData.filter((v) => v.nama_lengkap.toLowerCase().includes(key.toLowerCase()));
	}
	function filteracara(key: string) {
		if (!acara) return [];
		return acara.filter((v) => v.nama_acara.toLowerCase().includes(key.toLowerCase()));
	}

	function filterPenghargaan(key: string) {
		if (!penghargaanData) return [];
		return penghargaanData.filter((v) =>
			v.nama_penghargaan.toLowerCase().includes(key.toLowerCase())
		);
	}

	function selectAbdi(user) {
		selectedAbdi = user;
		abdiKeyword = user.nama_lengkap;
		showAbdiDropdown = false;
		console.log('Selected Abdi:', selectedAbdi);
	}
	function selectAcara(user) {
		selectedAcara = user;
		acaraKeyword = user.nama_acara;
		showAcaraDropdown = false;
		console.log('Selected Acara:', selectedAcara);
	}
	function selectPenghargaan(user) {
		selectedPenghargaan = user;
		penghargaanKeyword = user.nama_penghargaan;
		showPenghargaanDropdown = false;
		console.log('Selected Penghargaan:', selectedPenghargaan);
	}
	function selectPemberi(user) {
		selectedPemberi = user;
		pemberiKeyword = user.nama_lengkap;
		showPemberiDropdown = false;
		console.log('Selected Pemberi:', selectedPemberi);
	}

	let fileName = $state('');
	let imagePreview: string | null = $state(null);

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (file) {
			fileName = file.name;

			if (file.type.startsWith('image/')) {
				imagePreview = URL.createObjectURL(file);
			} else {
				imagePreview = null;
			}
		}
	}

	// Helper function to get error message for a specific field
	function getErrorMessage(fieldName: string): string | null {
		if (!errors) return null;

		const error = errors.find((e) => e.path[0] === index && e.path[1] === fieldName);
		return error ? error.message : null;
	}
</script>

<!-- abdi yang akan dilantik -->
<div class="bg-badran/60 mx-3 mb-3 flex flex-col rounded-xl pb-3">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="bg-badran/80 flex cursor-pointer rounded-t-xl py-3" onclick={togle}>
		<p class="ms-3 text-gray-200">{nama}</p>
	</div>
	{#if drop}
		<!-- nama abdi/ id abdi -->
		<div
			class="mx-3 mt-3 grid grid-cols-1 gap-4 lg:grid-cols-4"
			transition:slide={{ duration: 150 }}
		>
			<!-- nama abdi/ id abdi -->
			<div class="relative col-span-1 flex w-full flex-col lg:col-span-1">
				<div class="flex w-full justify-between rounded-md border border-gray-600 bg-white">
					<input
						type="text"
						bind:value={abdiKeyword}
						onfocus={() => {
							showAbdiDropdown = true;
						}}
						onblur={() => {
							setTimeout(() => {
								showAbdiDropdown = false;
							}, 200);
						}}
						placeholder="Nama Abdi/ID Abdi"
						class="w-full rounded-lg py-2 pe-2 ps-2 focus:outline-none"
						id=""
					/>
					<div class="me-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class=" size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</div>
				</div>
				<input
					type="text"
					hidden
					name={`abdi[${index}][abdi_id]`}
					value={selectedAbdi?.id_anggota}
				/>
				{#if showAbdiDropdown && filteredAbdi.length > 0}
					<div class="absolute top-full z-10 mt-1 rounded-lg border bg-white shadow-lg">
						<ul class="max-h-60 overflow-y-auto">
							{#each filteredAbdi as user}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<li
									class="cursor-pointer px-3 py-2 hover:bg-gray-100"
									onclick={() => selectAbdi(user)}
								>
									<ul class="flex flex-col">
										<span class="font-medium">{user.nama_lengkap}</span>
										<span class="text-sm text-gray-500">{user.email}</span>
									</ul>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if getErrorMessage('abdi_id')}
					<p class="text-sm text-red-500">{getErrorMessage('abdi_id')}</p>
				{/if}
			</div>

			<!-- nama Acara -->
			<div class="relative col-span-1 flex w-full flex-col lg:col-span-1">
				<div class=" flex w-full justify-between rounded-md border border-gray-600 bg-white">
					<input
						type="text"
						placeholder="Nama Acara"
						bind:value={acaraKeyword}
						onfocus={() => {
							showAcaraDropdown = true;
						}}
						onblur={() => {
							setTimeout(() => {
								showAcaraDropdown = false;
							}, 200);
						}}
						class="w-full rounded-lg py-2 pe-2 ps-2 focus:outline-none"
						id=""
					/>
					<div class="me-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class=" size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</div>
				</div>
				<input
					type="text"
					hidden
					name={`abdi[${index}][acara_id]`}
					value={selectedAcara?.id_acara}
				/>
				{#if showAcaraDropdown && filteredAcara.length > 0}
					<div class="absolute top-full z-10 mt-1 rounded-lg border bg-white shadow-lg">
						<ul class="max-h-50 overflow-y-auto">
							{#each filteredAcara as user}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<li
									class="cursor-pointer px-3 py-2 hover:bg-gray-100"
									onclick={() => selectAcara(user)}
								>
									<ul class="flex flex-col">
										<span class="font-medium">{user.nama_acara}</span>
										<span class="text-sm text-gray-500">{user.kapasitas_acara}</span>
									</ul>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if getErrorMessage('acara_id')}
					<p class="text-sm text-red-500">{getErrorMessage('acara_id')}</p>
				{/if}
			</div>
			<!-- Dilantik Siapa -->
			<div class="relative col-span-1 flex w-full flex-col lg:col-span-1">
				<div class="flex w-full justify-between rounded-md border border-gray-600 bg-white">
					<input
						type="text"
						bind:value={pemberiKeyword}
						onfocus={() => {
							showPemberiDropdown = true;
						}}
						onblur={() => {
							setTimeout(() => {
								showPemberiDropdown = false;
							}, 200);
						}}
						placeholder="Diberi oleh siapa"
						class="w-full rounded-lg py-2 pe-2 ps-2 focus:outline-none"
						id=""
					/>
					<div class="me-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class=" size-6"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</div>
				</div>
				<input
					type="text"
					hidden
					name={`abdi[${index}][pemberi_id]`}
					value={selectedPemberi?.id_anggota}
				/>
				{#if showPemberiDropdown && filteredPemberi.length > 0}
					<div class="absolute top-full z-10 mt-1 rounded-lg border bg-white shadow-lg">
						<ul class="max-h-50 overflow-y-auto">
							{#each filteredPemberi as user}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<li
									class="cursor-pointer px-3 py-2 hover:bg-gray-100"
									onclick={() => selectPemberi(user)}
								>
									<ul class="flex flex-col">
										<span class="font-medium">{user.nama_lengkap}</span>
										<span class="text-sm text-gray-500">{user.email}</span>
									</ul>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if getErrorMessage('pemberi_id')}
					<p class="text-sm text-red-500">{getErrorMessage('pemberi_id')}</p>
				{/if}
			</div>

			<!-- bukti pelantikan -->
			<div class="col-span-1 flex w-full flex-col lg:col-span-1">
				<div class="flex w-full justify-between rounded-md border border-gray-600 bg-white">
					<input
						type="text"
						readonly
						name="bukti_bintang_jasa"
						placeholder="Bukti Gelar"
						class="w-full rounded-lg py-2 pe-2 ps-2 focus:outline-none"
						bind:value={fileName}
					/>

					<div class="me-2 flex items-center">
						<label for={`fileInput-${index}`} class="cursor-pointer">
							{#if imagePreview}
								<img src={imagePreview} alt="preview" class="h-6 w-6 rounded object-fill" />
							{:else}
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
										d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
									/>
								</svg>
							{/if}
						</label>

						<input
							type="file"
							name={`abdi[${index}][bukti_bintang_jasa]`}
							id={`fileInput-${index}`}
							accept="image/*"
							class="hidden"
							onchange={handleFileChange}
						/>
					</div>
				</div>
				{#if getErrorMessage('bukti_bintang_jasa')}
					<p class="text-sm text-red-500">{getErrorMessage('bukti_bintang_jasa')}</p>
				{/if}
			</div>

			<!-- 
			<SekreAbdiInput span="1" placeholder="Nama Abdi/ID Abdi"></SekreAbdiInput>
			<SekreAbdiInput span="1" placeholder="Nama Acara"></SekreAbdiInput>
			<SekreAbdiInput span="1" placeholder="Dilantik oleh Siapa"></SekreAbdiInput>
			<SekreAbdiInput span="1" placeholder="Bukti Pelantikan" img={true}></SekreAbdiInput>
			<SekreAbdiInput span="1" placeholder="Nama Abdi Dalam yang lama"></SekreAbdiInput>
			<SekreAbdiInput span="2" placeholder="Nama Abdi Dalam yang baru"></SekreAbdiInput>
			<SekreAbdiInput span="1" placeholder="Nama Gelar" gelar={true}></SekreAbdiInput> -->
		</div>
		<div class="relative me-3 ms-3 mt-3 grid grid-cols-2 gap-4">
			<!-- nama bintang jasa-->
			<div class="col-span-1 flex w-full flex-col lg:col-span-1">
				<div class="flex w-full justify-between rounded-md border border-gray-600 bg-white">
					<input
						type="text"
						onfocus={() => {
							showPenghargaanDropdown = true;
						}}
						onblur={() => {
							setTimeout(() => {
								showPenghargaanDropdown = false;
							}, 200);
						}}
						bind:value={penghargaanKeyword}
						placeholder="Nama Bintang Jasa"
						class="w-full rounded-lg py-2 pe-2 ps-2 focus:outline-none"
						id=""
					/>
				</div>
				<input
					type="text"
					hidden
					name={`abdi[${index}][penghargaan_id]`}
					value={selectedPenghargaan?.id_penghargaan}
				/>
				{#if showPenghargaanDropdown && filteredPenghargaan.length > 0}
					<div class="absolute top-full z-10 mt-1 rounded-lg border bg-white shadow-lg">
						<ul class="max-h-50 overflow-y-auto">
							{#each filteredPenghargaan as user}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<li
									class="cursor-pointer px-3 py-2 hover:bg-gray-100"
									onclick={() => selectPenghargaan(user)}
								>
									<ul class="flex flex-col">
										<span class="font-medium">{user.nama_penghargaan}</span>
										<span class="text-sm text-gray-500">{user.tingkat_penghargaan}</span>
									</ul>
								</li>
							{/each}
						</ul>
					</div>
				{/if}
				{#if getErrorMessage('penghargaan_id')}
					<p class="text-sm text-red-500">{getErrorMessage('penghargaan_id')}</p>
				{/if}
			</div>
			<!-- keterangan gelar-->
			<div class="col-span-1 flex w-full flex-col lg:col-span-1">
				<div class="flex w-full justify-between rounded-md border border-gray-600 bg-white">
					<input
						type="text"
						name={`abdi[${index}][keterangan]`}
						placeholder="Keterangan Bintang Jasa"
						class="w-full rounded-lg py-2 pe-2 ps-2 focus:outline-none"
						id=""
					/>
				</div>
				{#if getErrorMessage('keterangan')}
					<p class="text-sm text-red-500">{getErrorMessage('keterangan')}</p>
				{/if}
			</div>
			<!-- Gelar -->
		</div>
	{/if}
</div>
