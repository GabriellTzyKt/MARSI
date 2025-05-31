<script lang="ts">
	import xbutton from '../asset/icon/xbutton.png';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let {
		value = $bindable(),
		errors = null,
		data2 = null,
		dataEdit = null,
		allanggota = [] // Provide default empty array
	} = $props();

	console.log('ini data2 : ', data2);
	console.log('ini data edit : ', dataEdit);
	console.log('Data anggota : ', allanggota);

	let keyword = $state(dataEdit ? dataEdit.nama_anggota : '');
	let showDropdown = $state(false);
	let selectedUserId = $state(dataEdit ? dataEdit.id_user : ''); // Store the selected user's ID
	let isValidSelection = $state(false); // Track if the current selection is valid

	function handleClose() {
		console.log('TambahAnggota close button clicked');
		value = false;
		dispatch('close');
	}

	function updateFilteredData() {
		// Check if allanggota exists and is an array
		if (!allanggota || !Array.isArray(allanggota) || !keyword || !keyword.trim()) {
			return [];
		}

		return allanggota.filter((v: any) => {
			// Check if nama_lengkap exists before calling toLowerCase()
			if (v && v.nama_lengkap) {
				return v.nama_lengkap.toLowerCase().includes(keyword.toLowerCase());
			}
			return false;
		});
	}

	function selectItem(item: any) {
		if (item && item.nama_lengkap) {
			keyword = item.nama_lengkap;
			selectedUserId = item.id || item.id_user || ''; // Store the selected user's ID, default to empty string
			showDropdown = false;
			isValidSelection = true; // Mark as valid when selected from dropdown
		}
	}

	// Validate if the current input matches any user in the list
	function validateSelection() {
		if (!keyword || !keyword.trim()) {
			isValidSelection = false;
			selectedUserId = '';
			return;
		}

		// Check if the current keyword exactly matches any user's name
		const matchedUser = allanggota.find(
			(user: any) => user.nama_lengkap && user.nama_lengkap.toLowerCase() === keyword.toLowerCase()
		);

		if (matchedUser) {
			isValidSelection = true;
			selectedUserId = matchedUser.id || matchedUser.id_user || '';
		} else {
			isValidSelection = false;
			selectedUserId = '';
		}
	}

	// Validate on blur
	function handleBlur() {
		// Small delay to allow click events on dropdown items to complete
		setTimeout(() => {
			validateSelection();
			showDropdown = false;
		}, 200);
	}

	// Validate before form submission
	$effect(() => {
		validateSelection();

		if (!isValidSelection) {
			// Prevent form submission if selection is invalid

			// Add custom error
			if (!errors) errors = {};
			if (!errors.namaanggota) errors.namaanggota = [];
			errors.namaanggota = ['Pilih nama anggota dari daftar yang tersedia'];
		} else {
			// Remove custom error if selection is valid

			errors = null;
		}
	});
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
	<div class="w-full max-w-3xl rounded-lg bg-white p-6">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold">Tambah Anggota</h2>
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button type="button" class="text-gray-500 hover:text-gray-700" onclick={handleClose}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
		</div>

		<p class="ml-5 mt-5">Nama Anggota</p>
		<div class="relative ml-5 w-[90%]">
			<input
				type="text"
				bind:value={keyword}
				placeholder="Nama Anggota"
				name="namaanggota"
				class="w-full rounded-lg border-2 {isValidSelection
					? 'border-green-400'
					: 'border-gray-400'} px-2 py-2 pr-8"
				readonly={dataEdit ? true : false}
				onfocus={() => (showDropdown = true)}
				onblur={() => handleBlur()}
			/>
			<!-- Hidden input to store the selected user ID -->
			<input type="hidden" name="id_user" value={selectedUserId || ''} />

			{#if showDropdown && updateFilteredData().length > 0}
				<ul
					class="absolute z-10 max-h-40 w-full overflow-y-auto rounded-lg border border-gray-400 bg-white shadow-lg"
				>
					{#each updateFilteredData() as item}
						<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
						<li class="cursor-pointer px-4 py-2 hover:bg-gray-200" onclick={() => selectItem(item)}>
							{item.nama_lengkap}
						</li>
					{/each}
				</ul>
			{/if}
			<!-- <input type="hidden" name="id_anggota" value={selectedUserId} /> -->
			<span class="icon-park-twotone--search absolute right-2 mt-2.5 opacity-55"> </span>
		</div>
		{#if !isValidSelection && keyword !== ''}
			<p class="ml-5 text-left text-yellow-500">Pilih nama dari daftar yang tersedia</p>
		{/if}
		{#if errors}
			{#each errors.namaanggota || [] as a}
				<p class="ml-5 text-left text-red-500">{a}</p>
			{/each}
			{#each errors.id_user || [] as a}
				<p class="ml-5 text-left text-red-500">{a}</p>
			{/each}
		{/if}

		<p class="ml-5 mt-5">Deskripsi Tugas</p>
		<div class="relative ml-5 w-[90%]">
			<textarea
				placeholder="Deskripsi Tugas"
				name="deskripsitugas"
				class="w-full rounded-lg border-2 border-gray-400 px-2 py-2 pr-8"
				value={dataEdit ? dataEdit.deskripsi_tugas : ''}
			></textarea>
		</div>
		{#if errors}
			{#each errors.deskripsi || [] as a}
				<p class="ml-5 text-left text-red-500">{a}</p>
			{/each}
		{/if}

		<p class="ml-5 mt-5">Pilih Jabatan</p>
		<div class="relative ml-5 w-[90%]">
			<select
				id="jabatan"
				name="jabatan"
				value={dataEdit ? dataEdit.jabatan_anggota : ''}
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-sm text-gray-900"
			>
				<option selected disabled>Pilih Jabatan</option>
				<option value="Ketua">Ketua</option>
				<option value="Wakil Ketua">Wakil Ketua</option>
				<option value="Sekretaris">Sekretaris</option>
				<option value="Bendahara">Bendahara</option>
				<option value="Anggota">Anggota</option>
			</select>
		</div>
		{#if errors}
			{#each errors.jabatan || [] as a}
				<p class="ml-5 text-left text-red-500">{a}</p>
			{/each}
		{/if}

		<div class="mt-4 flex justify-end">
			<button type="button" class="mr-2 rounded-lg bg-gray-200 px-4 py-2" onclick={handleClose}>
				Batal
			</button>
			<button type="submit" class="rounded-lg bg-blue-500 px-4 py-2 text-white">
				{dataEdit ? 'Simpan Perubahan' : 'Tambah Anggota'}
			</button>
		</div>
	</div>
</div>

<style>
	.icon-park-twotone--search {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cmask id='ipTSearch0'%3E%3Cg fill='none' stroke='%23fff' stroke-linejoin='round' stroke-width='4'%3E%3Cpath fill='%23555555' d='M21 38c9.389 0 17-7.611 17-17S30.389 4 21 4S4 11.611 4 21s7.611 17 17 17Z'/%3E%3Cpath stroke-linecap='round' d='M26.657 14.343A7.98 7.98 0 0 0 21 12a7.98 7.98 0 0 0-5.657 2.343m17.879 18.879l8.485 8.485'/%3E%3C/g%3E%3C/mask%3E%3C/defs%3E%3Cpath fill='%23000' d='M0 0h48v48H0z' mask='url(%23ipTSearch0)'/%3E%3C/svg%3E");
	}
</style>
