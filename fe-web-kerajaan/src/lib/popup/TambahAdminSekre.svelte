<script lang="ts">
	import { fade } from 'svelte/transition';
	import xbutton from '$lib/asset/icon/xbutton.png';
	import { formatDate } from '$lib/index';

	let {
		value = $bindable(),
		textM,
		open = $bindable(),
		errors = null,
		data = null,
		userData = null
	} = $props();
	console.log('data : ', data);
	console.log('userData : ', userData);

	let namagelar = $state(data?.afiliasi || '');
	let daftarGelar: any = $state([]);
	function tambahGelar() {
		if (namagelar.trim() !== '') {
			daftarGelar = [...daftarGelar, namagelar.trim()];
			namagelar = ''; // Reset input setelah ditambahkan
		}
	}

	let userKeyword = $state('');
	let filteredUserData = $derived(filterUserData(userData));
	let selectedUser = $state<any>(null);
	let userDropdownOpen = $state(false);

	function handleUserSelection(user: any) {
		selectedUser = user;
		userKeyword = user.nama_lengkap || user.username || user.email || '';
		userDropdownOpen = false;
	}
	function filterUserData(data: any[]) {
		if (!data) return [];
		return data.filter(
			(item) =>
				(item.nama_lengkap?.toLowerCase() || '').includes(userKeyword.toLowerCase()) ||
				(item.username?.toLowerCase() || '').includes(userKeyword.toLowerCase()) ||
				(item.email?.toLowerCase() || '').includes(userKeyword.toLowerCase())
		);
	}

	function hapusGelar(index: number) {
		daftarGelar = daftarGelar.filter((_: any, i: number) => i !== index);
	}

	let radioinput = $state(textM === 'Ubah' ? 'sekre_tidak' : 'sekre_ya');

	console.log('data : ', data);

	let timer: number;
	let type = $state('password');
	if (open) {
		timer = setTimeout(() => {
			value = false;
			open = false;
		}, 3000);
		clearTimeout(timer);
	}

	// Format date for date input (YYYY-MM-DD)
	function formatDateForInput(isoString: string): string {
		if (!isoString || isoString === '0001-01-01T00:00:00Z') return '';

		try {
			const date = new Date(isoString);
			if (isNaN(date.getTime())) return '';

			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const day = String(date.getDate()).padStart(2, '0');

			return `${year}-${month}-${day}`;
		} catch (error) {
			console.error('Error formatting date:', error);
			return '';
		}
	}

	function formatTanggalLahir(isoString: string): string {
		if (!isoString || isoString === '0001-01-01T00:00:00Z') return '-';

		const date = new Date(isoString);
		const day = date.getDate();

		// Array of month names in Indonesian
		const monthNames = [
			'Januari',
			'Februari',
			'Maret',
			'April',
			'Mei',
			'Juni',
			'Juli',
			'Agustus',
			'September',
			'Oktober',
			'November',
			'Desember'
		];

		const month = monthNames[date.getMonth()];
		const year = date.getFullYear();

		return `${day} ${month} ${year}`;
	}
</script>

<div
	class="fixed left-0 top-0 flex min-h-full min-w-full items-center justify-center bg-black/75"
	transition:fade={{ duration: 200 }}
>
	<div class="flex max-h-screen w-full max-w-[824px] flex-col overflow-y-auto border bg-white">
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
			<!-- nama lengkap -->
			<input type="text" hidden name="id_admin" value={data.id_admin} id="" />
			<div class="flex w-full flex-col md:col-span-full">
				<div class="flex justify-between">
					<p>Nama Lengkap</p>
					{#if textM !== 'Ubah'}
						<div class="flex items-center justify-between gap-2">
							<p>Apakah Sudah memiliki akun sebelumnya?</p>
							<input
								type="radio"
								bind:group={radioinput}
								value="sekre_ya"
								name="superadmin"
								checked
							/>
							<p>Sudah</p>
							<input type="radio" bind:group={radioinput} value="sekre_tidak" name="superadmin" />
							<p>Belum</p>
						</div>
					{/if}
				</div>
				<div class="relative w-full">
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 px-2 py-2 pr-10 focus:outline-none"
						name="nama_lengkap"
						placeholder="Jane Doe"
						bind:value={userKeyword}
						onfocus={() => (userDropdownOpen = true)}
						onblur={() => {
							setTimeout(() => {
								userDropdownOpen = false;
							}, 200);
						}}
						id=""
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
					>
						<path
							fill="#4a4a4a"
							d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
						/>
					</svg>
				</div>
				<div class="relative">
					{#if userDropdownOpen && filteredUserData.length > 0}
						<div
							class="absolute z-10 mt-2 max-h-40 overflow-auto rounded-lg border bg-white shadow-lg"
						>
							{#each filteredUserData as user}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<!-- svelte-ignore a11y_no_static_element_interactions -->
								<div
									class="max-h-60 cursor-pointer overflow-y-auto px-4 py-2 hover:bg-gray-100"
									onclick={() => {
										handleUserSelection(user);
									}}
								>
									<p class="text-sm font-semibold">
										{user.nama_lengkap || user.username || user.email}
									</p>
									<p class="text-xs text-gray-500">
										{user.email || 'Tidak ada email'}
									</p>
								</div>
							{/each}
						</div>
					{/if}
				</div>
				{#if selectedUser}
					<input type="hidden" name="nama_lengkap" value={selectedUser.nama_lengkap} />
					<input type="hidden" name="jenis_kelamin" value={selectedUser.jenis_kelamin} />
					<input type="hidden" name="tempat_lahir" value={selectedUser.tempat_lahir} />
					<input type="hidden" name="tanggal_lahir" value={selectedUser.tanggal_lahir} />
					<input type="hidden" name="username" value={selectedUser.username} />
					<input type="hidden" name="password" value={selectedUser.password} />
					<input type="hidden" name="email" value={selectedUser.email} />
					<input type="hidden" name="no_telp" value={selectedUser.no_telp} />
					<input type="hidden" name="id_user" value={selectedUser.id_user} />
				{/if}

				{#if errors}
					{#each errors.nama_lengkap as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}
				{#if errors}{/if}

				{#if radioinput == 'sekre_tidak'}
					<!-- username -->
					<div class="flex flex-col md:col-span-full">
						<div class="">
							<p>Username</p>
						</div>
						<div>
							<input
								type="text"
								class="w-full rounded-lg border border-gray-300 px-2 py-2 pr-10 focus:outline-none"
								name="username"
								placeholder="Jane Doe"
								id=""
								value={data ? data.username : ''}
							/>
							{#if errors}
								{#each errors.username as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<!-- Email -->
					<div class="flex flex-col md:col-span-full">
						<div class="">
							<p>Email</p>
						</div>
						<div>
							<input
								type="email"
								class="w-full rounded-lg border border-gray-300 px-2 py-2 pr-10 focus:outline-none"
								name="email"
								placeholder="....@gmail.com"
								id=""
								value={data ? data.email : ''}
							/>
							{#if errors}
								{#each errors.email as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<!-- No Telp -->
					<div class="flex flex-col md:col-span-full">
						<div class="">
							<p>No Telp</p>
						</div>
						<div>
							<input
								type="phone"
								class="w-full rounded-lg border border-gray-300 px-2 py-2 pr-10 focus:outline-none"
								name="no_telp"
								placeholder="xxxxxxxxxxxxxxxxxxx"
								id=""
								value={data ? data.no_telp : ''}
							/>
						</div>
						{#if errors}
							{#each errors.no_telp as a}
								<p class="text-left text-red-500">{a}</p>
							{/each}
						{/if}
					</div>

					<!-- password -->
					<div class="relative flex flex-col md:col-span-full">
						<div class="">
							<p>Password</p>
						</div>
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<input
							{type}
							class="grow rounded-lg border-none px-2 py-2 shadow-none focus:outline-none focus:ring-0"
							name="password"
							placeholder="password"
							id=""
							value={data ? data.password : '-'}
						/>
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
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
								class="absolute right-3 top-1/2 size-6"
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
								class="w-full rounded-lg border border-gray-300 px-2 py-2 pr-10 text-gray-500 focus:outline-none"
								name="tgl_lahir"
								placeholder="Jane Doe"
								id=""
								value={data ? formatDateForInput(data.tanggal_lahir) : ''}
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
								class="sha w-full rounded-lg border border-gray-300 px-2 py-2 pr-10 text-gray-500 focus:outline-none"
								name="kota_lahir"
								placeholder="Surabaya"
								id=""
								value={data ? data.tempat_lahir : ''}
							/>
							{#if errors}
								{#each errors.kota_lahir as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>

					<!-- Jenis kelamin -->
					<div class="flex flex-col md:col-span-full">
						<div class="">
							<p>Jenis Kelamin</p>
						</div>
						<div>
							<select
								name="jenis_kelamin"
								class="w-full rounded-lg border border-gray-300 px-2 py-2 pr-10 focus:outline-none"
								value={data ? data.jenis_kelamin : '-'}
								id={data ? data.jenis_kelamin : ''}
							>
								<option value="Laki-Laki">Laki-Laki</option>
								<option value="Perempuan">Perempuan</option>
							</select>
							{#if errors}
								{#each errors.jenis_kelamin as a}
									<p class="text-left text-red-500">{a}</p>
								{/each}
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Role Admin -->
			<div class="flex flex-col md:col-span-full">
				<div class="flex flex-col md:flex-row md:justify-between">
					<p>Role Admin</p>
				</div>

				<div>
					<select
						name="admin_role"
						value={data ? data.jenis_admin : ''}
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-500 focus:outline-none"
						id=""
					>
						<option value="" selected disabled>Pilih Role</option>
						<option value="Super Admin">Super Admin</option>
						<option value="Admin Situs">Admin Situs</option>
						<option value="Admin Komunitas">Admin Komunitas</option>
						<option value="Admin Organisasi">Admin Organisasi</option>
					</select>
					{#if errors}
						{#each errors.admin_role as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			</div>

			<!-- Afiliasi -->
			<div class="flex w-full flex-col md:col-span-full">
				<label for="gelar">Afiliasi:</label>
				<div class="relative w-full">
					<input
						id="gelar"
						name="afiliasi"
						bind:value={namagelar}
						class="w-full rounded-lg border px-3 py-2 pr-10"
						placeholder="Masukkan Gelar"
					/>
					<button
						class="absolute bottom-0 right-0 top-0 h-full rounded-r-lg bg-blue-500 px-8 text-white"
						onclick={tambahGelar}
						type="button"
					>
						Add
					</button>
				</div>

				{#if daftarGelar.length > 0}
					<div class="w-full overflow-x-auto">
						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
							{#each daftarGelar as gelar, index}
								<div class="mt-3 flex items-center justify-between rounded-lg border p-3">
									<p class="w-full max-w-[200px] truncate break-words">
										{gelar}
									</p>
									<input type="text" hidden name="afiliasi" value={gelar} id="" />
									<!-- svelte-ignore a11y_consider_explicit_label -->
									<button class="text-red-500" onclick={() => hapusGelar(index)}>
										<span class="carbon--close-outline2 ml-2 items-center"></span>
									</button>
								</div>
							{/each}
						</div>
					</div>
				{/if}
				<div>
					{#if errors}
						{#each errors.afiliasi as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			</div>

			<div class="flex w-full md:col-span-full md:justify-end">
				<div class="mb-4 w-full md:w-auto">
					<button class="w-full rounded-md bg-[#0011ff] px-8 py-2 text-white" type="submit"
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
		padding-right: 10px;
	}

	.carbon--close-outline2 {
		display: inline-block;
		width: 12px;
		height: 12px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23bba5a5' d='M16 2C8.2 2 2 8.2 2 16s6.2 14 14 14s14-6.2 14-14S23.8 2 16 2m0 26C9.4 28 4 22.6 4 16S9.4 4 16 4s12 5.4 12 12s-5.4 12-12 12'/%3E%3Cpath fill='%23bba5a5' d='M21.4 23L16 17.6L10.6 23L9 21.4l5.4-5.4L9 10.6L10.6 9l5.4 5.4L21.4 9l1.6 1.6l-5.4 5.4l5.4 5.4z'/%3E%3C/svg%3E");
	}
</style>
