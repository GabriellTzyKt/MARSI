<script lang="ts">
	import { fade } from 'svelte/transition';
	import xbutton from '$lib/asset/icon/xbutton.png';
	let { value = $bindable(), textM, open = $bindable(), errors = null, data = null } = $props();

	let namagelar = $state('');
	let daftarGelar: any = $state([]);
	function tambahGelar() {
		if (namagelar.trim() !== '') {
			daftarGelar = [...daftarGelar, namagelar.trim()];
			namagelar = ''; // Reset input setelah ditambahkan
		}
	}

	function hapusGelar(index: number) {
		daftarGelar = daftarGelar.filter((_: any, i: number) => i !== index);
	}

	let radioinput = $state('sekre_ya');

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
	if (data) {
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
			<div class="flex w-full flex-col md:col-span-full">
				<div class="flex justify-between">
					<p>Nama Lengkap</p>
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
				</div>
				<div class="relative w-full">
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 px-2 py-2 pr-10 focus:outline-none"
						name="nama_lengkap"
						placeholder="Jane Doe"
						id=""
						value={data ? data.nama_lengkap : ''}
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
				{#if errors}
					{#each errors.nama_lengkap as a}
						<p class="text-left text-red-500">{a}</p>
					{/each}
				{/if}

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
							value={data ? data.password : ''}
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
								value={data ? data.tgl_lahir : ''}
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
								value={data ? data.kota_lahir : ''}
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
								value="Laki-laki"
								id=""
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
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-500 focus:outline-none"
						id=""
					>
						<option value="" selected disabled>Pilih Role</option>
						<option value="super_admin">Super Admin</option>
						<option value="admin_kerajaan">Admin Kerajaan</option>
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
