<script lang="ts">
	import { goto } from '$app/navigation';
	import SuccessModal from '$lib/modal/SuccessModal.svelte';
	import { fade } from 'svelte/transition';
	let {
		value = $bindable(),
		data = $bindable(),
		userData = null,
		text = '',
		successText = '',
		errors = $bindable(),
		dataEdit = null,
		editmode = $bindable(false),
		dataAcara = null
	} = $props();

	let total = $state(8);
	console.log('data Situs: ', data);
	console.log('data Acara: ', dataAcara);
	console.log('USer Daat', userData);
	let open = $state(false);
	let findNamaSitus = data.filter((item: any) => item?.id_situs == Number(dataEdit?.lokasi_tugas));
	console.log('Fiound,', findNamaSitus);
	let namaSitus = $state<any>(findNamaSitus?.length > 0 ? findNamaSitus[0]?.nama_situs : '');
	console.log(namaSitus);
	let timer: number;
	let jenisTugas = $state('');
	let showDropdown = $state(false);
	let today = $state(String(new Date().toISOString().split('T')[0]));
	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		if (open) {
			timer = setTimeout(() => {
				open = false;
				value = false;
				goto('/abdi/sekretariat/tugas');
			});
		}
	}

	let selectedKeterkaitan = $state<any>(null);
	// console.log('selectedKeterkaitan', selectedKeterkaitan);
	let selectedUserKeyword = $state(dataEdit ? dataEdit.pemberi_tugas : '');
	let selecteduser: any = $state(
		dataEdit ? userData.find((user) => user.id == dataEdit.id_pemberi_tugas) : null
	);
	let dropDownPemberiTugas = $state(false);
	let filteredPemberitugas = $derived(filterUser(selectedUserKeyword));

	let selectedAnggotaDitugaskanKeyWord = $state(dataEdit ? dataEdit.penerima_tugas : '');
	let filteredAnggotaDitugaskan = $derived(filterUser(selectedAnggotaDitugaskanKeyWord));
	let dropDownAnggotaDitugaskan = $state(false);
	let selectedAnggotaDitugaskan = $state(
		dataEdit ? userData.find((user) => user.id == dataEdit.id_penerima_tugas) : null
	);

	let selectedAcara = $state(
		dataEdit?.id_acara ? dataAcara.find((acara) => acara.id == dataEdit.id_acara)?.name : ''
	);
	// console.log('selectedAcara', selectedAcara);
	let filteredAcara = $derived(filterAcara(selectedAcara));
	let dropDownAcara = $state(false);
	let selectedAcaraData = $state(
		dataEdit?.id_acara ? dataAcara.find((acara) => acara.id == dataEdit.id_acara) : null
	);

	function filterAcara(acara: any) {
		return dataAcara.filter((item: any) => item.name.toLowerCase().includes(acara.toLowerCase()));
	}

	function filterUser(user) {
		return userData.filter((item) => {
			// Check if item and item.name exist before calling toLowerCase()
			const itemName = item?.name ?? ''; // Use empty string if name is undefined or null
			const userFilter = user ?? ''; // Use empty string if user is undefined or null
			return itemName.toLowerCase().includes(userFilter.toLowerCase());
		});
	}
	function selectPemberiTugas(user: any) {
		selecteduser = user;
		selectedUserKeyword = user.name;
		dropDownPemberiTugas = false;
	}
	function selectAnggotaDitugaskan(user: any) {
		selectedAnggotaDitugaskan = user;
		selectedAnggotaDitugaskanKeyWord = user.name;
		dropDownAnggotaDitugaskan = false;
	}
	function selectAcara(acara: any) {
		selectedAcaraData = acara;
		selectedAcara = acara.name;
		dropDownAcara = false;
	}
	function filter(data: any[]) {
		return data.filter((item) => item?.nama_situs?.toLowerCase().includes(namaSitus.toLowerCase()));
	}
	let searchRes = $derived(filter(data));

	function selectKeterkaitan(value: any) {
		namaSitus = value.nama_situs;
		selectedKeterkaitan = value;
		showDropdown = false;
	}
</script>

<div
	class="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black/75"
	transition:fade={{ duration: 100 }}
>
	<div
		class="relative flex max-h-[500px] w-full max-w-[600px] flex-col overflow-auto rounded-lg border bg-white p-6"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute right-0 top-0 me-4 mt-7 cursor-pointer p-2"
			onclick={() => {
				value = false;
				errors = null;
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="size-8"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
			</svg>
		</div>
		<div class="my-4 flex justify-self-start">
			<p class=" text-xl font-[500]">{text}</p>
		</div>
		<div class="relative flex w-full flex-col">
			<div>
				<p class="text-sm">Pemberi Tugas</p>
			</div>
			<!-- Pemberi Tugas -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="text"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="Jane Doe"
						id=""
						name="pemberi_tugas"
						bind:value={selectedUserKeyword}
						onfocus={() => (dropDownPemberiTugas = true)}
						onblur={() => {
							// Delay hiding dropdown to allow for click
							setTimeout(() => {
								dropDownPemberiTugas = false;
							}, 200);
						}}
					/>
				</div>
				<div class="me-2 ms-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="gray"
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
			<input type="text" name="id_pemberi" hidden value={selecteduser?.id || ''} id="" />
			{#if dropDownPemberiTugas && filteredPemberitugas.length > 0}
				<div class="absolute top-full z-50 mt-1 w-full rounded-lg border bg-white shadow-lg">
					<ul class="max-h-60 overflow-y-auto">
						{#each filteredPemberitugas as user}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
							<li
								class="cursor-pointer px-3 py-2 hover:bg-gray-100"
								onclick={() => selectPemberiTugas(user)}
							>
								<div class="flex flex-col">
									<span class="font-medium">{user.name}</span>
									<span class="text-sm text-gray-500">{user.email}</span>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<p class="text-left text-red-500">
					{filteredPemberitugas.length >= 0 ? '' : 'Pemberi Tugas Tidak Ditemukan'}
				</p>
			{/if}
			{#if errors}
				{#each errors.pemberi_tugas as e}
					<p class="text-left text-red-500">{e}</p>
				{/each}
			{/if}
		</div>
		<div class="mt-2 flex w-full flex-col">
			<div>
				<p class="text-sm">Nama Tugas</p>
			</div>
			<!-- nama Tugas -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="text"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="Jane Doe"
						name="nama_tugas"
						value={dataEdit?.nama_tugas || ''}
						autocorrect="off"
						id=""
					/>
				</div>
				<div class="me-2 ms-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="gray"
						class="size-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
						/>
					</svg>
				</div>
			</div>
			{#if errors}
				{#each errors.nama_tugas as e}
					<p class="text-left text-red-500">{e}</p>
				{/each}
			{/if}
		</div>
		<div class="mt-2 flex w-full flex-col">
			<div>
				<p class="text-sm">Tanggal Penugasan</p>
			</div>
			<!-- Anggota yang ditugaskan -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="date"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="13-12-2001"
						name="tanggal_penugasan"
						value={dataEdit?.tanggal_mulai || today}
						id=""
					/>
				</div>
			</div>
			{#if errors}
				{#each errors.tanggal_penugasan as e}
					<p class="text-left text-red-500">{e}</p>
				{/each}
			{/if}
		</div>
		<div class="relative mt-2 flex w-full flex-col">
			<div>
				<p class="text-sm">Anggota yang Ditugaskan</p>
			</div>
			<!-- nama Tugas -->
			<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
				<div class="grow">
					<input
						type="text"
						name="anggota_yg_ditugaskan"
						class="my-2 w-full pe-2 ps-2 focus:outline-none"
						placeholder="Jane Doe"
						bind:value={selectedAnggotaDitugaskanKeyWord}
						onfocus={() => (dropDownAnggotaDitugaskan = true)}
						onblur={() => {
							// Delay hiding dropdown to allow for click
							setTimeout(() => {
								dropDownAnggotaDitugaskan = false;
							}, 200);
						}}
						id=""
					/>
				</div>
				<div class="me-2 ms-2 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="gray"
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
			<input
				type="text"
				name="id_ditugaskan"
				hidden
				value={selectedAnggotaDitugaskan?.id || ''}
				id=""
			/>
			{#if dropDownAnggotaDitugaskan && filteredAnggotaDitugaskan.length > 0}
				<div class="absolute top-full z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
					<ul class="max-h-60 overflow-y-auto">
						{#each filteredAnggotaDitugaskan as user}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
							<li
								class="cursor-pointer px-3 py-2 hover:bg-gray-100"
								onclick={() => selectAnggotaDitugaskan(user)}
							>
								<div class="flex flex-col">
									<span class="font-medium">{user.name}</span>
									<span class="text-sm text-gray-500">{user.email}</span>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			{:else if filteredAnggotaDitugaskan.length === 0}
				<p class="text-left text-red-500">Anggota Tidak Ditemukan</p>
			{/if}
			{#if errors}
				{#each errors.anggota_yg_ditugaskan as e}
					<p class="text-left text-red-500">{e}</p>
				{/each}
			{/if}
		</div>

		<div class="flex-col">
			<label for="tugas">Jenis Tugas</label>

			<select
				name="jenis_tugas"
				id="jenis_tugas"
				bind:value={jenisTugas}
				class="w-full rounded-lg border-2 border-black px-2 py-2"
			>
				<option disabled value=""> Pilih Jenis! </option>
				<option value="pribadi" selected>Tugas Pribadi</option>
				<option value="acara">Tugas Acara</option>
			</select>
		</div>
		{#if errors}
			{#each errors.jenis_tugas as e}
				<p class="text-left text-red-500">{e}</p>
			{/each}
		{/if}

		{#if jenisTugas === 'pribadi'}
			<div class="mt-2 flex w-full flex-col">
				<div>
					<p class="text-sm">Nama Situs :</p>
				</div>
				<!-- nama Tugas -->
				<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
					<div class="grow">
						<input
							type="text"
							class="my-2 w-full pe-2 ps-2 focus:outline-none"
							placeholder="Jane Doe"
							name="nama_situs"
							autocorrect="off"
							autocomplete="off"
							bind:value={namaSitus}
							id=""
							onfocus={() => (showDropdown = true)}
						/>
					</div>
					<div class="me-2 ms-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="gray"
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
				<input
					type="text"
					name="id_situs"
					hidden
					value={selectedKeterkaitan?.id_situs || ''}
					id=""
				/>
				{#if showDropdown && searchRes.length > 0}
					<ul class="z-10 max-h-40 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						{#each searchRes as item}
							<!-- svelte-ignore a11y_click_events_have_key_events -->
							<li
								class="cursor-pointer p-2 hover:bg-gray-300"
								onclick={() => selectKeterkaitan(item)}
							>
								{item.nama_situs}
							</li>
						{/each}
					</ul>
				{/if}
				{#if errors}
					{#each errors.nama_situs as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<div class="mt-2 flex w-full flex-col">
				<div>
					<p class="text-sm">Deskripsi Tugas</p>
				</div>
				<!-- nama Tugas -->
				<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
					<div class="grow">
						<textarea
							name="deskripsi_tugas"
							class="w-full pe-2 ps-2 pt-2 focus:outline-none"
							placeholder="Deskripsi"
							value={dataEdit?.deskripsi_tugas || ''}
							id=""
							rows="5"
						></textarea>
					</div>
				</div>
				{#if errors}
					{#each errors.deskripsi_tugas as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
		{/if}

		{#if jenisTugas === 'acara'}
			<div class="relative mt-2 flex w-full flex-col">
				<div>
					<p class="text-sm">Nama Acara :</p>
				</div>
				<!-- nama Tugas -->
				<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
					<div class="grow">
						<input
							type="text"
							class="my-2 w-full pe-2 ps-2 focus:outline-none"
							placeholder="Jane Doe"
							bind:value={selectedAcara}
							onfocus={() => (dropDownAcara = true)}
							onblur={() => {
								// Delay hiding dropdown to allow for click
								setTimeout(() => {
									dropDownAcara = false;
								}, 200);
							}}
							id=""
						/>
					</div>
					<div class="me-2 ms-2 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="gray"
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
				<input type="text" name="id_acara" hidden value={selectedAcaraData?.id || ''} id="" />
				{#if dropDownAcara && filteredAcara.length > 0}
					<div class="absolute top-full z-10 mt-1 w-full rounded-lg border bg-white shadow-lg">
						<ul class="max-h-60 overflow-y-auto">
							{#each filteredAcara as acara}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
								<li
									class="cursor-pointer px-3 py-2 hover:bg-gray-100"
									onclick={() => selectAcara(acara)}
								>
									<div class="flex flex-col">
										<span class="font-medium">{acara.name}</span>
										<span class="text-sm text-gray-500">Kapasitas : {acara.kapasitas}</span>
									</div>
								</li>
							{/each}
						</ul>
					</div>
				{:else if filteredAcara.length === 0}
					<p class="text-left text-red-500">Acara Tidak Ditemukan</p>
				{/if}
				{#if errors}
					{#each errors.nama_acara as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>

			<div class="mt-2 flex w-full flex-col">
				<div>
					<p class="text-sm">Deskripsi Tugas</p>
				</div>
				<!-- nama Tugas -->
				<div class="mt-1 flex justify-between rounded-lg border border-gray-700 bg-white">
					<div class="grow">
						<textarea
							name="deskripsi_tugas"
							class="w-full pe-2 ps-2 pt-2 focus:outline-none"
							placeholder="Deskripsi"
							value={dataEdit?.deskripsi_tugas || ''}
							id=""
							rows="5"
						></textarea>
					</div>
				</div>
				{#if errors}
					{#each errors.deskripsi_tugas as e}
						<p class="text-left text-red-500">{e}</p>
					{/each}
				{/if}
			</div>
		{/if}

		<div class="mt-4 flex w-full lg:justify-end">
			<button
				class="w-full cursor-pointer rounded-lg bg-green-500 px-4 py-2 text-white lg:w-auto"
				type="submit">{text}</button
			>
		</div>
	</div>
</div>
{#if open}
	<SuccessModal text={successText}></SuccessModal>
{/if}
