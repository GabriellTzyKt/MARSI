<script lang="ts">
	import { fade } from 'svelte/transition';
	import xbutton from '../../asset/icons/xbutton.png';
	import SModal from './SModal.svelte';

	let showPassword = $state(false);

	let {
		value = $bindable(),
		textM,
		open = $bindable(),
		errors = null,
		data,
		datakerajaan = null
	} = $props();

	console.log('Errors : ', errors);

	console.log('Modal received data:', data);

	let isRadioYa = $state(false);

	// Inisialisasi formValues dengan data yang diterima
	let formValues = $state({
		id_admin: data?.id_admin || 0,
		id_user: data?.id_user || 0,
		nama_lengkap: data?.nama_lengkap || '',
		username: data?.username || '',
		email: data?.email || '',
		no_telp: data?.no_telp || '',
		password: data?.password || '',
		tgl_lahir: data?.tanggal_lahir ? data.tanggal_lahir.split('T')[0] : '',
		kota_lahir: data?.tempat_lahir || '',
		jenis_kelamin: data?.jenis_kelamin || 'Laki-laki',
		afiliasi: data?.id_kerajaan === 0 ? 'marsi' : data?.id_kerajaan?.toString() || 'marsi',
		admin_role: data?.jenis_admin?.toLowerCase() || 'super admin',
		id_kerajaan: data?.id_kerajaan || 0,
		status_aktif: data?.status_aktif || 0
	});

	// Inisialisasi variabel lain berdasarkan data
	let radioValue = $state(
		formValues.admin_role === 'admin kerajaan' && formValues.afiliasi === 'marsi' ? 'ya' : 'tidak'
	);
	let newafiliasi = $state(formValues.afiliasi);
	let newroleadmin = $state(formValues.admin_role);
	let selectedKerajaanName = $state('');
	// Update isRadioYa berdasarkan radioValue
	// $effect(() => {
	// 	isRadioYa = radioValue === 'ya';
	// });

	$effect(() => {
		if (data && Object.keys(data).length > 0) {
			console.log('Updating form values with data:', data);
			formValues.id_admin = data.id_admin || 0;
			formValues.id_user = data.id_user || 0;
			formValues.nama_lengkap = data.nama_lengkap || '';
			formValues.username = data.username || '';
			formValues.email = data.email || '';
			formValues.no_telp = data.no_telp || '';
			formValues.password = data.password || '';
			formValues.tgl_lahir = data.tanggal_lahir.split('T')[0] || '';
			formValues.kota_lahir = data.tempat_lahir || '';
			formValues.id_kerajaan = data.id_kerajaan || 0;
			formValues.jenis_kelamin = data.jenis_kelamin || 'Laki-laki';
			formValues.afiliasi =
				data.jenis_admin === 'super admin' || data.id_kerajaan === 0 ? 'marsi' : data.id_kerajaan;
			formValues.admin_role = data.jenis_admin === 'super admin' ? 'super admin' : 'admin kerajaan';

			console.log('Form values updated:', formValues);
		}
	});

	// Update admin_role when afiliasi changes
	$effect(() => {
		if (isRadioYa === true && formValues.afiliasi === 'marsi') {
			formValues.admin_role = 'admin kerajaan';
		} else if(data.superadmin == "ya" ){
			radioValue = "ya"
		} 	
		else {
			isRadioYa = false;
			if (formValues.admin_role !== 'admin kerajaan') {
				formValues.admin_role = formValues.afiliasi === 'marsi' ? 'super admin' : 'admin kerajaan';
			}
		}
		console.log('Admin role updated based on afiliasi:', formValues.admin_role);
	});

	let timer: number;
	let type = $state('password');
	if (open) {
		timer = setTimeout(() => {
			value = false;
			open = false;
		}, 3000);
		clearTimeout(timer);
	}

	// Add a function to get kingdom name from ID
	function getKerajaanName(id: any) {
		console.log('Getting name for ID:', id, 'Type:', typeof id);

		if (id === 0) return 'MARSI';

		if (datakerajaan && Array.isArray(datakerajaan)) {
			// Convert both to strings for comparison to handle type mismatches
			const kerajaan = datakerajaan.find((k) => k.id_kerajaan.toString() === id.toString());
			console.log('Found kerajaan:', kerajaan);
			return kerajaan ? kerajaan.nama_kerajaan : id;
		}
		return id;
	}

	// Add a display variable for showing the selected kingdom name
	let displayKerajaanName = $state('');

	// Update display name when affiliation changes
	$effect(() => {
		console.log('Current afiliasi value:', formValues.afiliasi);
		console.log('New afiliasi value:', newafiliasi);
		const currentAfiliasi = newafiliasi !== ' ' ? newafiliasi : formValues.afiliasi;
		displayKerajaanName = getKerajaanName(currentAfiliasi);
		console.log('Display name updated to:', displayKerajaanName);
	});

	function handleAfiliasiChange(event: any) {
		const selectedValue = event.target.value;
		console.log('Selected value:', selectedValue);

		// Langsung update newafiliasi
		newafiliasi = selectedValue;

		// Update display name
		displayKerajaanName = getKerajaanName(selectedValue);
		console.log('afiliasi : ', newafiliasi);
		console.log('Display name updated to:', displayKerajaanName);

		// Only update admin_role if radio is not "Ya"
		if (radioValue !== 'ya') {
			// If MARSI is selected directly from dropdown, set role to super admin
			if (selectedValue === 'marsi') {
				newroleadmin = 'super admin';
				formValues.id_kerajaan = 0;
			} else {
				// For other kingdoms, set to admin kerajaan
				newroleadmin = 'admin kerajaan';
				formValues.id_kerajaan = selectedValue;
				formValues.afiliasi = selectedValue;
			}
		}

		console.log(
			'Afiliasi changed to:',
			selectedValue,
			'Name:',
			displayKerajaanName,
			'Role set to:',
			newroleadmin
		);
	}

	// Handle changes to radio buttons
	function handleRadioChange(value: any) {
		radioValue = value;

		if (value === 'ya') {
			// Tidak perlu set newafiliasi = 'marsi'
			newroleadmin = 'admin kerajaan';
			formValues.id_kerajaan = 0;
			isRadioYa = true;
		} else {
			isRadioYa = false;
			if (newafiliasi === 'marsi' || formValues.afiliasi === 'marsi') {
				newroleadmin = 'super admin';
			} else {
				newroleadmin = 'admin kerajaan';
			}
		}
		console.log(
			'Radio changed to:',
			value,
			'Role set to:',
			newroleadmin,
			'Affiliation:',
			newafiliasi
		);
	}

	$effect(() => {
		console.log('Current afiliasi value:', formValues.afiliasi);
		console.log('New afiliasi value:', newafiliasi);
		console.log('Data kerajaan:', datakerajaan);

		// Check if the current value exists in the options
		if (datakerajaan && Array.isArray(datakerajaan)) {
			const found = datakerajaan.find(
				(k) =>
					k.id_kerajaan.toString() ===
					(newafiliasi !== ' ' ? newafiliasi : formValues.afiliasi).toString()
			);
			console.log('Found matching kerajaan:', found);
		}
	});

	// Make sure datakerajaan is properly initialized
	$effect(() => {
		console.log('Data kerajaan available:', datakerajaan);
		if (datakerajaan && Array.isArray(datakerajaan)) {
			console.log('Number of kingdoms:', datakerajaan.length);
			datakerajaan.forEach((k) => console.log('Kingdom:', k.nama_kerajaan, 'ID:', k.id_kerajaan));
		}
	});

	// Make sure the current value is properly set
	$effect(() => {
		if (data && Object.keys(data).length > 0) {
			console.log('Setting afiliasi from data:', data.id_kerajaan);
			// Set the ID value directly
			if (data.jenis_admin === 'super admin' || data.id_kerajaan === 0) {
				formValues.afiliasi = 'marsi';
				formValues.id_kerajaan = 0;
			} else {
				formValues.afiliasi = data.id_kerajaan.toString();
				formValues.id_kerajaan = data.id_kerajaan.toString();
			}
			console.log('Afiliasi set to:', formValues.afiliasi);
		}
	});
</script>

<div
	class="fixed left-0 top-0 flex min-h-full min-w-full items-center justify-center bg-black/75"
	transition:fade={{ duration: 200 }}
>
	<div
		class="flex max-h-screen w-full max-w-[824px] flex-col overflow-y-auto border bg-white"
		class:noautofill={true}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="flex items-center justify-between px-8 py-4">
			<div>
				<p class="text-lg font-[700] text-[#070707] sm:text-[36px]">{textM} Admin</p>
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				onclick={() => {
					value = false;
					data = null;
					errors = null;
				}}
			>
				<img
					src={xbutton}
					alt="x-button"
					class="h-8 w-auto rounded-full p-2 hover:cursor-pointer hover:bg-gray-400"
				/>
			</div>
		</div>
		<div class="mb-4 flex h-[2px] w-full bg-[#CFCFCF]"></div>
		<div class="grid max-h-screen w-full grid-cols-1 gap-4 overflow-auto px-8 md:grid-cols-6">
			<!-- Nama Lengkap -->
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Nama Lengkap <span class="text-red-500">*</span></p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="nama_lengkap"
						placeholder="Jane Doe"
						value={data.nama_lengkap}
					/>
				</div>
				{#if errors}
					{#each errors.nama_lengkap as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<!-- Username -->
			<div class="flex flex-col md:col-span-3">
				<div class="">
					<p>Username <span class="text-red-500">*</span></p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="username"
						placeholder="janedoe"
						value={formValues.username}
						readonly={textM === 'Ubah'}
					/>
				</div>
				{#if errors}
					{#each errors.username as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
					<p class="text-left text-red-500">{errors?.api}</p>
				{/if}
			</div>

			<!-- Email -->
			<div class="flex flex-col md:col-span-3">
				<div class="">
					<p>Email <span class="text-red-500">*</span></p>
				</div>
				<div>
					<input
						type="email"
						class="w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="email"
						placeholder="janedoe@example.com"
						value={formValues.email}
					/>
				</div>
				{#if errors}
					{#each errors.email as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>

			{#if textM !== 'Ubah' && textM !== 'ubah'}
				<div class="flex flex-col md:col-span-full">
					<div>
					<p> Password <span class="text-red-500">*</span></p>
					</div>
					<div class="relative">
						<input
							type={showPassword ? 'text' : 'password'}
							class="w-full rounded-lg border border-gray-300 pr-10 text-gray-500 focus:outline-none"
							name="password"
							placeholder="Password"
							autocomplete="new-password"
						/>
						<!-- Icon mata -->
						<span
							class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer select-none"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<!-- Mata terbuka (SVG) -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0a9 9 0 0118 0 9 9 0 01-18 0z"
									/>
								</svg>
							{:else}
								<!-- Mata tertutup (SVG) -->
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5 text-gray-500"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-1.675A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 1.675A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675"
									/>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 3l18 18"
									/>
								</svg>
							{/if}
						</span>
					</div>
					{#if errors}
						{#each errors.password as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			{/if}

			<input type="hidden" name="id_admin" value={formValues.id_admin} />
			<input type="hidden" name="id_user" value={formValues.id_user} />
			<input type="hidden" name="status_aktif" value={formValues.status_aktif} />

			<!-- No Telp -->
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>No Telp <span class="text-red-500">*</span></p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="no_telp"
						placeholder="08123456789"
						value={formValues.no_telp}
					/>
				</div>
				{#if errors}
					{#each errors.no_telp as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>

			<!-- Tanggal Lahir -->
			<div class="flex flex-col md:col-span-2">
				<div class="">
					<p>Tanggal Lahir <span class="text-red-500">*</span></p>
				</div>
				<div>
					<input
						type="date"
						class="w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="tgl_lahir"
						placeholder="Jane Doe"
						id="tgl_lahir_field"
						autocomplete="new-password"
						value={formValues.tgl_lahir}
					/>
				</div>
				{#if errors}
					{#each errors.tgl_lahir as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<!-- kota Kelahiran -->
			<div class="flex flex-col md:col-span-4">
				<div class="">
					<p>Kota Kelahiran <span class="text-red-500">*</span></p>
				</div>
				<div>
					<input
						type="text"
						class="sha w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="kota_lahir"
						placeholder="Surabaya"
						autocomplete="new-password"
						id="kota_lahir_field"
						value={formValues.kota_lahir}
					/>
					{#if errors}
						{#each errors.kota_lahir as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			</div>
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Jenis Kelamin <span class="text-red-500">*</span></p>
				</div>
				<div>
					<select
						name="jenis_kelamin"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
						value={formValues.jenis_kelamin}
					>
						<option value="Laki-laki">Laki-laki</option>
						<option value="Perempuan">Perempuan</option>
					</select>
					{#if errors}
						{#each errors.jenis_kelamin as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			</div>
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Afiliasi<span class="text-red-500">*</span></p>
				</div>
				<div>
					<select
						name="afiliasi"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
						value={newafiliasi}
						onchange={handleAfiliasiChange}
						disabled={radioValue === 'ya'}
					>
						<option value="marsi">MARSI</option>
						{#if datakerajaan && Array.isArray(datakerajaan)}
							{#each datakerajaan as kerajaan}
								<option value={kerajaan.id_kerajaan.toString()}>{kerajaan.nama_kerajaan}</option>
							{/each}
						{/if}
					</select>

					<!-- Add a display for the selected kingdom name -->
					{#if displayKerajaanName && newafiliasi !== ' ' && newafiliasi !== 'marsi'}
						<p class="mt-1 text-sm text-gray-600">Selected: {displayKerajaanName}</p>
					{/if}

					{#if errors}
						{#each errors.afiliasi as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Role Admin -->
			<div class="flex flex-col md:col-span-full">
				<div class="flex flex-col md:flex-row md:justify-between">
					<p>Role Admin <span class="text-red-500">*</span></p>
					{#if (newafiliasi !== ' ' ? newafiliasi : formValues.afiliasi) !== 'marsi' || ((newafiliasi !== ' ' ? newafiliasi : formValues.afiliasi) === 'marsi' && (newroleadmin !== ' ' ? newroleadmin : formValues.admin_role) === 'admin kerajaan')}
						<div class="flex items-center gap-2">
							<p>Buat Menjadi Super Admin Kerajaan juga?</p>
							<input
								type="radio"
								value="ya"
								name="superadmin"
								checked={radioValue === 'ya'}
								onclick={() => handleRadioChange('ya')}
							/>
							<p>Ya</p>
							<input
								type="radio"
								value="tidak"
								name="superadmin"
								checked={radioValue === 'tidak'}
								onclick={() => handleRadioChange('tidak')}
							/>
							<p>Tidak</p>
						</div>
						{#if errors}
							{#each errors.inputradio as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					{/if}
				</div>

				<input type="hidden" name="afiliasi8008" value={displayKerajaanName}>

				<div>
					<select
						name="admin_role"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-500 focus:outline-none"
						id="admin_role_field"
						autocomplete="new-password"
						value={newroleadmin !== ' ' ? newroleadmin : formValues.admin_role}
						disabled={radioValue === 'ya'}
					>
						<option value="super admin">Super Admin</option>
						<option value="admin kerajaan">Admin Kerajaan</option>
					</select>
					<input
						type="hidden"
						name="admin_role"
						value={newroleadmin !== ' ' ? newroleadmin : formValues.admin_role}
					/>
					<input
						type="hidden"
						name="afiliasi"
						value={newafiliasi !== ' ' ? newafiliasi : formValues.afiliasi}
					/>
					{#if errors}
						{#each errors.admin_role as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			</div>
			<div class="flex w-full md:col-span-full md:justify-end">
				<div class="mb-4 w-full md:w-auto">
					<button class="w-full rounded-md bg-[#C1A411] px-8 py-2 text-white" type="submit"
						>{textM} Data</button
					>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	input,
	select {
		box-shadow: 1px 2px 2px gray;
	}

	/* Tambahan untuk mencegah autofill */
	.noautofill input:-webkit-autofill,
	.noautofill select:-webkit-autofill {
		-webkit-box-shadow: 0 0 0 1000px white inset !important;
		transition: background-color 5000s ease-in-out 0s;
	}
</style>
