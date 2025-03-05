<script lang="ts">
	import { fade } from 'svelte/transition';
	import xbutton from '../../asset/icons/xbutton.png';
	import SModal from './SModal.svelte';
	let { value = $bindable(), textM } = $props();
	let open = $state(false);
	let timer: number;
	function setTimer() {
		open = true;
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			value = false;
			open = false;
		}, 3000);
	}
</script>

<div
	class="fixed left-0 top-0 flex min-h-full min-w-full items-center justify-center bg-black/75"
	transition:fade={{ duration: 200 }}
>
	<div class="flex w-full max-w-[824px] flex-col border bg-white">
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
		<div class="grid w-full grid-cols-1 gap-4 px-8 md:grid-cols-6">
			<!-- nama lengkap -->
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Nama Lengkap</p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 focus:outline-none"
						name=""
						placeholder="Jane Doe"
						id=""
					/>
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
						name=""
						placeholder="....@gmail.com"
						id=""
					/>
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
						name=""
						placeholder="xxxxxxxxxxxxxxxxxxx"
						id=""
					/>
				</div>
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
						name=""
						placeholder="Jane Doe"
						id=""
					/>
				</div>
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
						name=""
						placeholder="Surabaya"
						id=""
					/>
				</div>
			</div>
			<!-- Afiliasi -->
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Afiliasi</p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
						name=""
						placeholder="MARSI"
						id=""
					/>
				</div>
			</div>
			<!-- Afiliasi -->
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Afiliasi</p>
				</div>
				<div>
					<input
						type="text"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none"
						name=""
						placeholder="MARSI"
						id=""
					/>
				</div>
			</div>
			<!-- Role Admin -->
			<div class="flex flex-col md:col-span-full">
				<div class="">
					<p>Role Admin</p>
				</div>
				<div>
					<select
						name="Super Admin"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-500 focus:outline-none"
						id=""
					>
						<option value="MARSI">Super Admin</option>
						<option value="Kerajaan">Admin Kerajaan</option>
					</select>
				</div>
			</div>
			<div class="flex w-full md:col-span-full md:justify-end">
				<div class="mb-4 w-full md:w-auto">
					<button
						class="w-full rounded-md bg-[#C1A411] px-8 py-2 text-white"
						onclick={() => {
							setTimer();
						}}>{textM} Data</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
{#if open}
	<SModal text={textM === 'Ubah' ? 'Admin Berhasil Diubah!' : 'Admin Berhasil Ditambah!'}></SModal>
{/if}

<style>
	input,
	select {
		box-shadow: 1px 2px 2px gray;
	}
</style>
