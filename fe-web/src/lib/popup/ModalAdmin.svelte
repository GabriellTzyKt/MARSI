<script lang="ts">
	import { fade } from 'svelte/transition';
	import xbutton from '../../asset/icons/xbutton.png';
	import SModal from './SModal.svelte';
	let { value = $bindable(), textM, open = $bindable(), errors = null, data = null } = $props();

	console.log("data : " , data)

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
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Nama Lengkap</p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 focus:outline-none"
						name="nama_lengkap"
						placeholder="Jane Doe"
						id=""
						value={data ? data.nama_lengkap : ''}
					/>
					{#if errors}
						{#each errors.nama_lengkap as a}
							<p class="text-left text-red-500">{a}</p>
						{/each}
					{/if}
				</div>
			</div>

			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Username</p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 focus:outline-none"
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
						class="w-full rounded-lg border border-gray-300 focus:outline-none"
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
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
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
						id=""
						value={data ? data.password : ''}
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
					<p>*Password harus memiliki kombinasi minimal8 huruf,angka, dan simbol</p>
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
						class="sha w-full rounded-lg border border-gray-300 text-gray-500 focus:outline-none"
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
			<!-- Afiliasi -->
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Jenis Kelamin</p>
				</div>
				<div>
					<select
						name="jenis_kelamin"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
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
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Afiliasi</p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
						name="afiliasi"
						placeholder="MARSI"
						id=""
						value={data ? data.afiliasi : ''}
					/>
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
					<div class="flex items-center gap-2">
						<p>Buat Menjadi Super Admin Kerajaan juga?</p>
						<input type="radio" value="superadmin_kerajaan_ya"  name="superadmin" />
						<p>Ya</p>
						<input type="radio" value="superadmin_kerajaan_tidak" name="superadmin" />
						<p>Tidak</p>
					</div>
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
						id=""
					>
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
</style>
