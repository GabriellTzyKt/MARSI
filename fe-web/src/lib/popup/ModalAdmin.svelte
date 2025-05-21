<script lang="ts">
	import { fade } from 'svelte/transition';
	import xbutton from '../../asset/icons/xbutton.png';
	import SModal from './SModal.svelte';	
	
	let {
		value = $bindable(),
		textM,
		open = $bindable(),
		errors = null,
		data,
		datakerajaan = null
	} = $props();

	console.log('data  : ', data);
	
	// Tambahkan state reaktif untuk nilai form
	let formValues = $state({
		nama_lengkap: '',
		username: '',
		email: '',
		no_telp: '',
		password: '',
		tgl_lahir: '',
		kota_lahir: '',
		jenis_kelamin: 'Laki-laki',
		afiliasi: 'marsi',
		admin_role: 'super_admin'
	});
	
	$effect(() => {
		if (data && Object.keys(data).length > 0) {
			console.log('Updating form values with data:', data);
			formValues.nama_lengkap = data.nama_lengkap || '';
			formValues.username = data.username || '';
			formValues.email = data.email || '';
			formValues.no_telp = data.no_telp || '';
			formValues.password = data.password || '';
			formValues.tgl_lahir = data.tanggal_lahir || '';
			formValues.kota_lahir = data.tempat_lahir || '';
			formValues.jenis_kelamin = data.jenis_kelamin || 'Laki-laki';
			formValues.afiliasi = data.afiliasi || 'marsi';
			formValues.admin_role = data.afiliasi === 'marsi' ? 'super_admin' : 'admin_kerajaan';
			
			console.log('Form values updated:', formValues);
		}
	});
	
	// Update admin_role when afiliasi changes
	$effect(() => {
		formValues.admin_role = formValues.afiliasi === 'marsi' ? 'super_admin' : 'admin_kerajaan';
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
					<p>Nama Lengkap</p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="nama_lengkap"
						placeholder="Jane Doe"
						bind:value={data.nama_lengkap}
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
					<p>Username</p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="username"
						placeholder="janedoe"
						bind:value={formValues.username}
					/>
				</div>
				{#if errors}
					{#each errors.username as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<!-- Email -->
			<div class="flex flex-col md:col-span-3">
				<div class="">
					<p>Email</p>
				</div>
				<div>
					<input
						type="email"
						class="w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="email"
						placeholder="janedoe@example.com"
						bind:value={formValues.email}
					/>
				</div>
				{#if errors}
					{#each errors.email as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<!-- No Telp -->
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>No Telp</p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="no_telp"
						placeholder="08123456789"
						bind:value={formValues.no_telp}
					/>
				</div>
				{#if errors}
					{#each errors.no_telp as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<!-- password -->
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Password</p>
				</div>
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div class="flex w-full justify-between rounded-lg border border-gray-300 shadow-lg">
					<input
						{type}
						class="grow rounded-lg border-none shadow-none focus:outline-none focus:ring-0"
						name="password"
						placeholder="password"
						id="password_field"
						autocomplete="new-password"
						bind:value={formValues.password}
					/>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<div
						class="me-1 ms-1 flex cursor-pointer items-center"
						onclick={() => {
							if (type === 'password') {
								type = 'text';
							} else type = 'password';
						}}
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
								d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
							/>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
							/>
						</svg>
					</div>
				</div>
				<div>
					<p>*Password harus memiliki kombinasi minimal 8 huruf, angka, dan simbol</p>
				</div>
				{#if errors}
					{#each errors.password as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
			</div>
			<!-- Tanggal Lahir -->
			<div class="flex flex-col md:col-span-2">
				<div class="">
					<p>Tanggal Lahir</p>
				</div>
				<div>
					<input
						type="date"
						class="w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="tgl_lahir"
						placeholder="Jane Doe"
						id="tgl_lahir_field"
						autocomplete="new-password"
						bind:value={formValues.tgl_lahir}
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
					<p>Kota Kelahiran</p>
				</div>
				<div>
					<input
						type="text"
						class="sha w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
						name="kota_lahir"
						placeholder="Surabaya"
						autocomplete="new-password"
						id="kota_lahir_field"
						bind:value={formValues.kota_lahir}
					/>
					{#if errors}
						{#each errors.kota_lahir as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			</div>
			<!-- Afiliasi -->
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Jenis Kelamin</p>
				</div>
				<div>
					<select
						name="jenis_kelamin"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
						bind:value={formValues.jenis_kelamin}
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
					<p>Afiliasi</p>
				</div>
				<div>
					<select
						name="afiliasi"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
						bind:value={formValues.afiliasi}
					>
						<option value="marsi">MARSI</option>
						{#if datakerajaan && Array.isArray(datakerajaan)}
							{#each datakerajaan as kerajaan}
								<option value={kerajaan.id_kerajaan}>{kerajaan.nama_kerajaan}</option>
							{/each}
						{/if}
					</select>
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
					<p>Role Admin</p>
					{#if formValues.afiliasi !== 'marsi'}
						<div class="flex items-center gap-2">
							<p>Buat Menjadi Super Admin Kerajaan juga?</p>
							<input type="radio" value="superadmin_kerajaan_ya" name="superadmin" />
							<p>Ya</p>
							<input type="radio" value="superadmin_kerajaan_tidak" name="superadmin" />
							<p>Tidak</p>
						</div>
					{/if}
					{#if errors}
						{#each errors.inputradio as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>

				<div>
					<select
						name="admin_role"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-500 focus:outline-none"
						id="admin_role_field"
						autocomplete="new-password"
						bind:value={formValues.admin_role}
						disabled
					>
						<option value="super admin">Super Admin</option>
						<option value="admin kerajaan">Admin Kerajaan</option>
					</select>
					<input type="hidden" name="admin_role" value={formValues.admin_role} />
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
